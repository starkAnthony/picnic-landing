import { useI18n } from '../i18n/context'
import './Testimonials.css'

export default function Testimonials() {
  const { t } = useI18n()

  return (
    <section className="testimonials" id="reviews">
      <div className="container">
        <span className="section-label">{t.testimonials.label}</span>
        <h2 className="section-title">{t.testimonials.title}</h2>

        <div className="reviews-grid">
          {t.testimonials.items.map((review) => (
            <blockquote key={review.name} className="review-card">
              <div className="stars" aria-label={t.testimonials.starsLabel}>
                ★★★★★
              </div>
              <p>&ldquo;{review.quote}&rdquo;</p>
              <footer>
                <cite>{review.name}</cite>
                <span>{review.occasion}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
