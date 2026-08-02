import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = { isPublished: true };

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (gender) {
      where.gender = gender;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const formatted = (products as any[]).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice || undefined,
      image: p.images[0]?.url || '/placeholder.jpg',
      category: p.category,
      gender: p.gender,
      rating: p.rating,
      reviewCount: p.reviewCount,
      stock: p.stock,
      isNew: p.isNew,
      isLimited: p.isLimited,
      isFeatured: p.isFeatured,
      variants: p.variants,
    }));

    return NextResponse.json({
      products: formatted,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
