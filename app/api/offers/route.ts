import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const featured = searchParams.get('featured');
        const adminView = searchParams.get('adminView') === 'true';
        const mySubmissions = searchParams.get('mySubmissions') === 'true';

        const andConditions: any[] = [];

        if (adminView) {
            const user = await getCurrentUser();
            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
            }
            const statusParam = searchParams.get('status');
            if (statusParam) {
                andConditions.push({ status: statusParam });
            }
        } else if (mySubmissions) {
            const user = await getCurrentUser();
            if (!user) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            const member = await prisma.members.findUnique({
                where: { email: user.email },
            });
            const memberId = member ? member.id : null;
            if (memberId) {
                andConditions.push({ member_id: memberId });
            } else {
                return NextResponse.json([]);
            }
        } else {
            andConditions.push({ status: 'approved' });
        }

        if (category && category !== 'All Categories' && category !== 'All') {
            andConditions.push({ category });
        }

        if (type && type !== 'All Types' && type !== 'All') {
            andConditions.push({ type });
        }

        if (featured === 'true') {
            andConditions.push({
                OR: [
                    { featured: true },
                    { fe_discount: { not: null } }
                ]
            });
        }

        const where = andConditions.length > 0 ? { AND: andConditions } : {};

        const offers = await (prisma as any).offers.findMany({
            where,
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(offers);
    } catch (error: any) {
        console.error('Error fetching offers:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
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

       const offer = await (prisma as any).offers.create({
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
                is_affiliate: false,
                status: 'pending',
            },
        });

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating offer:', error);
        return NextResponse.json({ success: false, error: `Failed to create offer: ${error.message || error}` }, { status: 500 });
    }
}
