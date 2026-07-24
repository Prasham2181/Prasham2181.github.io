/**
 * Turns the full-res source photos in scripts/perception-src/ into the
 * responsive WebP set the hero ships, and prints the `aspect` + `lqip` values
 * to paste into src/data/perception.ts.
 *
 *   node scripts/build-perception-images.mjs
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SRC = 'scripts/perception-src'
const OUT = 'public/perception'
const WIDTHS = [960, 1440, 1920, 2560]

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f))
const meta = []

for (const file of files) {
  const name = basename(file, extname(file))
  const src = join(SRC, file)
  const { width, height } = await sharp(src).metadata()

  for (const w of WIDTHS) {
    if (w > width) continue
    await sharp(src)
      .resize({ width: w })
      .webp({ quality: 80, effort: 6 })
      .toFile(join(OUT, `${name}-${w}.webp`))
  }

  // tiny blurred placeholder, inlined as a data URI so the hero never flashes empty
  const lqip = await sharp(src).resize({ width: 24 }).blur(1).webp({ quality: 40 }).toBuffer()

  meta.push({
    name,
    aspect: +(width / height).toFixed(4),
    widths: WIDTHS.filter((w) => w <= width),
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  })
}

await writeFile('scripts/perception-meta.json', JSON.stringify(meta, null, 2))
console.log(`${meta.length} images → ${OUT}`)
for (const m of meta) console.log(`  ${m.name}  aspect ${m.aspect}  ${m.widths.join('/')}`)
