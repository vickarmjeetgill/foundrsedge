import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    // Security check: Verify Bearer token matches CRON_SECRET in production environment
    if (
      process.env.NODE_ENV === "production" && 
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Grab current date in Calgary (America/Edmonton) timezone in YYYY-MM-DD string format
    const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "America/Edmonton" });

    console.log(`[Cron Archive] Running auto-archive check. Today: ${todayStr}`);

    // Retrieve events about to be archived for detailed logs
    const eventsToArchive = await prisma.events.findMany({
      where: {
        status: "APPROVED",
        date: {
          lt: todayStr,
        },
      },
      select: {
        id: true,
        title: true,
        date: true,
      },
    });

    if (eventsToArchive.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No past events to archive today.",
        archivedCount: 0,
      });
    }

    // Perform bulk database update to status='ARCHIVED' and featured=false
    const result = await prisma.events.updateMany({
      where: {
        status: "APPROVED",
        date: {
          lt: todayStr,
        },
      },
      data: {
        status: "ARCHIVED",
        featured: false,
      },
    });

    console.log(`[Cron Archive] Successfully archived ${result.count} past events.`);

    return NextResponse.json({
      success: true,
      message: `Successfully archived ${result.count} past events.`,
      archivedCount: result.count,
      archivedEvents: eventsToArchive,
    });
  } catch (error: any) {
    console.error("[Cron Archive Error]:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "" },
      { status: 500 }
    );
  }
}

// Support GET requests for easy manual triggers / browser testing in development
export async function GET(request: Request) {
  return POST(request);
}
