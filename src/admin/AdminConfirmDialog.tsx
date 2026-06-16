import { useEffect } from 'react'

type Props = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function AdminConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Ha, o‘chirish',
  cancelLabel = 'Bekor qilish',
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="admin-confirm" role="dialog" aria-modal="true" aria-labelledby="admin-confirm-title">
      <button type="button" className="admin-confirm__backdrop" onClick={onCancel} aria-label={cancelLabel} />
      <div className="admin-confirm__panel">
        <h3 id="admin-confirm-title" className="admin-confirm__title">
          {title}
        </h3>
        <p className="admin-confirm__message">{message}</p>
        <div className="admin-confirm__actions">
          <button type="button" className="admin-btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="admin-btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
