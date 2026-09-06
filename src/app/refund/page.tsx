export default function RefundPage() {
  return (
    <div className="container py-12 animate-fade-in" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Refund & Cancellation Policy</h1>
      <div className="card" style={{ padding: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)' }}>Cancellations</h3>
        <p>You may cancel your order within 24 hours of placing it, provided it has not yet been shipped. Once shipped, the order cannot be cancelled.</p>
        <h3 style={{ color: 'var(--text-primary)', marginTop: '16px' }}>Returns & Refunds</h3>
        <p>Because our items are unique vintage pieces, <strong>all sales are final</strong>. We do not offer returns or refunds for buyer's remorse or sizing issues. Please check the measurements carefully before purchasing.</p>
        <p>If an item arrives significantly not as described (e.g., major undisclosed damage), please contact us within 48 hours of delivery at support@portedhub.com with photos of the issue. If approved, we will process a refund to your original payment method within 5-7 business days.</p>
      </div>
    </div>
  )
}
