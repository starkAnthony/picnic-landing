import { useSiteSettings } from '../context/SiteSettingsContext'
import { useI18n } from '../i18n/context'
import './Footer.css'

export default function Footer() {
  const { t } = useI18n()
  const site = useSiteSettings()

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
            <a href={`tel:${site.phoneTel}`}>{t.footer.phone}: {site.phoneDisplay}</a>
            <a href={site.telegramUrl} target="_blank" rel="noopener noreferrer">
              {t.footer.telegram} {site.telegramHandle}
            </a>
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              {t.footer.instagram} {site.instagramHandle}
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
