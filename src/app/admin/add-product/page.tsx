'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'shoes',
    size: '',
    condition: 'Excellent',
    material: '',
    era: 'Modern',
    color: '',
    brand: '',
    thriftStory: '',
    images: '' // Comma separated urls
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: formData.images.split(',').map(url => url.trim()).filter(Boolean)
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Product added successfully!', 'success');
        router.push('/admin');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to add product', 'error');
      }
    } catch (err) {
      showToast('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-2xl mx-auto">
      <Link href="/admin" className="flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">Product Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. Vintage Nike Windbreaker" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">Description *</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none min-h-[100px]" placeholder="Detailed product description..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Price (₹) *</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. 1999" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none">
                <option value="shoes">Shoes</option>
                <option value="shirts">Shirts</option>
                <option value="pants">Pants</option>
                <option value="accessories">Accessories</option>
                <option value="outerwear">Outerwear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Size *</label>
              <input required type="text" name="size" value={formData.size} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. M, L, EU 42" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Color *</label>
              <input required type="text" name="color" value={formData.color} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. Black, Navy" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Material</label>
              <input type="text" name="material" value={formData.material} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. 100% Cotton" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none" placeholder="e.g. Nike, Levi's" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">Thrift Story</label>
            <textarea name="thriftStory" value={formData.thriftStory} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none min-h-[80px]" placeholder="How was this found?"></textarea>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary">Image URLs (Comma separated) *</label>
            <textarea required name="images" value={formData.images} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] text-white outline-none min-h-[100px]" placeholder="url('/images/shoes/1.jpg') center/cover, url('/images/shoes/2.jpg') center/cover"></textarea>
            <p className="text-xs text-secondary mt-1">Make sure to format like: <code className="bg-[var(--surface-hover)] px-1 rounded">url('/image.jpg') center/cover</code></p>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-4 p-4 text-lg">
            {loading ? 'Adding Product...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
