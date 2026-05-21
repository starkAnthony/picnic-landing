import { useEffect, useState } from 'react'
import { galleryImages as staticGallery, heroImage as staticHero } from '../data/gallery'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { GalleryItem } from '../types/content'

const staticItems: GalleryItem[] = staticGallery.map((g, i) => ({
  id: g.src,
  image_url: g.src,
  alt: g.alt,
  sort_order: i,
}))

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>(staticItems)
  const [heroSrc, setHeroSrc] = useState(staticHero.src)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase
      .from('gallery_items')
      .select('id, image_url, alt, sort_order')
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data?.length) {
          setItems(data as GalleryItem[])
        }
        setLoading(false)
      })
  }, [])

  return { items, heroSrc, setHeroSrc, loading, usingCms: isSupabaseConfigured }
}
