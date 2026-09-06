export default function TermsPage() {
  return (
    <div className="container py-12 animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Terms & Conditions</h1>
      <div className="card" style={{ padding: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p>Last updated: September 2026</p>
        <p>Welcome to Ported Hub. By using our website and purchasing from us, you agree to the following terms and conditions.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>1. Vintage Condition</h3>
        <p>All items sold on Ported Hub are second-hand and vintage unless stated otherwise. Natural wear and tear is expected. We do our best to accurately photograph and describe any major flaws.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>2. Pricing & Payments</h3>
        <p>All prices are in INR. We reserve the right to change prices at any time. Payments are securely processed via Razorpay.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>3. Shipping</h3>
        <p>We ship across India. Standard shipping takes 3-7 business days. We are not responsible for delays caused by shipping carriers.</p>
      </div>
    </div>
  )
}
