import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const data = await request.json();
        const { nominationsOpen } = data;

        //Check if the user is logged in
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'UnAuthorized' }, { status: 401 });
        }

        // Only allow admin users to change offer statuses
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updatedAward = await prisma.awards.update({
            where: {
                id: id
            },
            data: {
                nominationsOpen: nominationsOpen
            }
        });

        return NextResponse.json({ success: true, updatedAward });

    } catch (error: any) {
        console.error('Error updating nomination status:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}
