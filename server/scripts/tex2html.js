/**
 * Converts LaTeX-flavoured .tex content files into HTML strings
 * and writes a compiled posts.json / projects.json consumed by the API.
 *
 * Supported LaTeX subset:
 *   \href{url}{text}              →  <a target="_blank" href="url">text</a>
 *   \textbf{text}                 →  <b>text</b>
 *   \textit{text} / \emph{text}  →  <i>text</i>
 *   \ldots{}                      →  …
 *   ---                           →  —
 *   --                            →  –
 *   ``text''                      →  "text"
 *   \begin{accordion}{Title}...   →  <Accordion title="Title">...</Accordion>
 *   \\'  (accent)                 →  left as-is (UTF-8 in source preferred)
 *   Blank lines                   →  paragraph breaks
 *
 * Usage:
 *   node server/scripts/tex2html.js
 *
 * Reads from  server/data/posts/<slug>/  and  server/data/projects/<slug>/
 * Writes to   server/data/posts.json     and  server/data/projects.json
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_DIR = join(__dirname, '..', 'data')

// ─── tex → html ───────────────────────────────────────────────
function texToHtml(tex) {
  let html = tex

  // Accordion environments → <Accordion> pseudo-tags (parsed client-side)
  html = html.replace(
    /\\begin\{accordion\}\{([^}]+)\}([\s\S]*?)\\end\{accordion\}/g,
    (_m, title, body) => `<Accordion title="${title}">${texToHtml(body)}</Accordion>`
  )

  // \href{url}{text}
  html = html.replace(
    /\\href\{([^}]+)\}\{([^}]+)\}/g,
    '<a target="_blank" href="$1">$2</a>'
  )

  // \textbf / \textit / \emph
  html = html.replace(/\\textbf\{([^}]+)\}/g, '<b>$1</b>')
  html = html.replace(/\\textit\{([^}]+)\}/g, '<i>$1</i>')
  html = html.replace(/\\emph\{([^}]+)\}/g,   '<i>$1</i>')

  // \ldots{}
  html = html.replace(/\\ldots\{?\}?/g, '…')

  // Dashes (order matters: --- before --)
  html = html.replace(/---/g, '—')
  html = html.replace(/--/g, '–')

  // Smart quotes  ``...''
  html = html.replace(/``/g, '\u201C')
  html = html.replace(/''/g, '\u201D')

  // LaTeX accents that might slip through (best effort)
  html = html.replace(/\\'e/g, 'é')
  html = html.replace(/\\'a/g, 'á')
  html = html.replace(/\\'i/g, 'í')
  html = html.replace(/\\'o/g, 'ó')
  html = html.replace(/\\'u/g, 'ú')

  return html
}

// ─── build collection ─────────────────────────────────────────
function buildCollection(type) {
  const baseDir = join(DATA_DIR, type)
  const slugs = readdirSync(baseDir).filter(f =>
    statSync(join(baseDir, f)).isDirectory()
  )

  const items = slugs.map(slug => {
    const dir = join(baseDir, slug)
    const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf-8'))
    const texPath = join(dir, 'content.tex')
    let content = ''
    try {
      const raw = readFileSync(texPath, 'utf-8')
      content = texToHtml(raw)
    } catch {
      console.warn(`  ⚠  No content.tex for ${type}/${slug}`)
    }
    return { ...meta, content }
  })

  // Sort posts by date descending
  if (type === 'posts') {
    items.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return items
}

// ─── main ─────────────────────────────────────────────────────
const posts = buildCollection('posts')
writeFileSync(join(DATA_DIR, 'posts.json'), JSON.stringify(posts, null, 2))
console.log(`✓ posts.json  — ${posts.length} posts`)

const projectsList = buildCollection('projects')
// projects.json is an object keyed by id (for backward compat with routes)
const projectsObj = {}
for (const p of projectsList) projectsObj[p.id] = p
writeFileSync(join(DATA_DIR, 'projects.json'), JSON.stringify(projectsObj, null, 2))
console.log(`✓ projects.json — ${projectsList.length} projects`)
