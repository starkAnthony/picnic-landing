import { useEffect, useState } from 'react'
import type { InstagramMedia } from '../types/content'

export function useInstagramFeed() {
  const [items, setItems] = useState<InstagramMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)

  useEffect(() => {
    fetch('/api/instagram-feed')
      .then(async (res) => {
        const data = await res.json()
        if (data.configured && data.items) {
          setConfigured(true)
          setItems(data.items)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return { items, loading, configured }
}
