import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const offerId = params.id;

    try {
        const data = await request.json();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'UnAuthorized' }, { status: 401 });
        }

        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const validStatuses = ['approved', 'rejected', 'pending'];
        if (!validStatuses.includes(data.status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        const updatedOffer = await prisma.offers.update({
            where: {
                id: offerId,
            },
            data: {
                status: data.status,
            },
        });

        return NextResponse.json({ success: true, data: updatedOffer }, { status: 200 });
    } catch (error) {
        console.error('Error updating offer status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}