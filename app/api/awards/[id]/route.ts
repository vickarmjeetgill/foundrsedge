import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Use prisma.awards.findUnique to fetch the unique award by id
        const award = await prisma.awards.findUnique({
            where: {
                id: id,
            },
        });


        // If the award is not found, return a 404 response
        if (!award) {
            return NextResponse.json({ error: 'Award not found' }, { status: 404 });
        }

        // Return the award with a 200 OK response
        return NextResponse.json(award);

    } catch (error: any) {
        console.error('Error fetching award:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const award = await prisma.awards.delete({
            where: {
                id: id,
            },
        });

        return NextResponse.json({ message: 'Award deleted successfully', award });
    } catch (err: any) {
        console.error("Error deleting award:", err);
        return NextResponse.json(
            { error: 'Internal Server Error', details: err.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await request.json();

    try {
        const updatedAward = await prisma.awards.update({
            where: {
                id: id,
            },
            data: {
                name: data.name,
                org: data.org,
                category: data.category,
                region: data.region,
                deadline: data.deadline,
                award_date: data.awardDate,
                value: data.value,
                cycle: data.cycle,
                desc: data.desc,
                featured: data.featured,
                nominationsOpen: data.nominationsOpen,
                sponsor: data.sponsor,
            },
        });

        return NextResponse.json(updatedAward);
    } catch (error: any) {
        console.error('Error updating award:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 }
        );
    }
}
