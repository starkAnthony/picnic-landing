import { createClient } from '@supabase/supabase-js'

type Req = {
  method?: string
  headers?: { authorization?: string }
  body?: { fileName?: string; contentType?: string; data?: string; kind?: 'gallery' | 'post' | 'hero' }
}

type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey || !serviceKey) {
    return res.status(503).json({
      error: 'Server upload not configured. Add SUPABASE_SERVICE_ROLE_KEY on Vercel.',
    })
  }

  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return res.status(401).json({ error: 'Missing login token' })
  }

  const authClient = createClient(url, anonKey)
  const { data: userData, error: userError } = await authClient.auth.getUser(token)
  if (userError || !userData.user) {
    return res.status(401).json({ error: 'Invalid or expired session. Log in again.' })
  }

  const { fileName, contentType, data } = req.body ?? {}
  if (!fileName || !data) {
    return res.status(400).json({ error: 'Missing file data' })
  }

  const kind =
    req.body?.kind === 'post' ? 'post' : req.body?.kind === 'hero' ? 'hero' : 'gallery'
  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg'
  const stamp = Date.now()
  const path =
    kind === 'post' ? `posts/${stamp}.${ext}` : kind === 'hero' ? `hero/${stamp}.${ext}` : `${stamp}.${ext}`
  const buffer = Buffer.from(data, 'base64')
  const mime = contentType || `image/${ext === 'png' ? 'png' : 'jpeg'}`

  const admin = createClient(url, serviceKey)

  const { error: uploadError } = await admin.storage.from('gallery').upload(path, buffer, {
    contentType: mime,
    upsert: false,
  })

  if (uploadError) {
    console.error('Storage upload:', uploadError.message)
    return res.status(502).json({ error: uploadError.message })
  }

  const { data: urlData } = admin.storage.from('gallery').getPublicUrl(path)

  if (kind === 'gallery') {
    const { count } = await admin.from('gallery_items').select('*', { count: 'exact', head: true })
    const sortOrder = count ?? 0

    const { error: insertError } = await admin.from('gallery_items').insert({
      image_url: urlData.publicUrl,
      alt: 'Sevinc Picnic',
      sort_order: sortOrder,
    })

    if (insertError) {
      console.error('Gallery insert:', insertError.message)
      return res.status(502).json({ error: insertError.message })
    }
  }

  return res.status(200).json({ ok: true, image_url: urlData.publicUrl })
}
