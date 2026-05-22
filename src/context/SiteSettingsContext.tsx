import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
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

export type SiteContact = {
  phoneDisplay: string
  phoneTel: string
  telegramUsername: string
  telegramHandle: string
  telegramUrl: string
  instagramHandle: string
  instagramUrl: string
}

const defaults: SiteContact = {
  phoneDisplay: DEFAULT_PHONE_DISPLAY,
  phoneTel: phoneToTel(DEFAULT_PHONE_DISPLAY),
  telegramUsername: DEFAULT_TELEGRAM_USERNAME,
  telegramHandle: telegramHandle(DEFAULT_TELEGRAM_USERNAME),
  telegramUrl: telegramUrl(DEFAULT_TELEGRAM_USERNAME),
  instagramHandle: instagramHandle(DEFAULT_INSTAGRAM_HANDLE),
  instagramUrl: DEFAULT_INSTAGRAM_URL,
}

type SiteSettingsRow = {
  phone_display: string
  telegram_username: string
  instagram_handle: string
  instagram_url: string | null
}

function rowToContact(row: SiteSettingsRow): SiteContact {
  const tgUser = row.telegram_username.trim() || DEFAULT_TELEGRAM_USERNAME
  const igHandle = row.instagram_handle.trim() || DEFAULT_INSTAGRAM_HANDLE
  const phone = row.phone_display.trim() || DEFAULT_PHONE_DISPLAY

  return {
    phoneDisplay: phone,
    phoneTel: phoneToTel(phone),
    telegramUsername: tgUser.replace(/^@/, ''),
    telegramHandle: telegramHandle(tgUser),
    telegramUrl: telegramUrl(tgUser),
    instagramHandle: instagramHandle(igHandle),
    instagramUrl: instagramUrl(igHandle, row.instagram_url),
  }
}

const SiteSettingsContext = createContext<SiteContact>(defaults)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<SiteContact>(defaults)

  useEffect(() => {
    if (!supabase) return

    supabase
      .from('site_settings')
      .select('phone_display, telegram_username, instagram_handle, instagram_url')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setContact(rowToContact(data as SiteSettingsRow))
      })
  }, [])

  const value = useMemo(() => contact, [contact])

  return (
    <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
  )
}

export function useSiteSettings(): SiteContact {
  return useContext(SiteSettingsContext)
}

export function useSiteSettingsReady(): boolean {
  return isSupabaseConfigured
}
