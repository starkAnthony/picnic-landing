type Req = {
  method?: string
  body?: unknown
}

type Res = {
  status: (code: number) => { json: (body: unknown) => void }
}

function parseBody(body: unknown): { message?: string } {
  if (!body) return {}
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as { message?: string }
    } catch {
      return {}
    }
  }
  if (typeof body === 'object') return body as { message?: string }
  return {}
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()

  if (!token || !chatId) {
    return res.status(503).json({ error: 'not_configured' })
  }

  const { message: rawMessage } = parseBody(req.body)
  const message = typeof rawMessage === 'string' ? rawMessage.trim() : ''

  if (!message || message.length > 4000) {
    return res.status(400).json({ error: 'invalid_message' })
  }

  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  })

  const tgData = (await tgRes.json().catch(() => null)) as {
    ok?: boolean
    description?: string
  } | null

  if (!tgRes.ok || !tgData?.ok) {
    const description = tgData?.description ?? 'Unknown Telegram error'
    console.error('Telegram API error:', description)
    return res.status(502).json({ error: 'telegram', description })
  }

  return res.status(200).json({ ok: true })
}
