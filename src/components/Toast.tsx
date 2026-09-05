'use client';
import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function ToastContainer() {
  const [toasts, setToasts] = useState<any[]>([]);

  useEffect(() => {
    const handleShowToast = (e: any) => {
      const newToast = { id: Date.now(), message: e.detail.message, type: e.detail.type || 'info' };
      setToasts(prev => [...prev, newToast]);
      
      // Auto dismiss after 4 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 4000);
    };

    window.addEventListener('showToast', handleShowToast);
    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {toasts.map(toast => (
        <div key={toast.id} className="animate-pop-in" style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 15px 35px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)', minWidth: '320px', backdropFilter: 'blur(12px)' }}>
          {toast.type === 'success' ? <CheckCircle color="#10B981" size={24} /> : toast.type === 'error' ? <AlertCircle color="#FF453A" size={24} /> : <Info color="var(--accent-color)" size={24} />}
          <div style={{ flex: 1, color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>{toast.message}</div>
          <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}><X size={18} /></button>
        </div>
      ))}
    </div>
  );
}

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
  }
};
