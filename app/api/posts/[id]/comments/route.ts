import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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