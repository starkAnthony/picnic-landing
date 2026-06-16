import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/context'
import { localizeTestimonial } from '../lib/localizeTrust'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Testimonial, TestimonialRecord } from '../types/content'

export function useTestimonials() {
  const { locale, t } = useI18n()
  const [rows, setRows] = useState<TestimonialRecord[] | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('testimonials')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) setRows(data as TestimonialRecord[])
        else setRows(null)
        setLoading(false)
      })
  }, [])

  const fromCms = rows !== null && rows.length > 0

  const items: Testimonial[] = useMemo(() => {
    if (fromCms && rows) return rows.map((row) => localizeTestimonial(row, locale))
    return t.testimonials.items.map((item, index) => ({
      id: `static-${index}`,
      name: item.name,
      quote: item.quote,
      occasion: item.occasion,
      image_url: null,
      sort_order: index,
    }))
  }, [fromCms, rows, locale, t.testimonials.items])

  return { items, loading, fromCms }
}
