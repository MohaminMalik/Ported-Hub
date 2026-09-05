import Link from 'next/link';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function TrackOrderPage() {
  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>Track Your Order</h1>
        <p className="text-secondary mb-8">Enter your Order ID below to see the latest shipping updates.</p>
        
        <div className="animate-pop-in" style={{ background: 'rgba(var(--accent-rgb), 0.1)', border: '1px solid var(--accent-color)', borderRadius: '12px', padding: '16px', marginBottom: '32px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
          <strong>Note:</strong> Just placed an order? Your official Tracking ID will be sent to your registered email and phone number shortly.
        </div>
        
        <div className="card mb-12" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <input 
              type="text" 
              placeholder="e.g. ORD-987654321" 
              style={{ flex: 1, padding: '16px 24px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '1.1rem' }} 
            />
            <button className="btn-primary" style={{ padding: '0 32px', fontSize: '1.1rem', borderRadius: '12px' }}>
              Track
            </button>
          </div>
        </div>
        
        {/* Mock Tracking Timeline */}
        <div className="card" style={{ padding: '40px' }}>
          <h3 className="mb-8" style={{ fontSize: '1.5rem', fontWeight: 600 }}>Order #ORD-123456789</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', left: '19px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
            
            <div style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'var(--accent-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Order Confirmed</h4>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>We've received your order and payment.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'var(--surface-color)', border: '2px solid var(--accent-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <Package size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Processing</h4>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Your items are being hand-packed.</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', position: 'relative', zIndex: 1, opacity: 0.5 }}>
              <div style={{ background: 'var(--surface-color)', border: '2px solid var(--border-color)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Truck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>Shipped</h4>
                <p className="text-secondary" style={{ fontSize: '0.9rem' }}>Handed over to delivery partner.</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
