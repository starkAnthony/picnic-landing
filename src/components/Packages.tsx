import { useServices } from '../hooks/useServices'
import { useI18n } from '../i18n/context'
import './Packages.css'

const BOOKING_SERVICE_KEY = 'booking-service'

export default function Packages() {
  const { t } = useI18n()
  const { services, loading } = useServices()

  function selectForBooking(serviceId: string) {
    try {
      sessionStorage.setItem(BOOKING_SERVICE_KEY, serviceId)
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="packages" id="packages">
      <div className="container">
        <span className="section-label">{t.packages.label}</span>
        <h2 className="section-title">{t.packages.title}</h2>
        <p className="section-subtitle">{t.packages.subtitle}</p>

        {loading ? (
          <p className="packages-loading">{t.packages.loading}</p>
        ) : (
          <div className="packages-grid">
            {services.map((pkg) => (
              <article
                key={pkg.id}
                className={`package-card ${pkg.is_popular ? 'popular' : ''}`}
              >
                {pkg.is_popular && (
                  <span className="package-badge">{t.packages.popularBadge}</span>
                )}
                <h3>{pkg.name}</h3>
                <p className="package-desc">{pkg.description}</p>
                <p className="package-price">
                  <span>{pkg.price_text || t.packages.priceOnRequest}</span>
                </p>
                <ul className="package-features">
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a
                  href="#book"
                  className={`btn ${pkg.is_popular ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => selectForBooking(pkg.id)}
                >
                  {t.packages.select}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export { BOOKING_SERVICE_KEY }
