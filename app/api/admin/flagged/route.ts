import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reports = await (prisma as any).flag_reports.findMany({
      orderBy: {
        reported_at: 'desc',
      },
    });

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