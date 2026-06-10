import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 50 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;

    const [posts, total] = await Promise.all([
      (prisma as any).posts.findMany({
        where: {
          removed: false,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: safeLimit,
      }),

      (prisma as any).posts.count({
        where: {
          removed: false,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      posts,
    });
  } catch (error: any) {
    console.error('Failed to fetch feed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch feed',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}