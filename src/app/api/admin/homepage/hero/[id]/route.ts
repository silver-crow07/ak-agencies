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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const { id } = await params;

    const slide = await prisma.heroSlide.findUnique({
      where: { id },
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

    if (!slide) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...slide,
        createdAt: slide.createdAt.toISOString(),
        updatedAt: slide.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero slide' },
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
    const parsed = heroSlideSchema.partial().safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const existing = await prisma.heroSlide.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 },
      );
    }

    const slide = await prisma.heroSlide.update({
      where: { id },
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

    return NextResponse.json({
      success: true,
      data: {
        ...slide,
        createdAt: slide.createdAt.toISOString(),
        updatedAt: slide.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update hero slide' },
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

    const existing = await prisma.heroSlide.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Hero slide not found' },
        { status: 404 },
      );
    }

    await prisma.heroSlide.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { id } });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to delete hero slide' },
      { status: 500 },
    );
  }
}
