import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (
            process.env.NODE_ENV === "production" &&
            authHeader !== `Bearer ${process.env.CRON_SECRET}`
        ) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Edmonton" });

        console.log(`[Cron Awards] Running auto-close check. Today: ${todayStr}`);

        const awardsToClose = await prisma.awards.findMany({
            where: {
                nominationsOpen: true,
                deadline: {
                    lt: todayStr,
                },
            },
            select: {
                id: true,
                name: true,
                deadline: true,
            },
        });

        if (awardsToClose.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No awards to close today.",
                closedCount: 0,
            });
        }

        const result = await prisma.awards.updateMany({
            where: {
                nominationsOpen: true,
                deadline: {
                    lt: todayStr,
                },
            },
            data: {
                nominationsOpen: false,
            },
        });

        console.log(`[Cron Awards] Successfully closed nominations for ${result.count} awards.`);

        return NextResponse.json({
            success: true,
            message: `Successfully closed nominations for ${result.count} awards.`,
            closedCount: result.count,
            closedAwards: awardsToClose,
        });

    } catch (error: any) {
        console.error('[Cron Awards Error]:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}

// Support GET requests for easy manual triggers / browser testing in development
export async function GET(request: Request) {
    return POST(request);
}