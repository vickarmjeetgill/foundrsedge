import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/tokens"

export async function POST(request: Request) {
  try {
    // 1. Authenticate the submitting member via session cookie
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    let memberId: string | null = null

    if (sessionToken) {
      try {
        const decoded = await decrypt(sessionToken) as { userId: string }
        if (decoded?.userId) {
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
          })
          if (user?.email) {
            const member = await prisma.members.findUnique({
              where: { email: user.email }
            })
            memberId = member?.id || null
          }
        }
      } catch (e) {
        console.error("Session verification failed:", e)
      }
    }

    // 2. Parse the request body JSON
    const body = await request.json()
    const { title, description, date, time, location, category, price, host } = body

    // 3. Validation
    if (!title || !description || !date || !time || !location || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, date, time, location, category" },
        { status: 400 }
      )
    }

    // 4. Save to Database
    const newEvent = await prisma.events.create({
      data: {
        title,
        description,
        date,
        time,
        location,
        category,
        price: price || "Free",
        host: host || "Member Submission",
        member_id: memberId,
        status: "PENDING" // Default to pending review
      }
    })

    return NextResponse.json(
      { success: true, message: "Event submitted successfully", event: newEvent },
      { status: 201 }
    )

  } catch (error: any) {
    console.error("API Error in POST /events:", error)
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value

    let isAdmin = false

    if (sessionToken) {
      try {
        const decoded = await decrypt(sessionToken) as { role: string }
        if (decoded?.role === "ADMIN") {
          isAdmin = true
        }
      } catch (e) {
        console.error("Failed to decrypt session token")
      }
    }

    const eventsList = await prisma.events.findMany({
      where: isAdmin ? {} : { status: "APPROVED" },
      orderBy: {
        created_At: "desc"
      }
    })
    return NextResponse.json(eventsList, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
