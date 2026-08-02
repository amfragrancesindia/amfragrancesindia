import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        gender: true,
        category: true,
        isNew: true,
        isLimited: true,
        isFeatured: true,
        stock: true,
        soldCount: true,
        rating: true,
        reviewCount: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
        variants: {
          select: {
            id: true,
            name: true,
            volume: true,
            price: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formatted = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice || undefined,
      image: p.images[0]?.url || '/placeholder.jpg',
      images: p.images.map((img: any) => img.url),
      category: p.category,
      gender: p.gender,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isNew: p.isNew,
      isLimited: p.isLimited,
      isFeatured: p.isFeatured,
      isBestseller: p.soldCount > 100,
      variants: p.variants,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
