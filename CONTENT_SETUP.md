# Content system — gallery, news, Instagram, admin

## Overview

| Feature | How it works |
|---------|----------------|
| **Gallery & news** | Supabase database + Storage (owner updates at `/admin`) |
| **Instagram live feed** | Meta Instagram API (optional, via Vercel env vars) |
| **Booking form** | Telegram bot (existing `TELEGRAM_BOT_TOKEN`) |

Without Supabase, the site still works with static images in `public/images/`.

---

## 1. Supabase (admin + dynamic content)

### Create project

1. [supabase.com](https://supabase.com) → New project (free tier).
2. **Settings → API** → copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`

### Run SQL

**SQL Editor** → paste `supabase/schema.sql` → **Run**.

### Storage bucket

1. **Storage** → **New bucket** → name: `gallery` → **Public bucket** ✓
2. **Policies** → allow public read; authenticated users can upload (or use Storage policy wizard).

### Owner login

1. **Authentication** → **Users** → **Add user** → email + password for business owner.
2. Owner opens: `https://your-site.vercel.app/admin`

### Vercel env vars

| Key | Value |
|-----|--------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

Redeploy after adding.

### Local `.env`

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
```

---

## 2. Instagram live photos (optional)

Instagram does **not** allow scraping `@sevinc_picnic` without official API.

### Requirements

- Instagram **Business** or **Creator** account
- Facebook Page linked to Instagram
- [Meta Developer](https://developers.facebook.com/) app

### Steps (summary)

1. Meta Developer → Create app → add **Instagram Graph API**.
2. Connect Instagram Business account → get long-lived **access token**.
3. Get **Instagram User ID** (IG User ID, numeric).
4. Vercel env vars:

| Key | Value |
|-----|--------|
| `INSTAGRAM_ACCESS_TOKEN` | long-lived token |
| `INSTAGRAM_USER_ID` | IG user id |

5. Redeploy.

The site section **“Instagramdan”** will show latest posts automatically. Until then, it links to your profile.

**Comments** are not available via API for display on websites (Instagram policy).

---

## 3. Admin panel

URL: **`/admin`**

- **Gallery** — upload images (stored in Supabase)
- **News & events** — title, text, optional image URL, event date

Changes appear on the live site immediately (no git push needed).

---

## 4. What still needs git push

- Code changes (design, translations, new features)
- Env-only changes on Vercel → **Redeploy** only
