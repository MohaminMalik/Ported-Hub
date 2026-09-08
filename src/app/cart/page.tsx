'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatPrice';
import { ArrowLeft, Trash2, ShieldCheck, X } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    // Load from local storage to sync with homepage additions
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length > 0) {
      setCartItems(savedCart);
    } else {
      // Fallback if empty to show design
      setCartItems([
        { id: 1, cartId: 1, name: 'Dolce & Gabbana Vintage Leather Boots', size: 'UK 7', price: 2999, image: "url('/images/shoes/dg1.jpeg') center/cover" },
        { id: 10, cartId: 2, name: 'Dickies Suede Vintage Chelsea ', size: 'UK 8', price: 1299, image: "url('/images/shoes/diki1.jpeg') center/cover" },
      ]);
    }
  }, []);

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    // Try to fetch logged-in user profile to pre-fill address
    fetch('/api/user/profile')
      .then(res => {
        if (res.ok) return res.json();
        return null;
      })
      .then(data => {
        if (data) {
          setShippingDetails({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            house: data.house || '',
            street: data.street || '',
            landmark: data.landmark || '',
            city: data.city || '',
            zip: data.zip || ''
          });
          if (data.phone) {
            // Very basic parse to separate country code and phone number
            const phoneStr = data.phone as string;
            if (phoneStr.startsWith('+91')) {
              setCountryCode('+91');
              setPhoneNumber(phoneStr.replace('+91', '').trim());
            } else if (phoneStr.startsWith('+1')) {
              setCountryCode('+1');
              setPhoneNumber(phoneStr.replace('+1', '').trim());
            } else if (phoneStr.startsWith('+44')) {
              setCountryCode('+44');
              setPhoneNumber(phoneStr.replace('+44', '').trim());
            } else {
              setPhoneNumber(phoneStr);
            }
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ''); // only allow digits
    if (countryCode === '+91' && val.length > 10) {
      val = val.slice(0, 10);
    }
    setPhoneNumber(val);
  };

  const deleteItem = (cartId: number) => {
    const updated = cartItems.filter(item => (item.cartId || item.id) !== cartId);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const suggestedProducts = [
    { id: 21, name: 'Vintage Wash Jeans', size: '32', price: 45.00, image: 'linear-gradient(135deg, #1e3c72, #2a5298)' },
    { id: 22, name: 'Retro Windbreaker', size: 'M', price: 65.00, image: 'linear-gradient(135deg, #00B894, #55EFC4)' },
    { id: 23, name: 'Canvas Tote Bag', size: 'One Size', price: 20.00, image: 'linear-gradient(135deg, #FD79A8, #FAB1A0)' },
  ];

  const addSuggestedItem = (product: any) => {
    if (cartItems.some(item => item.id === product.id)) {
      showToast("Item is already in your cart!", 'error');
      return;
    }
    const newProduct = { ...product, cartId: Date.now() };
    const updated = [...cartItems, newProduct];
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
    showToast(`${product.name} added to cart!`, 'success');
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const p = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
    return acc + (isNaN(p) ? 0 : p);
  }, 0);
  const discountAmount = appliedCoupon ? subtotal * 0.10 : 0;
  // Free shipping over 3000 INR
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 250;
  const total = subtotal - discountAmount + shipping;

  const applyCoupon = () => {
    const coupons = JSON.parse(localStorage.getItem('dinoCoupons') || '[]');
    const now = new Date().getTime();
    
    // Clean up expired ones
    const validCoupons = coupons.filter((c: any) => c.expires > now);
    if (validCoupons.length !== coupons.length) {
      localStorage.setItem('dinoCoupons', JSON.stringify(validCoupons));
    }

    const matchedCoupon = validCoupons.find((c: any) => c.code === couponCode.toUpperCase());
    
    if (matchedCoupon) {
      setAppliedCoupon(matchedCoupon.code);
      showToast(`Coupon applied successfully! 10% off.`, 'success');
    } else if (couponCode.toUpperCase() === 'THRIFTDINO10') {
      // Fallback for previous code
      setAppliedCoupon('THRIFTDINO10');
      showToast('Coupon applied successfully! 10% off.', 'success');
    } else {
      showToast('Invalid or expired coupon code.', 'error');
    }
  };

  const [showQRModal, setShowQRModal] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckoutClick = () => {
    if (total === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    
    const { firstName, lastName, email, house, street, city, zip } = shippingDetails;
    const missingFields = [];
    
    if (!firstName.trim()) missingFields.push("First Name");
    if (!lastName.trim()) missingFields.push("Last Name");
    if (!email.trim()) missingFields.push("Email Address");
    if (!phoneNumber.trim()) missingFields.push("Phone Number");
    if (!house.trim()) missingFields.push("House / Flat No.");
    if (!street.trim()) missingFields.push("Street / Lane");
    if (!city.trim()) missingFields.push("City");
    if (!zip.trim()) missingFields.push("ZIP Code");

    if (missingFields.length > 0) {
      showToast(`Please fill out: ${missingFields.join(', ')}`, 'error');
      return;
    }

    // Show the QR code payment modal
    setShowQRModal(true);
  };

  const confirmQRPayment = async () => {
    // UPI UTRs are exactly 12 numeric digits
    if (!/^\d{12}$/.test(utrNumber.trim())) {
      showToast('Please enter a valid 12-digit numeric UTR/Transaction ID', 'error');
      return;
    }

    setIsProcessing(true);
    showToast('Verifying payment and placing order...', 'info');
    
    const orderId = `ORD_${Date.now()}`;
    
    try {
      await fetch('/api/order/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingDetails,
          cartItems,
          total,
          paymentId: `UPI_${utrNumber}`,
          orderId: orderId,
          phoneNumber
        })
      });

      showToast('Payment successful! Processing order...', 'success');
      localStorage.setItem('cart', JSON.stringify([]));
      window.dispatchEvent(new Event('cartUpdated'));
      router.push('/success');
    } catch (e) {
      console.error("Failed to send confirmation email", e);
      showToast('Error placing order, please try again.', 'error');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '16px', transition: 'color 0.2s' }}>
          <ArrowLeft size={20} /> Continue Shopping
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Your Cart & Checkout</h1>
      </div>

      <div className="cart-grid">
        
        {/* Left Column: Cart Items & Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Editable Cart Items */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Review Items</h2>
            {cartItems.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {cartItems.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: item.image || (item.images && item.images[0]) || 'var(--surface-hover)' }}></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.name}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Size: {item.size}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', background: 'rgba(var(--accent-rgb), 0.1)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>1 of 1</span>
                        <button onClick={() => deleteItem(item.cartId || item.id)} style={{ color: '#FF453A', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatPrice(item.price)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* You May Also Like */}
          <div className="card" style={{ padding: '32px', background: 'var(--bg-color)', border: '1px dashed var(--border-color)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px', color: 'var(--text-secondary)' }}>You May Also Like</h2>
            <div className="grid grid-cols-1" style={{ gap: '16px' }}>
              {suggestedProducts.map(product => (
                <div key={product.id} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: product.image }}></div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{product.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{formatPrice(product.price)}</p>
                  </div>
                  <button onClick={() => addSuggestedItem(product)} style={{ padding: '8px 16px', borderRadius: '20px', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--accent-color)'; }}>
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Shipping Details</h2>
            <div className="grid grid-cols-2" style={{ gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>First Name *</label>
                <input type="text" name="firstName" value={shippingDetails.firstName} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="John" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Last Name *</label>
                <input type="text" name="lastName" value={shippingDetails.lastName} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="Doe" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address *</label>
                <input type="email" name="email" value={shippingDetails.email} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="john@example.com" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone Number *</label>
                <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', background: 'transparent' }}>
                  <select 
                    value={countryCode} 
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      if (e.target.value === '+91' && phoneNumber.length > 10) {
                        setPhoneNumber(phoneNumber.slice(0, 10));
                      }
                    }} 
                    style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRight: '1px solid var(--border-color)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                    <option value="+91" style={{ color: 'var(--text-primary)' }}>🇮🇳 +91</option>
                    <option value="+1" style={{ color: 'var(--text-primary)' }}>🇺🇸 +1</option>
                    <option value="+44" style={{ color: 'var(--text-primary)' }}>🇬🇧 +44</option>
                  </select>
                  <input type="tel" value={phoneNumber} onChange={handlePhoneChange} style={{ flex: 1, padding: '12px 16px', border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="98765 43210" />
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>House / Flat No. *</label>
                <input type="text" name="house" value={shippingDetails.house} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="Apt 4B" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Street / Lane *</label>
                <input type="text" name="street" value={shippingDetails.street} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="Vintage Avenue" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Landmark (Optional)</label>
                <input type="text" name="landmark" value={shippingDetails.landmark} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="Opposite Central Park" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>City *</label>
                <input type="text" name="city" value={shippingDetails.city} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="New York" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ZIP Code *</label>
                <input type="text" name="zip" value={shippingDetails.zip} onChange={handleShippingChange} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} placeholder="10001" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Razorpay */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Order Summary</h2>
            
            <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-color)' }}>
                  <span>Discount ({appliedCoupon})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
            </div>

            {/* Coupon Option */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Coupon Code</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={couponCode} 
                  onChange={(e) => setCouponCode(e.target.value)} 
                  placeholder="Enter code" 
                  style={{ flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit', textTransform: 'uppercase' }} 
                />
                <button onClick={applyCoupon} style={{ padding: '0 20px', borderRadius: '8px', background: 'var(--text-primary)', color: 'var(--bg-color)', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Apply</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.3rem', marginBottom: '32px' }}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid var(--accent-color)', borderRadius: '12px', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ShieldCheck size={24} color="var(--accent-color)" />
              <div>
                <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>Secure Manual UPI Checkout</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Scan QR code and enter Transaction ID.</p>
              </div>
            </div>

            <button onClick={handleCheckoutClick} className="btn-primary" style={{ width: '100%', padding: '20px', fontSize: '1.2rem', background: 'var(--accent-color)', display: 'flex', flexDirection: 'column', gap: '4px', height: 'auto' }}>
              <span>Pay {formatPrice(total)}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 400 }}>via UPI / QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {showQRModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px', textAlign: 'center', position: 'relative' }}>
            <button onClick={() => setShowQRModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Complete Payment</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Scan this QR code using any UPI app to pay {formatPrice(total)}.</p>
            
            <div style={{ width: '200px', height: '200px', background: 'white', margin: '0 auto 24px', borderRadius: '12px', padding: '16px', border: '1px solid #ddd' }}>
              {/* Replace src with the actual QR code image */}
              <img src="/images/shoes/qr.jpeg" alt="UPI QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:black;font-weight:bold;">[Your QR Code Here]</div>'; }} />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>12-Digit UTR / Transaction ID *</label>
              <input 
                type="text" 
                value={utrNumber} 
                onChange={(e) => setUtrNumber(e.target.value)} 
                placeholder="e.g. 312345678901" 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} 
              />
            </div>

            <button onClick={confirmQRPayment} disabled={isProcessing} className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', opacity: isProcessing ? 0.7 : 1 }}>
              {isProcessing ? 'Verifying...' : 'I have completed the payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
