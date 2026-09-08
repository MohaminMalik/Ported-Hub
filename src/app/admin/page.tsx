'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Users, Package, BarChart3, Plus, Trash2 } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We should ideally check if user is admin via API here
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, userRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/users')
      ]);
      
      if (prodRes.ok) {
        const p = await prodRes.json();
        setProducts(p);
      }
      if (userRes.ok) {
        const u = await userRes.json();
        setUsers(u);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Product deleted', 'success');
        fetchData();
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('Error', 'error');
    }
  };

  const handleUpdateRole = async (id: number, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: newRole })
      });
      if (res.ok) {
        showToast('Role updated', 'success');
        fetchData();
      } else {
        showToast('Failed to update role', 'error');
      }
    } catch (err) {
      showToast('Error', 'error');
    }
  };

  if (loading) return <div className="container py-12 text-center">Loading admin dashboard...</div>;

  return (
    <div className="container py-12 animate-fade-in" style={{ display: 'flex', gap: '32px' }}>
      <div style={{ width: '250px', flexShrink: 0 }}>
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '24px' }}>Admin Panel</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => setActiveTab('analytics')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', textAlign: 'left', borderRadius: '8px', background: activeTab === 'analytics' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'analytics' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <BarChart3 size={20} /> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', textAlign: 'left', borderRadius: '8px', background: activeTab === 'products' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'products' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <Package size={20} /> Products
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', textAlign: 'left', borderRadius: '8px', background: activeTab === 'users' ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent', color: activeTab === 'users' ? 'var(--accent-color)' : 'var(--text-primary)', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              <Users size={20} /> Users & Roles
            </button>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="card" style={{ padding: '32px' }}>
          
          {activeTab === 'analytics' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Store Overview</h2>
              <div className="grid grid-cols-3" style={{ gap: '24px', marginBottom: '32px' }}>
                <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Users</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{users.length}</h3>
                </div>
                <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Products</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>{products.length}</h3>
                </div>
                <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Revenue (Mock)</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>₹45,200</h3>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Manage Products</h2>
                <button onClick={() => router.push('/admin/add-product')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}>
                  <Plus size={18} /> Add Product
                </button>
              </div>
              
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>ID</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Price</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Category</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 8px' }}>#{p.id}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '16px 8px' }}>₹{p.price}</td>
                      <td style={{ padding: '16px 8px', textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ padding: '16px 8px' }}>
                        <button onClick={() => handleDeleteProduct(p.id)} style={{ background: 'none', border: 'none', color: '#ff7675', cursor: 'pointer', padding: '8px' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Manage Users</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>ID</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Name</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Email</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Sizes (Top/Waist/Shoe)</th>
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 8px' }}>#{u.id}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: '16px 8px' }}>{u.email}</td>
                      <td style={{ padding: '16px 8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {u.shirtSize || '-'} / {u.waistSize || '-'} / {u.shoeSize || '-'}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        <select 
                          value={u.role} 
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', outline: 'none' }}
                        >
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
