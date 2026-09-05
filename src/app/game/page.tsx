import DinoGame from '@/components/DinoGame';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GamePage() {
  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          <ArrowLeft size={20} /> Back to Shop
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center' }}>Win a Discount</h1>
      </div>
      
      <DinoGame />
    </div>
  );
}
