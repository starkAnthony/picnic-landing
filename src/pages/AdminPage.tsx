import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { uploadGalleryImage, uploadPostImage } from '../lib/uploadImage'
import type { GalleryItem, Post } from '../types/content'
import './AdminPage.css'

export default function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'gallery' | 'posts'>('gallery')
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [postType, setPostType] = useState<'news' | 'event'>('news')
  const [postDate, setPostDate] = useState('')
  const [postImageFile, setPostImageFile] = useState<File | null>(null)
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [postSubmitting, setPostSubmitting] = useState(false)

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
    const [g, p] = await Promise.all([
      supabase.from('gallery_items').select('*').order('sort_order'),
      supabase.from('posts').select('*').order('created_at', { ascending: false }),
    ])
    if (g.data) setGallery(g.data as GalleryItem[])
    if (p.data) setPosts(p.data as Post[])
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
          <p className="admin-muted">Supabase-da yaratilgan email va parol</p>
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
