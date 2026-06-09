import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const isValidUuid =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        if (!isValidUuid) {
            return NextResponse.json(
                { success: false, error: 'Invalid post ID' },
                { status: 400 }
            );
        }
        const body = await request.json();

        const reason = body.reason;
        const details = body.details || null;
        const reportedBy = body.reportedBy || 'Member';

        if (!reason) {
            return NextResponse.json(
                { success: false, error: 'Reason is required' },
                { status: 400 }
            );
        }

        const post = await (prisma as any).posts.findUnique({
            where: { id },
        });

        if (!post) {
            return NextResponse.json(
                { success: false, error: 'Post not found' },
                { status: 404 }
            );
        }

        const report = await (prisma as any).flag_reports.create({
            data: {
                content_type: 'post',
                content_id: id,
                post_id: id,
                content_preview: post.content.slice(0, 100),
                author_name: post.author_name,
                reported_by: reportedBy,
                reason,
                details,
                status: 'pending',
            },
        });

        await (prisma as any).posts.update({
            where: { id },
            data: {
                flag_count: post.flag_count + 1,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Post has been flagged for review.',
                report,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Failed to flag post:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to flag post',
                details: error?.message || '',
            },
            { status: 500 }
        );
    }
}