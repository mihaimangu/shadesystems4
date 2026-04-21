import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './homepage.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const products = [
  {
    name: 'Pergolas',
    desc: 'Permanent aluminium structures that define your terrace with elegance and durability.',
    gradient: 'linear-gradient(135deg, #2c4a6e 0%, #4a7a8a 60%, #7aadcc 100%)',
  },
  {
    name: 'Awnings',
    desc: 'Retractable fabric solutions for patios, windows and façades — motorised or manual.',
    gradient: 'linear-gradient(135deg, #3a5a3e 0%, #5a8a62 60%, #8ab890 100%)',
  },
  {
    name: 'Roller Screens',
    desc: 'Filter sun and wind while keeping your outdoor view completely open.',
    gradient: 'linear-gradient(135deg, #5a3a2e 0%, #8a6248 60%, #c49a7a 100%)',
  },
  {
    name: 'Zip Blinds',
    desc: 'Side-guided screens that seal out insects and wind with a clean, frameless look.',
    gradient: 'linear-gradient(135deg, #2e3a5a 0%, #485a8a 60%, #7a90c4 100%)',
  },
  {
    name: 'Louvre Roofs',
    desc: 'Adjustable aluminium blades that open and close to control light and rain instantly.',
    gradient: 'linear-gradient(135deg, #4a3a2e 0%, #7a6248 60%, #b09270 100%)',
  },
  {
    name: 'Glass Rooms',
    desc: 'Year-round outdoor living spaces — thermally efficient, minimalist, and durable.',
    gradient: 'linear-gradient(135deg, #2a4a3a 0%, #3a7a5e 60%, #6aaa8e 100%)',
  },
]

export function HomePage() {
  return (
    <main className={`homepage ${plusJakarta.variable}`}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="hp-hero" data-theme="dark">
        <div className="hp-hero-inner">
          <span className="hp-hero-tag">Shade Systems</span>
          <h1 className="hp-hero-title">
            Quality Shade Solutions<br />for Every Space
          </h1>
          <p className="hp-hero-sub">
            Pergolas, awnings, roller screens and more — designed and installed
            by specialists with over 20 years of experience.
          </p>
          <div className="hp-hero-actions">
            <Link href="/products" className="hp-btn hp-btn-orange">
              View Products
            </Link>
            <Link href="/contact" className="hp-btn hp-btn-outline-white">
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── PRODUCTS ─────────────── */}
      <section className="hp-products">
        <div className="hp-products-inner">
          <div className="hp-section-header">
            <p className="hp-section-label">Our Products</p>
            <h2 className="hp-section-title">Complete Range of Shade Systems</h2>
            <p className="hp-section-desc">
              From residential terraces to large commercial projects, we have a solution
              for every environment and budget.
            </p>
          </div>

          <div className="hp-products-grid">
            {products.map((p) => (
              <Link
                key={p.name}
                href={`/products/${p.name.toLowerCase().replace(' ', '-')}`}
                className="hp-product-card"
              >
                <div className="hp-product-thumb">
                  <div
                    className="hp-product-thumb-inner"
                    style={{ background: p.gradient }}
                  />
                </div>
                <div className="hp-product-body">
                  <h3 className="hp-product-name">{p.name}</h3>
                  <p className="hp-product-desc">{p.desc}</p>
                  <span className="hp-product-more">Learn more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── ABOUT ─────────────── */}
      <section className="hp-about">
        <div className="hp-about-inner">
          <div className="hp-about-img" />

          <div className="hp-about-text">
            <p className="hp-section-label">About Us</p>
            <h2 className="hp-section-title">Over 20 Years of Expertise</h2>

            <p className="hp-about-body">
              We are a specialist company focused on outdoor shade systems for residential
              and commercial clients. Our team handles everything from design and
              manufacturing to installation and after-sales support.
            </p>
            <p className="hp-about-body">
              We work with high-quality aluminium and fabric systems that are built to
              last, combining functionality with clean, modern aesthetics.
            </p>

            <div className="hp-about-stats">
              {[
                { num: '20', suffix: '+', label: 'Years in business' },
                { num: '5000', suffix: '+', label: 'Projects completed' },
                { num: '12', suffix: '', label: 'Countries served' },
                { num: '100', suffix: '%', label: 'Client satisfaction' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="hp-about-stat-num">
                    {s.num}<span>{s.suffix}</span>
                  </div>
                  <div className="hp-about-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            <Link href="/about" className="hp-btn hp-btn-outline-navy">
              Read More
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA STRIP ─────────────── */}
      <section className="hp-cta">
        <div className="hp-cta-inner">
          <p className="hp-cta-text">
            Ready to get started?{' '}
            <span>Request a free consultation.</span>
          </p>
          <Link href="/contact" className="hp-btn hp-btn-orange">
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
