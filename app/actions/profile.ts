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

export async function updateProfile(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session')?.value;
        const decodedSession = await decrypt(session);
        
        if (!decodedSession || !decodedSession.userId) {
            return { error: 'Unauthorized' };
        }
        
        const name = formData.get('name') as string;
        
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
        
        return { success: true, user };
    } catch (error: any) {
        console.error('Error updating profile:', error);
        return { error: error.message || 'Server error' };
    }
}
