# SOAMIQ Website

A lightweight, data-driven website for **SOAMIQ LABS** built with local HTML, CSS, and JavaScript files.

## Project structure

- `index.html` - page layout and section placeholders
- `styles.css` - site styling, responsive behavior, and theme
- `data.js` - editable local content/data source for all sections
- `script.js` - rendering logic that binds `data.js` to the UI

## Run locally

Open `index.html` directly in your browser, or serve the folder with a simple local server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Edit site content

Update `data.js` to change text, navigation links, capabilities, featured work, team model, and contact details.  
No layout code changes are required for normal content updates.
