import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import postsRouter from './routes/posts.js'
import projectsRouter from './routes/projects.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())

// Serve optimized images
app.use('/img', express.static(join(__dirname, 'public/img')))

// Also serve the root img/ folder (for non-optimized originals like avatar)
app.use('/img', express.static(join(__dirname, '..', 'img')))

// API routes
app.use('/api/posts', postsRouter)
app.use('/api/projects', projectsRouter)

// In production, serve the Vite build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '..', 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, '..', 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
