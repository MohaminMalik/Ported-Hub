import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';

const mockProducts = [
  { name: 'Dolce & Gabbana Vintage Leather Boots', description: 'Classic Chestnut brown boots with double stitch detailing.  Excellent condition, Comfortable and durable. Low stacked leather heel.', price: 2999, category: 'shoes', size: 'EU 40 / UK 7 ', condition: 'Excellent Vintage', material: '100% pure leather', era: '1990s', thriftStory: 'Found it from a local shoe seller, he only had 4 pairs of shoes and one of them was this pair. It looked untouched for decades, just waiting to be worn again.', images: ["url('/images/shoes/dg1.jpeg') center/cover", "url('/images/shoes/dg2.jpeg') center/cover", "url('/images/shoes/dg3.jpeg') center/cover", "url('/images/shoes/dg4.jpeg') center/cover", "url('/images/shoes/dg5.jpeg') center/cover", "url('/images/shoes/dg6.jpeg') center/cover", "url('/images/shoes/dg7.jpeg') center/cover", "url('/images/shoes/dg8.jpeg') center/cover"] },
  { name: 'Zara High Top Suede Sneakers ', description: 'Brushed suede upper in warn camel/ wheat tan. durable, low profile vulcanized rubber cupsole with tonal foxing. smooth interior lining with a cusioned footbed for daily wear.', price: 1899, category: 'shoes', size: 'EU 41 / UK 8', condition: 'Excellent', material: 'Brushed Suede', era: '2020s', thriftStory: 'Scored it from my local shoes seller.', images: ["url('/images/shoes/zara1.jpeg') center/cover", "url('/images/shoes/zara2.jpeg') center/cover", "url('/images/shoes/zara3.jpeg') center/cover", "url('/images/shoes/zara4.jpeg') center/cover", "url('/images/shoes/zara5.jpeg') center/cover"] },
  { name: 'Dickies Suede Vintage Chelsea ', description: 'Matte Black Suede/innubuck upper with subtle texture.Wood look cuban heel with contrasting  welt sticthing. Rare find in this size and condition. Cleaned and restored by our team.', price: 1299, category: 'shoes', size: 'EU 41 / UK 8', condition: 'Good', material: 'Suede', era: 'Late 90s', thriftStory: 'Found these in a sellers house where he had 1000 torn shoes. We spent hours cleaning and re-icing the soles to bring them back to their former glory.', images: ["url('/images/shoes/diki1.jpeg') center/cover", "url('/images/shoes/diki2.jpeg') center/cover", "url('/images/shoes/diki3.jpeg') center/cover", "url('/images/shoes/diki4.jpeg') center/cover", "url('/images/shoes/diki5.jpeg') center/cover", "url('/images/shoes/diki6.jpeg') center/cover"] },
  { name: 'Redskins Leather Sneakers', description: 'Classic leather sneakers from Redskins. Clean, comfortable and ready for everyday wear.', price: 2199, category: 'shoes', size: 'EU 40 / UK 7', condition: 'Excellent', material: 'Leather', era: 'Modern', thriftStory: 'Freshly sourced and restored to perfection.', images: ["url('/images/shoes/reds1.jpeg') center/cover", "url('/images/shoes/reds2.jpeg') center/cover", "url('/images/shoes/reds3.jpeg') center/cover", "url('/images/shoes/reds4.jpeg') center/cover", "url('/images/shoes/reds5.jpeg') center/cover", "url('/images/shoes/reds6.jpeg') center/cover"] },
  { name: 'Ralph Lauren High Top Corduroy Sneakers', description: 'Premium corduroy high tops by Ralph Lauren. Distinctive vintage style and ultimate comfort.', price: 2199, category: 'shoes', size: 'EU 40 / UK 7', condition: 'Excellent', material: 'Corduroy', era: 'Vintage', thriftStory: 'Found in a local estate sale, barely worn.', images: ["url('/images/shoes/rl1.jpeg') center/cover", "url('/images/shoes/rl2.jpeg') center/cover", "url('/images/shoes/rl3.jpeg') center/cover", "url('/images/shoes/rl4.jpeg') center/cover", "url('/images/shoes/rl5.jpeg') center/cover"] },
];

export async function GET(req: Request) {
  try {
    await prisma.product.deleteMany({});
    
    for (const product of mockProducts) {
      await prisma.product.create({
        data: product
      });
    }
    return NextResponse.json({ success: true, message: 'Database seeded with mock products on live server!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
