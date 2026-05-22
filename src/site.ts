/** Default contact info when Supabase settings are not loaded yet */
export const DEFAULT_PHONE_DISPLAY = '+998 99 442 60 30'
export const DEFAULT_TELEGRAM_USERNAME = 'tony_not'
export const DEFAULT_INSTAGRAM_HANDLE = 'sevinc_picnic'
export const DEFAULT_INSTAGRAM_URL =
  'https://www.instagram.com/sevinc_picnic?igsh=MTRuZmF2aXc0d2V4dA=='

/** @deprecated Use useSiteSettings() — kept for backwards compatibility */
export const INSTAGRAM_URL = DEFAULT_INSTAGRAM_URL
export const INSTAGRAM_HANDLE = '@sevinc_picnic'
export const PHONE_DISPLAY = DEFAULT_PHONE_DISPLAY
export const PHONE_TEL = phoneToTel(DEFAULT_PHONE_DISPLAY)
export const TELEGRAM_USERNAME = DEFAULT_TELEGRAM_USERNAME
export const TELEGRAM_HANDLE = `@${DEFAULT_TELEGRAM_USERNAME}`
export const TELEGRAM_URL = `https://t.me/${DEFAULT_TELEGRAM_USERNAME}`

export function phoneToTel(display: string): string {
  const digits = display.replace(/\D/g, '')
  return digits ? `+${digits}` : ''
}

export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@/, '')
}

export function telegramHandle(username: string): string {
  const u = normalizeUsername(username)
  return u ? `@${u}` : ''
}

export function telegramUrl(username: string): string {
  const u = normalizeUsername(username)
  return u ? `https://t.me/${u}` : ''
}

export function instagramHandle(handle: string): string {
  const h = normalizeUsername(handle)
  return h ? `@${h}` : ''
}

export function instagramUrl(handle: string, customUrl?: string | null): string {
  const trimmed = customUrl?.trim()
  if (trimmed) return trimmed
  const h = normalizeUsername(handle)
  return h ? `https://www.instagram.com/${h}` : DEFAULT_INSTAGRAM_URL
}
