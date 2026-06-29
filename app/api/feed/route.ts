import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);

    const safePage = page > 0 ? page : 1;
    const safeLimit = limit > 0 && limit <= 50 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;
    const cacheKey = `feed:page:${safePage}:limit:${safeLimit}`;

    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(JSON.parse(cachedData));
      }
    } catch (e) {
      console.error('Redis read error:', e);
    }

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

    const responsePayload = {
      success: true,
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
      posts,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(responsePayload), 'EX', 60);
    } catch (e) {
      console.error('Redis write error:', e);
    }

    return NextResponse.json(responsePayload);
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