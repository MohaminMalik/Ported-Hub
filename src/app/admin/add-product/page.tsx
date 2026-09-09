'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    isFreshDrop: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast('Please upload at least one image', 'error');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // 1. Upload Images Sequentially
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const uploadData = new FormData();
        uploadData.append('file', file);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData
        });

        if (!uploadRes.ok) {
          let errorMsg = `Failed to upload ${file.name}`;
          try {
            const errData = await uploadRes.json();
            errorMsg = errData.error || errorMsg;
          } catch (e) {}
          throw new Error(`${errorMsg} (Status: ${uploadRes.status})`);
        }
        
        const { urls } = await uploadRes.json();
        if (urls && urls.length > 0) {
          uploadedUrls.push(urls[0]);
        }
      }
      
      setUploading(false);

      // Convert URLs to the frontend gradient format
      const formattedImages = uploadedUrls.map((u: string) => `url('${u}') center/cover`);

      // 2. Add Product
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: formattedImages
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
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'An error occurred during submission', 'error');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container py-12 max-w-4xl mx-auto animate-fade-in">
      <Link href="/admin" className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors bg-[var(--surface-color)] px-4 py-2 rounded-full text-sm font-semibold border border-[var(--border-color)] shadow-sm">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="card p-8 md:p-10 shadow-xl border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-color)] to-[var(--bg-color)]">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">List a New Drop</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Image Upload Section */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Product Photos *</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--surface-color)] rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:bg-[rgba(10,132,255,0.05)]"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--surface-hover)] flex items-center justify-center">
                <UploadCloud size={32} className="text-secondary" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-lg">Click to browse or drag & drop</p>
                <p className="text-sm text-secondary mt-1">High quality JPEG, PNG up to 5MB</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[var(--border-color)] group shadow-sm">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => removeFile(i)}
                      className="absolute top-2 right-2 bg-black/70 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent my-2" />

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Product Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="e.g. Vintage Nike Windbreaker" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none min-h-[120px] transition-colors" placeholder="Tell the story of this piece..."></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Price (₹) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">₹</span>
                <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full p-4 pl-8 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="1999" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors appearance-none cursor-pointer">
                <option value="shoes">Shoes</option>
                <option value="shirts">Shirts</option>
                <option value="t-shirts">T-Shirts</option>
                <option value="jackets">Jackets</option>
                <option value="leather-jackets">Leather Jackets</option>
                <option value="bags">Bags</option>
                <option value="sweaters">Sweaters</option>
                <option value="hoodies">Hoodies</option>
                <option value="pants">Pants</option>
                <option value="accessories">Accessories</option>
                <option value="outerwear">Outerwear</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Size *</label>
              <input required list="sizes" type="text" name="size" value={formData.size} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="e.g. M, L, EU 42" />
              <datalist id="sizes">
                <option value="XS" />
                <option value="S" />
                <option value="M" />
                <option value="L" />
                <option value="XL" />
                <option value="XXL" />
                <option value="US 7 / EU 40" />
                <option value="US 8 / EU 41" />
                <option value="US 9 / EU 42.5" />
                <option value="US 10 / EU 44" />
                <option value="US 11 / EU 45" />
              </datalist>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Color *</label>
              <input required list="colors" type="text" name="color" value={formData.color} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="e.g. Black, Navy" />
              <datalist id="colors">
                <option value="Black" />
                <option value="White" />
                <option value="Navy Blue" />
                <option value="Grey" />
                <option value="Brown" />
                <option value="Red" />
                <option value="Green" />
                <option value="Olive" />
                <option value="Beige" />
                <option value="Multicolor" />
              </datalist>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Material</label>
              <input list="materials" type="text" name="material" value={formData.material} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="e.g. 100% Cotton" />
              <datalist id="materials">
                <option value="100% Cotton" />
                <option value="Genuine Leather" />
                <option value="Denim" />
                <option value="Polyester" />
                <option value="Wool" />
                <option value="Suede" />
                <option value="Corduroy" />
                <option value="Nylon" />
              </datalist>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none transition-colors" placeholder="e.g. Nike, Levi's" />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Thrift Story</label>
              <textarea name="thriftStory" value={formData.thriftStory} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-color)] focus:border-[var(--accent-color)] text-white outline-none min-h-[100px] transition-colors" placeholder="Where did you find this gem?"></textarea>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--surface-hover)]">
              <label className="flex items-center gap-4 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="isFreshDrop" 
                  checked={formData.isFreshDrop} 
                  onChange={handleChange} 
                  className="w-6 h-6 rounded accent-[var(--accent-color)]"
                />
                <span className="text-lg font-bold">Feature as a Fresh Drop?</span>
              </label>
              <p className="text-sm text-secondary ml-10">If checked, this product will be showcased on the homepage under "Fresh Drops". Otherwise, it will only appear in the Shop and its Category.</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6 p-5 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg flex justify-center items-center gap-2">
            {uploading ? (
              <span className="flex items-center gap-2"><UploadCloud className="animate-bounce" /> Uploading Images...</span>
            ) : loading ? (
              'Publishing...'
            ) : (
              'Publish Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
