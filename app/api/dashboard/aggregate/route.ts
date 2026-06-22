import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withErrorHandling } from '@/lib/api-error-handler';

export const GET = withErrorHandling(async () => {
  try {
    const [events, offers, posts, notifications] = await Promise.all([
      (prisma as any).events.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      }),

      (prisma as any).offers.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      }),

      (prisma as any).posts.findMany({
        where: {
          removed: false,
        },
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      }),

      (prisma as any).notifications.findMany({
        orderBy: {
          created_at: 'desc',
        },
        take: 5,
      }),
    ]);

    const activity = [
      ...events.map((event: any) => ({
        id: event.id,
        type: 'event',
        title: event.title,
        subtitle: event.category,
        status: event.status,
        created_at: event.created_at,
      })),

      ...offers.map((offer: any) => ({
        id: offer.id,
        type: 'offer',
        title: offer.title,
        subtitle: offer.category,
        status: offer.status,
        created_at: offer.created_at,
      })),

      ...posts.map((post: any) => ({
        id: post.id,
        type: 'post',
        title: post.content,
        subtitle: post.author_business || post.author_name || 'Community Post',
        status: 'active',
        created_at: post.created_at,
      })),
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return NextResponse.json({
      success: true,
      summary: {
        events: events.length,
        offers: offers.length,
        posts: posts.length,
        notifications: notifications.length,
      },
      activity: activity.slice(0, 10),
      events,
      offers,
      posts,
      notifications,
    });
  } catch (error: any) {
    console.error('Failed to load dashboard aggregate:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load dashboard aggregate',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
});