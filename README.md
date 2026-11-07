# Shubh Deepavali — Diwali Celebration Site

A self-contained static website celebrating Diwali with canvas fireworks,
animated diyas, flying diyas, sparkles and glowing greeting animations.

## Run locally

No build step — just open `index.html` in a browser, or serve the folder:

```
npx serve .
```

## Deploy to Vercel

**Option 1 — Vercel CLI**
```
npx vercel
```

**Option 2 — GitHub**
Push this folder to a GitHub repo, then import it at https://vercel.com/new.
Vercel detects it as a static site automatically — no framework or build
command needed.

## Files

- `index.html` — page markup (hero, diyas row, wishes card, footer)
- `styles.css` — all styling & CSS animations (flickering flames, shimmer text)
- `fireworks.js` — canvas fireworks engine (auto-launch + click-to-fire)
- `main.js` — flying diyas, sparkles, scroll reveals, diya row builder
- `vercel.json` — static-site headers/cache config
