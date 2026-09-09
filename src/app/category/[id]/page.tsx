import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const mockProducts = {
  'shirts': [],
  't-shirts': [],
  'jackets': [],
  'leather-jackets': [],
  'bags': [],
  'shoes': [
    { id: 11, name: 'Dolce & Gabbana Vintage Leather Boots', description: 'Classic Chestnut brown boots with double stitch detailing.  Excellent condition, Comfortable and durable. Low stacked leather heel.', price: '2,999', images: ["url('/images/shoes/dg1.jpeg') center/cover", "url('/images/shoes/dg2.jpeg') center/cover", "url('/images/shoes/dg3.jpeg') center/cover", "url('/images/shoes/dg4.jpeg') center/cover", "url('/images/shoes/dg5.jpeg') center/cover", "url('/images/shoes/dg6.jpeg') center/cover", "url('/images/shoes/dg7.jpeg') center/cover", "url('/images/shoes/dg8.jpeg') center/cover"] },
    { id: 12, name: 'Zara High Top Suede Sneakers ', description: 'Brushed suede upper in warn camel/ wheat tan. durable, low profile vulcanized rubber cupsole with tonal foxing. smooth interior lining with a cusioned footbed for daily wear.', price: '1,899', images: ["url('/images/shoes/zara1.jpeg') center/cover", "url('/images/shoes/zara2.jpeg') center/cover", "url('/images/shoes/zara3.jpeg') center/cover", "url('/images/shoes/zara4.jpeg') center/cover", "url('/images/shoes/zara5.jpeg') center/cover"] },
    { id: 13, name: 'Dickies Suede Vintage Chelsea ', description: 'Matte Black Suede/innubuck upper with subtle texture.Wood look cuban heel with contrasting  welt sticthing. Rare find in this size and condition. Cleaned and restored by our team.', price: '1,299', images: ["url('/images/shoes/diki1.jpeg') center/cover", "url('/images/shoes/diki2.jpeg') center/cover", "url('/images/shoes/diki3.jpeg') center/cover", "url('/images/shoes/diki4.jpeg') center/cover", "url('/images/shoes/diki5.jpeg') center/cover", "url('/images/shoes/diki6.jpeg') center/cover"] },
    { id: 14, name: 'Redskins Leather Sneakers', description: 'Classic leather sneakers from Redskins. Clean, comfortable and ready for everyday wear.', price: '2,199', images: ["url('/images/shoes/reds1.jpeg') center/cover", "url('/images/shoes/reds2.jpeg') center/cover", "url('/images/shoes/reds3.jpeg') center/cover", "url('/images/shoes/reds4.jpeg') center/cover", "url('/images/shoes/reds5.jpeg') center/cover", "url('/images/shoes/reds6.jpeg') center/cover"] },
    { id: 15, name: 'Ralph Lauren High Top Corduroy Sneakers', description: 'Premium corduroy high tops by Ralph Lauren. Distinctive vintage style and ultimate comfort.', price: '2,199', images: ["url('/images/shoes/rl1.jpeg') center/cover", "url('/images/shoes/rl2.jpeg') center/cover", "url('/images/shoes/rl3.jpeg') center/cover", "url('/images/shoes/rl4.jpeg') center/cover", "url('/images/shoes/rl5.jpeg') center/cover"] },
  ],
  'sweaters': [],
  'hoodies': [],
};

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // @ts-ignore
  const products = mockProducts[id] || [];
  const categoryName = id.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          <ArrowLeft size={20} /> Back to Categories
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{categoryName}</h1>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-3">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 card">
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>More products coming soon to this category!</h3>
        </div>
      )}
    </div>
  );
}
