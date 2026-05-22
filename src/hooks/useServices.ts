import { useEffect, useState } from 'react'
import { staticServices } from '../data/services'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Service } from '../types/content'

export function useServices() {
  const [services, setServices] = useState<Service[]>(staticServices)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [fromCms, setFromCms] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('services')
      .select('id, name, description, price_text, price_amount, features, is_popular, sort_order')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setServices(data as Service[])
          setFromCms(true)
        } else {
          setServices(staticServices)
          setFromCms(false)
        }
        setLoading(false)
      })
  }, [])

  return { services, loading, usingCms: isSupabaseConfigured, fromCms }
}
