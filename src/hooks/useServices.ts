import { useEffect, useMemo, useState } from 'react'
import { staticServices } from '../data/services'
import { useI18n } from '../i18n/context'
import { localizeServices } from '../lib/localizeService'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Service, ServiceRecord } from '../types/content'

export function useServices() {
  const { locale } = useI18n()
  const [records, setRecords] = useState<ServiceRecord[] | null>(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setRecords(data as ServiceRecord[])
        } else {
          setRecords(null)
        }
        setLoading(false)
      })
  }, [])

  const fromCms = records !== null && records.length > 0

  const services: Service[] = useMemo(() => {
    if (fromCms && records) return localizeServices(records, locale)
    return staticServices
  }, [fromCms, records, locale])

  return { services, loading, usingCms: isSupabaseConfigured, fromCms }
}
