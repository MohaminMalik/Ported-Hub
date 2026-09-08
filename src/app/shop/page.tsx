import { prisma } from '@/utils/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const size = params.size as string | undefined;
  
  const where: any = {};
  if (category) where.category = category;
  if (size) where.size = size;

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container py-12 animate-fade-in" style={{ display: 'flex', gap: '32px' }}>
      {/* Sidebar Filter */}
      <div style={{ width: '250px', flexShrink: 0 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Filters</h2>
        
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href="/shop" style={{ color: !category ? 'var(--accent-color)' : 'var(--text-primary)', textDecoration: 'none' }}>All Categories</Link>
            <Link href="/shop?category=shoes" style={{ color: category === 'shoes' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Shoes</Link>
            <Link href="/shop?category=shirts" style={{ color: category === 'shirts' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Shirts</Link>
            <Link href="/shop?category=jackets" style={{ color: category === 'jackets' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Jackets</Link>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Size</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={category ? `/shop?category=${category}&size=S` : '/shop?size=S'} style={{ color: size === 'S' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Small</Link>
            <Link href={category ? `/shop?category=${category}&size=M` : '/shop?size=M'} style={{ color: size === 'M' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Medium</Link>
            <Link href={category ? `/shop?category=${category}&size=L` : '/shop?size=L'} style={{ color: size === 'L' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Large</Link>
          </div>
        </div>
        
        {/* Additional Filters can be added here easily */}
      </div>

      {/* Product Grid */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '32px' }}>All Products {category && `> ${category}`}</h1>
        {products.length === 0 ? (
          <div className="card text-center py-12">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>No products found matching your filters.</h3>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
