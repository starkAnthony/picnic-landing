export type GalleryItem = {
  id: string
  image_url: string
  alt: string
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
