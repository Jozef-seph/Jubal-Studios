# Jubal Studios website

A complete multi-page marketing site for a music studio in Thika: lessons, recording, rehearsal booking, gallery, pricing, and contact. Typography uses **Plus Jakarta Sans** (see `css/styles.css` and Google Fonts link in each HTML file).

## Run locally

Open `index.html` in a browser, or serve the folder so all assets load predictably:

```bash
# Python 3
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Host on GitHub, deploy on Render

This site is **static files** (HTML/CSS/JS) — no server build is required. Typical flow: **GitHub = source code**, **Render = hosting + HTTPS**.

### 1. Put the project on GitHub

1. On GitHub, create a **new empty repository** (e.g. `jubal-studios-website`). Do not add a README if you already have one locally.
2. In a terminal, from **this project folder** (the one that contains `index.html`):

> **Git folder safety:** Run these commands only from the **Jubal website folder**. Check with `git rev-parse --show-toplevel` — it should print that folder’s path. If `git status` lists unrelated files (Desktop, Documents, `.cursor`, etc.), your `.git` is in the wrong place; do **not** push until you fix that (e.g. remove the mistaken `.git` and run `git init` again **inside** this project only).

```bash
git init
git add .
git commit -m "Initial site: Jubal Studios static pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Replace `YOUR_USERNAME/YOUR_REPO` with your real GitHub path. If the repo already exists and you use SSH, use `git@github.com:YOUR_USERNAME/YOUR_REPO.git` instead.

### 2. Deploy on Render (from that GitHub repo)

**Option A — Blueprint (uses `render.yaml` in this repo)**  

1. Log in at [render.com](https://render.com) with **GitHub**.
2. **New** → **Blueprint** → connect the repository → leave the default blueprint path **`render.yaml`** at the repo root.
3. Apply the blueprint. Render will create a **static site** that publishes from **`./`** (repo root). Pushes to the connected branch trigger redeploys if auto-deploy is on.

**Option B — Static Site only (dashboard)**  

1. **New** → **Static Site** → connect the same GitHub repo.  
2. **Branch:** `main` (or your default branch).  
3. **Root directory:** leave empty (repo root).  
4. **Build command:** `true` (no-op; there is nothing to compile).  
5. **Publish directory:** `.` (publish the repo root so `index.html` is the site entry).

Your site will get a URL like `https://jubal-studios-site.onrender.com` (exact name depends on what you choose). **HTTPS is automatic.**

### Notes

- **`netlify.toml` / `vercel.json`** in this repo apply only on Netlify/Vercel. On Render, **`render.yaml`** sets a few basic headers; you can extend them in the [Render static headers docs](https://render.com/docs/static-site-headers).
- **`Content-Security-Policy`** from Netlify/Vercel is **not** duplicated in `render.yaml` (long and easy to break embeds). Add CSP in Render later if you want it there too.
- Gallery images live under `screenshots/` — keep them committed so production URLs work.

## Deploy with HTTPS (launch)

`file://` and plain `http://localhost` are fine for development, but **customers should use `https://`** on a real host so traffic is encrypted and you can apply security headers.

| Platform | What to do |
|----------|------------|
| **Render (from GitHub)** | See **[Host on GitHub, deploy on Render](#host-on-github-deploy-on-render)** above. Use **`render.yaml`** (Blueprint) or a manual **Static Site** with publish dir **`.`** and build **`true`**. |
| **Netlify** | Connect this repo or drag the folder into [Netlify](https://www.netlify.com/). Set publish directory to **`.`** (root). HTTPS is automatic. **`netlify.toml`** adds security headers (CSP, anti-clickjacking, etc.). |
| **Vercel** | Import the repo or run `vercel` from this folder. **`vercel.json`** applies the same headers. |
| **GitHub Pages** | Repo → Settings → Pages → deploy from branch; root. **`.nojekyll`** stops Jekyll from dropping files it does not recognise. HTTPS is automatic; custom headers need an extra layer (e.g. Cloudflare) if you want CSP there too. |

If you add **new embeds, fonts, or image CDNs**, update **Content-Security-Policy** in both `netlify.toml` and `vercel.json` or the browser may block them.

## Customize branding & contact

1. **WhatsApp** — Edit `WHATSAPP_NUMBER` at the top of `js/main.js` (digits only, country code, no `+`). Static `wa.me` buttons in HTML should use the same digits. **`JubalStudios.openWhatsApp(text)`** still opens WhatsApp from the console or custom buttons if you need it.
2. **WhatsApp (static buttons in HTML)** — Any `https://wa.me/…` links in `*.html` must use the **same digits** as `WHATSAPP_NUMBER` (no `+` in the URL). If you change the number in `js/main.js`, update those links too.
3. **Email / phone** — Update `STUDIO_EMAIL`, `STUDIO_PHONE` in `js/main.js` and the visible mailto / tel links in `contact.html` and `index.html`.
4. **Map** — In `contact.html` (and the home contact strip), replace the Google Maps iframe `src` with your embed URL from Google Maps → Share → Embed a map.
5. **Images & video** — Gallery photos live in `screenshots/` and are referenced from `gallery.html`. Add or replace PNG/JPEG files there (keep names updated in the HTML if you rename). Update gallery iframes for your YouTube uploads.
6. **Pricing table** — Fill in the `—` amounts on `pricing.html` and package cards sitewide.

## Optional: WhatsApp message format (dev / API)

The helper **`buildBookingWhatsAppMessage`** matches what booking forms send to WhatsApp on submit. Run `node scripts/test-whatsapp-booking.js` to sanity-check encoded URL length.

## Forms behaviour (current)

- **Lesson / recording / rehearsal** (`data-booking-form`): on valid submit, opens WhatsApp with a structured message built from the form fields (same `WHATSAPP_NUMBER` as `js/main.js`). The visitor taps **Send** in WhatsApp to deliver the request. No server or email — the studio receives it in WhatsApp.
- **Contact** (`contact.html`): optional name + message, then **Open WhatsApp** with a prefilled enquiry. Phone and email on the page are for other channels.

## Files

| Path | Purpose |
|------|--------|
| `index.html` | Home — hero, paths, about, equipment strip |
| `lessons.html` | Programme grid (flyer lineup), book-a-lesson form |
| `recording.html` | Recording packages, prep, booking form |
| `rehearsal.html` | Rehearsal packages and location, room photo, sample calendar, booking form |
| `studio-services.html` | Hub for recording vs rehearsal + equipment highlights |
| `booking.html` | Booking hub — links to lesson, recording, and rehearsal forms |
| `gallery.html` | Photo grid + video embeds |
| `screenshots/` | Gallery images (PNG screenshots referenced by `gallery.html`) |
| `pricing.html` | Rate tables |
| `contact.html` | WhatsApp enquiry composer, phone, email, map |
| `css/styles.css` | Global layout, components, responsive nav |
| `assets/jubal-studios-logo.png` | Header mark — gold JS monogram (all pages) |
| `assets/rehearsal-studio-flyer.png` | Rehearsal promo image (used on `rehearsal.html`) |
| `js/main.js` | Mobile nav, booking → WhatsApp on submit, contact composer, toasts; `JubalStudios.openWhatsApp` / `previewBookingMessage` |
| `render.yaml` | [Render](https://render.com) Blueprint — static site from repo root (`./`), basic security headers |
| `netlify.toml` | Netlify publish root + security headers (CSP, etc.) |
| `vercel.json` | Same security headers for Vercel |
| `.nojekyll` | GitHub Pages: disable Jekyll for pure static files |
| `scripts/test-whatsapp-booking.js` | Quick check: sample message + encoded length (run with `node`) |

## Policies & social links

Footer links for privacy/terms and social networks are placeholders (`#`). Point them to real URLs when available.
