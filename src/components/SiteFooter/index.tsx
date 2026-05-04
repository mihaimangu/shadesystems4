import Link from 'next/link'

const productLinks = [
  { label: 'Pergolas', href: '/products/pergolas' },
  { label: 'Awnings', href: '/products/awnings' },
  { label: 'Roller Screens', href: '/products/roller-screens' },
  { label: 'Zip Blinds', href: '/products/zip-blinds' },
  { label: 'Louvre Roofs', href: '/products/louvre-roofs' },
  { label: 'Glass Rooms', href: '/products/glass-rooms' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'News', href: '/posts' },
  { label: 'Contact', href: '/contact' },
]

const linkStyle: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.85rem',
  color: 'rgba(255,255,255,0.6)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '0.6rem',
  transition: 'color 0.15s',
}

const headingStyle: React.CSSProperties = {
  fontFamily: 'system-ui, sans-serif',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#e8601a',
  marginBottom: '1.25rem',
}

export function SiteFooter() {
  return (
    <footer style={{ background: '#111c27', color: '#fff' }}>
      {/* Main footer */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 2rem',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
          gap: '3rem',
        }}
      >
        {/* Brand column */}
        <div>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              Shade<span style={{ color: '#e8601a' }}>Systems</span>
            </span>
          </Link>
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.7,
              marginTop: '1rem',
              maxWidth: '280px',
            }}
          >
            Premium outdoor shade solutions for residential and commercial projects.
            Designed to last, built to impress.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <a href="tel:+34647101244" style={{ ...linkStyle, color: 'rgba(255,255,255,0.65)' }}>
              +34 647 101 244
            </a>
            <a href="mailto:contact@shadesystems.eu" style={{ ...linkStyle, color: 'rgba(255,255,255,0.65)' }}>
              contact@shadesystems.eu
            </a>
          </div>
        </div>

        {/* Products column */}
        <div>
          <p style={headingStyle}>Products</p>
          {productLinks.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Company column */}
        <div>
          <p style={headingStyle}>Company</p>
          {companyLinks.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact / address column */}
        <div>
          <p style={headingStyle}>Find Us</p>
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75,
            }}
          >
            Calle Orfebres 10<br />
            Mijas, Málaga 29649<br />
            España<br />
            Mon – Fri: 08:00 – 17:00
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1.25rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            © {new Date().getFullYear()} Shade Systems. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Use'].map((t) => (
              <Link
                key={t}
                href="#"
                style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.35)',
                  textDecoration: 'none',
                }}
              >
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
