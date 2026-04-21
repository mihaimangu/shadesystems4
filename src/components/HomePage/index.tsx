import Link from 'next/link'
import Image from 'next/image'
import { Plus_Jakarta_Sans } from 'next/font/google'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import type { HomepageSetting, Media, Product } from '@/payload-types'
import './homepage.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const cardGradients = [
  'linear-gradient(135deg, #2c4a6e 0%, #4a7a8a 60%, #7aadcc 100%)',
  'linear-gradient(135deg, #3a5a3e 0%, #5a8a62 60%, #8ab890 100%)',
  'linear-gradient(135deg, #5a3a2e 0%, #8a6248 60%, #c49a7a 100%)',
  'linear-gradient(135deg, #2e3a5a 0%, #485a8a 60%, #7a90c4 100%)',
  'linear-gradient(135deg, #4a3a2e 0%, #7a6248 60%, #b09270 100%)',
  'linear-gradient(135deg, #2a4a3a 0%, #3a7a5e 60%, #6aaa8e 100%)',
]

async function getData() {
  const payload = await getPayload({ config: configPromise })

  const [settings, productsResult] = await Promise.all([
    payload.findGlobal({ slug: 'homepage-settings' }) as Promise<HomepageSetting>,
    payload.find({
      collection: 'products',
      limit: 12,
      sort: 'order',
      pagination: false,
    }),
  ])

  return { settings, products: productsResult.docs }
}

export async function HomePage() {
  const { settings, products } = await getData()

  const { hero, products: productsSection, about, cta } = settings

  return (
    <main className={`homepage ${plusJakarta.variable}`}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="hp-hero" data-theme="dark">
        <div className="hp-hero-inner">
          {hero.tag && <span className="hp-hero-tag">{hero.tag}</span>}
          <h1 className="hp-hero-title">{hero.title}</h1>
          {hero.subtitle && <p className="hp-hero-sub">{hero.subtitle}</p>}
          <div className="hp-hero-actions">
            <Link href={hero.primaryButtonHref || '/products'} className="hp-btn hp-btn-orange">
              {hero.primaryButtonLabel || 'View Products'}
            </Link>
            <Link href={hero.secondaryButtonHref || '/contact'} className="hp-btn hp-btn-outline-white">
              {hero.secondaryButtonLabel || 'Get a Quote'}
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────── PRODUCTS ─────────────── */}
      <section className="hp-products">
        <div className="hp-products-inner">
          <div className="hp-section-header">
            <p className="hp-section-label">{productsSection?.label || 'Our Products'}</p>
            <h2 className="hp-section-title">{productsSection?.title || 'Complete Range of Shade Systems'}</h2>
            {productsSection?.description && <p className="hp-section-desc">{productsSection.description}</p>}
          </div>

          <div className="hp-products-grid">
            {products.map((product: Product, i: number) => {
              const image = product.image && typeof product.image === 'object'
                ? (product.image as Media)
                : null
              const imgUrl = image?.url ? getMediaUrl(image.url, image.updatedAt) : null

              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="hp-product-card">
                  <div className="hp-product-thumb">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={image?.alt || product.name}
                        fill
                        className="hp-product-thumb-inner"
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                      />
                    ) : (
                      <div
                        className="hp-product-thumb-inner"
                        style={{ background: cardGradients[i % cardGradients.length] }}
                      />
                    )}
                  </div>
                  <div className="hp-product-body">
                    <h3 className="hp-product-name">{product.name}</h3>
                    <p className="hp-product-desc">{product.description}</p>
                    <span className="hp-product-more">Learn more</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────── ABOUT ─────────────── */}
      <section className="hp-about">
        <div className="hp-about-inner">
          <div className="hp-about-img" />

          <div className="hp-about-text">
            <p className="hp-section-label">About Us</p>
            <h2 className="hp-section-title">{about?.title || 'Over 20 Years of Expertise'}</h2>

            {about?.body1 && <p className="hp-about-body">{about.body1}</p>}
            {about?.body2 && <p className="hp-about-body">{about.body2}</p>}

            <div className="hp-about-stats">
              {[
                { value: about?.stat1Value || '20+', label: about?.stat1Label || 'Years in business' },
                { value: about?.stat2Value || '5000+', label: about?.stat2Label || 'Projects completed' },
                { value: about?.stat3Value || '12',   label: about?.stat3Label || 'Countries served' },
                { value: about?.stat4Value || '100%', label: about?.stat4Label || 'Client satisfaction' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="hp-about-stat-num">{s.value}</div>
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
            {cta?.text || 'Ready to get started?'}{' '}
            {cta?.highlight && <span>{cta.highlight}</span>}
          </p>
          <Link href={cta?.buttonHref || '/contact'} className="hp-btn hp-btn-orange">
            {cta?.buttonLabel || 'Contact Us'}
          </Link>
        </div>
      </section>
    </main>
  )
}
