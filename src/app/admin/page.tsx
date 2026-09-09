'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Users, Package, BarChart3, Plus, Trash2 } from 'lucide-react';
import { showToast } from '@/components/Toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable Revenue State
  const [mockRevenue, setMockRevenue] = useState(45200);
  const [isEditingRevenue, setIsEditingRevenue] = useState(false);

  // Editable Users State
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUserForm, setEditUserForm] = useState({ firstName: '', lastName: '', email: '' });

  // Admin auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('admin_auth') === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        localStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true);
        fetchData();
        showToast('Welcome Admin', 'success');
      } else {
        setLoginError('Invalid email or password');
        showToast('Invalid credentials', 'error');
      }
    } catch (err) {
      setLoginError('Server error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
  };

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

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to completely remove this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('User removed', 'success');
        fetchData();
      } else {
        showToast('Failed to remove user', 'error');
      }
    } catch (err) {
      showToast('Error', 'error');
    }
  };

  const handleEditUserClick = (u: any) => {
    setEditingUserId(u.id);
    setEditUserForm({ firstName: u.firstName, lastName: u.lastName, email: u.email });
  };

  const handleSaveUser = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/users`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editUserForm })
      });
      if (res.ok) {
        showToast('User info updated', 'success');
        setEditingUserId(null);
        fetchData();
      } else {
        showToast('Failed to update user', 'error');
      }
    } catch (err) {
      showToast('Error', 'error');
    }
  };

  const handleSaveRevenue = () => {
    setIsEditingRevenue(false);
    showToast('Revenue updated locally!', 'success');
  };

  if (loading) return <div className="container py-12 text-center">Loading admin dashboard...</div>;

  if (!isAuthenticated) {
    return (
      <div className="container py-24 flex justify-center items-center">
        <div className="card" style={{ padding: '32px', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', outline: 'none' }}
                required 
              />
            </div>
            {loginError && <p style={{ color: '#ff7675', fontSize: '0.9rem', margin: 0 }}>{loginError}</p>}
            <button type="submit" className="btn-primary" style={{ marginTop: '8px', padding: '14px' }}>
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', width: '100%', textAlign: 'left', borderRadius: '8px', background: 'transparent', color: '#ff7675', border: 'none', cursor: 'pointer', fontWeight: 600, marginTop: '24px' }}
            >
              Logout
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
                <div style={{ padding: '24px', background: 'var(--surface-hover)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Revenue</p>
                  
                  {isEditingRevenue ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>₹</span>
                      <input 
                        type="number" 
                        value={mockRevenue}
                        onChange={(e) => setMockRevenue(Number(e.target.value))}
                        style={{ width: '120px', padding: '8px', borderRadius: '6px', border: '1px solid var(--accent-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none' }}
                      />
                      <button onClick={handleSaveRevenue} style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--accent-color)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>₹{mockRevenue.toLocaleString('en-IN')}</h3>
                      <button onClick={() => setIsEditingRevenue(true)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>Edit</button>
                    </div>
                  )}
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
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 8px' }}>#{p.id}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>{p.name}</td>
                      <td style={{ padding: '16px 8px' }}>₹{p.price}</td>
                      <td style={{ padding: '16px 8px', textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                        <Link href={`/admin/edit-product/${p.id}`} style={{ marginRight: '16px', color: 'var(--accent-color)', fontWeight: 600, textDecoration: 'none' }}>
                          Edit
                        </Link>
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
                    <th style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '16px 8px' }}>#{u.id}</td>
                      <td style={{ padding: '16px 8px', fontWeight: 500 }}>
                        {editingUserId === u.id ? (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input value={editUserForm.firstName} onChange={e => setEditUserForm({...editUserForm, firstName: e.target.value})} style={{ width: '80px', padding: '4px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }} />
                            <input value={editUserForm.lastName} onChange={e => setEditUserForm({...editUserForm, lastName: e.target.value})} style={{ width: '80px', padding: '4px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }} />
                          </div>
                        ) : (
                          `${u.firstName} ${u.lastName}`
                        )}
                      </td>
                      <td style={{ padding: '16px 8px' }}>
                        {editingUserId === u.id ? (
                          <input value={editUserForm.email} onChange={e => setEditUserForm({...editUserForm, email: e.target.value})} style={{ width: '150px', padding: '4px', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }} />
                        ) : (
                          u.email
                        )}
                      </td>
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
                      <td style={{ padding: '16px 8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {editingUserId === u.id ? (
                            <button onClick={() => handleSaveUser(u.id)} style={{ padding: '6px 10px', background: 'var(--accent-color)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Save</button>
                          ) : (
                            <button onClick={() => handleEditUserClick(u)} style={{ padding: '6px 10px', background: 'var(--surface-hover)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Edit</button>
                          )}
                          <button onClick={() => handleDeleteUser(u.id)} style={{ padding: '6px 8px', background: 'transparent', color: '#ff7675', border: 'none', cursor: 'pointer' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
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
