'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <button
        className="site-hamburger"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={`site-hamburger-bar ${open ? 'open' : ''}`} />
        <span className={`site-hamburger-bar ${open ? 'open' : ''}`} />
        <span className={`site-hamburger-bar ${open ? 'open' : ''}`} />
      </button>

      {open && <div className="site-mobile-overlay" onClick={() => setOpen(false)} />}

      <nav className={`site-mobile-nav ${open ? 'site-mobile-nav--open' : ''}`} aria-hidden={!open}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="site-mobile-nav-link">
            {link.label}
          </Link>
        ))}
        <Link href="/contact" className="site-mobile-nav-cta">
          Get a Quote
        </Link>
      </nav>
    </>
  )
}
