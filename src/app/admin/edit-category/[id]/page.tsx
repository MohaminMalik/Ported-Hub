'use client';
import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/components/Toast';
import { ArrowLeft, UploadCloud, X } from 'lucide-react';
import Link from 'next/link';

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = use(params);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        const cat = data.find((c: any) => c.id === id || c.slug === id);
        if (cat) {
          setFormData({ name: cat.name, slug: cat.slug });
          if (cat.imageUrl) {
            // parse "url('/images/...') center/cover" back to url
            const match = cat.imageUrl.match(/url\('([^']+)'\)/);
            if (match) {
              setPreviewUrl(match[1]);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      showToast('Please provide a name and slug', 'error');
      return;
    }

    setSaving(true);
    let finalImageUrl = previewUrl ? `url('${previewUrl}') center/cover` : '';

    try {
      if (selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadData
        });

        if (!uploadRes.ok) throw new Error('Failed to upload image');
        
        const { urls } = await uploadRes.json();
        if (urls && urls.length > 0) {
          finalImageUrl = `url('${urls[0]}') center/cover`;
        }
        setUploading(false);
      }

      const payload = {
        id,
        name: formData.name,
        slug: formData.slug,
        imageUrl: finalImageUrl,
      };

      const res = await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Category updated successfully!', 'success');
        router.push('/admin');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update category', 'error');
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'An error occurred during save', 'error');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center py-24">Loading category...</div>;

  return (
    <div className="container py-12 max-w-2xl mx-auto animate-fade-in">
      <Link href="/admin" className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors bg-[var(--surface-color)] px-4 py-2 rounded-full text-sm font-semibold border border-[var(--border-color)] shadow-sm">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="card p-8 md:p-10 shadow-xl border border-[var(--border-color)] bg-[var(--surface-color)]">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Edit Category Box</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Category Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] focus:border-[var(--accent-color)] text-white outline-none" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-secondary uppercase tracking-wider">URL Slug / ID *</label>
            <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] focus:border-[var(--accent-color)] text-white outline-none" />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-secondary uppercase tracking-wider">Category Image</label>
            {!previewUrl ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] bg-[var(--bg-color)] rounded-2xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <UploadCloud size={32} className="text-secondary" />
                <p className="font-semibold mt-2">Click to upload image</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-[var(--border-color)] group">
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-black/70 p-2 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          <button type="submit" disabled={saving || uploading} className="btn-primary mt-4 p-4 text-lg font-bold rounded-xl flex justify-center items-center gap-2">
            {uploading ? 'Uploading Image...' : saving ? 'Saving...' : 'Update Category Box'}
          </button>
        </form>
      </div>
    </div>
  );
}
