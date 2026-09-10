import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Seed Categories
    const categories = [
      { id: 'shirts', slug: 'shirts', name: 'Shirts', imageUrl: "url('/images/boxes/shirt.jpeg') center/cover", updatedAt: new Date() },
      { id: 't-shirts', slug: 't-shirts', name: 'T-Shirts', imageUrl: "url('/images/boxes/tshirt.jpeg') center/cover", updatedAt: new Date() },
      { id: 'jackets', slug: 'jackets', name: 'Jackets', imageUrl: "url('/images/boxes/jacket.jpeg') center/cover", updatedAt: new Date() },
      { id: 'leather-jackets', slug: 'leather-jackets', name: 'Leather Jackets', imageUrl: "url('/images/boxes/leather-jackets.jpeg') center/cover", updatedAt: new Date() },
      { id: 'bags', slug: 'bags', name: 'Bags', imageUrl: "url('/images/boxes/bags.jpeg') center/cover", updatedAt: new Date() },
      { id: 'shoes', slug: 'shoes', name: 'Shoes', imageUrl: "url('/images/shoes/shoebox.jpeg') center/cover", updatedAt: new Date() },
      { id: 'sweaters', slug: 'sweaters', name: 'Sweaters', imageUrl: "url('/images/boxes/sweaters.jpeg') center/cover", updatedAt: new Date() },
      { id: 'hoodies', slug: 'hoodies', name: 'Hoodies', imageUrl: "url('/images/boxes/hoodie.jpeg') center/cover", updatedAt: new Date() },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: cat,
        create: cat,
      });
    }

    // 2. Fix Fresh Drops to always have at least 3
    const freshDrops = await prisma.product.findMany({ where: { isFreshDrop: true } });
    const needed = 3 - freshDrops.length;
    let updatedCount = 0;
    if (needed > 0) {
      const nonFresh = await prisma.product.findMany({ 
        where: { isFreshDrop: false }, 
        take: needed, 
        orderBy: { createdAt: 'desc' } 
      });
      for (const p of nonFresh) {
        await prisma.product.update({ 
          where: { id: p.id }, 
          data: { isFreshDrop: true } 
        });
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, message: `Seeded categories. Updated ${updatedCount} products to fresh drops.` });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
