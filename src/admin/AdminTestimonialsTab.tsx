import { useEffect, useState, type FormEvent } from 'react'
import AdminConfirmDialog from './AdminConfirmDialog'
import { AdminUploadIcon } from './AdminUploadIcon'
import { testimonialFormLabels } from './trustFormLabels'
import { uploadTestimonialImage } from '../lib/uploadImage'
import { localizeTestimonial } from '../lib/localizeTrust'
import { supabase } from '../lib/supabase'
import type { TestimonialRecord } from '../types/content'
import type { Locale } from '../i18n/types'

type TestimonialLocaleForm = {
  quote: string
  occasion: string
}

type Props = {
  setError: (msg: string) => void
}

const emptyLocale = (): TestimonialLocaleForm => ({ quote: '', occasion: '' })

function recordToForm(row: TestimonialRecord, locale: Locale): TestimonialLocaleForm {
  const quoteKey = `quote_${locale}` as keyof TestimonialRecord
  const occasionKey = `occasion_${locale}` as keyof TestimonialRecord
  return {
    quote: (row[quoteKey] as string | null) ?? row.quote_uz ?? '',
    occasion: (row[occasionKey] as string | null) ?? row.occasion_uz ?? '',
  }
}

export default function AdminTestimonialsTab({ setError }: Props) {
  const [list, setList] = useState<TestimonialRecord[]>([])
  const [name, setName] = useState('')
  const [uz, setUz] = useState<TestimonialLocaleForm>(emptyLocale)
  const [ru, setRu] = useState<TestimonialLocaleForm>(emptyLocale)
  const [en, setEn] = useState<TestimonialLocaleForm>(emptyLocale)
  const [localeTab, setLocaleTab] = useState<Locale>('uz')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order')
    if (error) {
      setError(error.message)
      return
    }
    setList((data as TestimonialRecord[]) ?? [])
  }

  useEffect(() => {
    loadList()
  }, [])

  function resetForm() {
    setName('')
    setUz(emptyLocale())
    setRu(emptyLocale())
    setEn(emptyLocale())
    setImageUrl(null)
    setImagePreview(null)
    setSort(list.length)
    setEditingId(null)
    setLocaleTab('uz')
  }

  function startEdit(row: TestimonialRecord) {
    setEditingId(row.id)
    setName(row.name)
    setUz(recordToForm(row, 'uz'))
    setRu(recordToForm(row, 'ru'))
    setEn(recordToForm(row, 'en'))
    setImageUrl(row.image_url)
    setImagePreview(row.image_url)
    setSort(row.sort_order)
    setLocaleTab('uz')
  }

  async function onImageSelect(file: File | undefined) {
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setSubmitting(true)
    setError('')
    const uploaded = await uploadTestimonialImage(file)
    setSubmitting(false)
    if (!uploaded.ok) {
      setError(uploaded.error)
      return
    }
    setImageUrl(uploaded.image_url)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    if (!uz.quote.trim()) {
      setError('O‘zbekcha sharh matni majburiy.')
      return
    }

    setSubmitting(true)
    setError('')

    const payload = {
      name: name.trim(),
      quote_uz: uz.quote.trim(),
      quote_ru: ru.quote.trim() || null,
      quote_en: en.quote.trim() || null,
      occasion_uz: uz.occasion.trim(),
      occasion_ru: ru.occasion.trim() || null,
      occasion_en: en.occasion.trim() || null,
      image_url: imageUrl,
      sort_order: sort,
      published: true,
    }

    const { error } = editingId
      ? await supabase.from('testimonials').update(payload).eq('id', editingId)
      : await supabase.from('testimonials').insert(payload)

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
      title: 'Sharhni o‘chirish',
      message: `«${label}» sharhini o‘chirishni tasdiqlaysizmi?`,
      onConfirm: async () => {
        setConfirmDialog(null)
        if (!supabase) return
        const { error } = await supabase.from('testimonials').delete().eq('id', id)
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
          <h2>{editingId ? 'Sharhni tahrirlash' : 'Yangi sharh'}</h2>
          <p className="admin-muted admin-muted--tight">
            Saytda «Sharhlar» bo‘limida ko‘rinadi. Bo‘sh qolsa, standart matnlar ishlatiladi.
          </p>
          <form onSubmit={handleSubmit} className="admin-form">
            <label className="admin-field">
              <span>Ism</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <div className="admin-field">
              <span>Surat (ixtiyoriy)</span>
              {imagePreview && (
                <img src={imagePreview} alt="" className="admin-decor-preview-img" />
              )}
              <label className={`admin-upload admin-upload--compact ${submitting ? 'is-uploading' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  disabled={submitting}
                  onChange={(e) => {
                    onImageSelect(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
                <AdminUploadIcon />
                <span className="admin-upload-copy">
                  <span className="admin-upload-title">
                    {imagePreview ? 'Boshqa surat' : 'Avatar yuklash'}
                  </span>
                </span>
              </label>
            </div>

            <div className="admin-locale-tabs" role="tablist">
              {localeForms.map(({ key, label, form }) => (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={localeTab === key}
                  className={`admin-locale-tab${localeTab === key ? ' is-active' : ''}${form.quote.trim() ? ' is-filled' : ''}`}
                  onClick={() => setLocaleTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            {localeForms
              .filter(({ key }) => key === localeTab)
              .map(({ key, form, set, required }) => {
                const L = testimonialFormLabels[key]
                return (
                <div key={key} className="admin-locale-panel">
                  <label className="admin-field">
                    <span>{L.quote}</span>
                    <textarea
                      rows={4}
                      value={form.quote}
                      onChange={(e) => set({ ...form, quote: e.target.value })}
                      required={required}
                    />
                  </label>
                  <label className="admin-field">
                    <span>{L.occasion}</span>
                    <input
                      value={form.occasion}
                      onChange={(e) => set({ ...form, occasion: e.target.value })}
                      placeholder={L.occasionPlaceholder}
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
          <h2>Sharhlar ({list.length})</h2>
          {list.length === 0 ? (
            <p className="admin-muted">Hali sharh yo‘q — standart matnlar ko‘rsatiladi.</p>
          ) : (
            <ul className="admin-list">
              {list.map((row) => {
                const preview = localizeTestimonial(row, localeTab)
                return (
                <li key={row.id} className="admin-list-item">
                  <div className="admin-list-item__main">
                    <strong>{row.name}</strong>
                    <span className="admin-muted">{preview.occasion}</span>
                    <p className="admin-list-item__desc">{preview.quote}</p>
                  </div>
                  <div className="admin-list-item__actions">
                    <button type="button" className="admin-btn-ghost" onClick={() => startEdit(row)}>
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => deleteRow(row.id, row.name)}
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
