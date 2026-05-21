import { useI18n } from '../i18n/context'
import './Packages.css'

export default function Packages() {
  const { t } = useI18n()

  return (
    <section className="packages" id="packages">
      <div className="container">
        <span className="section-label">{t.packages.label}</span>
        <h2 className="section-title">{t.packages.title}</h2>
        <p className="section-subtitle">{t.packages.subtitle}</p>

        <div className="packages-grid">
          {t.packages.items.map((pkg) => (
            <article key={pkg.name} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <span className="package-badge">{t.packages.popularBadge}</span>}
              <h3>{pkg.name}</h3>
              <p className="package-desc">{pkg.description}</p>
              <p className="package-price">
                <span>{t.packages.priceOnRequest}</span>
              </p>
              <ul className="package-features">
                {pkg.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a href="#book" className={`btn ${pkg.popular ? 'btn-primary' : 'btn-outline'}`}>
                {t.packages.select}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
