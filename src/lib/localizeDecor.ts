import type { Locale } from '../i18n/types'
import type { Decor, DecorRecord } from '../types/content'

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

export function localizeDecor(
  row: DecorRecord,
  locale: Locale,
  serviceIds: string[],
): Decor {
  return {
    id: row.id,
    name: pickText(locale, row.name_uz, row.name_ru, row.name_en),
    price_text: pickText(
      locale,
      row.price_text_uz,
      row.price_text_ru,
      row.price_text_en,
      row.price_text,
    ),
    image_url: row.image_url,
    sort_order: row.sort_order,
    serviceIds,
  }
}

export function formatDecorLabel(decor: Decor, priceOnRequest: string): string {
  const price = decor.price_text.trim() || priceOnRequest
  return `${decor.name} — ${price}`
}

export function decorsForService(decors: Decor[], serviceId: string): Decor[] {
  if (!serviceId) return []
  return decors.filter(
    (d) => d.serviceIds.length === 0 || d.serviceIds.includes(serviceId),
  )
}
