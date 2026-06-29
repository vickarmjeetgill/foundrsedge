import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { invalidateCache } from '@/lib/redis';
import { rateLimit } from '@/lib/rate-limiter';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { validateBody } from '@/lib/validate';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment content is required ' })
  content!: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  authorBusiness?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await rateLimit(ip, 20, 60);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Too Many Requests' }, { status: 429 });
    }

    const { id } = await params;
    const rawBody = await request.json();
    const { errors, data } = await validateBody(CreateCommentDto, rawBody);
    if (errors) {
      return NextResponse.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 });
    }
    const body = data;

    const content = body.content;
    const authorName = body.authorName || 'Member';
    const authorBusiness = body.authorBusiness || null;

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUuid) {
      return NextResponse.json(
        { success: false, error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      );
    }

    const post = await (prisma as any).posts.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const comment = await (prisma as any).comments.create({
      data: {
        post_id: id,
        author_name: authorName,
        author_business: authorBusiness,
        content,
      },
    });

    await (prisma as any).posts.update({
      where: { id },
      data: {
        comment_count: (post.comment_count || 0) + 1,
      },
    });

    await (prisma as any).notifications.create({
      data: {
        type: 'comment',
        message: `${authorName} commented on your post.`,
        post_id: id,
        read: false,
      },
    });

    await invalidateCache();

    return NextResponse.json(
      {
        success: true,
        message: 'Comment added successfully.',
        comment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to add comment:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add comment',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}