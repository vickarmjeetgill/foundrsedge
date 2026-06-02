import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        }

        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const member = await prisma.members.findUnique({
            where: { email: user.email },
        });
        const memberId = member ? member.id : null;

        const existingBusiness = await prisma.businesses.findFirst({
            where: { business_name: data.businessName },
        });

        let chosenBusinessId: string;
        if (existingBusiness) {
            chosenBusinessId = existingBusiness.id;
        } else {
            const newBusiness = await prisma.businesses.create({
                data: { business_name: data.businessName },
            });
            chosenBusinessId = newBusiness.id;
        }

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
        })


        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Admin offer creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}