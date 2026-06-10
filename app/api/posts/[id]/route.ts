import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUuid) {
      return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
    }

    const existingPost = await (prisma as any).posts.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const updatedPost = await (prisma as any).posts.update({
      where: { id },
      data: {
        content: body.content ?? existingPost.content,
        linked_type: body.linkedType ?? existingPost.linked_type,
        linked_title: body.linkedTitle ?? existingPost.linked_title,
        linked_subtitle: body.linkedSubtitle ?? existingPost.linked_subtitle,
        linked_url: body.linkedUrl ?? existingPost.linked_url,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully.',
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Failed to update post:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to update post', details: error?.message || '' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUuid) {
      return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
    }

    const existingPost = await (prisma as any).posts.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    const deletedPost = await (prisma as any).posts.update({
      where: { id },
      data: {
        removed: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully.',
      post: deletedPost,
    });
  } catch (error: any) {
    console.error('Failed to delete post:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to delete post', details: error?.message || '' },
      { status: 500 }
    );
  }
}