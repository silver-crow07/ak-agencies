import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [heroSlides, reels, posts, settings] = await Promise.all([
      prisma.heroSlide.findMany({
        where: { isActive: true },
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
          displayOrder: true,
        },
      }),
      prisma.instagramReel.findMany({
        where: { isActive: true },
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
          displayOrder: true,
        },
      }),
      prisma.instagramPost.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
        select: {
          id: true,
          imageUrl: true,
          postUrl: true,
          caption: true,
          displayOrder: true,
        },
      }),
      prisma.homepageSettings.findUnique({
        where: { id: 'singleton' },
        select: {
          instagramHandle: true,
          instagramProfileUrl: true,
          instagramFollowText: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        heroSlides,
        reels,
        posts,
        settings,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage data' },
      { status: 500 },
    );
  }
}
