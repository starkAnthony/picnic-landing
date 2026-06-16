import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { heroImage as staticHero } from '../data/gallery'
import {
  DEFAULT_HERO_IMAGE_URL,
  DEFAULT_INSTAGRAM_HANDLE,
  DEFAULT_INSTAGRAM_URL,
  DEFAULT_PHONE_DISPLAY,
  DEFAULT_TELEGRAM_USERNAME,
  instagramHandle,
  instagramUrl,
  phoneToTel,
  telegramHandle,
  telegramUrl,
} from '../site'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export type SiteSettings = {
  phoneDisplay: string
  phoneTel: string
  telegramUsername: string
  telegramHandle: string
  telegramUrl: string
  instagramHandle: string
  instagramUrl: string
  heroImageUrl: string
  howStep1ImageUrl: string | null
  howStep2ImageUrl: string | null
  howStep3ImageUrl: string | null
}

const defaults: SiteSettings = {
  phoneDisplay: DEFAULT_PHONE_DISPLAY,
  phoneTel: phoneToTel(DEFAULT_PHONE_DISPLAY),
  telegramUsername: DEFAULT_TELEGRAM_USERNAME,
  telegramHandle: telegramHandle(DEFAULT_TELEGRAM_USERNAME),
  telegramUrl: telegramUrl(DEFAULT_TELEGRAM_USERNAME),
  instagramHandle: instagramHandle(DEFAULT_INSTAGRAM_HANDLE),
  instagramUrl: DEFAULT_INSTAGRAM_URL,
  heroImageUrl: staticHero.src || DEFAULT_HERO_IMAGE_URL,
  howStep1ImageUrl: null,
  howStep2ImageUrl: null,
  howStep3ImageUrl: null,
}

type SiteSettingsRow = {
  phone_display: string
  telegram_username: string
  instagram_handle: string
  instagram_url: string | null
  hero_image_url: string | null
  how_step_1_image_url: string | null
  how_step_2_image_url: string | null
  how_step_3_image_url: string | null
}

function rowToSettings(row: SiteSettingsRow): SiteSettings {
  const tgUser = row.telegram_username.trim() || DEFAULT_TELEGRAM_USERNAME
  const igHandle = row.instagram_handle.trim() || DEFAULT_INSTAGRAM_HANDLE
  const phone = row.phone_display.trim() || DEFAULT_PHONE_DISPLAY
  const hero = row.hero_image_url?.trim() || DEFAULT_HERO_IMAGE_URL

  return {
    phoneDisplay: phone,
    phoneTel: phoneToTel(phone),
    telegramUsername: tgUser.replace(/^@/, ''),
    telegramHandle: telegramHandle(tgUser),
    telegramUrl: telegramUrl(tgUser),
    instagramHandle: instagramHandle(igHandle),
    instagramUrl: instagramUrl(igHandle, row.instagram_url),
    heroImageUrl: hero,
    howStep1ImageUrl: row.how_step_1_image_url?.trim() || null,
    howStep2ImageUrl: row.how_step_2_image_url?.trim() || null,
    howStep3ImageUrl: row.how_step_3_image_url?.trim() || null,
  }
}

const SiteSettingsContext = createContext<SiteSettings>(defaults)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaults)

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('site_settings')
      .select(
        'phone_display, telegram_username, instagram_handle, instagram_url, hero_image_url, how_step_1_image_url, how_step_2_image_url, how_step_3_image_url',
      )
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setSettings(rowToSettings(data as SiteSettingsRow))
      })
  }, [])

  const value = useMemo(() => settings, [settings])

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  )
}

export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext)
}

/** @deprecated use useSiteSettings */
export const useSiteContact = useSiteSettings

export function useSiteSettingsReady(): boolean {
  return isSupabaseConfigured
}
