'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { setSession, deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// Server Action for user login
export async function login(formData: FormData) {
    // Extract email and password from the form submission
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate input fields
    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        // Find the user by their email in the database
        const user = await prisma.user.findUnique({
            where: { email },
        })

        // Verify user exists and compare passwords using bcrypt
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return { error: "Invalid email or password." }
        }

        // Establish session cookies (access token + refresh token)
        await setSession(user.id)

        // 6. Return user details on successful login
        return {
            success: true,
            role: user.role,
        };
    } catch (error: any) {
        console.error("[login] Error:", error)
        return { error: `Server error: ${error?.message ?? "Unknown"}` }
    }
}

// Server Action for registering a new user
export async function register(formData: FormData) {
    // Extract email and password from the registration form
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate inputs
    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    try {
        // Hash the plain text password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create the new User record in the database
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        // Automatically log the user in by setting the session cookies
        await setSession(user.id)

        return { success: true }
    } catch (error: any) {
        console.error("[register] Error:", error)
        // Check for Prisma unique constraint violation (duplicate email)
        if (error.code === "P2002") {
            return { error: "This email is already in use." }
        }
        return { error: `Server error: ${error?.message ?? "Unknown"}` }
    }
}

// Server Action to log a user out
export async function logout() {
    // Delete access and refresh token cookies
    await deleteSession();
    // Redirect back to the login page
    redirect('/login');
}



