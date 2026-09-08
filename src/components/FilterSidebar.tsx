'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const size = searchParams.get('size') || '';
  const color = searchParams.get('color') || '';
  const material = searchParams.get('material') || '';

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div 
        className="flex justify-between items-center md:mb-6 mb-4 cursor-pointer bg-[var(--surface-hover)] p-4 rounded-xl border border-[var(--border-color)]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Filter Products</h2>
        <div>
          {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>
      
      <div className={`${isOpen ? 'block' : 'hidden'}`}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Category</h3>
          <select value={category} onChange={(e) => updateFilter('category', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>
            <option value="">All Categories</option>
            <option value="shoes">Shoes</option>
            <option value="shirts">Shirts</option>
            <option value="jackets">Jackets</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Size</h3>
          <select value={size} onChange={(e) => updateFilter('size', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>
            <option value="">All Sizes</option>
            <option value="EU 40">EU 40 / UK 7</option>
            <option value="EU 41">EU 41 / UK 8</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Color</h3>
          <select value={color} onChange={(e) => updateFilter('color', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>
            <option value="">All Colors</option>
            <option value="brown">Brown</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="grey">Grey</option>
            <option value="green">Green</option>
          </select>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px' }}>Material</h3>
          <select value={material} onChange={(e) => updateFilter('material', e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'var(--text-primary)' }}>
            <option value="">All Materials</option>
            <option value="leather">Leather</option>
            <option value="suede">Suede</option>
            <option value="corduroy">Corduroy</option>
            <option value="cotton">Cotton</option>
            <option value="polyester">Polyester</option>
            <option value="denim">Denim</option>
            <option value="silk">Silk</option>
            <option value="wool">Wool</option>
          </select>
        </div>
      </div>
    </div>
  );
}
