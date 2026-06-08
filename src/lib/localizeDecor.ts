import type { Locale } from '../i18n/types'
import type { Decor, DecorRecord } from '../types/content'

function pickName(
  locale: Locale,
  uz: string | null | undefined,
  ru: string | null | undefined,
  en: string | null | undefined,
): string {
  const map = { uz, ru, en } as const
  return (map[locale]?.trim() || uz?.trim() || ru?.trim() || en?.trim() || '')
}

export function localizeDecor(
  row: DecorRecord,
  locale: Locale,
  serviceIds: string[],
): Decor {
  return {
    id: row.id,
    name: pickName(locale, row.name_uz, row.name_ru, row.name_en),
    image_url: row.image_url,
    sort_order: row.sort_order,
    serviceIds,
  }
}

export function decorsForService(decors: Decor[], serviceId: string): Decor[] {
  if (!serviceId) return []
  return decors.filter(
    (d) => d.serviceIds.length === 0 || d.serviceIds.includes(serviceId),
  )
}
