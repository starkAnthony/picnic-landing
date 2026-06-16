import { useState } from 'react'
import { useI18n } from '../i18n/context'
import LanguageSwitcher from './LanguageSwitcher'
import './Navbar.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  const links = [
    { href: '#packages', label: t.nav.packages },
    { href: '#news', label: t.nav.news },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#how-it-works', label: t.nav.howItWorks },
    { href: '#reviews', label: t.nav.reviews },
    { href: '#faq', label: t.nav.faq },
    { href: '#book', label: t.nav.book },
  ]

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#" className="logo">
          <span className="logo-icon" aria-hidden>🧺</span>
          {t.brand}
        </a>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className="nav-lang">
            <LanguageSwitcher />
          </div>
          <a href="#book" className="btn btn-primary nav-cta" onClick={() => setOpen(false)}>
            {t.nav.reserve}
          </a>
        </nav>

        <div className="navbar-actions">
          <LanguageSwitcher />
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
