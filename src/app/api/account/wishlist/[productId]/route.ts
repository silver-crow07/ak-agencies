import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';

// DELETE /api/account/wishlist/[productId] — Remove from wishlist
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 },
      );
    }

    const { productId } = await params;

    // Find the wishlist item belonging to this user
    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.userId,
          productId,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Not found in wishlist' },
        { status: 404 },
      );
    }

    await prisma.wishlistItem.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 },
    );
  }
}
