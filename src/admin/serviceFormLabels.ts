import type { Locale } from '../i18n/types'

export type ServiceFormLabels = {
  name: string
  desc: string
  price: string
  pricePlaceholder: string
  features: string
  featuresPlaceholder: string
}

export const serviceFormLabels: Record<Locale, ServiceFormLabels> = {
  uz: {
    name: 'Nomi',
    desc: 'Qisqa tavsif',
    price: 'Narx (matn)',
    pricePlaceholder: '1 500 000 so‘m / Kelishuv asosida',
    features: 'Imkoniyatlar (har qator — bitta punkt)',
    featuresPlaceholder: 'Piknik uslubida bezak\nJoylashtirish va yig‘ish',
  },
  ru: {
    name: 'Название',
    desc: 'Краткое описание',
    price: 'Цена (текст)',
    pricePlaceholder: '1 500 000 сум / По запросу',
    features: 'Возможности (каждая строка — пункт)',
    featuresPlaceholder: 'Оформление в стиле пикника\nУстановка и сбор',
  },
  en: {
    name: 'Name',
    desc: 'Short description',
    price: 'Price (text)',
    pricePlaceholder: '1,500,000 UZS / On request',
    features: 'Features (one item per line)',
    featuresPlaceholder: 'Picnic-style décor\nSetup and teardown',
  },
}
