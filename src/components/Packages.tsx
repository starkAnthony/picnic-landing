import { useServices } from '../hooks/useServices'
import { useI18n } from '../i18n/context'
import { scrollToBooking, setBookingService } from '../lib/bookingSelection'
import './Packages.css'

export default function Packages() {
  const { t } = useI18n()
  const { services, loading } = useServices()

  function requestService(serviceId: string) {
    setBookingService(serviceId)
    scrollToBooking()
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
                className={`package-card${pkg.is_popular ? ' popular' : ''}${pkg.is_custom ? ' custom' : ''}`}
              >
                {pkg.is_popular && (
                  <span className="package-badge">{t.packages.popularBadge}</span>
                )}
                {pkg.is_custom && !pkg.is_popular && (
                  <span className="package-badge package-badge--custom">{t.packages.customBadge}</span>
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
                <button
                  type="button"
                  className={`btn ${pkg.is_popular ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => requestService(pkg.id)}
                >
                  {t.packages.select}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
