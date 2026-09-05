'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [identifier, setIdentifier] = useState('');
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });

  const [loading, setLoading] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    // Simulate sending OTP/Link
    setStep('reset');
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, newPassword: passwords.newPassword })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Password reset failed');
        return;
      }
      
      alert(data.message);
      router.push('/signin');
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 animate-fade-in" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
        
        {step === 'request' ? (
          <>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Reset Password</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
              Enter the email address or phone number associated with your account.
            </p>

            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address or Phone Number</label>
                <input 
                  type="text" 
                  required 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
                  placeholder="john@example.com or 98765 43210" 
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '16px' }}>
                Continue
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Remembered your password? <Link href="/signin" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign In</Link>
            </p>
          </>
        ) : (
          <div className="animate-fade">
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Create New Password</h1>
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
              Enter a new password for <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{identifier}</span>.
            </p>

            <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>New Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={passwords.newPassword} 
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
                  placeholder="••••••••" 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  required 
                  minLength={6}
                  value={passwords.confirmPassword} 
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
                  placeholder="••••••••" 
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '8px', padding: '16px', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
