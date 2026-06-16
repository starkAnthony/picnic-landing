import { useEffect, useState, type FormEvent } from 'react'
import AdminConfirmDialog from './AdminConfirmDialog'
import { faqFormLabels } from './trustFormLabels'
import { supabase } from '../lib/supabase'
import { localizeFaq } from '../lib/localizeTrust'
import type { FaqRecord } from '../types/content'
import type { Locale } from '../i18n/types'

type FaqLocaleForm = {
  question: string
  answer: string
}

type Props = {
  setError: (msg: string) => void
}

const emptyLocale = (): FaqLocaleForm => ({ question: '', answer: '' })

function recordToForm(row: FaqRecord, locale: Locale): FaqLocaleForm {
  const qKey = `question_${locale}` as keyof FaqRecord
  const aKey = `answer_${locale}` as keyof FaqRecord
  return {
    question: (row[qKey] as string | null) ?? row.question_uz ?? '',
    answer: (row[aKey] as string | null) ?? row.answer_uz ?? '',
  }
}

export default function AdminFaqTab({ setError }: Props) {
  const [list, setList] = useState<FaqRecord[]>([])
  const [uz, setUz] = useState<FaqLocaleForm>(emptyLocale)
  const [ru, setRu] = useState<FaqLocaleForm>(emptyLocale)
  const [en, setEn] = useState<FaqLocaleForm>(emptyLocale)
  const [localeTab, setLocaleTab] = useState<Locale>('uz')
  const [sort, setSort] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string
    message: string
    onConfirm: () => void
  } | null>(null)

  async function loadList() {
    if (!supabase) return
    const { data, error } = await supabase.from('faq_items').select('*').order('sort_order')
    if (error) {
      setError(error.message)
      return
    }
    setList((data as FaqRecord[]) ?? [])
  }

  useEffect(() => {
    loadList()
  }, [])

  function resetForm() {
    setUz(emptyLocale())
    setRu(emptyLocale())
    setEn(emptyLocale())
    setSort(list.length)
    setEditingId(null)
    setLocaleTab('uz')
  }

  function startEdit(row: FaqRecord) {
    setEditingId(row.id)
    setUz(recordToForm(row, 'uz'))
    setRu(recordToForm(row, 'ru'))
    setEn(recordToForm(row, 'en'))
    setSort(row.sort_order)
    setLocaleTab('uz')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    if (!uz.question.trim() || !uz.answer.trim()) {
      setError('O‘zbekcha savol va javob majburiy.')
      return
    }

    setSubmitting(true)
    setError('')

    const payload = {
      question_uz: uz.question.trim(),
      question_ru: ru.question.trim() || null,
      question_en: en.question.trim() || null,
      answer_uz: uz.answer.trim(),
      answer_ru: ru.answer.trim() || null,
      answer_en: en.answer.trim() || null,
      sort_order: sort,
      published: true,
    }

    const { error } = editingId
      ? await supabase.from('faq_items').update(payload).eq('id', editingId)
      : await supabase.from('faq_items').insert(payload)

    setSubmitting(false)
    if (error) {
      setError(error.message)
      return
    }

    resetForm()
    await loadList()
  }

  function deleteRow(id: string, label: string) {
    setConfirmDialog({
      title: 'Savolni o‘chirish',
      message: `«${label}» savolini o‘chirishni tasdiqlaysizmi?`,
      onConfirm: async () => {
        setConfirmDialog(null)
        if (!supabase) return
        const { error } = await supabase.from('faq_items').delete().eq('id', id)
        if (error) setError(error.message)
        else await loadList()
      },
    })
  }

  const localeForms = [
    { key: 'uz' as const, label: 'O‘zbekcha', form: uz, set: setUz, required: true },
    { key: 'ru' as const, label: 'Русский', form: ru, set: setRu, required: false },
    { key: 'en' as const, label: 'English', form: en, set: setEn, required: false },
  ]

  return (
    <>
      <div className="admin-layout admin-layout--split">
        <section className="admin-card admin-card--form">
          <h2>{editingId ? 'Savolni tahrirlash' : 'Yangi savol'}</h2>
          <p className="admin-muted admin-muted--tight">
            Saytda «Savollar» bo‘limida ko‘rinadi. Bo‘sh qolsa, standart savollar ishlatiladi.
          </p>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="admin-locale-tabs" role="tablist">
              {localeForms.map(({ key, label, form }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={localeTab === key}
                  className={`admin-locale-tab${localeTab === key ? ' is-active' : ''}${form.question.trim() ? ' is-filled' : ''}`}
                  onClick={() => setLocaleTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {localeForms
              .filter(({ key }) => key === localeTab)
              .map(({ key, form, set, required }) => {
                const L = faqFormLabels[key]
                return (
                <div key={key} className="admin-locale-panel">
                  <label className="admin-field">
                    <span>{L.question}</span>
                    <input
                      value={form.question}
                      onChange={(e) => set({ ...form, question: e.target.value })}
                      required={required}
                    />
                  </label>
                  <label className="admin-field">
                    <span>{L.answer}</span>
                    <textarea
                      rows={4}
                      value={form.answer}
                      onChange={(e) => set({ ...form, answer: e.target.value })}
                      required={required}
                    />
                  </label>
                </div>
              )})}

            <div className="admin-option-tile admin-option-tile--sort">
              <div className="admin-option-tile__body">
                <span className="admin-option-tile__title">Tartib</span>
              </div>
              <div className="admin-sort-stepper">
                <button
                  type="button"
                  className="admin-sort-stepper__btn"
                  onClick={() => setSort((n) => Math.max(0, n - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  min={0}
                  className="admin-sort-stepper__input"
                  value={sort}
                  onChange={(e) => setSort(Math.max(0, Number(e.target.value) || 0))}
                />
                <button
                  type="button"
                  className="admin-sort-stepper__btn"
                  onClick={() => setSort((n) => n + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="admin-form-actions">
              <button type="submit" className="btn btn-primary admin-btn-full" disabled={submitting}>
                {submitting ? 'Saqlanmoqda…' : editingId ? 'Saqlash' : 'Qo‘shish'}
              </button>
              {editingId && (
                <button type="button" className="admin-btn-ghost" onClick={resetForm}>
                  Bekor qilish
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-card admin-card--list">
          <h2>Savollar ({list.length})</h2>
          {list.length === 0 ? (
            <p className="admin-muted">Hali savol yo‘q — standart matnlar ko‘rsatiladi.</p>
          ) : (
            <ul className="admin-list">
              {list.map((row) => {
                const preview = localizeFaq(row, localeTab)
                return (
                <li key={row.id} className="admin-list-item">
                  <div className="admin-list-item__main">
                    <strong>{preview.question}</strong>
                    <p className="admin-list-item__desc">{preview.answer}</p>
                  </div>
                  <div className="admin-list-item__actions">
                    <button type="button" className="admin-btn-ghost" onClick={() => startEdit(row)}>
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => deleteRow(row.id, row.question_uz)}
                    >
                      O‘chirish
                    </button>
                  </div>
                </li>
              )})}
            </ul>
          )}
        </section>
      </div>

      {confirmDialog && (
        <AdminConfirmDialog
          open
          title={confirmDialog.title}
          message={confirmDialog.message}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
        />
      )}
    </>
  )
}
