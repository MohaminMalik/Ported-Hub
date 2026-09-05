'use client';
import { useState } from 'react';
import { User, MapPin, Package, Clock, ArrowRight, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/utils/formatPrice';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');

  const mockOrders = [
    { id: '#ORD-9871', date: 'Oct 12, 2026', total: 85.00, status: 'Delivered', items: ['Vintage Flannel Shirt', 'Canvas Tote'] },
    { id: '#ORD-8820', date: 'Sep 05, 2026', total: 150.00, status: 'In Transit', items: ['Biker Leather Jacket'] }
  ];

  const mockAddress = {
    name: 'John Doe',
    phone: '+91 98765 43210',
    flat: 'Apt 4B',
    street: 'Vintage Avenue',
    city: 'New York',
    zip: '10001'
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>My Account</h1>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--accent-color)' }}>
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
            <MapPin size={20} /> Saved Addresses
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', background: activeTab === 'settings' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'settings' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            <Settings size={20} /> Account Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="card" style={{ padding: '32px' }}>
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="animate-fade">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Order History & Tracking</h2>
              {mockOrders.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {mockOrders.map((order, idx) => (
                    <div key={idx} style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--surface-hover)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{order.id}</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Placed on {order.date}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700 }}>{formatPrice(order.total)}</div>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: order.status === 'Delivered' ? '#00B894' : 'var(--accent-color)', background: order.status === 'Delivered' ? 'rgba(0,184,148,0.1)' : 'rgba(var(--accent-rgb), 0.1)', padding: '4px 10px', borderRadius: '20px', marginTop: '4px' }}>
                            {order.status === 'In Transit' ? <Clock size={14} /> : <Package size={14} />} {order.status}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                          {order.items.join(', ')}
                        </div>
                        <button style={{ color: 'var(--accent-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                          Track Order <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESS TAB */}
          {activeTab === 'address' && (
            <div className="animate-fade">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Saved Addresses</h2>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>+ Add New</button>
              </div>
              <div style={{ padding: '24px', border: '1px solid var(--accent-color)', borderRadius: '12px', background: 'rgba(var(--accent-rgb), 0.05)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '0.8rem', background: 'var(--accent-color)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>DEFAULT</div>
                <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>{mockAddress.name}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{mockAddress.phone}</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{mockAddress.flat}, {mockAddress.street}</p>
                <p style={{ color: 'var(--text-secondary)' }}>{mockAddress.city}, {mockAddress.zip}</p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
                  <button style={{ color: 'var(--accent-color)', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                  <button style={{ color: '#E63946', fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="animate-fade">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px' }}>Account Settings</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
                  <input type="text" value="John Doe" readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
                  <input type="email" value="john@example.com" readOnly style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--surface-hover)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
                </div>
                <button className="btn-primary" style={{ marginTop: '16px' }}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
