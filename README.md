# SOAMIQ LABS — Website

A modern, responsive, single-page marketing website for **SOAMIQ LABS**.
Built with plain HTML, CSS, and vanilla JavaScript — no build step required.

> Note: This site was scaffolded by a Cloud Agent that did not have access to
> your local machine. The copy, stats, products, and team are placeholders
> designed to be easy to replace with your real content.

## Quick start

Because it's a static site, you can open it directly or serve it locally:

```bash
# Option A — just open the file
open index.html        # macOS
xdg-open index.html    # Linux

# Option B — serve with any static server (recommended for correct paths)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Project structure

```
.
├── index.html            # All page sections (nav, hero, about, capabilities,
│                         # products, process, team, contact, footer)
├── assets/
│   ├── css/styles.css    # Theme tokens + all styling (responsive + motion)
│   ├── js/main.js        # Nav, mobile menu, scroll reveal, contact form
│   └── img/              # Drop logos / images here
└── README.md
```

## Customizing

- **Brand & copy** — edit text directly in `index.html`. Section IDs:
  `#home`, `#about`, `#capabilities`, `#products`, `#process`, `#team`, `#contact`.
- **Colors & fonts** — change the CSS variables in the `:root` block at the top
  of `assets/css/styles.css` (`--brand`, `--brand-2`, `--accent`, `--grad`, etc.).
- **Contact email** — update `hello@soamiqlabs.com` in `index.html` and
  `assets/js/main.js`.
- **Team & products** — duplicate the `.member` / `.product` blocks in
  `index.html` to add more entries.

### Wiring up the contact form

The form currently validates input and falls back to opening the visitor's
email client (`mailto:`). To collect submissions, point the `<form>` at a
service such as [Formspree](https://formspree.io) or your own endpoint and
update the submit handler in `assets/js/main.js`.

## Deploying

This is static, so it can be hosted anywhere:

- **GitHub Pages** — Settings → Pages → deploy from branch (`/root`).
- **Netlify / Vercel / Cloudflare Pages** — drag-and-drop or connect the repo;
  no build command needed, publish directory is the repo root.

## License

© SOAMIQ LABS. All rights reserved.
