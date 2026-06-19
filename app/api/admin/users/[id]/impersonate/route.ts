import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, setSession } from '@/lib/session';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentAdmin = await getCurrentUser();
        if (!currentAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (currentAdmin.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const resolvedParams = await params;
        const targetUserId = resolvedParams.id;

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
        }

        if (targetUser.status === 'DEACTIVATED') {
            return NextResponse.json({ error: 'Cannot impersonate a deactivated user' }, { status: 400 });
        }

        console.log(`Admin ${currentAdmin.id} is impersonating User ${targetUserId}`);

        await setSession(targetUserId, currentAdmin.id);

        return NextResponse.json({
            success: true,
            message: `Now impersonating ${targetUser.email}`
        });
    }
    catch (error) {
        console.error('Impersonation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}