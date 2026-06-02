'use server'

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/tokens';
import { prisma } from '@/lib/prisma';

export async function getProfile() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const decodedSession = await decrypt(session);
        
        if (!decodedSession || !decodedSession.userId) {
            return { error: 'Unauthorized' };
        }
        
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

export async function updateProfile(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const decodedSession = await decrypt(session);
        
        if (!decodedSession || !decodedSession.userId) {
            return { error: 'Unauthorized' };
        }
        
        const name = (formData.get('name') as string) || '';
        
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

        // Sync with PostgreSQL members table using Prisma directly (foolproof, bypasses RLS)
        if (user.email) {
            const nameParts = name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

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
