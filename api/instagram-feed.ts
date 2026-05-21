type Req = { method?: string }
type Res = { status: (code: number) => { json: (body: unknown) => void } }

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim()
  const userId = process.env.INSTAGRAM_USER_ID?.trim()

  if (!token || !userId) {
    return res.status(200).json({ configured: false, items: [] })
  }

  const url = `https://graph.instagram.com/v21.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=8&access_token=${token}`

  const igRes = await fetch(url)
  const data = (await igRes.json()) as { data?: unknown[]; error?: { message: string } }

  if (!igRes.ok || data.error) {
    console.error('Instagram feed error:', data.error)
    return res.status(200).json({ configured: false, items: [], error: data.error?.message })
  }

  return res.status(200).json({ configured: true, items: data.data ?? [] })
}
