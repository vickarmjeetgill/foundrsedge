'use server'

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/tokens';
import { setSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function exitImpersonate() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    const payload = await decrypt(session);

    if (payload && payload.impersonatorId) {
        // Log back in as the admin (impersonator)
        await setSession(payload.impersonatorId as string);
        redirect('/admin/users');
    } else {
        redirect('/');
    }
}
