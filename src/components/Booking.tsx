import { useState, type FormEvent } from 'react'
import { useI18n } from '../i18n/context'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_TEL } from '../site'
import './Booking.css'

export default function Booking() {
  const [submitted, setSubmitted] = useState(false)
  const { t } = useI18n()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="booking" id="book">
      <div className="container booking-grid">
        <div className="booking-info">
          <span className="section-label">{t.booking.label}</span>
          <h2 className="section-title">{t.booking.title}</h2>
          <p className="section-subtitle">{t.booking.subtitle}</p>
          <div className="booking-contacts">
            <a href={`tel:${PHONE_TEL}`} className="booking-contact">
              {PHONE_DISPLAY}
            </a>
            <a
              href={INSTAGRAM_URL}
              className="booking-contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.booking.viewInstagram} — {INSTAGRAM_HANDLE}
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
                <select name="package" required defaultValue="">
                  <option value="" disabled>
                    {t.booking.packagePlaceholder}
                  </option>
                  {t.booking.packageOptions.map((opt) => (
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
                  <input type="number" name="guests" min={2} max={12} defaultValue={2} required />
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
              <button type="submit" className="btn btn-primary">
                {t.booking.submit}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
