import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

const loadPosts = () => {
  const raw = readFileSync(join(__dirname, '..', 'data', 'posts.json'), 'utf-8')
  return JSON.parse(raw)
}

// GET /api/posts — list (metadata only, no content)
router.get('/', (_req, res) => {
  const posts = loadPosts()
  const list = posts.map(({ id, title, date, image }) => ({
    id,
    title,
    date,
    thumb: image ? image.replace(/(\.\w+)$/, '-200w.webp') : null
  }))
  res.json(list)
})

// GET /api/posts/:id — full post with content
router.get('/:id', (req, res) => {
  const posts = loadPosts()
  const post = posts.find(p => p.id === req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })

  const result = { ...post }
  if (result.image) {
    const base = result.image.replace(/(\.\w+)$/, '')
    const ext = 'webp'
    result.image = `${base}-800w.${ext}`
    result.imageSrcSet = `${base}-400w.${ext} 400w, ${base}-800w.${ext} 800w`
  }
  res.json(result)
})

export default router
