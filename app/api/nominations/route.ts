import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.email) {
            return NextResponse.json(
                {
                    error: 'Unauthorized. Please log in to submit a nomination'
                },

                {
                    status: 401
                }

            );
        }

        const data = await request.json();

        const member = await prisma.members.findUnique({
            where: {
                email: user.email,
            },
        });

        if (!member) {
            return NextResponse.json(
                {
                    error: 'You must be a member to submit a nomination',
                },
                {
                    status: 403,
                }
            );
        }

        const existingNomination = await prisma.nominations.findFirst({
            where: {
                award_id: data.award_id,
                member_id: member.id,
            },
        });

        if (existingNomination) {
            return NextResponse.json(
                {
                    error: 'You have already submitted a nomination for this award',
                },
                {
                    status: 409,
                }
            );
        }

        const award = await prisma.awards.findUnique({
            where: {
                id: data.award_id,
            },
        });

        if (!award) {
            return NextResponse.json(
                {
                    error: 'Award not found',
                },
                {
                    status: 404,
                }
            );
        }

        if (!award.nominationsOpen) {
            return NextResponse.json(
                {
                    error: 'Nominations are closed for this award',
                },
                {
                    status: 403,
                }
            );
        }

        const nomination = await prisma.nominations.create({
            data: {
                award_id: data.award_id,
                member_id: member.id,
                business_name: data.business_name,
                contact_name: data.contact_name,
                contact_email: data.contact_email,
                website: data.website,
                achievement: data.achievement,
                statement: data.statement,
                status: 'PENDING',
            },
        });

        return NextResponse.json(nomination);

    } catch (error: any) {
        console.error('Nomination submission failed:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role === 'ADMIN') {
            const allNominations = await prisma.nominations.findMany({
                include: {
                    award: true,
                },
                orderBy: { created_at: 'desc' }
            });
            return NextResponse.json(allNominations);
        }

        const member = await prisma.members.findUnique({
            where: {
                email: user.email,
            },
        });

        if (!member) {
            return NextResponse.json(
                { error: 'Member profile not found' }, { status: 404 }
            );
        }

        const memberNominations = await prisma.nominations.findMany({
            where: {
                member_id: member.id,
            },
            include: {
                award: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(memberNominations);

    } catch (error: any) {
        console.error('Failed to fetch nominations:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message }, { status: 500 }
        );
    }
}
