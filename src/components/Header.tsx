'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Gamepad2, User, Search, X, Moon, Sun, LogIn, UserPlus, LogOut, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

const searchableItems = [
  { name: 'Dolce & Gabbana Vintage Leather Boots', type: 'Product', link: '/product/1', image: "url('/images/shoes/dg1.jpeg') center/cover" },
  { name: 'Zara High Top Suede Sneakers ', type: 'Product', link: '/product/8', image: "url('/images/shoes/zara1.jpeg') center/cover" },
  { name: 'Dickies Suede Vintage Chelsea ', type: 'Product', link: '/product/10', image: "url('/images/shoes/diki1.jpeg') center/cover" },
  { name: 'Redskins Leather Sneakers', type: 'Product', link: '/product/13', image: "url('/images/shoes/reds1.jpeg') center/cover" },
  { name: 'Ralph Lauren High Top Corduroy Sneakers', type: 'Product', link: '/product/14', image: "url('/images/shoes/rl1.jpeg') center/cover" },
  { name: 'Shirts', type: 'Category', link: '/category/shirts', image: 'linear-gradient(135deg, #FF6B6B, #FF8E8B)' },
  { name: 'T-Shirts', type: 'Category', link: '/category/t-shirts', image: 'linear-gradient(135deg, #4ECDC4, #55EFC4)' },
  { name: 'Jackets', type: 'Category', link: '/category/jackets', image: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' },
  { name: 'Leather Jackets', type: 'Category', link: '/category/leather-jackets', image: 'linear-gradient(135deg, #2D3436, #636E72)' },
  { name: 'Bags', type: 'Category', link: '/category/bags', image: 'linear-gradient(135deg, #FD79A8, #FAB1A0)' },
  { name: 'Shoes', type: 'Category', link: '/category/shoes', image: "url('/images/shoes/shoebox.jpeg') center/cover" },
  { name: 'Sweaters', type: 'Category', link: '/category/sweaters', image: 'linear-gradient(135deg, #E17055, #FFEAA7)' },
  { name: 'Hoodies', type: 'Category', link: '/category/hoodies', image: 'linear-gradient(135deg, #00B894, #55EFC4)' },
];

export default function Header() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const filteredSuggestions = searchQuery.trim() === '' 
    ? [] 
    : searchableItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        e.preventDefault();
        handleSuggestionClick(filteredSuggestions[selectedIndex].link);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && selectedIndex === -1) {
      alert(`Searching for: ${searchQuery}\n\n(In production, this would route to /search?q=${searchQuery})`);
      setIsSearching(false);
      setSearchQuery('');
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (link: string) => {
    setIsSearching(false);
    setSearchQuery('');
    setSelectedIndex(-1);
    router.push(link);
  };

  return (
    <>
      <div style={{ background: 'var(--accent-color)', color: 'var(--bg-color)', padding: '8px 0', textAlign: 'center', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', width: '100%' }}>
        DIRECTED TO YOUR WARDROBE
      </div>
      <header className="header">
      <div className="container header-content">
        {!isSearching ? (
          <>
            <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <span style={{ background: '#d1d5db', color: '#000000', padding: '2px 6px', borderRadius: '6px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                Ported
              </span>
              <span style={{ color: '#ffffff', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Hub
              </span>
            </Link>
            <nav className="nav-links">
              <Link href="/" className="nav-link">Shop</Link>
              <Link href="/game" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Gamepad2 size={18} /> Win 10% Off
              </Link>
            </nav>
            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-secondary)', alignItems: 'center', position: 'relative' }}>
              <button onClick={toggleTheme} style={{ color: 'inherit' }}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsSearching(true)} style={{ color: 'inherit' }}><Search size={20} /></button>
              
              <div 
                style={{ position: 'relative' }}
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button style={{ color: 'inherit', cursor: 'pointer', background: 'transparent', border: 'none' }}><User size={20} /></button>
                {isUserMenuOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: 0, paddingTop: '12px', zIndex: 50 }}>
                    <div className="animate-pop-in" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '8px', minWidth: '220px', boxShadow: 'var(--shadow-md)' }}>
                      {!isLoggedIn ? (
                        <>
                          <button onClick={() => { setIsUserMenuOpen(false); router.push('/signin'); }} style={{ width: '100%', padding: '12px', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}><LogIn size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 600 }}>Sign In</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Welcome back</div>
                            </div>
                          </button>
                          <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>
                          <button onClick={() => { setIsUserMenuOpen(false); router.push('/signup'); }} style={{ width: '100%', padding: '12px', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}><UserPlus size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 600 }}>Create Account</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Join the community</div>
                            </div>
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setIsUserMenuOpen(false); router.push('/account'); }} style={{ width: '100%', padding: '12px', textAlign: 'left', color: 'var(--text-primary)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}><Settings size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 600 }}>My Account</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Orders & Settings</div>
                            </div>
                          </button>
                          <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>
                          <button onClick={() => { setIsLoggedIn(false); setIsUserMenuOpen(false); router.push('/'); }} style={{ width: '100%', padding: '12px', textAlign: 'left', color: 'var(--accent-color)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '12px' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E63946' }}><LogOut size={18} /></div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#E63946' }}>Sign Out</div>
                            </div>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/cart" style={{ color: 'inherit', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="animate-pop-in" style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--accent-color)', color: 'white', fontSize: '0.65rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </>
        ) : (
          <div className="animate-fade" style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '16px', position: 'static' }}>
            <Search size={28} color="var(--text-secondary)" />
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <input 
                type="text" 
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search Ported Hub" 
                style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', outline: 'none', fontFamily: 'inherit', fontWeight: 500 }} 
              />
            </form>
            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }} style={{ color: 'var(--text-secondary)', padding: '8px', cursor: 'pointer', background: 'transparent', border: 'none' }}><X size={28} /></button>

            {/* Apple-style Full Width Dropdown */}
            <div className="animate-fade-in" style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-color)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px', overflow: 'hidden', zIndex: 50, transformOrigin: 'top center', padding: '32px 0 48px 0', borderTop: '1px solid var(--border-color)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
                {searchQuery.trim().length === 0 ? (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { name: 'Shop All Shirts', link: '/category/shirts' },
                        { name: 'Premium Leather Jackets', link: '/category/leather-jackets' },
                        { name: 'Win 10% Off', link: '/game' },
                        { name: 'My Account', link: '/account' },
                      ].map((item, idx) => (
                        <li key={idx}>
                          <button onClick={() => handleSuggestionClick(item.link)} style={{ textAlign: 'left', padding: '0', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-color)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}>
                            <Search size={16} color="var(--text-secondary)" /> {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div>
                    <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '24px' }}>Suggested Results</h4>
                    {filteredSuggestions.length > 0 ? (
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {filteredSuggestions.map((suggestion, idx) => (
                          <li key={idx}>
                            <button 
                              onClick={() => handleSuggestionClick(suggestion.link)}
                              style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: idx === selectedIndex ? 'var(--surface-hover)' : 'transparent', border: 'none', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s', marginBottom: '8px' }}
                              onMouseOver={() => setSelectedIndex(idx)}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: suggestion.image }}></div>
                                <span style={{ fontWeight: 500, fontSize: '1.2rem' }}>{suggestion.name}</span>
                              </div>
                              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{suggestion.type}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ padding: '24px 0', color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
