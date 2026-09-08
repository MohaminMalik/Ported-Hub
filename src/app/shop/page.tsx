export const dynamic = 'force-dynamic';
import { prisma } from '@/utils/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const size = params.size as string | undefined;
  const color = params.color as string | undefined;
  const material = params.material as string | undefined;
  
  const where: any = {};
  if (category) where.category = category;
  if (size) where.size = { contains: size, mode: 'insensitive' };
  if (color) where.color = { contains: color, mode: 'insensitive' };
  if (material) where.material = { contains: material, mode: 'insensitive' };

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
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(color ? {color} : {}), ...(material ? {material} : {}), size: 'EU 40' })}`} style={{ color: size?.includes('40') ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>EU 40 / UK 7</Link>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(color ? {color} : {}), ...(material ? {material} : {}), size: 'EU 41' })}`} style={{ color: size?.includes('41') ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>EU 41 / UK 8</Link>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(color ? {color} : {}), ...(material ? {material} : {}), size: 'L' })}`} style={{ color: size === 'L' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Large</Link>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Color</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(size ? {size} : {}), ...(material ? {material} : {}), color: 'brown' })}`} style={{ color: color === 'brown' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Brown</Link>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(size ? {size} : {}), ...(material ? {material} : {}), color: 'black' })}`} style={{ color: color === 'black' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Black</Link>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Material</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(size ? {size} : {}), ...(color ? {color} : {}), material: 'leather' })}`} style={{ color: material === 'leather' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Leather</Link>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(size ? {size} : {}), ...(color ? {color} : {}), material: 'suede' })}`} style={{ color: material === 'suede' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Suede</Link>
            <Link href={`/shop?${new URLSearchParams({ ...(category ? {category} : {}), ...(size ? {size} : {}), ...(color ? {color} : {}), material: 'corduroy' })}`} style={{ color: material === 'corduroy' ? 'var(--accent-color)' : 'var(--text-secondary)', textDecoration: 'none' }}>Corduroy</Link>
          </div>
        </div>
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
