// Build an animated preview for MyAutoPano from the pipeline screenshots.
// detect (Harris corners) -> match (RANSAC correspondences) -> stitched panorama.
// No ffmpeg/imagemagick here, so we normalise every frame onto one dark canvas
// with sharp and join them into a single animated WebP.
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = join(__dirname, '..', 'Assets', 'myAutopano')
const OUT = join(__dirname, '..', 'public', 'projects', 'autopano', 'pipeline.webp')

// canvas + look
const W = 1280
const H = 960
const BG = { r: 10, g: 11, b: 13, alpha: 1 } // matches the site's dark panel
const DELAY = 1600 // ms per frame

// the narrative order
const frames = [
  'Screenshot 2025-01-27 113004.png', // corner detection, tower
  'Screenshot 2025-01-27 113255.png', // corner detection, building
  'Screenshot 2025-01-27 113341.png', // feature matching (correspondence lines)
  'Screenshot 2025-01-27 113239.png', // features carried onto the warped frame
  'Screenshot 2025-01-27 113545.png', // final stitched panorama
]

const normalise = (name) =>
  sharp(join(SRC, name))
    .resize(W, H, { fit: 'contain', background: BG })
    .flatten({ background: BG })
    .png()
    .toBuffer()

const buffers = await Promise.all(frames.map(normalise))

await sharp(buffers, { join: { animated: true } })
  .webp({ quality: 82, effort: 5, loop: 0, delay: frames.map(() => DELAY) })
  .toFile(OUT)

const meta = await sharp(OUT, { animated: true }).metadata()
console.log(`wrote ${OUT}`)
console.log(`  ${meta.width}x${meta.pageHeight} · ${meta.pages} frames · ${meta.format}`)
