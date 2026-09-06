export default function PrivacyPage() {
  return (
    <div className="container py-12 animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Privacy Policy</h1>
      <div className="card" style={{ padding: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p>At Ported Hub, we take your privacy seriously. This policy describes how we collect and use your data.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Data Collection</h3>
        <p>We collect your name, email address, phone number, and shipping address solely for the purpose of fulfilling your orders. Payment information is securely handled by Razorpay and is not stored on our servers.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Cookies</h3>
        <p>We use local storage and cookies to maintain your shopping cart and user session. You can clear these at any time via your browser settings.</p>
      </div>
    </div>
  )
}
