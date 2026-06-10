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
        { success: false, error: 'Invalid comment ID' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Reply content is required' },
        { status: 400 }
      );
    }

    const parentComment = await (prisma as any).comments.findUnique({
      where: { id },
    });

    if (!parentComment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    const reply = await (prisma as any).comments.create({
      data: {
        post_id: parentComment.post_id,
        parent_id: id,
        author_name: authorName,
        author_business: authorBusiness,
        content,
      },
    });

    await (prisma as any).notifications.create({
      data: {
        type: 'reply',
        message: `${authorName} replied to your comment.`,
        post_id: parentComment.post_id,
        read: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Reply added successfully.',
        reply,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to add reply:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add reply',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}