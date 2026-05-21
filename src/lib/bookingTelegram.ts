export type TelegramSendResult =
  | { ok: true }
  | {
      ok: false
      reason: 'not_configured' | 'no_api' | 'telegram' | 'failed' | 'network'
      description?: string
    }

export async function sendBookingToTelegram(message: string): Promise<TelegramSendResult> {
  try {
    const res = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    let data: { error?: string; description?: string } | null = null
    try {
      data = await res.json()
    } catch {
      data = null
    }

    if (res.status === 503 || data?.error === 'not_configured') {
      return { ok: false, reason: 'not_configured' }
    }

    if (res.status === 404) {
      return { ok: false, reason: 'no_api' }
    }

    if (data?.error === 'telegram') {
      return { ok: false, reason: 'telegram', description: data.description }
    }

    if (!res.ok) {
      return { ok: false, reason: 'failed', description: data?.description }
    }

    return { ok: true }
  } catch {
    return { ok: false, reason: 'network' }
  }
}
