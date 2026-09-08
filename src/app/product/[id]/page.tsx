'use client';
import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import { ArrowLeft, ShoppingCart, Truck, RefreshCcw, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/formatPrice';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % (product?.images?.length || 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1));

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

  const router = useRouter();

  const handleAddToCart = () => {
    if (!product) return;
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    if (currentCart.some((item: any) => item.id === product.id)) {
      showToast(`${product.name} is already in your cart!`, 'error');
      return;
    }
    
    // Parse price to float
    const parsedPrice = typeof product.price === 'string' ? parseFloat(product.price.replace(/,/g, '')) : product.price;
    const newProduct = { ...product, price: parsedPrice, size: product.size || 'One Size', cartId: Date.now(), image: product.images[0] };
    
    currentCart.push(newProduct);
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // Notify Header to update badge
    window.dispatchEvent(new Event('cartUpdated'));
    
    showToast(`${product.name} added to cart!`, 'success');
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex items-center justify-center">
        <h2 className="text-2xl font-bold text-secondary">Loading product...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-bold">Product Not Found</h2>
        <p className="text-secondary">This item may have been removed or sold out.</p>
        <Link href="/shop" className="btn-primary mt-4">Browse Shop</Link>
      </div>
    );
  }

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
            {product.category?.replace('-', ' ') || 'Vintage'}
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.1 }}>{product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--accent-color)', marginBottom: '32px' }}>{formatPrice(product.price)}</p>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            {product.description}
          </p>

          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '12px' }}>Size</h4>
            <div style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '8px', border: '2px solid var(--accent-color)', color: 'var(--text-primary)', fontWeight: 600, background: 'rgba(10, 132, 255, 0.1)' }}>
              {product.size || 'One Size'}
            </div>
          </div>

          <div style={{ marginBottom: '32px', background: 'var(--surface-hover)', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '16px' }}>Item Details</h4>
            <ul style={{ listStyle: 'none', marginBottom: '24px', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Condition:</strong> {product.condition || 'Pre-loved'}</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Material:</strong> {product.material || 'Mixed'}</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Era:</strong> {product.era || 'Vintage'}</li>
            </ul>

            <h4 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '12px' }}>How I Thrifted It</h4>
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, borderLeft: '3px solid var(--accent-color)', paddingLeft: '12px' }}>
              "{product.thriftStory || 'Handpicked from a local vintage collection.'}"
            </p>
          </div>

          <button onClick={handleAddToCart} className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '1.2rem', marginBottom: '40px', display: 'flex', justifyContent: 'center' }}>
            <ShoppingCart size={24} /> Add to Cart
          </button>

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
