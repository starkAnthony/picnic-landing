import { useEffect, useMemo, useState } from 'react'
import { useI18n } from '../i18n/context'
import { localizeDecor } from '../lib/localizeDecor'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type { Decor, DecorRecord } from '../types/content'

type DecorRow = DecorRecord & {
  service_decors?: { service_id: string }[] | null
}

export function useDecors() {
  const { locale } = useI18n()
  const [rows, setRows] = useState<DecorRow[] | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('decors')
      .select('*, service_decors(service_id)')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setRows(data as DecorRow[])
        } else {
          setRows(null)
        }
        setLoading(false)
      })
  }, [])

  const fromCms = rows !== null && rows.length > 0

  const decors: Decor[] = useMemo(() => {
    if (!fromCms || !rows) return []
    return rows.map((row) => {
      const serviceIds = (row.service_decors ?? []).map((l) => l.service_id)
      return localizeDecor(row, locale, serviceIds)
    })
  }, [fromCms, rows, locale])

  return { decors, loading, fromCms }
}
