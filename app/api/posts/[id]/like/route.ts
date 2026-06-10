import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const userIdentifier = body.userIdentifier || body.likedBy || 'Member';

    const post = await (prisma as any).posts.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    const existingLike = await (prisma as any).likes.findUnique({
      where: {
        target_type_target_id_user_identifier: {
          target_type: 'post',
          target_id: id,
          user_identifier: userIdentifier,
        },
      },
    });

    if (existingLike) {
      await (prisma as any).likes.delete({
        where: { id: existingLike.id },
      });

      const updatedPost = await (prisma as any).posts.update({
        where: { id },
        data: {
          like_count: Math.max((post.like_count || 0) - 1, 0),
        },
      });

      return NextResponse.json({
        success: true,
        liked: false,
        message: 'Like removed.',
        post: updatedPost,
      });
    }

    await (prisma as any).likes.create({
      data: {
        target_type: 'post',
        target_id: id,
        user_identifier: userIdentifier,
      },
    });

    const updatedPost = await (prisma as any).posts.update({
      where: { id },
      data: {
        like_count: (post.like_count || 0) + 1,
      },
    });

    await (prisma as any).notifications.create({
      data: {
        type: 'like',
        message: `${userIdentifier} liked your post.`,
        post_id: id,
        read: false,
      },
    });

    return NextResponse.json({
      success: true,
      liked: true,
      message: 'Like added and notification created.',
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Failed to toggle like:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to toggle like',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}

