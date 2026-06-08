import type { Translations } from '../i18n/types'

export function buildBookingMessage(
  form: HTMLFormElement,
  t: Translations,
  extras?: { decorNames?: string[] },
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

  const decorNames = extras?.decorNames?.filter(Boolean) ?? []
  if (decorNames.length) {
    lines.push(`${t.booking.decors}: ${decorNames.join(', ')}`)
  }

  const notes = String(data.get('notes') ?? '').trim()
  if (notes) lines.push(`${t.booking.notes}: ${notes}`)

  return lines.join('\n')
}
