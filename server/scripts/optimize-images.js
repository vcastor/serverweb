/**
 * Image optimization script
 * Usage: node server/scripts/optimize-images.js [inputDir] [outputDir]
 * Default: node server/scripts/optimize-images.js ./img ./server/public/img
 *
 * Generates name-200w.webp, name-400w.webp, name-800w.webp for each source image.
 */

import sharp from 'sharp'
import { readdirSync, mkdirSync } from 'fs'
import { join, parse } from 'path'

const WIDTHS = [200, 400, 800]

const inputDir = process.argv[2] || './img'
const outputDir = process.argv[3] || './server/public/img'

mkdirSync(outputDir, { recursive: true })

const files = readdirSync(inputDir).filter(f =>
  /\.(png|jpe?g|webp|tiff?)$/i.test(f)
)

for (const file of files) {
  const { name } = parse(file)
  const inputPath = join(inputDir, file)

  for (const w of WIDTHS) {
    const outputPath = join(outputDir, `${name}-${w}w.webp`)
    await sharp(inputPath)
      .resize(w)
      .webp({ quality: 80 })
      .toFile(outputPath)
    console.log(`  ${outputPath}`)
  }
}

console.log(`Done — ${files.length} images × ${WIDTHS.length} sizes`)
