# soamiq.ai — Soamiq Labs Private Limited

A modern, AI-native marketing website for **Soamiq** (Soamiq Labs Private Limited).

> **Tagline:** Trust Data. Trust AI. Build Smarter. Build Optimized.

Built as a fast, dependency-free, **data-driven static site** (HTML + CSS + vanilla
JS). All content lives in one JSON-style data file, so copy can be updated without
touching markup. No build step is required — it deploys to any static host.

## Quick start

```bash
# Serve locally (recommended — root-relative paths need a server)
python3 -m http.server 8000
# then open http://localhost:8000
```

## Pages / routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `index.html` | Home: hero, capabilities, flow, services, industries, process, results, FAQ |
| `/services` | `services/index.html` | Service pillars + results |
| `/frameworks` | `frameworks/index.html` | Reusable frameworks (GAURI) |
| `/gauri` | `gauri/index.html` | GAURI revenue-intelligence platform |
| `/about` | `about/index.html` | Company, leadership & specialists, stats |
| `/contact` | `contact/index.html` | Contact info + form |
| `/privacy`, `/terms` | `privacy/`, `terms/` | Legal |
| `/use-cases/<slug>` | `use-cases/<slug>/` | Solution-play use cases |

## How it works

- **`assets/js/data.js`** — all site content as `window.SOAMIQ`. **Edit this file to
  change any text** (hero, services, team, FAQ, legal, etc.). It's loaded as a global
  (not via `fetch`) so the site also works from `file://`.
- **`assets/js/app.js`** — renders the shared header/footer and each page's content
  from the data, and wires interactions (typewriter tagline, scroll reveals, mobile
  menu, FAQ accordion, contact form).
- **`assets/css/styles.css`** — the AI-native design system (dark theme, blue→cyan
  brand gradient, glassmorphism, motion). Change brand colors via the CSS variables
  in the `:root` block.
- Each HTML page is a thin shell with per-page `<title>`/meta for SEO and a
  `<main id="app" data-page="...">` that tells `app.js` what to render.

## Branding / logo

The SOAMIQ wordmark is recreated as a crisp, scalable SVG/CSS logo (blue→cyan glow
with the circuit/soundwave motif):

- `assets/img/favicon.svg` — the waveform mark (favicon / app icon)
- `assets/img/logo.svg` — full wordmark (used for Open Graph / sharing)
- The header logo is rendered inline in `app.js` (`brandMarkup()`) using the **Jura**
  font so it stays crisp and responsive.

**To use your exact PNG logo:** drop it in `assets/img/` (e.g. `logo.png`) and either
replace the `og:image` references or swap `brandMarkup()` in `app.js` for an
`<img src="/assets/img/logo.png" alt="Soamiq">`.

## Contact form

The form validates input client-side and opens the visitor's mail client to
`hello@soamiq.ai` (no backend). To capture submissions, point it at a service such as
[Formspree](https://formspree.io) or your own endpoint in `app.js` (the submit
handler inside `initInteractions`).

## Deploying

Static, so it hosts anywhere. For the **soamiq.ai** domain:

- **GitHub Pages** — `CNAME` (already included) sets the custom domain; enable Pages
  for the branch root. `.nojekyll` is included so all files are served as-is.
- **Netlify / Vercel / Cloudflare Pages** — connect the repo; no build command,
  publish directory is the repo root. These hosts resolve clean URLs automatically.

DNS: point `soamiq.ai` at your host per their docs (GitHub Pages A/ALIAS records, or
the host's nameservers).

## License

© 2026 Soamiq Labs Private Limited. All rights reserved.
