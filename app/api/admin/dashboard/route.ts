import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden ' }, { status: 403 });
    }

    //Count Queries
    const [offers, events, nominations, flagged] = await Promise.all([
      prisma.offers.count({ where: { status: 'pending' } }),
      prisma.events.count({ where: { status: 'PENDING' } }),
      prisma.nominations.count({ where: { status: 'PENDING' } }),
      prisma.flag_reports.count({ where: { status: 'pending' } }),
    ]);


    return NextResponse.json({ count: { offers, events, nominations, flagged } }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}