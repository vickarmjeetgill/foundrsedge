import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUuid) {
      return NextResponse.json(
        { error: 'Invalid offer ID' },
        { status: 400 }
      );
    }

    const offer = await (prisma as any).offers.findUnique({
      where: { id },
    });

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error('Failed to fetch offer:', error);

    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const isValidUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (!isValidUuid) {
      return NextResponse.json(
        { error: 'Invalid offer ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const featured =
      body.featured === true || body.featured === 'true'
        ? true
        : body.featured === false || body.featured === 'false'
          ? false
          : null;

    if (featured === null) {
      return NextResponse.json(
        { error: 'featured must be true or false' },
        { status: 400 }
      );
    }

    const updatedOffer = await (prisma as any).offers.update({
      where: { id },
      data: {
        featured,
      },
    });

    return NextResponse.json({
      success: true,
      message: featured
        ? 'Offer marked as featured.'
        : 'Offer removed from featured.',
      offer: updatedOffer,
    });
  } catch (error: any) {
    console.error('Failed to update featured offer:', error);

    return NextResponse.json(
      {
        error: 'Failed to update featured offer',
        details: error?.message || '',
      },
      { status: 500 }
    );
  }
}
    