'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '@/components/PasswordInput';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ identifier: '', password: '' });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Login failed');
        return;
      }
      
      alert(data.message);
      router.push('/account');
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
          Sign in to access your Ported Hub account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address or Phone Number</label>
            <input 
              type="text" 
              name="identifier" 
              required 
              value={formData.identifier} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
              placeholder="john@example.com or 98765 43210" 
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
              <Link href="/forgot-password" style={{ color: 'var(--accent-color)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              name="password" 
              required 
              value={formData.password} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '16px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Don't have an account? <Link href="/signup" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Create Account</Link>
        </p>
      </div>
    </div>
  );
}
