# Jubal Studios website

A complete multi-page marketing site for a music studio in Thika: lessons, recording, rehearsal booking, gallery, pricing, and contact. Typography uses **Cormorant Garamond** (headings, logo wordmark context) and **Jost** at light weight for body, labels, and UI — see `css/styles.css` and the Google Fonts link in each HTML file.

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
3. **Email / phone** — Update `STUDIO_EMAIL`, `STUDIO_PHONE`, and `WHATSAPP_NUMBER` in `js/main.js`. Match any static `wa.me/…` links in `*.html` to `WHATSAPP_NUMBER`. **`contact.html`** shows phone (with `tel:`) and WhatsApp (no email in the UI).
4. **Map** — `contact.html` uses an embed centred on [Kanyiri Building from your Google Maps link](https://maps.app.goo.gl/2J62XjgrZsc5fVZo8); update coordinates or the “Open in Google Maps” URL if the pin moves.
5. **Images & video** — Gallery photos and the home “about” image live in `screenshots/` (`gallery.html` and `index.html`). Add or replace PNG/JPEG files there (keep names updated in the HTML if you rename). Update gallery iframes for your YouTube uploads.
6. **Pricing & rates** — Edit the rehearsal figures and “On request” rows in the **Rates** section on `studio-services.html` (`#pricing`).

## Forms behaviour (current)

- **Studio hub** (`studio-services.html`): same **`js/main.js`** booking → WhatsApp flow as other pages, plus a small inline script for tabbed forms and hash deep-links. Hub layout, pricing, and booking UI live in **`css/styles.css`** under `body[data-page="services"]`.
- **Contact** (`contact.html`): optional name + message, then **Contact us** to open a prefilled WhatsApp chat. Contact-only tweaks (visible kickers, hero height) are in **`css/styles.css`** under `body[data-page="contact"]`.

## Files

| Path | Purpose |
|------|--------|
| `index.html` | Home — hero, two gateway cards (lessons / studio & booking), about story |
| `lessons.html` | Programme grid and book-a-lesson form |
| `studio-services.html` | Studio, pricing & booking hub — **`css/styles.css`** (studio block) + **`js/main.js`** |
| `booking.html` | Redirects to `studio-services.html#booking` |
| `pricing.html` | Redirects to `studio-services.html#pricing` |
| `recording.html` | Recording packages, prep, booking form |
| `rehearsal.html` | Rehearsal packages, room photo, sample calendar, booking form |
| `gallery.html` | Photo grid + video embeds |
| `screenshots/` | Gallery + home “about” images (referenced by `gallery.html` and `index.html`) |
| `contact.html` | WhatsApp composer, phone with `tel:` link, map (contact-only CSS in **`css/styles.css`**) |
| `css/styles.css` | **Single main stylesheet** — global layout, components, responsive nav, studio hub (`body[data-page="services"]`), contact tweaks (`body[data-page="contact"]`) |
| `assets/jubal-studios-logo.png` | Header mark — gold JS monogram (all pages) |
| `assets/rehearsal-studio-flyer.png` | Rehearsal promo image (used on `rehearsal.html`) |
| `js/main.js` | Mobile nav, booking → WhatsApp on submit, contact composer, toasts; `JubalStudios.openWhatsApp` / `previewBookingMessage` |
| `render.yaml` | [Render](https://render.com) Blueprint — static site from repo root (`./`), basic security headers |
| `netlify.toml` | Netlify publish root + security headers (CSP, etc.) |
| `vercel.json` | Same security headers for Vercel |
| `.nojekyll` | GitHub Pages: disable Jekyll for pure static files |

## Policies & social links

Footer links for privacy/terms and social networks are placeholders (`#`). Point them to real URLs when available.
