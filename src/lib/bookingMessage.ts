import type { Translations } from '../i18n/types'

export function buildBookingMessage(
  form: HTMLFormElement,
  t: Translations,
  extras?: { decorLines?: string[]; customBrief?: string; customTag?: string },
): string {
  const data = new FormData(form)
  const packageSelect = form.elements.namedItem('package') as HTMLSelectElement | null
  const serviceLabel = packageSelect?.selectedOptions[0]?.text ?? String(data.get('package') ?? '')

  const lines = [
    `🧺 ${t.brand} — ${t.booking.label}`,
    '',
    `${t.booking.name}: ${data.get('name')}`,
    `${t.booking.email}: ${data.get('phone')}`,
    `${t.booking.package}: ${serviceLabel}`,
    `${t.booking.date}: ${data.get('date')}`,
    `${t.booking.guests}: ${data.get('guests')}`,
  ]

  const decorLines = extras?.decorLines?.filter(Boolean) ?? []
  if (decorLines.length) {
    lines.push(`${t.booking.decors}: ${decorLines.join(', ')}`)
  }

  const customBrief = extras?.customBrief?.trim() ?? ''
  if (customBrief) {
    lines.push('')
    lines.push(`🎨 ${extras?.customTag ?? t.booking.customTelegramTag}`)
    lines.push(`${t.booking.customBriefLabel}: ${customBrief}`)
  }

  const notes = String(data.get('notes') ?? '').trim()
  if (notes) lines.push(`${t.booking.notes}: ${notes}`)

  return lines.join('\n')
}
