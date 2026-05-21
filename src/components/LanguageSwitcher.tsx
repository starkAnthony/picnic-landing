import { useI18n } from '../i18n/context'
import { localeLabels, locales } from '../i18n/types'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          className={code === locale ? 'active' : ''}
          aria-pressed={code === locale}
          onClick={() => setLocale(code)}
        >
          {localeLabels[code]}
        </button>
      ))}
    </div>
  )
}
