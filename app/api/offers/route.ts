import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { invalidateCache } from '@/lib/redis';
import { rateLimit } from '@/lib/rate-limiter';
import { validateBody } from '@/lib/validate';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateOfferDto {
    @IsString()
    @IsNotEmpty({ message: 'Business name is required' })
    businessName!: string;

    @IsString()
    @IsNotEmpty({ message: 'Title is required' })
    title!: string;

    @IsString()
    @IsNotEmpty({ message: 'Description is required' })
    description!: string;

    @IsString()
    @IsNotEmpty({ message: 'Category is required' })
    category!: string;

    @IsString()
    @IsNotEmpty({ message: 'Type is required' })
    type!: string;

    @IsOptional()
    @IsString()
    discountValue?: string;

    @IsOptional()
    @IsString()
    discountUnit?: string;

    @IsOptional()
    @IsString()
    customDiscount?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsDateString({}, { message: 'Expiry date must be a valid ISO date string' })
    @IsNotEmpty({ message: 'Expiry date is required' })
    expiryDate!: string;

    @IsOptional()
    @IsString()
    foundersEdgeDiscount?: string;

    @IsOptional()
    @IsString()
    eventsPageUrl?: string;

    @IsOptional()
    @IsString()
    howToRedeem?: string;

    @IsOptional()
    @IsBoolean()
    agreeGuidelines?: boolean;
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const type = searchParams.get('type');
        const featured = searchParams.get('featured');
        const adminView = searchParams.get('adminView') === 'true';
        const mySubmissions = searchParams.get('mySubmissions') === 'true';
        const search = searchParams.get('search');
        const location = searchParams.get('location');
        const hideExpired = searchParams.get('hideExpired') === 'true';

        const isPaginated = searchParams.has('page');
        const page = isPaginated ? Math.max(1, parseInt(searchParams.get('page') || '1', 10)) : 1;
        const limit = isPaginated ? Math.max(1, parseInt(searchParams.get('limit') || '12', 10)) : 12;
        const skip = isPaginated ? (page - 1) * limit : undefined;
        const take = isPaginated ? limit : undefined;

        const andConditions: any[] = [];

        if (search) {
            andConditions.push({
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { business_name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { category: { contains: search, mode: 'insensitive' } },
                    { discount_value: { contains: search, mode: 'insensitive' } },
                    { fe_discount: { contains: search, mode: 'insensitive' } },
                    { type: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        if (location) {
            andConditions.push({
                location: { contains: location, mode: 'insensitive' }
            });
        }

        if (hideExpired) {
            andConditions.push({
                expiry_date: {
                    gt: new Date()
                }
            });
        }

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

        const [offers, total] = await Promise.all([
            prisma.offers.findMany({
                where,
                skip,
                take,
                orderBy: [
                    { featured: 'desc' },
                    { created_at: 'desc' }
                ],

                select: {
                    id: true,
                    title: true,
                    description: true,
                    business_name: true,
                    category: true,
                    type: true,
                    discount_value: true,
                    status: true,
                    expiry_date: true,
                    featured: true,
                    location: true,
                    fe_discount: true,
                }
            }),
            prisma.offers.count({ where })
        ]);

        if (isPaginated) {
            return NextResponse.json({
                offers,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        }

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
        const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success } = await rateLimit(ip, 10, 60);
        if (!success) {
            return NextResponse.json({ success: false, error: 'Too Many Requests' }, { status: 429 });
        }
        const rawData = await request.json();
        const { errors, data } = await validateBody(CreateOfferDto, rawData);
        if (errors) {
            return NextResponse.json({ success: false, error: 'Validation failed', details: errors }, { status: 400 });
        }

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

        await invalidateCache();

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating offer:', error);
        return NextResponse.json({ success: false, error: `Failed to create offer: ${error.message || error}` }, { status: 500 });
    }
}
