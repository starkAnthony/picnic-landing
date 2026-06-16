import type { Locale } from '../i18n/types'
import type { Faq, FaqRecord, Testimonial, TestimonialRecord } from '../types/content'

function pickText(
  locale: Locale,
  uz: string | null | undefined,
  ru: string | null | undefined,
  en: string | null | undefined,
  legacy?: string | null,
): string {
  const map = { uz, ru, en } as const
  return (map[locale]?.trim() || uz?.trim() || ru?.trim() || en?.trim() || legacy?.trim() || '')
}

export function testimonialHasLocale(rows: TestimonialRecord[], locale: Locale): boolean {
  if (locale === 'uz') return true
  return rows.some((row) => {
    if (locale === 'ru') {
      return !!(row.quote_ru?.trim() || row.occasion_ru?.trim())
    }
    return !!(row.quote_en?.trim() || row.occasion_en?.trim())
  })
}

export function faqHasLocale(rows: FaqRecord[], locale: Locale): boolean {
  if (locale === 'uz') return true
  return rows.some((row) => {
    if (locale === 'ru') {
      return !!(row.question_ru?.trim() || row.answer_ru?.trim())
    }
    return !!(row.question_en?.trim() || row.answer_en?.trim())
  })
}

export function localizeTestimonial(row: TestimonialRecord, locale: Locale): Testimonial {
  return {
    id: row.id,
    name: row.name,
    quote: pickText(locale, row.quote_uz, row.quote_ru, row.quote_en),
    occasion: pickText(locale, row.occasion_uz, row.occasion_ru, row.occasion_en),
    image_url: row.image_url,
    sort_order: row.sort_order,
  }
}

export function localizeFaq(row: FaqRecord, locale: Locale): Faq {
  return {
    id: row.id,
    question: pickText(locale, row.question_uz, row.question_ru, row.question_en),
    answer: pickText(locale, row.answer_uz, row.answer_ru, row.answer_en),
    sort_order: row.sort_order,
  }
}
