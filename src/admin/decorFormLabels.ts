import type { Locale } from '../i18n/types'

export type DecorFormLabels = {
  name: string
  price: string
  pricePlaceholder: string
}

export const decorFormLabels: Record<Locale, DecorFormLabels> = {
  uz: {
    name: 'Bezak nomi',
    price: 'Narx (matn)',
    pricePlaceholder: '150 000 so‘m',
  },
  ru: {
    name: 'Название декора',
    price: 'Цена (текст)',
    pricePlaceholder: '150 000 сум',
  },
  en: {
    name: 'Decor name',
    price: 'Price (text)',
    pricePlaceholder: '150,000 UZS',
  },
}
