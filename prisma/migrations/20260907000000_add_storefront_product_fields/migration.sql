-- AlterTable: Add storefront product detail fields
ALTER TABLE "products" ADD COLUMN "shortDescription" TEXT,
ADD COLUMN "rating" DECIMAL(2,1),
ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "badge" TEXT,
ADD COLUMN "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "material" TEXT,
ADD COLUMN "colors" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "sizes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "fabrics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "features" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "careInstructions" TEXT;
