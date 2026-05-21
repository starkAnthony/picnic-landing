import { useGallery } from '../hooks/useGallery'
import { useI18n } from '../i18n/context'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../site'
import './Gallery.css'

export default function Gallery() {
  const { t } = useI18n()
  const { items, loading } = useGallery()

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <span className="section-label">{t.gallery.label}</span>
        <h2 className="section-title">{t.gallery.title}</h2>
        <p className="section-subtitle">{t.gallery.subtitle}</p>

        {loading ? (
          <p className="gallery-loading">{t.gallery.loading}</p>
        ) : (
          <div className="gallery-grid">
            {items.map((image) => (
              <a
                key={image.id}
                href={INSTAGRAM_URL}
                className="gallery-item"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={image.image_url}
                  alt={image.alt || 'Sevinc Picnic'}
                  loading="lazy"
                  width={450}
                  height={340}
                />
              </a>
            ))}
          </div>
        )}

        <a href={INSTAGRAM_URL} className="btn btn-outline gallery-cta" target="_blank" rel="noopener noreferrer">
          {t.gallery.viewMore} — {INSTAGRAM_HANDLE}
        </a>
      </div>
    </section>
  )
}
