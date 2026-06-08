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

type UploadKind = 'gallery' | 'post' | 'hero' | 'decor'

export type UploadResult =
  | { ok: true; image_url: string }
  | { ok: false; error: string }

async function uploadImageFile(file: File, kind: UploadKind): Promise<UploadResult> {
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
      kind,
    }),
  })

  let body: { error?: string; image_url?: string } = {}
  try {
    body = await res.json()
  } catch {
    body = {}
  }

  if (res.status === 404) {
    return uploadImageDirect(file, kind)
  }

  if (res.status === 503) {
    return {
      ok: false,
      error:
        body.error ??
        'Vercel-da SUPABASE_SERVICE_ROLE_KEY qo‘ying va qayta deploy qiling.',
    }
  }

  if (!res.ok || !body.image_url) {
    return { ok: false, error: body.error ?? `Upload failed (${res.status})` }
  }

  return { ok: true, image_url: body.image_url }
}

async function uploadImageDirect(file: File, kind: UploadKind): Promise<UploadResult> {
  if (!supabase) return { ok: false, error: 'Supabase not configured' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const stamp = Date.now()
  const path =
    kind === 'post'
      ? `posts/${stamp}.${ext}`
      : kind === 'hero'
        ? `hero/${stamp}.${ext}`
        : kind === 'decor'
          ? `decors/${stamp}.${ext}`
          : `${stamp}.${ext}`
  const { error: upErr } = await supabase.storage.from('gallery').upload(path, file)
  if (upErr) {
    return {
      ok: false,
      error: upErr.message.includes('row-level security')
        ? `${upErr.message} — fix-storage-rls.sql yoki SUPABASE_SERVICE_ROLE_KEY`
        : upErr.message,
    }
  }
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)

  if (kind === 'gallery') {
    const { error: rowErr } = await supabase.from('gallery_items').insert({
      image_url: data.publicUrl,
      alt: 'Sevinc Picnic',
      sort_order: 0,
    })
    if (rowErr) return { ok: false, error: rowErr.message }
  }

  return { ok: true, image_url: data.publicUrl }
}

export function uploadGalleryImage(file: File): Promise<UploadResult> {
  return uploadImageFile(file, 'gallery')
}

export function uploadPostImage(file: File): Promise<UploadResult> {
  return uploadImageFile(file, 'post')
}

export function uploadHeroImage(file: File): Promise<UploadResult> {
  return uploadImageFile(file, 'hero')
}

export function uploadDecorImage(file: File): Promise<UploadResult> {
  return uploadImageFile(file, 'decor')
}
