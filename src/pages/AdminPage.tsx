import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  DEFAULT_INSTAGRAM_HANDLE,
  DEFAULT_PHONE_DISPLAY,
  DEFAULT_TELEGRAM_USERNAME,
  normalizeUsername,
} from '../site'
import { uploadGalleryImage, uploadPostImage } from '../lib/uploadImage'
import type { GalleryItem, Post, Service } from '../types/content'
import './AdminPage.css'

export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'settings' | 'services' | 'gallery' | 'posts'>('settings')
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [svcName, setSvcName] = useState('')
  const [svcDesc, setSvcDesc] = useState('')
  const [svcPrice, setSvcPrice] = useState('')
  const [svcFeatures, setSvcFeatures] = useState('')
  const [svcPopular, setSvcPopular] = useState(false)
  const [svcSort, setSvcSort] = useState(0)
  const [svcEditingId, setSvcEditingId] = useState<string | null>(null)
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
    const [g, p, s, settings] = await Promise.all([
      supabase.from('gallery_items').select('*').order('sort_order'),
      supabase.from('posts').select('*').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    ])
    if (g.data) setGallery(g.data as GalleryItem[])
    if (p.data) setPosts(p.data as Post[])
    if (s.data) setServices(s.data as Service[])
    if (settings.data) {
      setPhoneDisplay(settings.data.phone_display ?? DEFAULT_PHONE_DISPLAY)
      setTelegramUsername(normalizeUsername(settings.data.telegram_username ?? DEFAULT_TELEGRAM_USERNAME))
      setInstagramHandle(normalizeUsername(settings.data.instagram_handle ?? DEFAULT_INSTAGRAM_HANDLE))
      setInstagramUrl(settings.data.instagram_url ?? '')
    }
  }

  async function saveSettings(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')
    setSettingsSaving(true)

    const { error: err } = await supabase.from('site_settings').upsert({
      id: 1,
      phone_display: phoneDisplay.trim(),
      telegram_username: normalizeUsername(telegramUsername),
      instagram_handle: normalizeUsername(instagramHandle),
      instagram_url: instagramUrl.trim() || null,
      updated_at: new Date().toISOString(),
    })

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
    setSvcName('')
    setSvcDesc('')
    setSvcPrice('')
    setSvcFeatures('')
    setSvcPopular(false)
    setSvcSort(nextSort)
    setSvcEditingId(null)
  }

  function editService(s: Service) {
    setSvcEditingId(s.id)
    setSvcName(s.name)
    setSvcDesc(s.description)
    setSvcPrice(s.price_text)
    setSvcFeatures(s.features.join('\n'))
    setSvcPopular(s.is_popular)
    setSvcSort(s.sort_order)
    setError('')
  }

  async function saveService(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setError('')

    const payload = {
      name: svcName.trim(),
      description: svcDesc.trim(),
      price_text: svcPrice.trim(),
      features: parseFeatures(svcFeatures),
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
              Telefon, Telegram va Instagram — bosh sahifa, footer va buyurtma bo‘limida ko‘rinadi.
              <br />
              <strong>Eslatma:</strong> Buyurtmalarni qabul qilish (bot token va guruh id) hali Vercel
              Environment Variables da — bu yerda faqat mijozlarga ko‘rinadigan kontaktlar.
            </p>
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
          <div className="admin-layout admin-layout--split">
            <section className="admin-card">
              <h2>{svcEditingId ? 'Xizmatni tahrirlash' : 'Yangi xizmat / narx'}</h2>
              <p className="admin-muted">
                Saytdagi xizmat kartochkalari va buyurtma formasi shu yerdan to‘ldiriladi.
              </p>
              <form onSubmit={saveService} className="admin-form">
                <label className="admin-field">
                  <span>Nomi</span>
                  <input value={svcName} onChange={(e) => setSvcName(e.target.value)} required />
                </label>
                <label className="admin-field">
                  <span>Qisqa tavsif</span>
                  <textarea
                    rows={3}
                    value={svcDesc}
                    onChange={(e) => setSvcDesc(e.target.value)}
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Narx (matn)</span>
                  <input
                    value={svcPrice}
                    onChange={(e) => setSvcPrice(e.target.value)}
                    placeholder="masalan: 1 500 000 so‘m yoki Kelishuv asosida"
                    required
                  />
                </label>
                <label className="admin-field">
                  <span>Imkoniyatlar (har qator — bitta punkt)</span>
                  <textarea
                    rows={5}
                    value={svcFeatures}
                    onChange={(e) => setSvcFeatures(e.target.value)}
                    placeholder={'Piknik uslubida bezak\nJoylashtirish va yig‘ish'}
                  />
                </label>
                <label className="admin-field admin-field--row">
                  <input
                    type="checkbox"
                    checked={svcPopular}
                    onChange={(e) => setSvcPopular(e.target.checked)}
                  />
                  <span>Eng ko‘p buyurtma (badge)</span>
                </label>
                <label className="admin-field">
                  <span>Tartib (kichik raqam — oldinroq)</span>
                  <input
                    type="number"
                    min={0}
                    value={svcSort}
                    onChange={(e) => setSvcSort(Number(e.target.value))}
                  />
                </label>
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
                        <h3>{s.name}</h3>
                        <p className="admin-service-price">{s.price_text}</p>
                        <p className="admin-muted">{s.description.slice(0, 100)}{s.description.length > 100 ? '…' : ''}</p>
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
