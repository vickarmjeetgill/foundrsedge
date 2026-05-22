'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { setSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// Used on the login page — checks credentials, does NOT create a new user
export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { error: "Invalid email or password." }
        }

        // Establish the secure session cookie
        await setSession(user.id)

        return {
            success: true,
            role: user.role,
        };
    } catch (error: any) {
        console.error("[login] Error:", error)
        return { error: `Server error: ${error?.message ?? "Unknown"}` }
    }
}

// Used during membership registration — creates a new user account
export async function register(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        // Automatically log the user in after registration
        await setSession(user.id)

        return { success: true }
    } catch (error: any) {
        console.error("[register] Error:", error)
        if (error.code === "P2002") {
            return { error: "This email is already in use." }
        }
        return { error: `Server error: ${error?.message ?? "Unknown"}` }
    }
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}



