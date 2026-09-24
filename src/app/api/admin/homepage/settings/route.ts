import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

const homepageSettingsSchema = z.object({
  instagramHandle: z.string().max(50).optional(),
  instagramProfileUrl: z.string().url().optional(),
  instagramFollowText: z.string().max(50).optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    let settings = await prisma.homepageSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: { id: 'singleton' },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        updatedAt: settings.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage settings' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();
  if ('response' in auth) return auth.response;

  try {
    const body = await request.json();
    const parsed = homepageSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    await prisma.homepageSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...parsed.data },
      update: parsed.data,
    });

    const settings = await prisma.homepageSettings.findUnique({
      where: { id: 'singleton' },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...settings!,
        updatedAt: settings!.updatedAt.toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update homepage settings' },
      { status: 500 },
    );
  }
}
