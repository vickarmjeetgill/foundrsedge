import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPaginated = searchParams.has('page');
    const page = isPaginated ? Math.max(1, parseInt(searchParams.get('page') || '1', 10)) : 1;
    const limit = isPaginated ? Math.max(1, parseInt(searchParams.get('limit') || '20', 10)) : 20;
    const skip = isPaginated ? (page - 1) * limit : undefined;
    const take = isPaginated ? limit : 50;

    const [total, notifications] = await Promise.all([
      (prisma as any).notifications.count(),
      (prisma as any).notifications.findMany({
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take,
      })
    ]);

    if (isPaginated) {
      return NextResponse.json({
        success: true,
        notifications,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    }

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch notifications',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}
  