import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/context'
import { faqHasLocale, localizeFaq } from '../lib/localizeTrust'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Faq, FaqRecord } from '../types/content'

export function useFaq() {
  const { locale, t } = useI18n()
  const [rows, setRows] = useState<FaqRecord[] | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('faq_items')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) setRows(data as FaqRecord[])
        else setRows(null)
        setLoading(false)
      })
  }, [])

  const fromCms = rows !== null && rows.length > 0

  const items: Faq[] = useMemo(() => {
    const staticItems = t.faq.items.map((item, index) => ({
      id: `static-${index}`,
      question: item.question,
      answer: item.answer,
      sort_order: index,
    }))

    if (fromCms && rows) {
      if (locale === 'uz' || faqHasLocale(rows, locale)) {
        return rows.map((row) => localizeFaq(row, locale))
      }
      return staticItems
    }

    return staticItems
  }, [fromCms, rows, locale, t.faq.items])

  return { items, loading, fromCms }
}
