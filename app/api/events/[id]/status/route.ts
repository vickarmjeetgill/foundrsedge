import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/tokens"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const cookieStore = await cookies()
        const sessionToken = cookieStore.get("session")?.value

        if (!sessionToken) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const decoded = await decrypt(sessionToken) as { role: string }
        const userRole = decoded?.role

        if (userRole !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden: Only admins can approve or reject events." }, { status: 403 })

        }

        const body = await request.json()
        const { status } = body

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status. Must be APPROVED OR REJECTED" }, { status: 400 })
        }

        const updatedEvent = await prisma.events.update({
            where: { id },
            data: {
                status: status as "APPROVED" | "REJECTED"
            }
        })

        return NextResponse.json({
            success: true,
            message: `Event status updated to ${status} successfully`,
            event: updatedEvent
        })

    } catch (error: any) {
        console.error("Failed to update event status:", error)
        return NextResponse.json(
            { error: `Failed to update event status: ${error.message}` },
            { status: 500 }
        )
    }
}