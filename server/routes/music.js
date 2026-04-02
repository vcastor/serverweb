import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = Router()

router.get('/', (_req, res) => {
  const raw = readFileSync(join(__dirname, '..', 'data', 'music.json'), 'utf-8')
  res.json(JSON.parse(raw))
})

export default router
