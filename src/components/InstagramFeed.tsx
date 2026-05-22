import { useInstagramFeed } from '../hooks/useInstagramFeed'
import { useI18n } from '../i18n/context'
import { useSiteSettings } from '../context/SiteSettingsContext'
import './InstagramFeed.css'

export default function InstagramFeed() {
  const { t } = useI18n()
  const site = useSiteSettings()
  const { items, loading, configured } = useInstagramFeed()

  return (
    <section className="instagram-feed" id="instagram">
      <div className="container">
        <span className="section-label">Instagram</span>
        <h2 className="section-title">{t.instagram.title}</h2>
        <p className="section-subtitle">{t.instagram.subtitle}</p>

        {loading && <p className="instagram-loading">{t.instagram.loading}</p>}

        {!loading && configured && items.length > 0 && (
          <div className="instagram-grid">
            {items.map((item) => {
              const src =
                item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url
              if (!src) return null
              return (
                <a
                  key={item.id}
                  href={item.permalink}
                  className="instagram-item"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={src} alt={item.caption?.slice(0, 80) ?? 'Instagram'} loading="lazy" />
                </a>
              )
            })}
          </div>
        )}

        {!loading && !configured && (
          <p className="instagram-fallback">
            {t.instagram.notConnected}{' '}
            <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
              {site.instagramHandle}
            </a>
          </p>
        )}

        <a href={site.instagramUrl} className="btn btn-outline instagram-cta" target="_blank" rel="noopener noreferrer">
          {t.instagram.viewMore} — {site.instagramHandle}
        </a>
      </div>
    </section>
  )
}
