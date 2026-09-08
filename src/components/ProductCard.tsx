'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatPrice';
import { showToast } from '@/components/Toast';

export default function ProductCard({ product }: { product: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % product.images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    if (currentCart.some((item: any) => item.id === product.id)) {
      showToast(`${product.name} is already in your cart!`, 'error');
      return;
    }
    
    // Parse price to float to avoid string concatenation issues in cart total
    const parsedPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/,/g, '')) : product.price;
    const newProduct = { ...product, price: parsedPrice, size: 'L', cartId: Date.now(), image: product.images[0] }; // Mock size for now
    currentCart.push(newProduct);
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Notify Header to update badge
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <div className="card" onClick={handleCardClick} style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: '300px', backgroundColor: 'var(--surface-hover)' }}>
        <div style={{ width: '100%', height: '100%', background: product.images[currentSlide], transition: 'background 0.3s ease' }}></div>
        
        {product.images.length > 1 && (
          <>
            <button onClick={prevSlide} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '5px' }}>
              <ChevronLeft size={20} />
            </button>
            <button onClick={nextSlide} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', padding: '5px' }}>
              <ChevronRight size={20} />
            </button>
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px' }}>
              {product.images.map((_: any, idx: number) => (
                <div key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: currentSlide === idx ? 'var(--accent-color)' : 'rgba(255,255,255,0.5)' }}></div>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{product.name}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flexGrow: 1 }}>{product.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-color)' }}>{formatPrice(product.price)}</span>
          <button onClick={handleAddToCart} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
