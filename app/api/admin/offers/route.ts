import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

// POST /api/admin/offers - Admin endpoint to submit an affiliate offer (which is auto-approved by default)
export async function POST(request: Request) {
    try {
        // 1. Parse the request body
        const data = await request.json();

        // 2. Authentication: Verify that the user is logged in
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 3. Authorization: Only allow admin users to submit affiliate offers
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 4. Find the member record associated with the admin's email address
        const member = await prisma.members.findUnique({
            where: { email: user.email },
        });
        const memberId = member ? member.id : null;

        // 5. Look up if the business already exists by its name
        const existingBusiness = await prisma.businesses.findFirst({
            where: { business_name: data.businessName },
        });

        // 6. If the business exists, use it. Otherwise, create a new business profile.
        let chosenBusinessId: string;
        if (existingBusiness) {
            chosenBusinessId = existingBusiness.id;
        } else {
            const newBusiness = await prisma.businesses.create({
                data: { business_name: data.businessName },
            });
            chosenBusinessId = newBusiness.id;
        }

        // 7. DB Insert: Create the new offer, marking it as an affiliate offer and setting it to approved
        const offer = await prisma.offers.create({
            data: {
                member_id: memberId,
                business_id: chosenBusinessId,
                business_name: data.businessName,
                category: data.category,
                type: data.type,
                discount_value: data.discountValue || null,
                title: data.title,
                description: data.description,
                location: data.location || null,
                expiry_date: new Date(data.expiryDate),
                fe_discount: data.foundersEdgeDiscount || null,
                events_page_url: data.eventsPageUrl || null,
                how_to_redeem: data.howToRedeem,
                is_affiliate: true,
                status: 'approved',
            }
        });

        // 8. Return success response
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Admin offer creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}