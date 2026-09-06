'use client';
import { useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, RefreshCcw, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';

const allProducts: Record<string, any> = {
  '1': { id: 1, name: 'Vintage Flannel Shirt', description: 'Classic red and black lumberjack flannel. Excellent condition, very warm and durable. A timeless piece that pairs well with denim.', price: '25.00', category: 'shirts', size: 'L', condition: 'Excellent Vintage', material: '100% Cotton', era: '1990s', thriftStory: 'Found tucked away in a small mom-and-pop thrift store in Portland. It looked untouched for decades, just waiting to be worn again.', images: ['linear-gradient(135deg, #FF6B6B, #FF8E8B)', 'linear-gradient(135deg, #FF8E8B, #FF6B6B)'] },
  '8': { id: 8, name: 'Biker Leather Jacket', description: 'Heavyweight black leather biker jacket. Genuine vintage, perfectly worn in with natural distressing. Features heavy duty zippers and quilted lining.', price: '150.00', category: 'leather-jackets', size: 'M', condition: 'Worn-in (Distressed)', material: 'Genuine Leather', era: '1980s', thriftStory: 'Scored this at an estate sale in the Midwest. The previous owner was an actual cross-country motorcyclist. It has stories stitched into every seam.', images: ['linear-gradient(135deg, #2D3436, #636E72)', 'linear-gradient(135deg, #1e272e, #485460)'] },
  '10': { id: 10, name: 'Chunky Sneakers', description: '90s style chunky sole sneakers. Rare find in this size and condition. Cleaned and restored by our team.', price: '60.00', category: 'shoes', size: 'US 10', condition: 'Very Good', material: 'Leather & Synthetic', era: 'Late 90s', thriftStory: 'Found these in a forgotten donation bin. We spent hours cleaning and re-icing the soles to bring them back to their former glory.', images: ['linear-gradient(135deg, #0984E3, #74B9FF)', 'linear-gradient(135deg, #74B9FF, #0984E3)'] },
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { id } = use(params);
  
  const product = allProducts[id] || { 
    id, 
    name: 'Premium Vintage Item', 
    description: 'This is a high-quality vintage piece curated by the Ported Hub team. Made to last and style perfectly. Every item is washed, inspected, and ready to wear.', 
    price: '45.00', 
    category: 'new-arrivals',
    size: 'One Size',
    condition: 'Great',
    material: 'Mixed',
    era: 'Vintage',
    thriftStory: 'Sourced from one of our favorite secret thrift spots. We immediately knew this was a special piece that deserved a second life.',
    images: ['linear-gradient(135deg, #6C5CE7, #A29BFE)', 'linear-gradient(135deg, #A29BFE, #6C5CE7)', 'linear-gradient(135deg, #4ECDC4, #55EFC4)'] 
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % product.images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    
    if (swipeDistance > 50) nextSlide(); // Swipe left
    if (swipeDistance < -50) prevSlide(); // Swipe right
    setTouchStartX(null);
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', transition: 'color 0.2s' }}>
          <ArrowLeft size={20} /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '48px', alignItems: 'start' }}>
        {/* Image Gallery */}
        <div 
          style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '600px', background: 'var(--surface-color)', border: '1px solid var(--border-color)' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div style={{ width: '100%', height: '100%', background: product.images[currentSlide], transition: 'background 0.3s ease' }}></div>
          
          {product.images.length > 1 && (
            <>
              <button onClick={prevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '12px', backdropFilter: 'blur(4px)' }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '12px', backdropFilter: 'blur(4px)' }}>
                <ChevronRight size={24} />
              </button>
              <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {product.images.map((_: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentSlide(idx)}
                    style={{ width: currentSlide === idx ? '24px' : '8px', height: '8px', borderRadius: '4px', background: currentSlide === idx ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)', transition: 'all 0.3s ease' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Product Details */}
        <div style={{ padding: '24px 0' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(10, 132, 255, 0.1)', color: 'var(--accent-color)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '16px' }}>
            {product.category.replace('-', ' ')}
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.1 }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '32px' }}>{formatPrice(product.price)}</p>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>Size</h4>
            <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '8px', border: '2px solid var(--accent-color)', color: 'var(--text-primary)', fontWeight: 600, background: 'rgba(10, 132, 255, 0.1)' }}>
              {product.size}
            </div>
          </div>

          <div style={{ marginBottom: '32px', background: 'var(--surface-hover)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '16px' }}>Item Details</h4>
            <ul style={{ listStyle: 'none', marginBottom: '24px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Condition:</strong> {product.condition}</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Material:</strong> {product.material}</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Era:</strong> {product.era}</li>
            </ul>

            <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '12px' }}>How I Thrifted It</h4>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, borderLeft: '3px solid var(--accent-color)', paddingLeft: '12px' }}>
              "{product.thriftStory}"
            </p>
          </div>

          <Link href="/cart" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
              <ShoppingCart size={24} /> Add to Cart
            </button>
          </Link>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Truck size={24} color="var(--accent-color)" />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Free Shipping</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>On all orders over ₹2,999</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-color)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Clock size={24} color="var(--accent-color)" />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Fast Delivery</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>3-7 days delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
