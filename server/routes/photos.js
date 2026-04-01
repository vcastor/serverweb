import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

const loadPhotos = () => {
  const raw = readFileSync(join(__dirname, '..', 'data', 'photos.json'), 'utf-8')
  return JSON.parse(raw)
}

// GET /api/photos — all photos (small collection, no pagination needed yet)
router.get('/', (_req, res) => {
  res.json(loadPhotos())
})

export default router
