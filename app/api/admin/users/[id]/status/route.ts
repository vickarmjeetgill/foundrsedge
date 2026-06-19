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
            return NextResponse.json({ error: 'Unauthorized: Access is denied' }, { status: 401 });
        };

        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden: You do not have permission to modify user status.' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!status) {
            return NextResponse.json(
                { error: 'Bad Request: Missing required field status.' }, { status: 400 }
            );
        }

        const normalizedStatus = status.toUpperCase();
        if (normalizedStatus !== 'ACTIVE' && normalizedStatus !== 'DEACTIVATED') {
            return NextResponse.json(
                { error: 'Bad Request: Status must be either ACTIVE or DEACTIVATED.' },
                { status: 400 }
            );
        }

        if (id === currentUser.id) {
            return NextResponse.json(
                { error: 'Conflict: Cannot deactivate admin account as admin' }, { status: 409 }
            );
        }

        const targetUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: 'Not Found: User account does not exist.' }, { status: 404 }
            );
        }

        const updateData: { status: string; refreshToken?: string | null } = {
            status: normalizedStatus,
        };

        if (normalizedStatus === 'DEACTIVATED') {
            updateData.refreshToken = null;
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                status: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error('Error updating user status:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

