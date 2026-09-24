import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const heroSlideSchema = z.object({
  backgroundImage: z.string().min(1),
  mobileImage: z.string().optional(),
  eyebrow: z.string().max(100).optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  primaryButtonText: z.string().max(50).optional(),
  primaryButtonUrl: z.string().max(200).optional(),
  secondaryButtonText: z.string().max(50).optional(),
  secondaryButtonUrl: z.string().max(200).optional(),
  badge: z.string().max(50).optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: { displayOrder: 'asc' },
      select: {
        id: true,
        backgroundImage: true,
        mobileImage: true,
        eyebrow: true,
        title: true,
        description: true,
        primaryButtonText: true,
        primaryButtonUrl: true,
        secondaryButtonText: true,
        secondaryButtonUrl: true,
        badge: true,
        isActive: true,
        displayOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const serialized = slides.map((s) => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: serialized });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slides' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const body = await request.json();
    const parsed = heroSlideSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const slide = await prisma.heroSlide.create({
      data: parsed.data,
      select: {
        id: true,
        backgroundImage: true,
        mobileImage: true,
        eyebrow: true,
        title: true,
        description: true,
        primaryButtonText: true,
        primaryButtonUrl: true,
        secondaryButtonText: true,
        secondaryButtonUrl: true,
        badge: true,
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
          ...slide,
          createdAt: slide.createdAt.toISOString(),
          updatedAt: slide.updatedAt.toISOString(),
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create hero slide' },
      { status: 500 },
    );
  }
}
