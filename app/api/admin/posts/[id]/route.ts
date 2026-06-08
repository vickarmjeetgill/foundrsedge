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
            return NextResponse.json({ success: false, error: 'Invalid post ID' }, { status: 400 });
        }

        const post = await (prisma as any).posts.findUnique({ where: { id } });

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        const updatedPost = await (prisma as any).posts.update({
            where: { id },
            data: { removed: true },
        });

        return NextResponse.json({
            success: true,
            message: 'Post removed successfully.',
            post: updatedPost,
        });
    } catch (error: any) {
        console.error('Failed to remove post:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to remove post', details: error?.message || '' },
            { status: 500 }
        );
    }
}