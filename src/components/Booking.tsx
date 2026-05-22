import { useCallback, useEffect, useState, type FormEvent } from 'react'
import {
  BOOKING_SERVICE_EVENT,
  readPendingBookingService,
} from '../lib/bookingSelection'
import { useServices } from '../hooks/useServices'
import { useI18n } from '../i18n/context'
import { buildBookingMessage } from '../lib/bookingMessage'
import { sendBookingToTelegram, type TelegramSendResult } from '../lib/bookingTelegram'
import { useSiteSettings } from '../context/SiteSettingsContext'
import './Booking.css'

export default function Booking() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const { t } = useI18n()
  const site = useSiteSettings()
  const { services, fromCms } = useServices()

  const packageOptions = fromCms
    ? services.map((s) => ({
        value: s.id,
        label: s.price_text ? `${s.name} — ${s.price_text}` : s.name,
      }))
    : t.booking.packageOptions

  const applyPendingService = useCallback(() => {
    const ids = packageOptions.map((o) => o.value)
    const saved = readPendingBookingService(ids)
    if (saved) setSelectedService(saved)
  }, [packageOptions])

  useEffect(() => {
    applyPendingService()
    window.addEventListener(BOOKING_SERVICE_EVENT, applyPendingService)
    return () => window.removeEventListener(BOOKING_SERVICE_EVENT, applyPendingService)
  }, [applyPendingService])

  function errorMessage(result: TelegramSendResult): string {
    if (result.ok) return ''
    if (result.reason === 'not_configured') return t.booking.errorNotConfigured
    if (result.reason === 'no_api') return t.booking.errorNoApi
    if (result.reason === 'network') return t.booking.errorNetwork
    if (result.reason === 'telegram') {
      const d = result.description?.toLowerCase() ?? ''
      if (d.includes('chat not found')) return t.booking.errorChatNotFound
      if (d.includes('upgraded to a supergroup')) return t.booking.errorGroupUpgraded
      if (d.includes('unauthorized')) return t.booking.errorBadToken
      return `${t.booking.errorFailed} (${result.description})`
    }
    return t.booking.errorFailed
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const form = e.currentTarget
    const message = buildBookingMessage(form, t)
    const result = await sendBookingToTelegram(message)

    if (result.ok) {
      setSubmitted(true)
      setSubmitting(false)
      return
    }

    setError(errorMessage(result))
    setSubmitting(false)
  }

  return (
    <section className="booking" id="book">
      <div className="container booking-grid">
        <div className="booking-info">
          <span className="section-label">{t.booking.label}</span>
          <h2 className="section-title">{t.booking.title}</h2>
          <p className="section-subtitle">{t.booking.subtitle}</p>
          <div className="booking-contacts">
            <a href={`tel:${site.phoneTel}`} className="booking-contact">
              {site.phoneDisplay}
            </a>
            <a href={site.telegramUrl} className="booking-contact" target="_blank" rel="noopener noreferrer">
              Telegram {site.telegramHandle}
            </a>
            <a
              href={site.instagramUrl}
              className="booking-contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.booking.viewInstagram} — {site.instagramHandle}
            </a>
          </div>
          <ul className="booking-perks">
            {t.booking.perks.map((perk) => (
              <li key={perk}>{perk}</li>
            ))}
          </ul>
        </div>

        <div className="booking-form-wrap">
          {submitted ? (
            <div className="booking-success">
              <span aria-hidden>🌿</span>
              <h3>{t.booking.successTitle}</h3>
              <p>{t.booking.successText}</p>
            </div>
          ) : (
            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  {t.booking.name}
                  <input type="text" name="name" required placeholder={t.booking.namePlaceholder} />
                </label>
                <label>
                  {t.booking.email}
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder={t.booking.emailPlaceholder}
                  />
                </label>
              </div>
              <label>
                {t.booking.package}
                <select
                  name="package"
                  required
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="" disabled>
                    {t.booking.packagePlaceholder}
                  </option>
                  {packageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-row">
                <label>
                  {t.booking.date}
                  <input type="date" name="date" required />
                </label>
                <label>
                  {t.booking.guests}
                  <input type="number" name="guests" min={1} required />
                </label>
              </div>
              <label>
                {t.booking.notes}
                <textarea
                  name="notes"
                  rows={3}
                  placeholder={t.booking.notesPlaceholder}
                />
              </label>
              {error && <p className="booking-error">{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t.booking.submitting : t.booking.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
