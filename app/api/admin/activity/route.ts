import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [recentOffers, recentEvents, recentNominations] = await Promise.all([
            prisma.offers.findMany({ take: 5, orderBy: { created_at: 'desc' }, select: { id: true, title: true, business_name: true, created_at: true } }),
            prisma.events.findMany({ take: 5, orderBy: { created_at: 'desc' }, select: { id: true, title: true, host: true, created_at: true } }),
            prisma.nominations.findMany({ take: 5, orderBy: { created_at: 'desc' }, select: { id: true, business_name: true, award: { select: { name: true } }, created_at: true } })
        ]);

        const mappedOffers = recentOffers.map(o => ({ id: o.id, type: 'offer', message: `New offer submitted: "${o.title}" by ${o.business_name}`, timestamp: o.created_at || new Date(), }));
        const mappedEvents = recentEvents.map(e => ({ id: e.id, type: 'event', message: `New event scheduled: "${e.title}" by ${e.host}`, timestamp: e.created_at || new Date(), }));
        const mappedNominations = recentNominations.map(n => ({ id: n.id, type: 'nomination', message: `New nomination for "${n.award.name}" (Business: ${n.business_name})`, timestamp: n.created_at || new Date() }));

        const activities = [...mappedOffers, ...mappedEvents, ...mappedNominations]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10);

        return NextResponse.json({ success: true, activities }, { status: 200 });
    } catch (error) {
        console.error('Activity Log Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}