import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const notifications = await (prisma as any).notifications.findMany({
      orderBy: {
        created_at: 'desc',
      },
      take: 50,
    });

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
  