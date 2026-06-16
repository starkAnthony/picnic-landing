import { useI18n } from '../i18n/context'
import { useFaq } from '../hooks/useFaq'
import './FAQ.css'

export default function FAQ() {
  const { t } = useI18n()
  const { items } = useFaq()

  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq-header">
          <div>
            <span className="section-label">{t.faq.label}</span>
            <h2 className="section-title">{t.faq.title}</h2>
          </div>
          <p className="section-subtitle">{t.faq.subtitle}</p>
        </div>

        <div className="faq-list">
          {items.map((item) => (
            <details key={item.id} className="faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
