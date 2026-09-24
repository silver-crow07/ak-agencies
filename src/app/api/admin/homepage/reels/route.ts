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

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const reels = await prisma.instagramReel.findMany({
      orderBy: { displayOrder: 'asc' },
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

    const serialized = reels.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reels' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const body = await request.json();
    const parsed = reelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const reel = await prisma.instagramReel.create({
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

    return NextResponse.json(
      {
        success: true,
        data: {
          ...reel,
          createdAt: reel.createdAt.toISOString(),
          updatedAt: reel.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create reel' },
      { status: 500 },
    );
  }
}
