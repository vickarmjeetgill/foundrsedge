import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const category = searchParams.get('category');
        const region = searchParams.get('region');
        const featured = searchParams.get('featured');
        const nominationsOpen = searchParams.get('nominationsOpen') || searchParams.get('nominationOpen');

        const where: any = {};

        if (category) {
            where.category = category;
        }

        if (region) {
            where.region = region;
        }

        if (featured === 'true') {
            where.featured = true;
        } else if (featured === 'false') {
            where.featured = false;
        }

        if (nominationsOpen === 'true') {
            where.nominationsOpen = true;
            // deadline is stored as a String (e.g. "YYYY-MM-DD")
            const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Edmonton" });
            where.deadline = {
                gte: todayStr,
            };
        } else if (nominationsOpen === 'false') {
            where.nominationsOpen = false;
        }

        const awards = await prisma.awards.findMany({
            where,
            orderBy: {
                deadline: 'asc',
            },
        });

        return NextResponse.json(awards);

    } catch (error: any) {
        console.error('Error fetching awards:', error);
        return NextResponse.json(
            { error: 'Failed to fetch awards', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { name, org, category, region, deadline, awardDate, value, cycle, desc, featured, nominationsOpen, sponsor } = body;

        if (!name || !org || !category || !region || !deadline || !awardDate || !value || !cycle || !desc) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 });
        }

        const newAward = await prisma.awards.create({
            data: {
                name,
                org,
                category,
                region,
                deadline,
                award_date: awardDate,
                value,
                cycle,
                desc,
                featured: typeof featured === 'boolean' ? featured : false,
                nominationsOpen: typeof nominationsOpen === 'boolean' ? nominationsOpen : true,
                sponsor: sponsor || null,
            }
        });

        return NextResponse.json({ success: true, award: newAward }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating award:', error);
        return NextResponse.json(
            { error: 'Failed to create award', details: error.message },
            { status: 500 }
        );
    }
}