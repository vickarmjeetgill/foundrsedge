import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/tokens"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingEvent = await prisma.events.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await decrypt(sessionToken) as { userId: string, role: string }
    const userRole = decoded?.role
    const userId = decoded?.userId

    // Retrieve the user's email or member record
    let memberId: string | null = null

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (user?.email) {
        const member = await prisma.members.findUnique({
          where: { email: user.email }
        })
        memberId = member?.id || null
      }
    }

    // Check if the user is an ADMIN or if the event's member_id matches the logged-in member's ID
    const isAuthorized = userRole === "ADMIN" || (memberId !== null && existingEvent.member_id === memberId)

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden: You don't own this event" }, { status: 403 })
    }

    // Parse & validate incoming data
    const body = await request.json()
    const { title, description, date, time, location, category, price, host } = body

    // Update in database
    const updatedEvent = await prisma.events.update({
      where: {
        id: id
      },
      data: {
        title,
        description,
        date,
        time,
        location,
        category,
        price: price !== undefined ? price : undefined,
        host: host !== undefined ? host : undefined,
      }
    })

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event: updatedEvent
    })

  } catch (error: any) {
    console.error("Put Event Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existingEvent = await prisma.events.findUnique({
      where: { id }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = await decrypt(sessionToken) as { userId: string, role: string }
    const userRole = decoded?.role
    const userId = decoded?.userId

    let memberId: string | null = null
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      if (user?.email) {
        const member = await prisma.members.findUnique({
          where: { email: user.email }
        })
        memberId = member?.id || null
      }
    }

    const isAuthorized = userRole === "ADMIN" || (memberId !== null && existingEvent.member_id === memberId)

    if (!isAuthorized) {
      return NextResponse.json({ error: "Forbidden: You are not authorized to delete this event" }, { status: 403 })
    }

    // Delete the event from the database
    const deletedEvent = await prisma.events.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({
      success: true,
      message: "Event deleted successfully",
      event: deletedEvent
    })

  } catch (error: any) {
    console.error("DELETE Event Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "" },
      { status: 500 }
    )
  }
}
