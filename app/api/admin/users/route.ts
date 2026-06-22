import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                {
                    error: 'Unauthorized'
                },
                {
                    status: 401
                }
            );
        }

        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: "Forbidden, you don't have permission." },
                { status: 403 }
            );
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                avatarUrl: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        const userEmails = users.map((user) => user.email);

        const associatedMembers = await prisma.members.findMany({
            where: {
                email: {
                    in: userEmails,
                },
            },
            select: {
                id: true,
                email: true,
                phone: true,
                stage: true,
                industry: true,
            },
        });

        const combinedUserData = users.map((user) => {
            const memberProfile = associatedMembers.find((m) => m.email === user.email);

            return {
                ...user,
                memberProfile: memberProfile || null,
            };
        });

        return NextResponse.json(combinedUserData, { status: 200 });
    } catch (error) {
        console.error('Error fetching admin users list:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}