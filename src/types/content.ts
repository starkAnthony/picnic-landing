export type GalleryItem = {
  id: string
  image_url: string
  alt: string
  sort_order: number
}

export type Service = {
  id: string
  name: string
  description: string
  price_text: string
  price_amount: number | null
  features: string[]
  is_popular: boolean
  sort_order: number
}

/** Raw row from Supabase (all locales) */
export type ServiceRecord = {
  id: string
  name?: string | null
  description?: string | null
  price_text?: string | null
  price_amount: number | null
  features?: string[] | null
  name_uz?: string | null
  name_ru?: string | null
  name_en?: string | null
  description_uz?: string | null
  description_ru?: string | null
  description_en?: string | null
  price_text_uz?: string | null
  price_text_ru?: string | null
  price_text_en?: string | null
  features_uz?: string[] | null
  features_ru?: string[] | null
  features_en?: string[] | null
  is_popular: boolean
  sort_order: number
}

export type Post = {
  id: string
  title: string
  body: string
  image_url: string | null
  post_type: 'news' | 'event'
  event_date: string | null
  created_at: string
}

export type InstagramMedia = {
  id: string
  caption?: string
  media_type: string
  media_url?: string
  thumbnail_url?: string
  permalink: string
  timestamp?: string
}
