import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border-color)', padding: '48px 0 24px 0', marginTop: '64px', background: 'var(--surface-color)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }}>Ported Hub</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}>Premium curated vintage and streetwear fashion. Sustainable style for the modern era.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Legal & Policies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link>
              <Link href="/refund" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Refund & Cancellation Policy</Link>
              <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '16px' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Contact Us</Link>
              <span style={{ color: 'var(--text-secondary)' }}>Email: support@portedhub.com</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
          © {new Date().getFullYear()} Ported Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
