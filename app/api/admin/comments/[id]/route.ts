import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const isValidUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isValidUuid) {
            return NextResponse.json({ success: false, error: 'Invalid comment ID' }, { status: 400 });
        }

        const comment = await (prisma as any).comments.findUnique({ where: { id } });

        if (!comment) {
            return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
        }

        const updatedComment = await (prisma as any).comments.update({
            where: { id },
            data: { removed: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Comment removed successfully.',
            comment: updatedComment,
        });
    } catch (error: any) {
        console.error('Failed to remove comment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to remove comment', details: error?.message || '' },
            { status: 500 }
        );
    }
}