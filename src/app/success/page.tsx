import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="container py-24 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '70vh', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '24px', borderRadius: '50%', marginBottom: '32px' }} className="animate-pop-in">
        <CheckCircle color="#10B981" size={80} />
      </div>
      
      <h1 className="mb-4" style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1 }}>Payment Successful!</h1>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '48px', maxWidth: '600px', lineHeight: 1.6 }}>
        Thank you for your order. We've received your payment and are securely packing your premium vintage pieces. <strong style={{ color: 'var(--text-primary)' }}>Your official Tracking ID will be sent to your registered email and phone number shortly.</strong>
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
        <a href="https://www.indiapost.gov.in/" target="_blank" rel="noreferrer" className="btn-primary w-full sm:w-auto justify-center" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Package size={20} /> Track Order
        </a>
        <Link href="/" className="btn-primary w-full sm:w-auto justify-center" style={{ padding: '16px 32px', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Continue Shopping <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
