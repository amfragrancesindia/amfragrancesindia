import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amfragrances.com' },
    update: {},
    create: {
      email: 'admin@amfragrances.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
      phoneVerified: true,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    { name: 'Eau de Parfum', description: 'Long-lasting fragrances with high concentration', sortOrder: 1 },
    { name: 'Eau de Toilette', description: 'Light and refreshing fragrances', sortOrder: 2 },
    { name: 'Luxury Collection', description: 'Premium exclusive fragrances', sortOrder: 3 },
    { name: 'Attars', description: 'Traditional Indian attars and oils', sortOrder: 4 },
    { name: 'Perfume Oils', description: 'Concentrated perfume oils', sortOrder: 5 },
    { name: 'Gift Collection', description: 'Perfect gift sets', sortOrder: 6 },
    { name: 'Discovery Sets', description: 'Sample and discovery sets', sortOrder: 7 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: slugify(cat.name) },
      update: {},
      create: {
        ...cat,
        slug: slugify(cat.name),
        isActive: true,
      },
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create sample products
  const products = [
    {
      name: 'Royal Oud',
      slug: 'royal-oud',
      description: 'A majestic blend of oud, saffron, and rose that captures the grandeur of Indian royalty. This exquisite fragrance opens with precious Kashmir saffron, develops into a heart of Bulgarian rose damascena, and settles into a rich base of aged Indian oud and sandalwood.',
      shortDescription: 'Majestic oud with saffron and rose',
      category: 'Luxury Collection',
      gender: 'MEN',
      price: 8999,
      compareAtPrice: 11999,
      sku: 'AMF-ROYAL-OUD-001',
      isPublished: true,
      isFeatured: true,
      isNew: false,
      isLimited: true,
      longevity: 10,
      projection: 'Strong',
      season: ['WINTER', 'FALL'],
      occasion: ['EVENING', 'FORMAL'],
      ingredients: 'Oud, Saffron, Rose, Sandalwood, Amber',
      rating: 4.8,
      reviewCount: 124,
      stock: 15,
      soldCount: 89,
      images: [
        { url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&q=80', alt: 'Royal Oud', isPrimary: true, position: 0 },
        { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80', alt: 'Royal Oud Detail', isPrimary: false, position: 1 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Saffron', description: 'Precious Kashmir saffron with a warm, spicy aroma' },
        { noteType: 'HEART', name: 'Rose', description: 'Bulgarian rose damascena, rich and floral' },
        { noteType: 'BASE', name: 'Oud', description: 'Aged Indian oud with deep woody notes' },
      ],
      variants: [
        { name: '50ml', volume: '50ml', price: 8999, sku: 'AMF-ROYAL-OUD-50', stock: 10, isAvailable: true },
        { name: '100ml', volume: '100ml', price: 12999, sku: 'AMF-ROYAL-OUD-100', stock: 5, isAvailable: true },
      ],
    },
    {
      name: 'Saffron Elixir',
      slug: 'saffron-elixir',
      description: 'An intoxicating blend of Kashmir saffron, Egyptian jasmine, and warm amber. This luxurious fragrance captures the essence of Indian opulence with its rich, spicy opening and warm, enveloping dry down.',
      shortDescription: 'Kashmir saffron with jasmine and amber',
      category: 'Eau de Parfum',
      gender: 'WOMEN',
      price: 7499,
      sku: 'AMF-SAFFRON-ELIXIR-001',
      isPublished: true,
      isFeatured: true,
      isNew: false,
      isLimited: false,
      longevity: 8,
      projection: 'Moderate',
      season: ['WINTER', 'FALL'],
      occasion: ['EVENING', 'ROMANTIC'],
      ingredients: 'Saffron, Jasmine, Amber, Vanilla, Musk',
      rating: 4.9,
      reviewCount: 89,
      stock: 23,
      soldCount: 156,
      images: [
        { url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=600&q=80', alt: 'Saffron Elixir', isPrimary: true, position: 0 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Bergamot', description: 'Italian bergamot with citrus freshness' },
        { noteType: 'HEART', name: 'Jasmine', description: 'Egyptian jasmine, sweet and intoxicating' },
        { noteType: 'BASE', name: 'Amber', description: 'Golden amber with warm, resinous depth' },
      ],
      variants: [
        { name: '50ml', volume: '50ml', price: 7499, sku: 'AMF-SAFFRON-ELIXIR-50', stock: 15, isAvailable: true },
        { name: '100ml', volume: '100ml', price: 10999, sku: 'AMF-SAFFRON-ELIXIR-100', stock: 8, isAvailable: true },
      ],
    },
    {
      name: 'Jasmine Noir',
      slug: 'jasmine-noir',
      description: 'A mysterious and seductive fragrance featuring night-blooming jasmine, dark woods, and a hint of spice. This captivating scent is perfect for those who dare to stand out.',
      shortDescription: 'Night-blooming jasmine mystery',
      category: 'Eau de Parfum',
      gender: 'WOMEN',
      price: 6999,
      compareAtPrice: 8999,
      sku: 'AMF-JASMINE-NOIR-001',
      isPublished: true,
      isFeatured: true,
      isNew: true,
      isLimited: false,
      longevity: 7,
      projection: 'Moderate',
      season: ['SPRING', 'SUMMER'],
      occasion: ['DAYTIME', 'CASUAL'],
      ingredients: 'Jasmine, Ylang-Ylang, Cedarwood, Vanilla',
      rating: 4.7,
      reviewCount: 56,
      stock: 18,
      soldCount: 42,
      images: [
        { url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80', alt: 'Jasmine Noir', isPrimary: true, position: 0 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Bergamot', description: 'Fresh citrus opening' },
        { noteType: 'HEART', name: 'Jasmine', description: 'Night-blooming jasmine, heady and floral' },
        { noteType: 'BASE', name: 'Cedarwood', description: 'Dark woody base with vanilla' },
      ],
      variants: [
        { name: '50ml', volume: '50ml', price: 6999, sku: 'AMF-JASMINE-NOIR-50', stock: 12, isAvailable: true },
        { name: '100ml', volume: '100ml', price: 9999, sku: 'AMF-JASMINE-NOIR-100', stock: 6, isAvailable: true },
      ],
    },
    {
      name: 'Amber Mystique',
      slug: 'amber-mystique',
      description: 'A warm, enveloping blend of amber, vanilla, and precious woods. This unisex fragrance is both comforting and sophisticated, perfect for any occasion.',
      shortDescription: 'Warm amber with vanilla and woods',
      category: 'Luxury Collection',
      gender: 'UNISEX',
      price: 9999,
      sku: 'AMF-AMBER-MYSTIQUE-001',
      isPublished: true,
      isFeatured: true,
      isNew: false,
      isLimited: true,
      longevity: 10,
      projection: 'Strong',
      season: ['WINTER'],
      occasion: ['EVENING', 'FORMAL'],
      ingredients: 'Amber, Vanilla, Sandalwood, Patchouli, Musk',
      rating: 5.0,
      reviewCount: 42,
      stock: 8,
      soldCount: 31,
      images: [
        { url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80', alt: 'Amber Mystique', isPrimary: true, position: 0 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Cardamom', description: 'Warm spicy opening' },
        { noteType: 'HEART', name: 'Amber', description: 'Rich golden amber heart' },
        { noteType: 'BASE', name: 'Vanilla', description: 'Creamy vanilla and sandalwood base' },
      ],
      variants: [
        { name: '50ml', volume: '50ml', price: 9999, sku: 'AMF-AMBER-MYSTIQUE-50', stock: 5, isAvailable: true },
        { name: '100ml', volume: '100ml', price: 14999, sku: 'AMF-AMBER-MYSTIQUE-100', stock: 3, isAvailable: true },
      ],
    },
    {
      name: 'Kashmir Kesar',
      slug: 'kashmir-kesar',
      description: 'A pure and elegant fragrance showcasing the finest Kashmiri saffron. This attar is a testament to traditional Indian perfumery, offering a rich and authentic scent experience.',
      shortDescription: 'Pure Kashmiri saffron attar',
      category: 'Attars',
      gender: 'UNISEX',
      price: 5999,
      sku: 'AMF-KASHMIR-KESAR-001',
      isPublished: true,
      isFeatured: false,
      isNew: true,
      isLimited: false,
      longevity: 8,
      projection: 'Moderate',
      season: ['WINTER', 'FALL'],
      occasion: ['EVENING', 'FORMAL'],
      ingredients: 'Kashmiri Saffron, Rose, Sandalwood',
      rating: 4.9,
      reviewCount: 34,
      stock: 20,
      soldCount: 28,
      images: [
        { url: 'https://images.unsplash.com/photo-1557174364-dc3859a8f87d?w=600&q=80', alt: 'Kashmir Kesar', isPrimary: true, position: 0 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Saffron', description: 'Premium Kashmiri saffron' },
        { noteType: 'HEART', name: 'Rose', description: 'Indian rose attar' },
        { noteType: 'BASE', name: 'Sandalwood', description: 'Mysore sandalwood' },
      ],
      variants: [
        { name: '12ml', volume: '12ml', price: 5999, sku: 'AMF-KASHMIR-KESAR-12', stock: 15, isAvailable: true },
        { name: '24ml', volume: '24ml', price: 10999, sku: 'AMF-KASHMIR-KESAR-24', stock: 5, isAvailable: true },
      ],
    },
    {
      name: 'Midnight Rose',
      slug: 'midnight-rose',
      description: 'A deep, romantic fragrance centered around dark roses and exotic spices. Perfect for evening wear, this scent leaves a lasting impression.',
      shortDescription: 'Dark roses with exotic spices',
      category: 'Eau de Parfum',
      gender: 'WOMEN',
      price: 8499,
      sku: 'AMF-MIDNIGHT-ROSE-001',
      isPublished: true,
      isFeatured: true,
      isNew: false,
      isLimited: true,
      longevity: 9,
      projection: 'Strong',
      season: ['WINTER', 'FALL'],
      occasion: ['EVENING', 'ROMANTIC'],
      ingredients: 'Rose, Pepper, Patchouli, Vanilla',
      rating: 4.8,
      reviewCount: 67,
      stock: 12,
      soldCount: 53,
      images: [
        { url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=600&q=80', alt: 'Midnight Rose', isPrimary: true, position: 0 },
      ],
      notes: [
        { noteType: 'TOP', name: 'Pink Pepper', description: 'Spicy and vibrant opening' },
        { noteType: 'HEART', name: 'Rose', description: 'Dark Turkish rose' },
        { noteType: 'BASE', name: 'Patchouli', description: 'Earthy patchouli with vanilla' },
      ],
      variants: [
        { name: '50ml', volume: '50ml', price: 8499, sku: 'AMF-MIDNIGHT-ROSE-50', stock: 8, isAvailable: true },
        { name: '100ml', volume: '100ml', price: 12499, sku: 'AMF-MIDNIGHT-ROSE-100', stock: 4, isAvailable: true },
      ],
    },
  ];

  for (const product of products) {
    const { images, notes, variants, ...productData } = product;
    (productData as any).gender = (productData as any).gender as "MEN" | "WOMEN" | "UNISEX";

    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: productData as any,
      create: productData as any,
    });

    // Create product images
    for (const image of images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: image.url,
          alt: image.alt,
          isPrimary: image.isPrimary,
          position: image.position,
        },
      });
    }

    // Create fragrance notes
    for (const note of notes) {
      await prisma.fragranceNote.create({
        data: {
          productId: createdProduct.id,
          noteType: note.noteType as any,
          name: note.name,
          description: note.description,
        },
      });
    }

    // Create variants
    for (const variant of variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          name: variant.name,
          volume: variant.volume,
          price: variant.price,
          sku: variant.sku,
          stock: variant.stock,
          isAvailable: variant.isAvailable,
        },
      });
    }
  }
  console.log(`✅ Created ${products.length} products with images, notes, and variants`);

  // Create sample coupon
  const coupon = await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      type: 'PERCENTAGE',
      value: 10,
      minPurchase: 1999,
      maxDiscount: 1000,
      usageLimit: 1000,
      usedCount: 0,
      perUserLimit: 1,
      isActive: true,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    },
  });
  console.log('✅ Created coupon:', coupon.code);

  // Create sample blog post
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: 'the-art-of-Indian-perfumery' },
    update: {},
    create: {
      title: 'The Art of Indian Perfumery',
      slug: 'the-art-of-Indian-perfumery',
      excerpt: 'Discover the rich heritage and craftsmanship behind Indian fragrances.',
      content: `
# The Art of Indian Perfumery

India has a rich heritage of perfumery that dates back thousands of years. From the ancient texts of Ayurveda to the grandeur of Mughal courts, fragrance has always held a special place in Indian culture.

## A Legacy of Excellence

The art of making attars (natural perfume oils) has been perfected over centuries in India. Using traditional methods like hydro-distillation and enfleurage, master perfumers create some of the world's most exquisite fragrances.

## Ingredients of India

- **Kashmir Saffron**: The world's finest saffron, known for its deep color and rich aroma
- **Mysore Sandalwood**: Sacred and precious, this wood forms the base of many classic Indian fragrances
- **Rose Damascena**: Grown in Kannauj, the perfume capital of India
- **Oud**: The rare and precious resinous heartwood, highly prized in Middle Eastern and Indian perfumery

## Modern Indian Perfumery

Today, Indian perfumers blend traditional ingredients with modern techniques to create fragrances that honor the past while embracing the future.

At AMFRAGRANCESINDIA, we continue this legacy by sourcing the finest ingredients and crafting perfumes that tell a story.
      `,
      coverImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80',
      category: 'Heritage',
      tags: ['Indian Perfumery', 'Attar', 'Heritage', 'Craftsmanship'],
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log('✅ Created blog post:', blogPost.title);

  console.log('\n🎉 Seed completed successfully!');
  console.log('👤 Admin login: admin@amfragrances.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
