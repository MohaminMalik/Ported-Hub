'use client';
import { useState } from 'react';
import Link from 'next/link';
import { showToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier })
      });
      const data = await res.json();
      
      if (!res.ok) {
        showToast(data.error || 'Failed to send reset link', 'error');
      } else {
        showToast('Reset link sent to your email!', 'success');
        setSuccess(true);
      }
    } catch (err) {
      showToast('Internal Server Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        
        {!success ? (
          <>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Reset Password</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
              Enter the email address associated with your account.
            </p>

            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
                <input 
                  type="email" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--background)', color: 'var(--foreground)', outline: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary" 
                disabled={loading}
                style={{ padding: '16px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Link href="/signin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                Back to Sign In
              </Link>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '16px' }}>Check your email</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
              We have sent a password reset link to your email address. It will expire in 1 hour.
            </p>
            <Link href="/signin" className="btn-primary" style={{ display: 'inline-block', width: '100%', padding: '16px', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
