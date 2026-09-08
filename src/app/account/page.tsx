'use client';
import { useState, useEffect } from 'react';
import { User, MapPin, Package, Clock, ArrowRight, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatPrice';

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit Address State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    phone: '', house: '', street: '', landmark: '', city: '', zip: ''
  });

  const [isEditingSizes, setIsEditingSizes] = useState(false);
  const [sizeForm, setSizeForm] = useState({
    shirtSize: '', waistSize: '', shoeSize: ''
  });

  useEffect(() => {
    fetch('/api/user/profile')
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => {
        setUserData(data);
        setAddressForm({
          phone: data.phone || '',
          house: data.house || '',
          street: data.street || '',
          landmark: data.landmark || '',
          city: data.city || '',
          zip: data.zip || ''
        });
        setSizeForm({
          shirtSize: data.shirtSize || '',
          waistSize: data.waistSize || '',
          shoeSize: data.shoeSize || ''
        });
        setLoading(false);
      })
      .catch(() => {
        router.push('/signin');
      });
  }, [router]);

  const handleSignOut = () => {
    document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
  };

  const handleSaveAddress = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addressForm)
      });
      if (res.ok) {
        const updatedData = await res.json();
        setUserData(updatedData);
        setIsEditingAddress(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveSizes = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sizeForm)
      });
      if (res.ok) {
        const updatedData = await res.json();
        setUserData(updatedData);
        setIsEditingSizes(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email })
      });
      if (res.ok) {
        alert('Password reset link sent to your email! Please check your inbox.');
      } else {
        alert('Failed to send link.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="container py-12 text-center">Loading your account...</div>;

  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>My Account</h1>
        <button onClick={handleSignOut} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--accent-color)' }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '250px 1fr', gap: '48px', alignItems: 'start' }}>
        {/* Sidebar Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('orders')} 
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'orders' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'orders' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <Package size={20} /> Order History
          </button>
          <button 
            onClick={() => setActiveTab('address')} 
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'address' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'address' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <MapPin size={20} /> Saved Address
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'settings' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'settings' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <Settings size={20} /> Account Settings
          </button>
          <button 
            onClick={() => setActiveTab('sizes')} 
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'sizes' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'sizes' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <User size={20} /> My Sizes
          </button>
        </div>

        {/* Content Area */}
        <div className="card" style={{ padding: '32px' }}>
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Order History & Tracking</h2>
              {!userData?.orders || userData.orders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {userData.orders.map((order: any) => {
                    const items = JSON.parse(order.cartItems || '[]');
                    const date = new Date(order.createdAt).toLocaleDateString();
                    return (
                      <div key={order.id} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-hover)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>Order #{order.id}</div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Placed on {date}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700 }}>{formatPrice(order.totalAmount)}</div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: order.status === 'Delivered' ? '#00B894' : 'var(--accent-color)', background: order.status === 'Delivered' ? 'rgba(0,184,148,0.1)' : 'rgba(var(--accent-rgb), 0.1)', padding: '4px 10px', borderRadius: '20px', marginTop: '4px' }}>
                              {order.status === 'In Transit' ? <Clock size={14} /> : <Package size={14} />} {order.status}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                            {items.map((i:any) => i.name).join(', ')}
                          </div>
                          {order.status !== 'Delivered' && (
                            <a href="https://www.indiapost.gov.in/" target="_blank" rel="noreferrer" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Package size={16} /> Track your order
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === 'address' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Saved Address</h2>
                {!isEditingAddress && (
                  <button onClick={() => setIsEditingAddress(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    {userData?.house ? 'Edit Address' : '+ Add New Address'}
                  </button>
                )}
              </div>
              
              {isEditingAddress ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <input placeholder="Phone" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <input placeholder="House/Flat" value={addressForm.house} onChange={e => setAddressForm({...addressForm, house: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <input placeholder="Street" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <input placeholder="Landmark" value={addressForm.landmark} onChange={e => setAddressForm({...addressForm, landmark: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <input placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <input placeholder="ZIP" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value})} style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={handleSaveAddress} className="btn-primary">Save Changes</button>
                    <button onClick={() => setIsEditingAddress(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px', border: '1px solid var(--accent-color)', borderRadius: '12px', background: 'rgba(var(--accent-rgb), 0.05)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '0.8rem', background: 'var(--accent-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>DEFAULT</div>
                  <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>{userData?.firstName} {userData?.lastName}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{userData?.phone || 'No phone added'}</p>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    {userData?.house ? `${userData.house}, ${userData.street}` : 'No address added'}
                  </p>
                  {userData?.city && <p style={{ color: 'var(--text-secondary)' }}>{userData.city}, {userData.zip}</p>}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="animate-fade">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Account Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
                  <input type="text" value={`${userData?.firstName} ${userData?.lastName}`} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
                  <input type="email" value={userData?.email} readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                
                <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>Security</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>We will send a secure password reset link to your email address.</p>
                  <button onClick={handleChangePassword} className="btn-primary" style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SIZES TAB */}
          {activeTab === 'sizes' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>My Sizes</h2>
                {!isEditingSizes && (
                  <button onClick={() => setIsEditingSizes(true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Edit Sizes
                  </button>
                )}
              </div>
              
              {isEditingSizes ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Shirt / Tops Size</label>
                    <input placeholder="e.g. M, L, XL" value={sizeForm.shirtSize} onChange={e => setSizeForm({...sizeForm, shirtSize: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pants / Lowers Waist Size</label>
                    <input placeholder="e.g. 32, 34" value={sizeForm.waistSize} onChange={e => setSizeForm({...sizeForm, waistSize: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Shoe Size</label>
                    <input placeholder="e.g. EU 41 / UK 8" value={sizeForm.shoeSize} onChange={e => setSizeForm({...sizeForm, shoeSize: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button onClick={handleSaveSizes} className="btn-primary">Save Sizes</button>
                    <button onClick={() => setIsEditingSizes(false)} style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-hover)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Shirt / Tops Size</p>
                    <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>{userData?.shirtSize || 'Not specified'}</h3>
                  </div>
                  <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-hover)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Pants Waist Size</p>
                    <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>{userData?.waistSize || 'Not specified'}</h3>
                  </div>
                  <div style={{ padding: '24px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-hover)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '4px', fontSize: '0.9rem' }}>Shoe Size</p>
                    <h3 style={{ fontWeight: 600, fontSize: '1.2rem' }}>{userData?.shoeSize || 'Not specified'}</h3>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
