import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

const loadProjects = () => {
  const raw = readFileSync(join(__dirname, '..', 'data', 'projects.json'), 'utf-8')
  return JSON.parse(raw)
}

// GET /api/projects — list all projects (metadata only)
router.get('/', (_req, res) => {
  const projects = loadProjects()
  const list = Object.values(projects).map(({ id, title, date, image }) => ({
    id,
    title,
    date,
    thumb: image ? image.replace(/(\.\w+)$/, '-200w.webp') : null
  }))
  res.json(list)
})

// GET /api/projects/:id — full project with content
router.get('/:id', (req, res) => {
  const projects = loadProjects()
  const project = projects[req.params.id]
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const result = { ...project }
  if (result.image) {
    const base = result.image.replace(/(\.\w+)$/, '')
    result.image = `${base}-800w.webp`
  }
  res.json(result)
})

export default router
