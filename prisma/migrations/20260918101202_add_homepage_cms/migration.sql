-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "backgroundImage" TEXT NOT NULL,
    "mobileImage" TEXT,
    "eyebrow" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "primaryButtonText" TEXT,
    "primaryButtonUrl" TEXT,
    "secondaryButtonText" TEXT,
    "secondaryButtonUrl" TEXT,
    "badge" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_reels" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reelUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "category" TEXT,
    "ctaText" TEXT,
    "ctaUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_reels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_posts" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postUrl" TEXT NOT NULL,
    "caption" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "homepage_settings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "instagramHandle" TEXT NOT NULL DEFAULT '@akagenciesbarabanki',
    "instagramProfileUrl" TEXT NOT NULL DEFAULT 'https://instagram.com/akagencies',
    "instagramFollowText" TEXT NOT NULL DEFAULT 'Follow on Instagram',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_slides_isActive_displayOrder_idx" ON "hero_slides"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "instagram_reels_isActive_displayOrder_idx" ON "instagram_reels"("isActive", "displayOrder");

-- CreateIndex
CREATE INDEX "instagram_posts_isActive_displayOrder_idx" ON "instagram_posts"("isActive", "displayOrder");
