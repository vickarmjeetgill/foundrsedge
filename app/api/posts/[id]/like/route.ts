import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const likedBy = body.likedBy || 'Member';

    const post = await (prisma as any).posts.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const updatedPost = await (prisma as any).posts.update({
      where: { id },
      data: {
        like_count: post.like_count + 1,
      },
    });

    await (prisma as any).notifications.create({
      data: {
        type: 'like',
        message: `${likedBy} liked your post.`,
        post_id: id,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Like added and notification created.',
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Failed to like post:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to like post',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}
