import Link from 'next/link'
import { MobileMenu } from './MobileMenu'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          Shade<span>Systems</span>
        </Link>

        <nav className="site-nav">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="site-nav-cta">
            Get a Quote
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  )
}
