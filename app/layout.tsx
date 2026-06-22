import type { Metadata } from "next";
import "./globals.css";

import { cookies } from 'next/headers';
import { decrypt } from '@/lib/tokens';
import { prisma } from '@/lib/prisma';
import ImpersonationBanner from '@/components/ImpersonationBanner';

export const metadata: Metadata = {
  title: "Founders Edge | Calgary's Entrepreneur Platform",
  description: "A curated membership platform connecting Calgary entrepreneurs to people, opportunities, and resources.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  const payload = await decrypt(session);
  let impersonatedUser = null;

  if (payload?.impersonatorId && payload?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { name: true, email: true }
    });
    if (user) {
      impersonatedUser = {
        name: user.name || 'Member',
        email: user.email
      };
    }
  }

  return (
    <html lang="en">
      <body>
        {impersonatedUser && (
          <>
            <ImpersonationBanner 
              userName={impersonatedUser.name} 
              userEmail={impersonatedUser.email} 
            />
            <style dangerouslySetInnerHTML={{ __html: `
              body {
                padding-top: 40px !important;
              }
            `}} />
          </>
        )}
        {children}
      </body>
    </html>
  );
}
