// One-shot : convertit les PNG lourds de public/assets en WebP légers.
// Usage : node scripts/optimize-images.mjs
// - articles : 1280 px de large max (héros de page article), qualité 75
// - media (podcasts/vidéos) : 640 px (vignettes de cartes), qualité 75
// Les PNG d'origine sont supprimés après conversion réussie.
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const jobs = [
  { dir: 'public/assets/articles', width: 1280 },
  { dir: 'public/assets/media/podcasts', width: 640 },
  { dir: 'public/assets/media/videos', width: 640 },
]

let totalBefore = 0
let totalAfter = 0

for (const { dir, width } of jobs) {
  const files = (await readdir(dir)).filter((f) => f.toLowerCase().endsWith('.png'))
  for (const file of files) {
    const src = path.join(dir, file)
    const dest = src.replace(/\.png$/i, '.webp')
    const before = (await stat(src)).size
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality: 75 }).toFile(dest)
    const after = (await stat(dest)).size
    totalBefore += before
    totalAfter += after
    await unlink(src)
    console.log(`${file}: ${(before / 1024).toFixed(0)} kB -> ${(after / 1024).toFixed(0)} kB`)
  }
}

console.log(`\nTotal: ${(totalBefore / 1048576).toFixed(1)} MB -> ${(totalAfter / 1048576).toFixed(1)} MB`)
