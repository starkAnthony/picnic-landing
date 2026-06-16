import type { Locale } from '../i18n/types'
import type { Service, ServiceRecord } from '../types/content'

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

function pickFeatures(
  locale: Locale,
  uz: string[] | null | undefined,
  ru: string[] | null | undefined,
  en: string[] | null | undefined,
  legacy?: string[] | null,
): string[] {
  const map = { uz, ru, en } as const
  const list = map[locale]
  if (list?.length) return list
  if (uz?.length) return uz
  if (ru?.length) return ru
  if (en?.length) return en
  return legacy ?? []
}

export function localizeService(row: ServiceRecord, locale: Locale): Service {
  return {
    id: row.id,
    name: pickText(locale, row.name_uz, row.name_ru, row.name_en, row.name),
    description: pickText(
      locale,
      row.description_uz,
      row.description_ru,
      row.description_en,
      row.description,
    ),
    price_text: pickText(
      locale,
      row.price_text_uz,
      row.price_text_ru,
      row.price_text_en,
      row.price_text,
    ),
    price_amount: row.price_amount,
    features: pickFeatures(
      locale,
      row.features_uz,
      row.features_ru,
      row.features_en,
      row.features,
    ),
    is_popular: row.is_popular,
    is_custom: row.is_custom ?? false,
    sort_order: row.sort_order,
  }
}

export function localizeServices(rows: ServiceRecord[], locale: Locale): Service[] {
  return rows.map((row) => localizeService(row, locale))
}
