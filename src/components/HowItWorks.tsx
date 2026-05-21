import { useI18n } from '../i18n/context'
import './HowItWorks.css'

const stepNumbers = ['01', '02', '03']

export default function HowItWorks() {
  const { t } = useI18n()

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="how-header">
          <div>
            <span className="section-label">{t.howItWorks.label}</span>
            <h2 className="section-title">{t.howItWorks.title}</h2>
          </div>
          <p className="section-subtitle">{t.howItWorks.subtitle}</p>
        </div>

        <ol className="steps-grid">
          {t.howItWorks.steps.map((item, index) => (
            <li key={stepNumbers[index]} className="step-card">
              <span className="step-number">{stepNumbers[index]}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
