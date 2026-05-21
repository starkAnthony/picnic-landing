import { useI18n } from '../i18n/context'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
} from '../site'
import './Footer.css'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a href="#" className="logo">
            <span className="logo-icon" aria-hidden>🧺</span>
            {t.brand}
          </a>
          <p>{t.footer.tagline}</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>{t.footer.explore}</h4>
            <a href="#packages">{t.nav.packages}</a>
            <a href="#news">{t.nav.news}</a>
            <a href="#gallery">{t.nav.gallery}</a>
            <a href="#how-it-works">{t.nav.howItWorks}</a>
            <a href="#reviews">{t.nav.reviews}</a>
          </div>
          <div>
            <h4>{t.footer.connect}</h4>
            <a href={`tel:${PHONE_TEL}`}>{t.footer.phone}: {PHONE_DISPLAY}</a>
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
              {t.footer.telegram} {TELEGRAM_HANDLE}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              {t.footer.instagram} {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} {t.brand}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
