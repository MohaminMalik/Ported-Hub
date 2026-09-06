export default function ContactPage() {
  return (
    <div className="container py-12 animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Contact Us</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>We are here to help. Reach out to us for any questions about your order or our vintage collection.</p>
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Operating Address</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Ported Hub<br/>123 Vintage Lane<br/>New Delhi, Delhi 110001<br/>India</p>
        <h3 style={{ marginBottom: '16px' }}>Email Support</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>support@portedhub.com</p>
        <h3 style={{ marginBottom: '16px' }}>Phone Support</h3>
        <p style={{ color: 'var(--text-secondary)' }}>+91 98765 43210 (Mon-Fri, 10 AM - 6 PM)</p>
      </div>
    </div>
  )
}
