'use server'

import { prisma } from '@/lib/prisma';
import { cookies } from "next/headers";
import { decrypt } from "@/lib/tokens";

// Submit a new event from the client-side Form submission
export async function submitEvent(formData: FormData) {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    
    let memberId: string | null = null

    // Look up the logged-in user profile if they have a session cookie
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
            console.error("Session verification failed", e)
        }
    }

    // Pull form fields from the submission payload
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string
    const category = formData.get("category") as string
    const price = formData.get("price") as string
    const host = formData.get("host") as string

    // Validate that all required fields are filled out
    if (!title || !description || !date || !time || !location || !category) {
        return { error: "Please fill out all required fields." }
    }

    // Create the event record in the database
    try {
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
                status: "PENDING" // Starts off as pending review
            }
        })

        return { success: true, eventId: newEvent.id }
    } catch (error: any) {
        console.error("Error creating event:", error)
        return { error: `Submission failed: ${error?.message || "Unknown error"}` }
    }
}
