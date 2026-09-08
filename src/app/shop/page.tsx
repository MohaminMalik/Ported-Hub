export const dynamic = 'force-dynamic';
import { prisma } from '@/utils/prisma';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/FilterSidebar';

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
    <div className="container py-12 animate-fade-in flex flex-col md:flex-row gap-8">
      <FilterSidebar />

      {/* Product Grid */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '32px' }}>All Products {category && `> ${category}`}</h1>
        {products.length === 0 ? (
          <div className="card text-center py-12">
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>Coming soon...</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>We don't have any products matching these exact filters yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
