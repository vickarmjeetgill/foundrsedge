import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt, encrypt } from '@/lib/tokens';

export default async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isDashboard = path.startsWith('/dashboard');

    if (isDashboard) {
        const session = request.cookies.get('session')?.value;
        const decodedSession = await decrypt(session);

        // 1. If access token is valid, let them through
        if (decodedSession) {
            // Enforce RBAC for Admin routes
            if (path.startsWith('/dashboard/admin') && decodedSession.role !== 'ADMIN') {
                console.warn(`🔒 Blocked non-admin user ${decodedSession.userId} from accessing ${path}`);
                return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
            }
            return NextResponse.next();
        }

        // 2. If access token is expired, check for the refresh token
        const refreshToken = request.cookies.get('refreshToken')?.value;
        const decodedRefresh = await decrypt(refreshToken);

        if (decodedRefresh && decodedRefresh.userId) {
            const role = decodedRefresh.role ?? 'MEMBER';

            // Enforce RBAC for Admin routes during refresh
            if (path.startsWith('/dashboard/admin') && role !== 'ADMIN') {
                console.warn(`🔒 Blocked non-admin refresh for ${path} by user ${decodedRefresh.userId}`);
                return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
            }

            // SILENT REFRESH: Issue a new 15-minute access token carrying the role
            const newSession = await encrypt({ userId: decodedRefresh.userId, role }, '15m');
            const response = NextResponse.next();
            
            response.cookies.set('session', newSession, {
                expires: new Date(Date.now() + 15 * 60 * 1000),
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
            });
            
            console.log("--- Silent session refresh for user:", decodedRefresh.userId, "---");
            return response;
        }

        // 3. If neither is valid, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
