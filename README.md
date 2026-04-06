# VCastor — Personal Webpage

## How it works

The front-end is a static React app hosted on Hostinger. All data (posts,
projects, photos, music, bookmarks) is served as JSON files from this
GitHub repo via `raw.githubusercontent.com`. No backend server is needed
at runtime.

## Commands

```bash
npm install              # install dependencies (once)
npm run build:content    # .tex → .json (posts & projects) — run after editing posts
npm run dev              # Vite dev server (front-end, port 3000)
npm run build            # production build → dist/
npm run optimize-images  # img/ → WebP thumbnails (200/400/800w)
```

### Updating content workflow

1. Edit `.tex` files or JSON data in `server/data/`
2. Run `npm run build:content` (only needed for posts/projects)
3. Commit and push — the frontend fetches data from GitHub raw on each visit

---

## Repo structure

```
.
├── src/                           ← React front-end
│   ├── App.jsx                    ← all components (windows, dock, desktop shortcuts)
│   ├── index.css                  ← styles
│   ├── main.jsx                   ← React entry
│   └── assets/
│       ├── icons/                 ← SVG icons for desktop shortcuts
│       │   ├── photos.svg
│       │   ├── music.svg
│       │   ├── internet.svg
│       │   └── arcade.svg
│       └── game/                  ← arcade game files (WASM + JS glue)
│           └── (your .wasm and loader .js go here)
│
├── server/                        ← Express back-end
│   ├── index.js                   ← server entry, mounts all routes
│   ├── routes/
│   │   ├── posts.js               ← GET /api/posts  ·  GET /api/posts/:id
│   │   ├── projects.js            ← GET /api/projects  ·  GET /api/projects/:id
│   │   ├── photos.js              ← GET /api/photos
│   │   ├── music.js               ← GET /api/music
│   │   └── bookmarks.js           ← GET /api/bookmarks
│   │
│   ├── data/
│   │   ├── posts/                 ← one folder per post (see "Writing a blog post")
│   │   ├── projects/              ← one folder per project (same layout)
│   │   ├── photos.json            ← photo gallery entries
│   │   ├── music.json             ← music recommendations
│   │   ├── bookmarks.json         ← internet bookmarks
│   │   ├── posts.json             ← compiled by tex2html (don't edit by hand)
│   │   └── projects.json          ← compiled by tex2html (don't edit by hand)
│   │
│   ├── scripts/
│   │   ├── tex2html.js            ← compiles content.tex → JSON
│   │   └── optimize-images.js     ← generates WebP thumbnails via sharp
│   │
│   └── public/img/                ← optimized images (output of optimize-images)
│
├── img/                           ← source images (avatar, etc.)
├── index.html                     ← HTML shell
├── vite.config.js                 ← Vite config
└── package.json
```

---

## Writing a blog post

Each post lives in its own directory under `server/data/posts/<slug>/`:

```
server/data/posts/my-new-post/
├── meta.json
├── content.tex
└── (optional images)
```

### meta.json

```json
{
  "id": "my-new-post",
  "title": "My New Post",
  "date": "2026-04-01",
  "image": null
}
```

Set `"image": "/img/my-photo.jpg"` if the post has a header image.

### content.tex

Write in a LaTeX-like syntax. Supported commands:

| LaTeX | Output |
|---|---|
| `\href{url}{text}` | link |
| `\textbf{text}` | **bold** |
| `\textit{text}` / `\emph{text}` | *italic* |
| `\begin{accordion}{Title} ... \end{accordion}` | collapsible section |
| `---` / `--` | em-dash / en-dash |
| ` ``text'' ` | "smart quotes" |
| `\ldots{}` | ... |

Blank lines separate paragraphs.

After writing or editing, compile:

```bash
npm run build:content
```

---

## Where things go

| What | Where |
|---|---|
| New blog post | `server/data/posts/<slug>/` (meta.json + content.tex) |
| New project | `server/data/projects/<slug>/` (same layout) |
| Photos list | `server/data/photos.json` |
| Music recs | `server/data/music.json` |
| Bookmarks | `server/data/bookmarks.json` |
| Source images | `img/` then run `npm run optimize-images` |
| Desktop icons (SVG) | `src/assets/icons/` — imported in App.jsx |
| Arcade game | `src/assets/game/` — compile C++ to `.wasm`, load in `ArcadeOverlay` (App.jsx) |
| 404 page | create `src/NotFound.jsx` + catch-all route in `server/index.js` |

---


## Desktop layout

- **Dock** (bottom bar) — About Me, Links, Blog, Work, FAQs
- **Desktop shortcuts** (top-left, SVG icons) — Photos, Music, Internet, Arcade

Arcade takes over the full screen on START (black + CRT scanlines).
Press ESC to exit. The dock hides while the arcade is running.
