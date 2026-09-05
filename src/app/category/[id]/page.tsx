import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const mockProducts = {
  'shirts': [
    { id: 1, name: 'Vintage Flannel Shirt', description: 'Classic red and black lumberjack flannel.', price: '25.00', images: ['linear-gradient(135deg, #FF6B6B, #FF8E8B)', 'linear-gradient(135deg, #FF8E8B, #FF6B6B)'] },
    { id: 2, name: 'Denim Button-up', description: 'Light wash denim shirt in excellent condition.', price: '30.00', images: ['linear-gradient(135deg, #4a69bd, #6a89cc)', 'linear-gradient(135deg, #6a89cc, #4a69bd)'] },
    { id: 3, name: 'Silk Patterned Shirt', description: 'Abstract 80s pattern silk blend shirt.', price: '40.00', images: ['linear-gradient(135deg, #b71540, #e55039)'] },
  ],
  't-shirts': [
    { id: 4, name: 'Retro Band Tee', description: 'Authentic 90s rock band tour t-shirt.', price: '45.00', images: ['linear-gradient(135deg, #4ECDC4, #55EFC4)', 'linear-gradient(135deg, #1abc9c, #16a085)'] },
    { id: 5, name: 'Washed Graphic Tee', description: 'Faded graphic tee with a distressed look.', price: '20.00', images: ['linear-gradient(135deg, #7f8c8d, #95a5a6)'] },
  ],
  'jackets': [
    { id: 6, name: 'Retro Windbreaker', description: 'Colorful 80s style windbreaker.', price: '35.00', images: ['linear-gradient(135deg, #6C5CE7, #A29BFE)'] },
    { id: 7, name: 'Varsity Jacket', description: 'Classic wool varsity jacket with leather sleeves.', price: '85.00', images: ['linear-gradient(135deg, #e1b12c, #fbc531)', 'linear-gradient(135deg, #2f3640, #353b48)'] },
  ],
  'leather-jackets': [
    { id: 8, name: 'Biker Leather Jacket', description: 'Heavyweight black leather biker jacket.', price: '150.00', images: ['linear-gradient(135deg, #2D3436, #636E72)', 'linear-gradient(135deg, #1e272e, #485460)'] },
  ],
  'bags': [
    { id: 9, name: 'Canvas Tote', description: 'Durable vintage canvas tote bag.', price: '15.00', images: ['linear-gradient(135deg, #FD79A8, #FAB1A0)'] },
  ],
  'shoes': [
    { id: 10, name: 'Chunky Sneakers', description: '90s style chunky sole sneakers.', price: '60.00', images: ['linear-gradient(135deg, #0984E3, #74B9FF)'] },
  ],
  'sweaters': [
    { id: 11, name: 'Knit Cardigan', description: 'Oversized wool knit cardigan.', price: '45.00', images: ['linear-gradient(135deg, #E17055, #FFEAA7)'] },
  ],
  'hoodies': [
    { id: 12, name: 'Faded Zip Hoodie', description: 'Perfectly worn-in zip up hoodie.', price: '30.00', images: ['linear-gradient(135deg, #00B894, #55EFC4)'] },
  ],
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
