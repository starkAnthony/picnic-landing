import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { I18nProvider } from './i18n/context'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <SiteSettingsProvider>
        <App />
      </SiteSettingsProvider>
    </I18nProvider>
  </StrictMode>,
)
