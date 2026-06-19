import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { role } = body;

        if (!role) {
            return NextResponse.json(
                { error: 'Bad Request: Missing required field roles' },
                { status: 400 }
            );
        }

        if (id === currentUser.id) {
            return NextResponse.json(
                { error: 'Conflict: You cannot demote admin role' },
                { status: 409 }
            );
        }

        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: 'Account does not exist' }, { status: 404 }
            );
        }

        const allowedRoles = ['ADMIN', 'MEMBER'];
        const upperRole = typeof role === 'string' ? role.toUpperCase() : '';

        if (!allowedRoles.includes(upperRole)) {
            return NextResponse.json(
                { error: 'Bad Request: Invalid or missing role. Must be admin or member' }, { status: 400 }
            );
        }


        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role: upperRole },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
