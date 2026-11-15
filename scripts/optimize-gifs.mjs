// Converts every animated GIF under public/projects/ into a smaller animated
// WebP next to it (max 960px wide). Point projects.ts at the .webp afterwards.
// Usage: npm run optimize:media
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'

const ROOT = 'public/projects'
const MAX_WIDTH = 960

function* gifs(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) yield* gifs(p)
    else if (name.toLowerCase().endsWith('.gif')) yield p
  }
}

for (const src of gifs(ROOT)) {
  const out = src.replace(/\.gif$/i, '.webp')
  await sharp(src, { animated: true, limitInputPixels: false })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 70, effort: 5 })
    .toFile(out)
  const kb = (f) => Math.round(statSync(f).size / 1024)
  console.log(`${src} ${kb(src)} KB -> ${out} ${kb(out)} KB`)
}
