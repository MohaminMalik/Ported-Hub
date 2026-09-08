import Link from 'next/link';
import { ArrowRight, Sparkles, Recycle, ShieldCheck, Gamepad2 } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

const categories = [
  { id: 'shirts', name: 'Shirts', gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8B)' },
  { id: 't-shirts', name: 'T-Shirts', gradient: 'linear-gradient(135deg, #4ECDC4, #55EFC4)' },
  { id: 'jackets', name: 'Jackets', gradient: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' },
  { id: 'leather-jackets', name: 'Leather Jackets', gradient: 'linear-gradient(135deg, #2D3436, #636E72)' },
  { id: 'bags', name: 'Bags', gradient: 'linear-gradient(135deg, #FD79A8, #FAB1A0)' },
  { id: 'shoes', name: 'Shoes', gradient: "url('/images/shoes/shoebox.jpeg') center/cover" },
  { id: 'sweaters', name: 'Sweaters', gradient: 'linear-gradient(135deg, #E17055, #FFEAA7)' },
  { id: 'hoodies', name: 'Hoodies', gradient: 'linear-gradient(135deg, #00B894, #55EFC4)' },
];

const featuredProducts = [
  { id: 1, name: 'Dolce & Gabbana Vintage Leather Boots', description: 'Classic Chestnut brown boots with double stitch detailing.  Excellent condition, Comfortable and durable. Low stacked leather heel.', price: '2,999', images: ["url('/images/shoes/dg1.jpeg') center/cover", "url('/images/shoes/dg2.jpeg') center/cover", "url('/images/shoes/dg3.jpeg') center/cover", "url('/images/shoes/dg4.jpeg') center/cover", "url('/images/shoes/dg5.jpeg') center/cover", "url('/images/shoes/dg6.jpeg') center/cover", "url('/images/shoes/dg7.jpeg') center/cover", "url('/images/shoes/dg8.jpeg') center/cover"] },
  { id: 8, name: 'Zara High Top Suede Sneakers ', description: 'Brushed suede upper in warn camel/ wheat tan. durable, low profile vulcanized rubber cupsole with tonal foxing. smooth interior lining with a cusioned footbed for daily wear.', price: '1,899', images: ["url('/images/shoes/zara1.jpeg') center/cover", "url('/images/shoes/zara2.jpeg') center/cover", "url('/images/shoes/zara3.jpeg') center/cover", "url('/images/shoes/zara4.jpeg') center/cover", "url('/images/shoes/zara5.jpeg') center/cover"] },
  { id: 10, name: 'Dickies Suede Vintage Chelsea ', description: 'Matte Black Suede/innubuck upper with subtle texture.Wood look cuban heel with contrasting  welt sticthing. Rare find in this size and condition. Cleaned and restored by our team.', price: '1,299', images: ["url('/images/shoes/diki1.jpeg') center/cover", "url('/images/shoes/diki2.jpeg') center/cover", "url('/images/shoes/diki3.jpeg') center/cover", "url('/images/shoes/diki4.jpeg') center/cover", "url('/images/shoes/diki5.jpeg') center/cover", "url('/images/shoes/diki6.jpeg') center/cover"] },
  { id: 13, name: 'Redskins Leather Sneakers', description: 'Classic leather sneakers from Redskins. Clean, comfortable and ready for everyday wear.', price: '2,199', images: ["url('/images/shoes/reds1.jpeg') center/cover", "url('/images/shoes/reds2.jpeg') center/cover", "url('/images/shoes/reds3.jpeg') center/cover", "url('/images/shoes/reds4.jpeg') center/cover", "url('/images/shoes/reds5.jpeg') center/cover", "url('/images/shoes/reds6.jpeg') center/cover"] },
  { id: 14, name: 'Ralph Lauren High Top Corduroy Sneakers', description: 'Premium corduroy high tops by Ralph Lauren. Distinctive vintage style and ultimate comfort.', price: '2,199', images: ["url('/images/shoes/rl1.jpeg') center/cover", "url('/images/shoes/rl2.jpeg') center/cover", "url('/images/shoes/rl3.jpeg') center/cover", "url('/images/shoes/rl4.jpeg') center/cover", "url('/images/shoes/rl5.jpeg') center/cover"] },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{ 
        padding: '100px 24px', 
        textAlign: 'center', 
        background: 'radial-gradient(circle at center, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="animate-slide-up" style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(var(--accent-rgb), 0.1)', borderRadius: '30px', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '24px', border: '1px solid rgba(var(--accent-rgb), 0.2)' }}>
            <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />
            Premium Curated Thrift Store
          </div>
          <h1 className="mb-8 animate-slide-up delay-1" style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1 }}>
            Wear the Past. <br /> <span className="text-gradient">Define the Future.</span>
          </h1>
          <p className="text-secondary mb-12 animate-slide-up delay-2" style={{ fontSize: '1.2rem' }}>
            Discover one-of-a-kind, premium vintage pieces handpicked for your unique style. Quality fashion that doesn't cost the earth.
          </p>
          <div className="animate-slide-up delay-3" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="#categories" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link href="/game" className="btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', background: 'var(--surface-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <Gamepad2 size={20} /> Win 10% Off
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-12 mt-8 animate-slide-up delay-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Fresh Drops</h2>
          <Link href="#categories" style={{ color: 'var(--accent-color)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-3">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Thrift Runner Game Promo */}
      <section className="container py-8 animate-slide-up">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(0,0,0,1))', padding: '48px', textAlign: 'center', border: '1px solid rgba(var(--accent-rgb), 0.3)' }}>
          <Gamepad2 size={48} className="mx-auto mb-4" style={{ margin: '0 auto', display: 'block', color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px' }}>Thrift Runner</h2>
          <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Think you have what it takes? Play our endless runner game. Beat the score and get an instant 10% off your entire order!
          </p>
          <Link href="/game" className="btn-primary">
            Play Now
          </Link>
        </div>
      </section>

      {/* Curated Lookbooks */}
      <section className="container py-12 animate-slide-up">
        <h2 className="mb-8" style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center' }}>Curated Vibes</h2>
        <div className="grid grid-cols-3">
          {[
            { title: "90s Grunge", subtitle: "Flannels, Denim, Boots", img: "linear-gradient(135deg, #1e272e, #485460)" },
            { title: "Y2K Streetwear", subtitle: "Baggy fits & Graphics", img: "linear-gradient(135deg, #0A84FF, #5E5CE6)" },
            { title: "Classic Americana", subtitle: "Workwear & Leathers", img: "linear-gradient(135deg, #8B4513, #D2691E)" }
          ].map((lookbook, idx) => (
            <div key={idx} className="card" style={{ position: 'relative', height: '300px', display: 'flex', alignItems: 'flex-end', padding: '24px', background: lookbook.img }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{lookbook.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{lookbook.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container py-12 animate-slide-up">
        <h2 className="mb-8" style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center' }}>Explore Categories</h2>
        <div className="grid grid-cols-4">
          {categories.map((cat) => (
            <Link href={`/category/${cat.id}`} key={cat.id}>
              <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', background: cat.gradient, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', transition: 'background 0.3s ease' }} className="cat-overlay"></div>
                </div>
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>{cat.name}</h3>
                  <ArrowRight size={20} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ background: 'var(--surface-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', marginTop: '64px' }}>
        <div className="container py-12">
          <div className="grid grid-cols-3" style={{ textAlign: 'center', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent-color)', marginBottom: '20px' }}>
                <Recycle size={32} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Sustainable Fashion</h3>
              <p className="text-secondary">Reduce your carbon footprint by giving premium vintage clothes a second life.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent-color)', marginBottom: '20px' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Curated Quality</h3>
              <p className="text-secondary">Every piece is hand-selected and verified for quality, authenticity, and condition.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(var(--accent-rgb), 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--accent-color)', marginBottom: '20px' }}>
                <Sparkles size={32} />
              </div>
              <h3 className="mb-2" style={{ fontSize: '1.25rem' }}>Unique Style</h3>
              <p className="text-secondary">Stand out from the crowd with one-of-a-kind vintage pieces you won't find anywhere else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-12" style={{ marginTop: '32px' }}>
        <h2 className="mb-8" style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center' }}>What Our Community Says</h2>
        <div className="grid grid-cols-3" style={{ gap: '24px' }}>
          {[
            { name: "Azim K.", review: "Found the exact vintage windbreaker I've been looking for. Quality is incredible and shipping was fast." },
            { name: "Faizan M.", review: "The curated selection is top-notch. I love knowing I'm buying sustainably without compromising on style." },
            { name: "Rahul S.", review: "Ported Hub never misses. The leather jacket I bought feels brand new but has that perfect vintage character." }
          ].map((testimonial, i) => (
            <div key={i} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--accent-color)' }}>
                {'★'.repeat(5)}
              </div>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', flexGrow: 1 }}>"{testimonial.review}"</p>
              <p style={{ fontWeight: 600 }}>- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="container py-12" style={{ marginTop: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Follow Our Hunts</h2>
          <p className="text-secondary">@PortedHub on Instagram</p>
        </div>
        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card" style={{ paddingBottom: '100%', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(${135 + i * 20}deg, #1C1C1E, #2C2C2E)` }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / Newsletter */}
      <footer className="container py-12 text-center" style={{ marginTop: '32px' }}>
        <h2 className="mb-4" style={{ fontSize: '2rem' }}>Join the Ported Hub Club</h2>
        <p className="text-secondary mb-8">Get exclusive early access to new drops and secret discount codes.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
          <input 
            type="tel" 
            placeholder="Enter your phone number" 
            style={{ flex: 1, padding: '16px 24px', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--surface-color)', color: 'white', outline: 'none', fontFamily: 'inherit' }} 
          />
          <button className="btn-primary" style={{ padding: '16px 32px' }}>Subscribe</button>
        </div>
        <div style={{ marginTop: '64px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms & Conditions</Link>
            <Link href="/refund" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Refund Policy</Link>
            <Link href="/contact" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link>
            <Link href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link>
          </div>
          <p className="text-secondary" style={{ fontSize: '0.9rem' }}>© 2026 Ported Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
