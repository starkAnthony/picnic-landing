import { supabase } from './supabase'

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      if (!base64) reject(new Error('Could not read file'))
      else resolve(base64)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/** Upload via server (bypasses Storage RLS). Requires SUPABASE_SERVICE_ROLE_KEY on Vercel. */
export async function uploadGalleryImage(file: File): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) {
    return { ok: false, error: 'Supabase not configured' }
  }

  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) {
    return { ok: false, error: 'Avval tizimga kiring (login)' }
  }

  let base64: string
  try {
    base64 = await readFileAsBase64(file)
  } catch {
    return { ok: false, error: 'Faylni o‘qib bo‘lmadi' }
  }

  const res = await fetch('/api/upload-gallery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      data: base64,
    }),
  })

  let body: { error?: string } = {}
  try {
    body = await res.json()
  } catch {
    body = {}
  }

  if (res.status === 404) {
    return uploadGalleryDirect(file)
  }

  if (res.status === 503) {
    return {
      ok: false,
      error:
        body.error ??
        'Vercel-da SUPABASE_SERVICE_ROLE_KEY qo‘ying va qayta deploy qiling. Yoki Supabase SQL Editor-da fix-storage-rls.sql ni ishga tushiring.',
    }
  }

  if (!res.ok) {
    return { ok: false, error: body.error ?? `Upload failed (${res.status})` }
  }

  return { ok: true }
}

/** Direct upload (local npm run dev only — needs fix-storage-rls.sql) */
async function uploadGalleryDirect(
  file: File,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${Date.now()}.${ext}`
  const { error: upErr } = await supabase.storage.from('gallery').upload(path, file)
  if (upErr) {
    return {
      ok: false,
      error: upErr.message.includes('row-level security')
        ? `${upErr.message} — Vercel-da SUPABASE_SERVICE_ROLE_KEY qo‘ying yoki fix-storage-rls.sql ishga tushiring.`
        : upErr.message,
    }
  }
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)
  const { error: rowErr } = await supabase.from('gallery_items').insert({
    image_url: data.publicUrl,
    alt: 'Sevinc Picnic',
    sort_order: 0,
  })
  if (rowErr) return { ok: false, error: rowErr.message }
  return { ok: true }
}
