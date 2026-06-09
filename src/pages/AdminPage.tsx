import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  DEFAULT_HERO_IMAGE_URL,
  DEFAULT_INSTAGRAM_HANDLE,
  DEFAULT_PHONE_DISPLAY,
  DEFAULT_TELEGRAM_USERNAME,
  normalizeUsername,
} from '../site'
import { uploadGalleryImage, uploadDecorImage, uploadHeroImage, uploadPostImage } from '../lib/uploadImage'
import { decorFormLabels } from '../admin/decorFormLabels'
import { serviceFormLabels } from '../admin/serviceFormLabels'
import type { DecorRecord, GalleryItem, Post, ServiceRecord } from '../types/content'
import type { Locale } from '../i18n/types'

type ServiceLocaleForm = {
  name: string
  desc: string
  price: string
  features: string
}

type AdminDecorRow = DecorRecord & {
  service_decors?: { service_id: string }[] | null
}

type DecorLocaleForm = {
  name: string
  price: string
}

const emptyDecorLocale = (): DecorLocaleForm => ({
  name: '',
  price: '',
})

function recordToDecorForm(row: DecorRecord, locale: Locale): DecorLocaleForm {
  const nameKey = `name_${locale}` as keyof DecorRecord
  const priceKey = `price_text_${locale}` as keyof DecorRecord

  const name = (row[nameKey] as string | null) ?? row.name_uz ?? ''
  const price =
    (row[priceKey] as string | null) ?? row.price_text_uz ?? row.price_text ?? ''

  return { name, price }
}

const emptyServiceLocale = (): ServiceLocaleForm => ({
  name: '',
  desc: '',
  price: '',
  features: '',
})

function recordToForm(row: ServiceRecord, locale: Locale): ServiceLocaleForm {
  const nameKey = `name_${locale}` as keyof ServiceRecord
  const descKey = `description_${locale}` as keyof ServiceRecord
  const priceKey = `price_text_${locale}` as keyof ServiceRecord
  const featKey = `features_${locale}` as keyof ServiceRecord

  const name = (row[nameKey] as string | null) ?? row.name ?? ''
  const desc = (row[descKey] as string | null) ?? row.description ?? ''
  const price = (row[priceKey] as string | null) ?? row.price_text ?? ''
  const feats = (row[featKey] as string[] | null) ?? row.features ?? []

  return {
    name,
    desc,
    price,
    features: feats.join('\n'),
  }
}
import './AdminPage.css'

export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'settings' | 'services' | 'decors' | 'gallery' | 'posts'>('settings')
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [services, setServices] = useState<ServiceRecord[]>([])
  const [svcUz, setSvcUz] = useState<ServiceLocaleForm>(emptyServiceLocale)
  const [svcRu, setSvcRu] = useState<ServiceLocaleForm>(emptyServiceLocale)
  const [svcEn, setSvcEn] = useState<ServiceLocaleForm>(emptyServiceLocale)
  const [svcPopular, setSvcPopular] = useState(false)
  const [svcSort, setSvcSort] = useState(0)
  const [svcEditingId, setSvcEditingId] = useState<string | null>(null)
  const [svcLocaleTab, setSvcLocaleTab] = useState<Locale>('uz')
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [postType, setPostType] = useState<'news' | 'event'>('news')
  const [postDate, setPostDate] = useState('')
  const [postImageFile, setPostImageFile] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [postSubmitting, setPostSubmitting] = useState(false)
  const [phoneDisplay, setPhoneDisplay] = useState(DEFAULT_PHONE_DISPLAY)
  const [telegramUsername, setTelegramUsername] = useState(DEFAULT_TELEGRAM_USERNAME)
  const [instagramHandle, setInstagramHandle] = useState(DEFAULT_INSTAGRAM_HANDLE)
  const [instagramUrl, setInstagramUrl] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [heroUploading, setHeroUploading] = useState(false)
  const [decorList, setDecorList] = useState<AdminDecorRow[]>([])
  const [decorUz, setDecorUz] = useState<DecorLocaleForm>(emptyDecorLocale)
  const [decorRu, setDecorRu] = useState<DecorLocaleForm>(emptyDecorLocale)
  const [decorEn, setDecorEn] = useState<DecorLocaleForm>(emptyDecorLocale)
  const [decorImageUrl, setDecorImageUrl] = useState<string | null>(null)
  const [decorImageFile, setDecorImageFile] = useState<File | null>(null)
  const [decorImagePreview, setDecorImagePreview] = useState<string | null>(null)
  const [decorServiceIds, setDecorServiceIds] = useState<string[]>([])
  const [decorSort, setDecorSort] = useState(0)
  const [decorEditingId, setDecorEditingId] = useState<string | null>(null)
  const [decorLocaleTab, setDecorLocaleTab] = useState<Locale>('uz')
  const [decorSubmitting, setDecorSubmitting] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setSession(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(!!data.session)
      if (data.session) loadData()
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(!!s)
      if (s) loadData()
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function loadData() {
    if (!supabase) return
    const [g, p, s, d, settings] = await Promise.all([
      supabase.from('gallery_items').select('*').order('sort_order'),
      supabase.from('posts').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('decors').select('*, service_decors(service_id)').order('sort_order'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ])
    if (g.data) setGallery(g.data as GalleryItem[])
    if (p.data) setPosts(p.data as Post[])
    if (s.data) setServices(s.data as ServiceRecord[])
    if (d.data) setDecorList(d.data as AdminDecorRow[])
    if (settings.data) {
      setPhoneDisplay(settings.data.phone_display ?? DEFAULT_PHONE_DISPLAY)
      setTelegramUsername(normalizeUsername(settings.data.telegram_username ?? DEFAULT_TELEGRAM_USERNAME))
      setInstagramHandle(normalizeUsername(settings.data.instagram_handle ?? DEFAULT_INSTAGRAM_HANDLE))
      setInstagramUrl(settings.data.instagram_url ?? '')
      setHeroImageUrl(settings.data.hero_image_url ?? null)
    }
  }

  async function persistSettings(heroUrl: string | null = heroImageUrl) {
    if (!supabase) return { error: new Error('Supabase not configured') }

    return supabase.from('site_settings').upsert({
      id: 1,
      phone_display: phoneDisplay.trim(),
      telegram_username: normalizeUsername(telegramUsername),
      instagram_handle: normalizeUsername(instagramHandle),
      instagram_url: instagramUrl.trim() || null,
      hero_image_url: heroUrl,
      updated_at: new Date().toISOString(),
    })
  }

  async function uploadHero(file: File) {
    setHeroUploading(true)
    setError('')

    const uploaded = await uploadHeroImage(file)
    if (!uploaded.ok) {
      setError(uploaded.error)
      setHeroUploading(false)
      return
    }

    const { error: err } = await persistSettings(uploaded.image_url)
    setHeroUploading(false)

    if (err) {
      setError(err.message)
      return
    }

    setHeroImageUrl(uploaded.image_url)
  }

  async function clearHeroImage() {
    setError('')
    const { error: err } = await persistSettings(null)
    if (err) {
      setError(err.message)
      return
    }
    setHeroImageUrl(null)
  }

  async function saveSettings(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setSettingsSaving(true)

    const { error: err } = await persistSettings()

    setSettingsSaving(false)
    if (err) {
      setError(err.message)
      return
    }
  }

  function parseFeatures(text: string): string[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }

  function resetServiceForm(nextSort = services.length) {
    setSvcUz(emptyServiceLocale())
    setSvcRu(emptyServiceLocale())
    setSvcEn(emptyServiceLocale())
    setSvcPopular(false)
    setSvcSort(nextSort)
    setSvcEditingId(null)
    setSvcLocaleTab('uz')
  }

  function editService(s: ServiceRecord) {
    setSvcEditingId(s.id)
    setSvcUz(recordToForm(s, 'uz'))
    setSvcRu(recordToForm(s, 'ru'))
    setSvcEn(recordToForm(s, 'en'))
    setSvcPopular(s.is_popular)
    setSvcSort(s.sort_order)
    setError('')
  }

  async function saveService(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')

    if (!svcUz.name.trim()) {
      setError('O‘zbekcha nom majburiy.')
      return
    }

    const payload = {
      name_uz: svcUz.name.trim(),
      name_ru: svcRu.name.trim() || svcUz.name.trim(),
      name_en: svcEn.name.trim() || svcUz.name.trim(),
      description_uz: svcUz.desc.trim(),
      description_ru: svcRu.desc.trim() || svcUz.desc.trim(),
      description_en: svcEn.desc.trim() || svcUz.desc.trim(),
      price_text_uz: svcUz.price.trim(),
      price_text_ru: svcRu.price.trim() || svcUz.price.trim(),
      price_text_en: svcEn.price.trim() || svcUz.price.trim(),
      features_uz: parseFeatures(svcUz.features),
      features_ru: parseFeatures(svcRu.features).length
        ? parseFeatures(svcRu.features)
        : parseFeatures(svcUz.features),
      features_en: parseFeatures(svcEn.features).length
        ? parseFeatures(svcEn.features)
        : parseFeatures(svcUz.features),
      name: svcUz.name.trim(),
      description: svcUz.desc.trim(),
      price_text: svcUz.price.trim(),
      features: parseFeatures(svcUz.features),
      is_popular: svcPopular,
      sort_order: svcSort,
      published: true,
    }

    const { error: err } = svcEditingId
      ? await supabase.from('services').update(payload).eq('id', svcEditingId)
      : await supabase.from('services').insert(payload)

    if (err) {
      setError(err.message)
      return
    }

    resetServiceForm()
    loadData()
  }

  async function deleteService(id: string) {
    await supabase?.from('services').delete().eq('id', id)
    if (svcEditingId === id) resetServiceForm()
    loadData()
  }

  function resetDecorForm(nextSort = decorList.length) {
    setDecorUz(emptyDecorLocale())
    setDecorRu(emptyDecorLocale())
    setDecorEn(emptyDecorLocale())
    setDecorImageUrl(null)
    setDecorImageFile(null)
    setDecorImagePreview(null)
    setDecorServiceIds([])
    setDecorSort(nextSort)
    setDecorEditingId(null)
    setDecorLocaleTab('uz')
  }

  function onDecorImageSelect(file: File | undefined) {
    if (!file) return
    setDecorImageFile(file)
    setDecorImagePreview(URL.createObjectURL(file))
  }

  function editDecor(row: AdminDecorRow) {
    setDecorEditingId(row.id)
    setDecorUz(recordToDecorForm(row, 'uz'))
    setDecorRu(recordToDecorForm(row, 'ru'))
    setDecorEn(recordToDecorForm(row, 'en'))
    setDecorImageUrl(row.image_url)
    setDecorImageFile(null)
    setDecorImagePreview(row.image_url)
    setDecorServiceIds((row.service_decors ?? []).map((l) => l.service_id))
    setDecorSort(row.sort_order)
    setDecorLocaleTab('uz')
    setError('')
  }

  function setDecorAllServices() {
    setDecorServiceIds([])
  }

  function toggleDecorService(serviceId: string) {
    setDecorServiceIds((prev) => {
      if (prev.length === 0) return [serviceId]
      if (prev.includes(serviceId)) {
        const next = prev.filter((id) => id !== serviceId)
        return next
      }
      return [...prev, serviceId]
    })
  }

  async function syncDecorServices(decorId: string, serviceIds: string[]) {
    if (!supabase) return
    await supabase.from('service_decors').delete().eq('decor_id', decorId)
    if (serviceIds.length === 0) return
    await supabase.from('service_decors').insert(
      serviceIds.map((service_id) => ({ service_id, decor_id: decorId })),
    )
  }

  async function saveDecor(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setDecorSubmitting(true)

    if (!decorUz.name.trim()) {
      setError('O‘zbekcha bezak nomi majburiy.')
      setDecorSubmitting(false)
      return
    }

    if (!decorUz.price.trim()) {
      setError('O‘zbekcha narx majburiy.')
      setDecorSubmitting(false)
      return
    }

    let imageUrl = decorImageUrl
    if (decorImageFile) {
      const uploaded = await uploadDecorImage(decorImageFile)
      if (!uploaded.ok) {
        setError(uploaded.error)
        setDecorSubmitting(false)
        return
      }
      imageUrl = uploaded.image_url
    }

    if (!imageUrl) {
      setError('Bezak surati kerak.')
      setDecorSubmitting(false)
      return
    }

    const payload = {
      image_url: imageUrl,
      name_uz: decorUz.name.trim(),
      name_ru: decorRu.name.trim() || decorUz.name.trim(),
      name_en: decorEn.name.trim() || decorUz.name.trim(),
      price_text_uz: decorUz.price.trim(),
      price_text_ru: decorRu.price.trim() || decorUz.price.trim(),
      price_text_en: decorEn.price.trim() || decorUz.price.trim(),
      price_text: decorUz.price.trim(),
      sort_order: decorSort,
      published: true,
    }

    let decorId = decorEditingId
    if (decorEditingId) {
      const { error: err } = await supabase.from('decors').update(payload).eq('id', decorEditingId)
      if (err) {
        setError(err.message)
        setDecorSubmitting(false)
        return
      }
    } else {
      const { data, error: err } = await supabase.from('decors').insert(payload).select('id').single()
      if (err || !data) {
        setError(err?.message ?? 'Saqlab bo‘lmadi')
        setDecorSubmitting(false)
        return
      }
      decorId = data.id
    }

    if (decorId) {
      await syncDecorServices(decorId, decorServiceIds)
    }

    setDecorSubmitting(false)
    resetDecorForm()
    loadData()
  }

  async function deleteDecor(id: string) {
    await supabase?.from('decors').delete().eq('id', id)
    if (decorEditingId === id) resetDecorForm()
    loadData()
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!supabase) return
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) setError(err.message)
  }

  async function handleLogout() {
    await supabase?.auth.signOut()
  }

  async function uploadImages(files: FileList) {
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (list.length === 0) return

    setUploading(true)
    setError('')
    let done = 0

    for (const file of list) {
      setUploadProgress(`${done + 1} / ${list.length}`)
      const result = await uploadGalleryImage(file)
      if (!result.ok) {
        setError(result.error)
        setUploading(false)
        setUploadProgress('')
        return
      }
      done += 1
    }

    setUploading(false)
    setUploadProgress('')
    loadData()
  }

  async function deleteGallery(id: string) {
    await supabase?.from('gallery_items').delete().eq('id', id)
    loadData()
  }

  function clearPostImage() {
    if (postImagePreview) URL.revokeObjectURL(postImagePreview)
    setPostImageFile(null)
    setPostImagePreview(null)
  }

  function onPostImageSelect(file: File | undefined) {
    if (!file) return
    clearPostImage()
    setPostImageFile(file)
    setPostImagePreview(URL.createObjectURL(file))
  }

  async function addPost(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setPostSubmitting(true)

    let imageUrl: string | null = null
    if (postImageFile) {
      const uploaded = await uploadPostImage(postImageFile)
      if (!uploaded.ok) {
        setError(uploaded.error)
        setPostSubmitting(false)
        return
      }
      imageUrl = uploaded.image_url
    }

    const { error: insertErr } = await supabase.from('posts').insert({
      title: postTitle,
      body: postBody,
      post_type: postType,
      event_date: postDate || null,
      image_url: imageUrl,
      published: true,
    })

    setPostSubmitting(false)
    if (insertErr) {
      setError(insertErr.message)
      return
    }

    setPostTitle('')
    setPostBody('')
    setPostDate('')
    clearPostImage()
    loadData()
  }

  async function deletePost(id: string) {
    await supabase?.from('posts').delete().eq('id', id)
    loadData()
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-page admin-page--centered">
        <div className="admin-card admin-card--narrow">
          <AdminBrand />
          <h1>Sozlash kerak</h1>
          <p className="admin-muted">
            <code>VITE_SUPABASE_URL</code> va <code>VITE_SUPABASE_ANON_KEY</code> qo‘shing (.env
            yoki Vercel).
          </p>
          <Link to="/" className="admin-link">
            ← Saytga qaytish
          </Link>
        </div>
      </div>
    )
  }

  if (session === null) {
    return (
      <div className="admin-page admin-page--centered">
        <p className="admin-muted">Yuklanmoqda…</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="admin-page admin-page--login">
        <div className="admin-card admin-card--login">
          <AdminBrand />
          <p className="admin-eyebrow">Boshqaruv paneli</p>
          <h1>Kirish</h1>
          <form onSubmit={handleLogin} className="admin-form">
            <label className="admin-field">
              <span>Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label className="admin-field">
              <span>Parol</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="admin-alert">{error}</p>}
            <button type="submit" className="btn btn-primary admin-btn-full">
              Kirish
            </button>
          </form>
          <Link to="/" className="admin-link">
            ← Saytga qaytish
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page admin-page--dashboard">
      <header className="admin-topbar">
        <div className="admin-topbar-inner">
          <AdminBrand compact />
          <nav className="admin-tabs" aria-label="Admin sections">
            <button
              type="button"
              className={tab === 'settings' ? 'active' : ''}
              onClick={() => setTab('settings')}
            >
              Sozlamalar
            </button>
            <button
              type="button"
              className={tab === 'services' ? 'active' : ''}
              onClick={() => setTab('services')}
            >
              Xizmatlar
            </button>
            <button
              type="button"
              className={tab === 'decors' ? 'active' : ''}
              onClick={() => setTab('decors')}
            >
              Bezaklar
            </button>
            <button
              type="button"
              className={tab === 'gallery' ? 'active' : ''}
              onClick={() => setTab('gallery')}
            >
              Galereya
            </button>
            <button
              type="button"
              className={tab === 'posts' ? 'active' : ''}
              onClick={() => setTab('posts')}
            >
              Yangiliklar
            </button>
          </nav>
          <div className="admin-topbar-actions">
            <Link to="/" className="btn btn-outline admin-btn-sm">
              Saytni ko‘rish
            </Link>
            <button type="button" className="admin-btn-ghost" onClick={handleLogout}>
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        {error && <p className="admin-alert admin-alert--bar">{error}</p>}

        {tab === 'settings' && (
          <section className="admin-card admin-card--narrow admin-settings">
            <h2>Sayt sozlamalari</h2>
            <p className="admin-muted">
              Telefon, Telegram, Instagram va bosh sahifadagi katta surat — shu yerdan boshqariladi.
              <br />
              <strong>Eslatma:</strong> Buyurtmalarni qabul qilish (bot token va guruh id) hali Vercel
              Environment Variables da.
            </p>

            <div className="admin-field">
              <span>Bosh sahifa surati (hero)</span>
              <div className="admin-hero-preview">
                <img
                  src={heroImageUrl ?? DEFAULT_HERO_IMAGE_URL}
                  alt=""
                  className="admin-hero-preview-img"
                />
              </div>
              <label className={`admin-upload admin-upload--compact ${heroUploading ? 'is-uploading' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  disabled={heroUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadHero(file)
                    e.target.value = ''
                  }}
                />
                <span className="admin-upload-title">
                  {heroUploading ? 'Yuklanmoqda…' : 'Yangi asosiy surat tanlang'}
                </span>
              </label>
              {heroImageUrl && (
                <button type="button" className="admin-btn-ghost" onClick={clearHeroImage}>
                  Standart suratga qaytarish
                </button>
              )}
              <span className="admin-hint">Galereyaga qo‘shilmaydi — faqat yuqoridagi katta rasm almashtiriladi.</span>
            </div>

            <form onSubmit={saveSettings} className="admin-form">
              <label className="admin-field">
                <span>Telefon (ko‘rinishi)</span>
                <input
                  value={phoneDisplay}
                  onChange={(e) => setPhoneDisplay(e.target.value)}
                  placeholder="+998 99 442 60 30"
                  required
                />
              </label>
              <label className="admin-field">
                <span>Telegram username</span>
                <input
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="tony_not"
                  required
                />
                <span className="admin-hint">@ siz qo‘ymang — faqat username</span>
              </label>
              <label className="admin-field">
                <span>Instagram username</span>
                <input
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  placeholder="sevinc_picnic"
                  required
                />
              </label>
              <label className="admin-field">
                <span>Instagram havolasi (ixtiyoriy)</span>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/..."
                />
                <span className="admin-hint">Bo‘sh qoldirsangiz, username dan link yasaladi</span>
              </label>
              <button type="submit" className="btn btn-primary admin-btn-full" disabled={settingsSaving}>
                {settingsSaving ? 'Saqlanmoqda…' : 'Saqlash'}
              </button>
            </form>
          </section>
        )}

        {tab === 'services' && (
          <div className="admin-layout admin-layout--split admin-layout--services">
            <section className="admin-card admin-card--form">
              <h2>{svcEditingId ? 'Xizmatni tahrirlash' : 'Yangi xizmat / narx'}</h2>
              <p className="admin-muted admin-muted--tight">
                Tilni tanlang, matnni kiriting. O‘zbekcha majburiy; boshqalar bo‘sh bo‘lsa o‘zbekcha nusxa ishlatiladi.
              </p>
              <form onSubmit={saveService} className="admin-form admin-form--service">
                <div className="admin-locale-tabs" role="tablist" aria-label="Xizmat tili">
                  {(
                    [
                      { key: 'uz' as const, label: 'O‘zbekcha', form: svcUz },
                      { key: 'ru' as const, label: 'Русский', form: svcRu },
                      { key: 'en' as const, label: 'English', form: svcEn },
                    ] as const
                  ).map(({ key, label, form }) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={svcLocaleTab === key}
                      className={`admin-locale-tab${svcLocaleTab === key ? ' is-active' : ''}${form.name.trim() ? ' is-filled' : ''}`}
                      onClick={() => setSvcLocaleTab(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {(
                  [
                    { key: 'uz' as const, form: svcUz, set: setSvcUz, required: true },
                    { key: 'ru' as const, form: svcRu, set: setSvcRu, required: false },
                    { key: 'en' as const, form: svcEn, set: setSvcEn, required: false },
                  ] as const
                )
                  .filter(({ key }) => key === svcLocaleTab)
                  .map(({ key, form, set, required }) => {
                    const L = serviceFormLabels[key]
                    return (
                      <div key={key} className="admin-locale-panel" role="tabpanel">
                        <label className="admin-field">
                          <span>{L.name}</span>
                          <input
                            value={form.name}
                            onChange={(e) => set({ ...form, name: e.target.value })}
                            required={required}
                          />
                        </label>
                        <label className="admin-field">
                          <span>{L.desc}</span>
                          <textarea
                            rows={3}
                            value={form.desc}
                            onChange={(e) => set({ ...form, desc: e.target.value })}
                            required={required}
                          />
                        </label>
                        <label className="admin-field">
                          <span>{L.price}</span>
                          <input
                            value={form.price}
                            onChange={(e) => set({ ...form, price: e.target.value })}
                            placeholder={L.pricePlaceholder}
                            required={required}
                          />
                        </label>
                        <label className="admin-field">
                          <span>{L.features}</span>
                          <textarea
                            rows={4}
                            value={form.features}
                            onChange={(e) => set({ ...form, features: e.target.value })}
                            placeholder={L.featuresPlaceholder}
                          />
                        </label>
                      </div>
                    )
                  })}

                <div className="admin-options-grid">
                  <label
                    className={`admin-option-tile${svcPopular ? ' is-on' : ''}`}
                    htmlFor="svc-popular"
                  >
                    <input
                      id="svc-popular"
                      type="checkbox"
                      className="admin-option-tile__check"
                      checked={svcPopular}
                      onChange={(e) => setSvcPopular(e.target.checked)}
                    />
                    <div className="admin-option-tile__body">
                      <span className="admin-option-tile__title">Mashhur xizmat</span>
                      <span className="admin-option-tile__hint">
                        Saytda «Eng ko‘p buyurtma» belgisi chiqadi
                      </span>
                    </div>
                    <span className="admin-option-tile__switch" aria-hidden />
                  </label>

                  <div className="admin-option-tile admin-option-tile--sort">
                    <div className="admin-option-tile__body">
                      <span className="admin-option-tile__title">Ko‘rinish tartibi</span>
                      <span className="admin-option-tile__hint">Kichik raqam — ro‘yxatda oldinroq</span>
                    </div>
                    <div className="admin-sort-stepper">
                      <button
                        type="button"
                        className="admin-sort-stepper__btn"
                        aria-label="Kamaytirish"
                        onClick={() => setSvcSort((n) => Math.max(0, n - 1))}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        className="admin-sort-stepper__input"
                        value={svcSort}
                        onChange={(e) => setSvcSort(Math.max(0, Number(e.target.value) || 0))}
                        aria-label="Tartib raqami"
                      />
                      <button
                        type="button"
                        className="admin-sort-stepper__btn"
                        aria-label="Oshirish"
                        onClick={() => setSvcSort((n) => n + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="btn btn-primary admin-btn-full">
                    {svcEditingId ? 'Saqlash' : 'Qo‘shish'}
                  </button>
                  {svcEditingId && (
                    <button
                      type="button"
                      className="admin-btn-ghost"
                      onClick={() => resetServiceForm()}
                    >
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-card admin-card--grow">
              <h2>Xizmatlar ({services.length})</h2>
              {services.length === 0 ? (
                <p className="admin-empty">
                  Hali xizmat yo‘q. Qo‘shing — saytda standart 3 ta karta o‘rniga ular chiqadi.
                </p>
              ) : (
                <ul className="admin-service-list">
                  {services.map((s) => (
                    <li key={s.id} className="admin-service-item">
                      <div className="admin-service-item-body">
                        <span className={`admin-badge ${s.is_popular ? 'admin-badge--event' : 'admin-badge--news'}`}>
                          {s.is_popular ? 'Mashhur' : 'Xizmat'} · #{s.sort_order}
                        </span>
                        <h3>{s.name_uz ?? s.name}</h3>
                        <div className="admin-locale-chips" aria-label="Tillar">
                          {(['uz', 'ru', 'en'] as const).map((loc) => {
                            const filled =
                              loc === 'uz'
                                ? Boolean((s.name_uz ?? s.name)?.trim())
                                : loc === 'ru'
                                  ? Boolean(s.name_ru?.trim())
                                  : Boolean(s.name_en?.trim())
                            return (
                              <span
                                key={loc}
                                className={`admin-locale-chip${filled ? ' is-filled' : ''}`}
                                title={filled ? `${loc.toUpperCase()} to‘ldirilgan` : `${loc.toUpperCase()} bo‘sh`}
                              >
                                {loc.toUpperCase()}
                              </span>
                            )
                          })}
                        </div>
                        <p className="admin-service-price">{s.price_text_uz ?? s.price_text}</p>
                        <p className="admin-muted">
                          {(s.description_uz ?? s.description ?? '').slice(0, 100)}
                          {(s.description_uz ?? s.description ?? '').length > 100 ? '…' : ''}
                        </p>
                      </div>
                      <div className="admin-service-actions">
                        <button type="button" className="admin-btn-ghost" onClick={() => editService(s)}>
                          Tahrirlash
                        </button>
                        <button type="button" className="admin-btn-danger" onClick={() => deleteService(s.id)}>
                          O‘chirish
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {tab === 'decors' && (
          <div className="admin-layout admin-layout--split admin-layout--services">
            <section className="admin-card admin-card--form">
              <h2>{decorEditingId ? 'Bezakni tahrirlash' : 'Yangi bezak'}</h2>
              <p className="admin-muted admin-muted--tight">
                Mijoz buyurtma formasida tanlaydi. Xizmat tanlanganda faqat shu xizmatga bog‘langan
                bezaklar chiqadi. Hech qaysi xizmat belgilanmasa — barcha xizmatlar uchun ko‘rinadi.
              </p>
              <form onSubmit={saveDecor} className="admin-form admin-form--service">
                <div className="admin-field">
                  <span>Surat</span>
                  {decorImagePreview && (
                    <div className="admin-decor-preview">
                      <img src={decorImagePreview} alt="" />
                    </div>
                  )}
                  <label className={`admin-upload ${decorSubmitting ? 'is-uploading' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={decorSubmitting}
                      onChange={(e) => {
                        onDecorImageSelect(e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />
                    <span className="admin-upload-icon" aria-hidden>
                      📷
                    </span>
                    <span className="admin-upload-title">
                      {decorSubmitting
                        ? 'Yuklanmoqda…'
                        : decorImagePreview
                          ? 'Boshqa surat tanlash'
                          : 'Bezak suratini yuklash'}
                    </span>
                    <span className="admin-upload-hint">PNG yoki JPG — buyurtmada ko‘rinadi</span>
                  </label>
                </div>

                <div className="admin-locale-tabs" role="tablist" aria-label="Bezak tili">
                  {(
                    [
                      { key: 'uz' as const, label: 'O‘zbekcha', form: decorUz },
                      { key: 'ru' as const, label: 'Русский', form: decorRu },
                      { key: 'en' as const, label: 'English', form: decorEn },
                    ] as const
                  ).map(({ key, label, form }) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={decorLocaleTab === key}
                      className={`admin-locale-tab${decorLocaleTab === key ? ' is-active' : ''}${form.name.trim() ? ' is-filled' : ''}`}
                      onClick={() => setDecorLocaleTab(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {(
                  [
                    { key: 'uz' as const, form: decorUz, set: setDecorUz, required: true },
                    { key: 'ru' as const, form: decorRu, set: setDecorRu, required: false },
                    { key: 'en' as const, form: decorEn, set: setDecorEn, required: false },
                  ] as const
                )
                  .filter(({ key }) => key === decorLocaleTab)
                  .map(({ key, form, set, required }) => {
                    const L = decorFormLabels[key]
                    return (
                      <div key={key} className="admin-locale-panel">
                        <label className="admin-field">
                          <span>{L.name}</span>
                          <input
                            value={form.name}
                            onChange={(e) => set({ ...form, name: e.target.value })}
                            required={required}
                          />
                        </label>
                        <label className="admin-field">
                          <span>{L.price}</span>
                          <input
                            value={form.price}
                            onChange={(e) => set({ ...form, price: e.target.value })}
                            placeholder={L.pricePlaceholder}
                            required={required}
                          />
                        </label>
                      </div>
                    )
                  })}

                <div className="admin-service-picker">
                  <div className="admin-service-picker__head">
                    <span className="admin-service-picker__title">Qaysi xizmatlar uchun</span>
                    <span className="admin-service-picker__hint">
                      Standart — barcha xizmatlar. Faqat ba’zilari uchun kerak bo‘lsa, pastdan tanlang.
                    </span>
                  </div>
                  {services.length === 0 ? (
                    <p className="admin-muted">Avval Xizmatlar bo‘limida kamida bitta xizmat qo‘shing.</p>
                  ) : (
                    <>
                      <button
                        type="button"
                        className={`admin-service-picker__all${decorServiceIds.length === 0 ? ' is-on' : ''}`}
                        onClick={setDecorAllServices}
                      >
                        <span className="admin-service-picker__all-icon" aria-hidden>
                          ✓
                        </span>
                        Barcha xizmatlar
                      </button>
                      <p className="admin-service-picker__or">yoki tanlangan xizmatlar:</p>
                      <div className="admin-service-chips" role="group" aria-label="Xizmatlar">
                        {services.map((s) => {
                          const selected =
                            decorServiceIds.length > 0 && decorServiceIds.includes(s.id)
                          return (
                            <button
                              key={s.id}
                              type="button"
                              className={`admin-service-chip${selected ? ' is-on' : ''}`}
                              aria-pressed={selected}
                              onClick={() => toggleDecorService(s.id)}
                            >
                              {s.name_uz ?? s.name}
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>

                <div className="admin-option-tile admin-option-tile--sort">
                  <div className="admin-option-tile__body">
                    <span className="admin-option-tile__title">Ko‘rinish tartibi</span>
                    <span className="admin-option-tile__hint">Kichik raqam — ro‘yxatda oldinroq</span>
                  </div>
                  <div className="admin-sort-stepper">
                    <button
                      type="button"
                      className="admin-sort-stepper__btn"
                      aria-label="Kamaytirish"
                      onClick={() => setDecorSort((n) => Math.max(0, n - 1))}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={0}
                      className="admin-sort-stepper__input"
                      value={decorSort}
                      onChange={(e) => setDecorSort(Math.max(0, Number(e.target.value) || 0))}
                      aria-label="Tartib raqami"
                    />
                    <button
                      type="button"
                      className="admin-sort-stepper__btn"
                      aria-label="Oshirish"
                      onClick={() => setDecorSort((n) => n + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="admin-form-actions">
                  <button type="submit" className="btn btn-primary admin-btn-full" disabled={decorSubmitting}>
                    {decorSubmitting ? 'Saqlanmoqda…' : decorEditingId ? 'Saqlash' : 'Qo‘shish'}
                  </button>
                  {decorEditingId && (
                    <button type="button" className="admin-btn-ghost" onClick={() => resetDecorForm()}>
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>
            </section>

            <section className="admin-card admin-card--grow">
              <h2>Bezaklar ({decorList.length})</h2>
              {decorList.length === 0 ? (
                <p className="admin-empty">
                  Hali bezak yo‘q. Qo‘shing — mijoz buyurtmada tanlay oladi.
                </p>
              ) : (
                <ul className="admin-decor-list">
                  {decorList.map((d) => (
                    <li key={d.id} className="admin-decor-item">
                      <img src={d.image_url} alt="" className="admin-decor-thumb" />
                      <div className="admin-decor-item-body">
                        <h3>{d.name_uz}</h3>
                        <p className="admin-service-price">
                          {d.price_text_uz ?? d.price_text ?? '—'}
                        </p>
                        <p className="admin-muted">
                          {(d.service_decors ?? []).length === 0
                            ? 'Barcha xizmatlar'
                            : `${(d.service_decors ?? []).length} ta xizmat`}
                          {' · '}#{d.sort_order}
                        </p>
                      </div>
                      <div className="admin-service-actions">
                        <button type="button" className="admin-btn-ghost" onClick={() => editDecor(d)}>
                          Tahrirlash
                        </button>
                        <button type="button" className="admin-btn-danger" onClick={() => deleteDecor(d.id)}>
                          O‘chirish
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {tab === 'gallery' && (
          <div className="admin-layout">
            <section className="admin-card">
              <h2>Yangi surat</h2>
              <p className="admin-muted">Surat sayt galereyasida ko‘rinadi.</p>
              <label className={`admin-upload ${uploading ? 'is-uploading' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading}
                  onChange={(e) => {
                    const files = e.target.files
                    if (files?.length) uploadImages(files)
                    e.target.value = ''
                  }}
                />
                <span className="admin-upload-icon" aria-hidden>
                  📷
                </span>
                <span className="admin-upload-title">
                  {uploading
                    ? uploadProgress
                      ? `Yuklanmoqda… (${uploadProgress})`
                      : 'Yuklanmoqda…'
                    : 'Surat tanlang yoki tashlang'}
                </span>
                <span className="admin-upload-hint">
                  Bir yoki bir nechta surat (PNG, JPG) — galereyada ko‘rinadi
                </span>
              </label>
            </section>

            <section className="admin-card admin-card--grow">
              <div className="admin-card-head">
                <h2>Galereya ({gallery.length})</h2>
              </div>
              {gallery.length === 0 ? (
                <p className="admin-empty">Hali surat yo‘q. Yuqoridan yuklang.</p>
              ) : (
                <div className="admin-gallery-grid">
                  {gallery.map((item) => (
                    <figure key={item.id} className="admin-gallery-item">
                      <img src={item.image_url} alt="" />
                      <button
                        type="button"
                        className="admin-gallery-delete"
                        onClick={() => deleteGallery(item.id)}
                      >
                        O‘chirish
                      </button>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'posts' && (
          <div className="admin-layout admin-layout--split">
            <section className="admin-card">
              <h2>Yangilik yoki tadbir</h2>
              <form onSubmit={addPost} className="admin-form">
                <label className="admin-field">
                  <span>Sarlavha</span>
                  <input value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
                </label>
                <label className="admin-field">
                  <span>Turi</span>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as 'news' | 'event')}
                  >
                    <option value="news">Yangilik</option>
                    <option value="event">Tadbir</option>
                  </select>
                </label>
                {postType === 'event' && (
                  <label className="admin-field">
                    <span>Sana</span>
                    <input type="date" value={postDate} onChange={(e) => setPostDate(e.target.value)} />
                  </label>
                )}
                <div className="admin-field">
                  <span>Surat (ixtiyoriy)</span>
                  <label className={`admin-upload admin-upload--compact ${postSubmitting ? 'is-uploading' : ''}`}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={postSubmitting}
                      onChange={(e) => {
                        onPostImageSelect(e.target.files?.[0])
                        e.target.value = ''
                      }}
                    />
                    <span className="admin-upload-title">
                      {postImageFile ? postImageFile.name : 'Telefon yoki kompyuterdan surat tanlang'}
                    </span>
                  </label>
                  {postImagePreview && (
                    <div className="admin-image-preview">
                      <img src={postImagePreview} alt="" />
                      <button type="button" className="admin-btn-ghost admin-image-remove" onClick={clearPostImage}>
                        Suratni olib tashlash
                      </button>
                    </div>
                  )}
                </div>
                <label className="admin-field">
                  <span>Matn</span>
                  <textarea
                    rows={5}
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    required
                  />
                </label>
                <button type="submit" className="btn btn-primary admin-btn-full" disabled={postSubmitting}>
                  {postSubmitting ? 'Yuklanmoqda…' : 'Nashr qilish'}
                </button>
              </form>
            </section>

            <section className="admin-card admin-card--grow">
              <h2>Nashr etilgan ({posts.length})</h2>
              {posts.length === 0 ? (
                <p className="admin-empty">Hali post yo‘q.</p>
              ) : (
                <ul className="admin-post-list">
                  {posts.map((p) => (
                    <li key={p.id} className="admin-post-item">
                      {p.image_url && (
                        <img src={p.image_url} alt="" className="admin-post-thumb" />
                      )}
                      <div className="admin-post-item-body">
                        <span className={`admin-badge admin-badge--${p.post_type}`}>
                          {p.post_type === 'event' ? 'Tadbir' : 'Yangilik'}
                        </span>
                        <h3>{p.title}</h3>
                        {p.event_date && <time>{p.event_date}</time>}
                        <p>{p.body.slice(0, 120)}{p.body.length > 120 ? '…' : ''}</p>
                      </div>
                      <button type="button" className="admin-btn-danger" onClick={() => deletePost(p.id)}>
                        O‘chirish
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  )
}

function AdminBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={`admin-brand ${compact ? 'admin-brand--compact' : ''}`}>
      <span className="admin-brand-icon" aria-hidden>
        🧺
      </span>
      <span className="admin-brand-text">Sevinc Picnic</span>
    </Link>
  )
}
