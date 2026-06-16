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
  is_custom: boolean
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
  is_custom: boolean
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

export type Decor = {
  id: string
  name: string
  price_text: string
  image_url: string
  sort_order: number
  /** Empty = available for all services */
  serviceIds: string[]
}

export type DecorRecord = {
  id: string
  image_url: string
  name_uz: string
  name_ru?: string | null
  name_en?: string | null
  price_text?: string | null
  price_text_uz?: string | null
  price_text_ru?: string | null
  price_text_en?: string | null
  sort_order: number
  published: boolean
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

export type Testimonial = {
  id: string
  name: string
  quote: string
  occasion: string
  image_url: string | null
  sort_order: number
}

export type TestimonialRecord = {
  id: string
  name: string
  quote_uz: string
  quote_ru?: string | null
  quote_en?: string | null
  occasion_uz: string
  occasion_ru?: string | null
  occasion_en?: string | null
  image_url: string | null
  sort_order: number
  published: boolean
}

export type Faq = {
  id: string
  question: string
  answer: string
  sort_order: number
}

export type FaqRecord = {
  id: string
  question_uz: string
  question_ru?: string | null
  question_en?: string | null
  answer_uz: string
  answer_ru?: string | null
  answer_en?: string | null
  sort_order: number
  published: boolean
}
