import { heroImage } from '../data/gallery'
import { useI18n } from '../i18n/context'
import './Hero.css'

export default function Hero() {
  const { t } = useI18n()

  return (
    <section className="hero" id="home">
      <div className="hero-bg" aria-hidden />
      <div className="container hero-grid">
        <div className="hero-content">
          <p className="hero-eyebrow">{t.hero.eyebrow}</p>
          <h1>
            {t.hero.title}
            <em>{t.hero.titleEmphasis}</em>
          </h1>
          <p className="hero-text">{t.hero.text}</p>
          <div className="hero-actions">
            <a href="#book" className="btn btn-primary">
              {t.hero.bookCta}
            </a>
            <a href="#packages" className="btn btn-outline">
              {t.hero.packagesCta}
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <strong>51+</strong>
              <span>{t.hero.statGuests}</span>
            </div>
            <div>
              <strong>1K+</strong>
              <span>{t.hero.statRating}</span>
            </div>
            <div>
              <strong>3</strong>
              <span>{t.hero.statLocations}</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card hero-card-main">
            <img
              className="hero-card-image"
              src={`${heroImage.src}?v=4`}
              alt={t.hero.imageAlt}
              width={1200}
              height={800}
              loading="eager"
            />
            <div className="hero-card-badge">{t.hero.cardBadge}</div>
            <p className="hero-card-title">{t.hero.cardTitle}</p>
            <p className="hero-card-price">{t.hero.cardPrice}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
