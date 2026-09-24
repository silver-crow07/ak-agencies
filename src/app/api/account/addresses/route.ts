import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { addressSchema } from '@/lib/validations';

function serializeAddress(addr: {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: addr.id,
    fullName: addr.fullName,
    phone: addr.phone,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    postalCode: addr.postalCode,
    country: addr.country,
    isDefault: addr.isDefault,
    createdAt: addr.createdAt,
    updatedAt: addr.updatedAt,
  };
}

// GET /api/account/addresses — List user's addresses
export async function GET() {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({
      success: true,
      data: addresses.map(serializeAddress),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}

// POST /api/account/addresses — Create a new address
export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { isDefault, ...addressData } = parsed.data;
    const userId = session.userId;

    // Check if this is the user's first address
    const addressCount = await prisma.address.count({
      where: { userId },
    });

    const makeDefault = addressCount === 0 || isDefault;

    const address = await prisma.$transaction(async (tx) => {
      // If making this the default, unset any existing default
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          ...addressData,
          isDefault: makeDefault,
        },
      });
    });

    return NextResponse.json(
      { success: true, data: serializeAddress(address) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
