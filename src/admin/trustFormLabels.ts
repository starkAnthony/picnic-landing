import type { Locale } from '../i18n/types'

export type TestimonialFormLabels = {
  quote: string
  occasion: string
  occasionPlaceholder: string
}

export type FaqFormLabels = {
  question: string
  answer: string
}

export const testimonialFormLabels: Record<Locale, TestimonialFormLabels> = {
  uz: {
    quote: 'Sharh',
    occasion: 'Tadbir turi',
    occasionPlaceholder: 'Tug‘ilgan kun, taklif...',
  },
  ru: {
    quote: 'Отзыв',
    occasion: 'Повод',
    occasionPlaceholder: 'День рождения, предложение...',
  },
  en: {
    quote: 'Review',
    occasion: 'Occasion',
    occasionPlaceholder: 'Birthday, proposal...',
  },
}

export const faqFormLabels: Record<Locale, FaqFormLabels> = {
  uz: {
    question: 'Savol',
    answer: 'Javob',
  },
  ru: {
    question: 'Вопрос',
    answer: 'Ответ',
  },
  en: {
    question: 'Question',
    answer: 'Answer',
  },
}
