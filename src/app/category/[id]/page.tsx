import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const products = await prisma.product.findMany({
    where: { category: id },
    orderBy: { createdAt: 'desc' }
  });
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
