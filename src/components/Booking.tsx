import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  BOOKING_SERVICE_EVENT,
  readPendingBookingService,
} from '../lib/bookingSelection'
import { useDecors } from '../hooks/useDecors'
import { useServices } from '../hooks/useServices'
import { decorsForService } from '../lib/localizeDecor'
import { useI18n } from '../i18n/context'
import { buildBookingMessage } from '../lib/bookingMessage'
import { sendBookingToTelegram, type TelegramSendResult } from '../lib/bookingTelegram'
import { useSiteSettings } from '../context/SiteSettingsContext'
import type { Decor } from '../types/content'
import './Booking.css'

export default function Booking() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedService, setSelectedService] = useState('')
  const [selectedDecors, setSelectedDecors] = useState<string[]>([])
  const [previewDecor, setPreviewDecor] = useState<Decor | null>(null)
  const { t } = useI18n()
  const site = useSiteSettings()
  const { services, fromCms } = useServices()
  const { decors, fromCms: decorsFromCms } = useDecors()

  const availableDecors = useMemo(
    () => (decorsFromCms && selectedService ? decorsForService(decors, selectedService) : []),
    [decors, decorsFromCms, selectedService],
  )

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

  useEffect(() => {
    setSelectedDecors((prev) => prev.filter((id) => availableDecors.some((d) => d.id === id)))
  }, [availableDecors])

  useEffect(() => {
    if (!previewDecor) return
    if (!availableDecors.some((d) => d.id === previewDecor.id)) {
      setPreviewDecor(null)
      return
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setPreviewDecor(null)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [previewDecor, availableDecors])

  function toggleDecor(id: string) {
    setSelectedDecors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

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
    const decorNames = availableDecors
      .filter((d) => selectedDecors.includes(d.id))
      .map((d) => d.name)
    const message = buildBookingMessage(form, t, { decorNames })
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

              {availableDecors.length > 0 && (
                <fieldset className="booking-decors">
                  <legend>{t.booking.decorsLabel}</legend>
                  <p className="booking-decors-hint">{t.booking.decorsHint}</p>
                  <div className="booking-decor-grid">
                    {availableDecors.map((decor) => {
                      const selected = selectedDecors.includes(decor.id)
                      return (
                        <div
                          key={decor.id}
                          className={`booking-decor-card${selected ? ' is-selected' : ''}`}
                        >
                          <button
                            type="button"
                            className="booking-decor-card__media"
                            aria-label={`${t.booking.decorViewLarge}: ${decor.name}`}
                            onClick={() => setPreviewDecor(decor)}
                          >
                            <img
                              src={decor.image_url}
                              alt=""
                              loading="lazy"
                            />
                            <span className="booking-decor-card__zoom" aria-hidden>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="booking-decor-card__toggle"
                            aria-pressed={selected}
                            onClick={() => toggleDecor(decor.id)}
                          >
                            <span className="booking-decor-card__check" aria-hidden />
                            <span className="booking-decor-card__name">{decor.name}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              {previewDecor && (
                <div
                  className="booking-decor-lightbox"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="booking-decor-preview-title"
                >
                  <button
                    type="button"
                    className="booking-decor-lightbox__backdrop"
                    onClick={() => setPreviewDecor(null)}
                    aria-label={t.booking.decorPreviewClose}
                  />
                  <div className="booking-decor-lightbox__panel">
                    <button
                      type="button"
                      className="booking-decor-lightbox__close"
                      onClick={() => setPreviewDecor(null)}
                      aria-label={t.booking.decorPreviewClose}
                    >
                      ×
                    </button>
                    <div className="booking-decor-lightbox__image-wrap">
                      <img src={previewDecor.image_url} alt={previewDecor.name} />
                    </div>
                    <h3 id="booking-decor-preview-title" className="booking-decor-lightbox__title">
                      {previewDecor.name}
                    </h3>
                    <button
                      type="button"
                      className={`btn ${selectedDecors.includes(previewDecor.id) ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => toggleDecor(previewDecor.id)}
                    >
                      {selectedDecors.includes(previewDecor.id)
                        ? t.booking.decorPreviewSelected
                        : t.booking.decorPreviewSelect}
                    </button>
                  </div>
                </div>
              )}

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
