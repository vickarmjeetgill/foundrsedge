'use server'

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/tokens';
import { prisma } from '@/lib/prisma';

// Server Action to retrieve the logged-in user's profile
export async function getProfile() {
    try {
        // 1. Fetch access token from cookies
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        
        // 2. Decrypt the session JWT to get the user ID
        const decodedSession = await decrypt(session);
        
        // 3. Validation: Verify decoded token is valid and contains user ID
        if (!decodedSession || !decodedSession.userId) {
            return { error: 'Unauthorized' };
        }
        
        // 4. Database query: Fetch User profile data (excluding password)
        const user = await prisma.user.findUnique({
            where: { id: decodedSession.userId as string },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
            }
        });
        
        return { success: true, user };
    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return { error: error.message || 'Server error' };
    }
}

import { supabase } from '@/lib/supabase';

// Server Action to update the user's name in both the User and Members tables
export async function updateProfile(formData: FormData) {
    try {
        // 1. Authenticate user using current session cookies
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const decodedSession = await decrypt(session);
        
        if (!decodedSession || !decodedSession.userId) {
            return { error: 'Unauthorized' };
        }
        
        // 2. Parse name from submission
        const name = (formData.get('name') as string) || '';
        
        // 3. Update the User table name
        const user = await prisma.user.update({
            where: { id: decodedSession.userId as string },
            data: { name },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatarUrl: true,
            }
        });

        // 4. Sync name changes with members table: Split name into first and last parts
        if (user.email) {
            const nameParts = name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Update the members table matching by user's email
            try {
                await prisma.members.update({
                    where: { email: user.email },
                    data: {
                        first_name: firstName,
                        last_name: lastName
                    }
                });
            } catch (dbError: any) {
                console.error('Failed to sync name with members database table:', dbError.message || dbError);
            }
        }
        
        return { success: true, user };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { error: error.message || 'Server error' };
    }
}
