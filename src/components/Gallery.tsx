import { galleryImages } from '../data/gallery'
import { useI18n } from '../i18n/context'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../site'
import './Gallery.css'

export default function Gallery() {
  const { t } = useI18n()

  return (
    <section className="gallery" id="gallery">
      <div className="container">
        <span className="section-label">{t.gallery.label}</span>
        <h2 className="section-title">{t.gallery.title}</h2>
        <p className="section-subtitle">{t.gallery.subtitle}</p>

        <div className="gallery-grid">
          {galleryImages.map((image) => (
            <a
              key={image.src}
              href={INSTAGRAM_URL}
              className="gallery-item"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`${image.src}?v=3`}
                alt={image.alt}
                loading="lazy"
                width={450}
                height={340}
              />
            </a>
          ))}
        </div>

        <a href={INSTAGRAM_URL} className="btn btn-outline gallery-cta" target="_blank" rel="noopener noreferrer">
          {t.gallery.viewMore} — {INSTAGRAM_HANDLE}
        </a>
      </div>
    </section>
  )
}
