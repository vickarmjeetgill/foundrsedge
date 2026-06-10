import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const content = body.content;
    const authorName = body.authorName || 'Member';
    const authorBusiness = body.authorBusiness || null;

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Post content is required' },
        { status: 400 }
      );
    }

    const post = await (prisma as any).posts.create({
      data: {
        author_name: authorName,
        author_business: authorBusiness,
        content,
        linked_type: body.linkedType || null,
        linked_title: body.linkedTitle || null,
        linked_subtitle: body.linkedSubtitle || null,
        linked_url: body.linkedUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Post created successfully.',
        post,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create post:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to create post', details: error?.message || '' },
      { status: 500 }
    );
  }
}