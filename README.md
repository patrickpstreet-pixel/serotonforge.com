# Seroton Forge

Seroton Forge is a lightweight, modular JavaScript microgame engine and accompanying website showcasing playable microgames and engine features. It’s designed for rapid prototyping and shipping small, delightful games quickly.

Project lead: Patrick Street (with assistance from AI)

---

## Overview

This repository contains the Seroton Forge static website (landing page, branding, demo animation) and a set of example microgames (a playable Snake demo is included). The site is built with plain HTML, CSS and JavaScript so it is easy to run locally and to embed simple demos.

Intent
- Provide a landing page that demonstrates the engine and links to downloads.
- Host example microgames that are easy to fork and extend.
- Serve as a minimal reference implementation for building microgames and small game tooling.

---

## Features

- Static landing page with a hero canvas animation
- Placeholder branding assets (SVG) for quick previews
- Playable example: `examples/snake/`
- Minimal, dependency-free code (vanilla HTML/CSS/JS)
- Easy to extend with additional example games

---

## Quick start (preview locally)

Requirements: Git (optional if using the web UI) and a modern web browser.

1. Clone the repo:
   ```
   git clone https://github.com/patrickpstreet-pixel/serotonforge.com.git
   cd serotonforge.com
   ```

2. Serve the site from the repository root with a simple static server:

   - Python 3:
     ```
     python -m http.server 8000
     # Open http://localhost:8000/
     ```

   - Node (http-server):
     ```
     npm install -g http-server
     http-server -c-1
     # Open the printed local URL, e.g. http://127.0.0.1:8080/
     ```

3. Open the Snake example:
   - http://localhost:8000/examples/snake/
   - Controls: arrow keys to move, Space to restart

---

## Important paths

- `index.html` — main landing page
- `styles.css` — site styles
- `script.js` — hero canvas animation
- `branding/` — placeholder logos and manifest (`logo-original.svg`, `og-image.svg`, `favicon.svg`, `apple-touch-icon.svg`, `site.webmanifest`)
- `examples/` — example microgames (e.g. `examples/snake/`)

---

## Adding or replacing branding assets

Replace the placeholder SVGs in `branding/` with your final artwork. Recommended filenames:
- `branding/logo-original.svg` — site emblem (header/footer)
- `branding/og-image.svg` — montage / social share image
- `branding/favicon.svg` — favicon
- `branding/apple-touch-icon.svg` — iOS icon
- `branding/site.webmanifest` — optional web manifest

Use relative paths as currently used in the site (these work for GitHub Pages publishing at the repo root).

---

## Adding example games

Create a folder under `examples/` (e.g. `examples/flappy/`) and include:
- `index.html`
- `style.css`
- `game.js` (or other assets)

Then link the example from `index.html` (Showcase section) so users can play directly.

Minimal example structure:
```
examples/your-game/
  ├─ index.html
  ├─ style.css
  └─ game.js
```

---

## Build & deploy (GitHub Pages)

This is a static site — no build step required.

1. Push your changes to the `main` branch.
2. In your repository settings → Pages, set the source to the `main` branch and the root (`/`).
3. Save and wait a few minutes — the site will be live at the repository Pages URL or your configured CNAME.

Notes:
- If you host as a project site (username.github.io/<repo>), prefer relative paths (already used here) to avoid path issues.

---

## Contribution

Contributions are welcome:
- Open issues to report bugs or request features
- Submit pull requests with fixes or new example games

If you plan to add large features (new engine subsystems or tooling), open an issue first to discuss the approach.

---

## License

This repository currently does not include a LICENSE file. If you want to open-source under a permissive license, add a `LICENSE` file (for example, the MIT license).

---

## Credits

Created by Patrick Street with assistance from AI tools.

---

## Contact

Email: hello@serotonforge.com
```
