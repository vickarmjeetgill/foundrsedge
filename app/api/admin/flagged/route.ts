import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const isPaginated = searchParams.has('page');
    const page = isPaginated ? Math.max(1, parseInt(searchParams.get('page') || '1', 10)) : 1;
    const limit = isPaginated ? Math.max(1, parseInt(searchParams.get('limit') || '5', 10)) : 5;
    const skip = isPaginated ? (page - 1) * limit : undefined;
    const take = isPaginated ? limit : undefined;

    const where: any = {};
    if (status && status !== 'All') {
      where.status = status.toLowerCase();
    }

    const [total, reports] = await Promise.all([
      (prisma as any).flag_reports.count({ where }),
      (prisma as any).flag_reports.findMany({
        where,
        orderBy: {
          reported_at: 'desc',
        },
        skip,
        take,

        select: {
          id: true,
          content_type: true,
          content_id: true,
          content_preview: true,
          author_name: true,
          reported_by: true,
          reason: true,
          details: true,
          status: true,
          reported_at: true,
        }
      })
    ]);

    if (isPaginated) {
      return NextResponse.json({
        success: true,
        reports,
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
      reports,
    });
  } catch (error: any) {
    console.error('Failed to fetch flagged content:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch flagged content',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}