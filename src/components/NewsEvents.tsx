import { usePosts } from '../hooks/usePosts'
import { useI18n } from '../i18n/context'
import './NewsEvents.css'

export default function NewsEvents() {
  const { t } = useI18n()
  const { posts, loading } = usePosts()

  if (!loading && posts.length === 0) return null

  return (
    <section className="news-events" id="news">
      <div className="container">
        <span className="section-label">{t.news.label}</span>
        <h2 className="section-title">{t.news.title}</h2>

        {loading ? (
          <p className="news-loading">{t.news.loading}</p>
        ) : (
          <div className="news-grid">
            {posts.map((post) => (
              <article key={post.id} className="news-card">
                {post.image_url && (
                  <img src={post.image_url} alt="" loading="lazy" className="news-card-image" />
                )}
                <div className="news-card-body">
                  <span className={`news-type news-type-${post.post_type}`}>
                    {post.post_type === 'event' ? t.news.event : t.news.news}
                  </span>
                  <h3>{post.title}</h3>
                  {post.event_date && post.post_type === 'event' && (
                    <time dateTime={post.event_date}>{post.event_date}</time>
                  )}
                  <p>{post.body}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
