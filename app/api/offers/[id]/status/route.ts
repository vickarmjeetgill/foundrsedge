import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

//Allows admin to approve, reject, return to pending status. 
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Grab the offer ID from the URL params
    const { id: offerId } = await params;

    try {
        // Parse the request body to get the new status
        const data = await request.json();

        //Check if the user is logged in
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'UnAuthorized' }, { status: 401 });
        }

        // Only allow admin users to change offer statuses
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Ensure the requested status is either 'approved', 'rejected', or 'pending'
        const validStatuses = ['approved', 'rejected', 'pending'];
        if (!validStatuses.includes(data.status)) {
            return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
        }

        // Modify the status of the specific offer to the database in Prisma 
        const updatedOffer = await prisma.offers.update({
            where: {
                id: offerId,
            },
            data: {
                status: data.status,
            },
        });

        // Return the updated offer details if successful
        return NextResponse.json({ success: true, data: updatedOffer }, { status: 200 });
    } catch (error) {
        console.error('Error updating offer status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}