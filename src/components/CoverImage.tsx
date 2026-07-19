import type { PubCode } from '@/lib/data/publications'
import { PUBLICATIONS } from '@/lib/data/publications'
import { Landmark } from 'lucide-react'
import type { UniverseKey } from '@/lib/data/publications'
import { UNIVERSE_ICONS } from '@/lib/universe-icons'

// ─── Couvertures génératives — jamais de rectangle gris ─────────
// Chaque article obtient une composition de gradients déterministe
// à partir de sa graine et de la couleur signature de sa publication.

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.max(0, (n >> 16) + amt))
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt))
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

interface CoverImageProps {
  publication: PubCode
  seed: number
  universe?: UniverseKey
  className?: string
  zoomClass?: string
  label?: string
  /** Photo réelle (WebP) affichée par-dessus le dégradé génératif,
   *  qui sert de placeholder anti-CLS et de secours en cas d'échec. */
  src?: string
  alt?: string
  /** true pour l'image LCP (héros de page article) : chargement prioritaire. */
  eager?: boolean
}

export function CoverImage({ publication, seed, universe, className = '', zoomClass = '', label, src, alt = '', eager = false }: CoverImageProps) {
  const pub = PUBLICATIONS[publication]
  const base = pub.color
  const dark = shade(base, -40)
  const deep = shade(base, -70)
  const light = shade(base, 55)
  const angle = (seed * 47) % 360
  const x1 = 15 + ((seed * 13) % 70)
  const y1 = 10 + ((seed * 29) % 80)
  const x2 = 15 + ((seed * 37) % 70)
  const y2 = 10 + ((seed * 17) % 80)
  const Icon = universe ? UNIVERSE_ICONS[universe] : Landmark

  return (
    <div className={`cover-visual overflow-hidden ${className}`} aria-hidden={alt ? undefined : 'true'}>
      {src && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
          className={`absolute inset-0 z-[1] h-full w-full object-cover ${zoomClass}`}
        />
      )}
      <div
        className={`absolute inset-0 ${zoomClass}`}
        style={{
          background: `
            radial-gradient(120% 90% at ${x1}% ${y1}%, ${light}33 0%, transparent 55%),
            radial-gradient(100% 80% at ${x2}% ${y2}%, #D4A84326 0%, transparent 50%),
            linear-gradient(${angle}deg, ${deep} 0%, ${dark} 48%, ${base} 100%)
          `,
        }}
      >
        {/* Cercles décoratifs */}
        <div
          className="absolute rounded-full"
          style={{
            width: '55%', paddingBottom: '55%', left: `${(seed * 7) % 50}%`, top: '-18%',
            background: `radial-gradient(circle, ${light}26 0%, transparent 65%)`,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: '38%', paddingBottom: '38%', right: `${(seed * 11) % 40}%`, bottom: '-14%',
            background: `radial-gradient(circle, #ffffff14 0%, transparent 60%)`,
          }}
        />
        {/* Icône filigrane */}
        <Icon
          className="absolute text-white/[0.13]"
          style={{ width: '42%', height: '42%', right: '6%', bottom: '8%' }}
          strokeWidth={1}
        />
      </div>
      {/* Filet bas + légende : toujours au-dessus de la photo éventuelle */}
      <div className="absolute inset-x-0 bottom-0 z-[2] h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
      {label && (
        <span className="absolute bottom-2.5 left-3 z-[2] font-display italic text-white/75 text-sm">
          {label}
        </span>
      )}
    </div>
  )
}
