import { useEffect, useState } from 'react'
import { useGallery } from '../hooks/useGallery'
import { useI18n } from '../i18n/context'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../site'
import './Gallery.css'

const PER_PAGE = 4

export default function Gallery() {
  const { t } = useI18n()
  const { items, loading } = useGallery()
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const safePage = Math.min(page, totalPages - 1)
  const visible = items.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE)
  const showNav = items.length > PER_PAGE

  useEffect(() => {
    setPage(0)
  }, [items.length])

  useEffect(() => {
    if (page > totalPages - 1) setPage(Math.max(0, totalPages - 1))
  }, [page, totalPages])

  function goPrev() {
    setPage((p) => (p <= 0 ? totalPages - 1 : p - 1))
  }

  function goNext() {
    setPage((p) => (p >= totalPages - 1 ? 0 : p + 1))
  }

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <span className="section-label">{t.gallery.label}</span>
        <h2 className="section-title">{t.gallery.title}</h2>
        <p className="section-subtitle">{t.gallery.subtitle}</p>

        {loading ? (
          <p className="gallery-loading">{t.gallery.loading}</p>
        ) : (
          <div className="gallery-carousel">
            <div className="gallery-grid" role="list">
              {visible.map((image) => (
                <a
                  key={image.id}
                  href={INSTAGRAM_URL}
                  className="gallery-item"
                  target="_blank"
                  rel="noopener noreferrer"
                  role="listitem"
                >
                  <img
                    src={image.image_url}
                    alt={image.alt || 'Sevinc Picnic'}
                    loading="lazy"
                  />
                </a>
              ))}
            </div>

            {showNav && (
              <div className="gallery-nav">
                <button type="button" className="gallery-nav-btn" onClick={goPrev} aria-label={t.gallery.prev}>
                  ←
                </button>
                <span className="gallery-nav-dots" aria-live="polite">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`gallery-nav-dot${i === safePage ? ' is-active' : ''}`}
                      aria-label={`${t.gallery.slide} ${i + 1}`}
                      aria-current={i === safePage ? 'true' : undefined}
                      onClick={() => setPage(i)}
                    />
                  ))}
                </span>
                <button type="button" className="gallery-nav-btn" onClick={goNext} aria-label={t.gallery.next}>
                  →
                </button>
              </div>
            )}
          </div>
        )}

        <a href={INSTAGRAM_URL} className="btn btn-outline gallery-cta" target="_blank" rel="noopener noreferrer">
          {t.gallery.viewMore} — {INSTAGRAM_HANDLE}
        </a>
      </div>
    </section>
  )
}
