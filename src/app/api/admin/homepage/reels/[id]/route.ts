import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const reelSchema = z.object({
  title: z.string().min(1).max(100),
  reelUrl: z.string().url(),
  thumbnailUrl: z.string().min(1),
  videoUrl: z.string().optional().nullable(),
  category: z.string().max(50).optional(),
  ctaText: z.string().max(50).optional(),
  ctaUrl: z.string().max(200).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const { id } = await params;

    const reel = await prisma.instagramReel.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        reelUrl: true,
        thumbnailUrl: true,
        videoUrl: true,
        category: true,
        ctaText: true,
        ctaUrl: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!reel) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...reel,
        createdAt: reel.createdAt.toISOString(),
        updatedAt: reel.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reel' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = reelSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const existing = await prisma.instagramReel.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 },
      );
    }

    const reel = await prisma.instagramReel.update({
      where: { id },
      data: parsed.data,
      select: {
        id: true,
        title: true,
        reelUrl: true,
        thumbnailUrl: true,
        videoUrl: true,
        category: true,
        ctaText: true,
        ctaUrl: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...reel,
        createdAt: reel.createdAt.toISOString(),
        updatedAt: reel.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update reel' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const { id } = await params;

    const existing = await prisma.instagramReel.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Reel not found' },
        { status: 404 },
      );
    }

    await prisma.instagramReel.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete reel' },
      { status: 500 },
    );
  }
}
