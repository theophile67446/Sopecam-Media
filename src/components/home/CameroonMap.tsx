import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { CAMEROON_REGION_PATHS } from '@/lib/data/cameroon-map'

// Décalage manuel des étiquettes quand le centre géométrique tombe mal
// (régions allongées ou étroites) — en unités du viewBox 1000×1000
const LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  'Extrême-Nord': { dx: 30, dy: -20 },
  'Littoral': { dx: -14, dy: 10 },
  'Nord-Ouest': { dx: -6, dy: -6 },
  'Sud-Ouest': { dx: -10, dy: 16 },
  'Centre': { dx: 10, dy: 14 },
}

/**
 * Carte interactive des dix régions du Cameroun, avec relief :
 * dégradé, extrusion sombre, ombre portée, capitales dorées et
 * étiquettes. Survol synchronisé avec la liste des régions,
 * clic ou Entrée → recherche des articles de la région.
 */
export function CameroonMap({
  hovered, onHover, regionQueries,
}: {
  hovered: string | null
  onHover: (name: string | null) => void
  /** Nom de région → terme de recherche */
  regionQueries: Record<string, string>
}) {
  const navigate = useNavigate()
  const go = (name: string) => navigate(`/recherche?q=${encodeURIComponent(regionQueries[name] ?? name)}`)
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({})
  const [centers, setCenters] = useState<Record<string, { x: number; y: number }>>({})

  // Centres des régions calculés depuis les tracés (pour points + étiquettes)
  useLayoutEffect(() => {
    const next: Record<string, { x: number; y: number }> = {}
    for (const r of CAMEROON_REGION_PATHS) {
      const el = pathRefs.current[r.id]
      if (!el) continue
      const b = el.getBBox()
      const off = LABEL_OFFSETS[r.name] ?? { dx: 0, dy: 0 }
      next[r.id] = { x: b.x + b.width / 2 + off.dx, y: b.y + b.height / 2 + off.dy }
    }
    setCenters(next)
  }, [])

  return (
    <svg
      viewBox="140 10 730 980"
      className="w-full"
      role="group"
      aria-label="Carte interactive du Cameroun — choisissez une région"
    >
      <defs>
        <linearGradient id="cm-green" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#2FA94F" />
          <stop offset="55%" stopColor="#128233" />
          <stop offset="100%" stopColor="#0A5E22" />
        </linearGradient>
        <linearGradient id="cm-gold" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0%" stopColor="#EBCB77" />
          <stop offset="100%" stopColor="#C8982E" />
        </linearGradient>
        <filter id="cm-shadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#00320d" floodOpacity="0.38" />
        </filter>
      </defs>

      {/* Épaisseur : le pays extrudé en vert profond sous la carte */}
      <g transform="translate(7, 16)" aria-hidden="true" pointerEvents="none">
        {CAMEROON_REGION_PATHS.map((r) => (
          <path key={r.id} d={r.d} fill="#06421A" stroke="#06421A" strokeWidth={3} strokeLinejoin="round" />
        ))}
      </g>

      {/* Régions interactives */}
      <g filter="url(#cm-shadow)">
        {CAMEROON_REGION_PATHS.map((r) => {
          const active = hovered === r.name
          return (
            <path
              key={r.id}
              ref={(el) => { pathRefs.current[r.id] = el }}
              d={r.d}
              role="link"
              tabIndex={0}
              aria-label={`Explorer l'actualité de la région ${r.name}`}
              className="cursor-pointer transition-all duration-200 focus:outline-none"
              style={{ transform: active ? 'translateY(-5px)' : undefined }}
              fill={active ? 'url(#cm-gold)' : 'url(#cm-green)'}
              fillOpacity={hovered && !active ? 0.72 : 1}
              stroke={active ? '#F5E3AE' : '#E9F5EC'}
              strokeWidth={active ? 2.5 : 1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
              onMouseEnter={() => onHover(r.name)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(r.name)}
              onBlur={() => onHover(null)}
              onClick={() => go(r.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  go(r.name)
                }
              }}
            >
              <title>{r.name}</title>
            </path>
          )
        })}
      </g>

      {/* Capitales dorées + noms des régions */}
      <g pointerEvents="none" aria-hidden="true">
        {CAMEROON_REGION_PATHS.map((r) => {
          const c = centers[r.id]
          if (!c) return null
          const active = hovered === r.name
          return (
            <g key={r.id} style={{ transform: active ? 'translateY(-5px)' : undefined }} className="transition-all duration-200">
              <circle cx={c.x} cy={c.y} r={active ? 7 : 5.5} fill="#F0C75E" stroke="#5C3D00" strokeWidth={1.4} />
              <text
                x={c.x}
                y={c.y - 13}
                textAnchor="middle"
                fontSize={active ? 25 : 22}
                fontWeight={700}
                fill="#FFFFFF"
                stroke="#06421A"
                strokeWidth={3.5}
                paintOrder="stroke"
                style={{ fontFamily: 'inherit', letterSpacing: 0.4 }}
              >
                {r.name}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
