-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "gender" TEXT NOT NULL DEFAULT 'unisex',
    "category" TEXT NOT NULL DEFAULT 'perfume',
    "concentration" TEXT NOT NULL DEFAULT '',
    "images" JSONB NOT NULL,
    "variants" JSONB NOT NULL,
    "notes" JSONB NOT NULL,
    "longevity" TEXT NOT NULL DEFAULT '',
    "sillage" TEXT NOT NULL DEFAULT '',
    "seasons" JSONB NOT NULL,
    "occasions" JSONB NOT NULL,
    "badge" TEXT,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "released_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
