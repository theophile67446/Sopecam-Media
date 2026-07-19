// ─── Formatage des dates et nombres ─────────────────────────────
// API Intl native (0 Ko embarqué, essentiel sur connexions mobiles
// lentes) en remplacement de date-fns pour ces trois formatteurs.
const rtfFr = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' })

export const timeAgo = (iso: string) => {
  const sec = Math.round((Date.now() - new Date(iso).getTime()) / 1000)
  if (sec < 60) return "à l'instant"
  const min = Math.round(sec / 60)
  if (min < 60) return rtfFr.format(-min, 'minute')
  const h = Math.round(min / 60)
  if (h < 24) return rtfFr.format(-h, 'hour')
  const d = Math.round(h / 24)
  if (d < 30) return rtfFr.format(-d, 'day')
  const mo = Math.round(d / 30)
  if (mo < 12) return rtfFr.format(-mo, 'month')
  return rtfFr.format(-Math.round(mo / 12), 'year')
}

const dayFmt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const pad2 = (n: number) => String(n).padStart(2, '0')

export const fullDate = (iso: string) => {
  const d = new Date(iso)
  return `${dayFmt.format(d)} à ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

export const dayDate = (iso: string) => dayFmt.format(new Date(iso))

export const formatViews = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace('.', ',').replace(',0', '')} k` : `${n}`

export const formatFCFA = (n: number) =>
  n === -1 ? 'Sur devis' : n === 0 ? 'Gratuit' : `${n.toLocaleString('fr-FR')} FCFA`

export const formatDuration = (sec: number) =>
  `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

// ─── Petit SEO maison (SPA) ─────────────────────────────────────
const SITE_URL = 'https://sopecam.cm'

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = create()
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

export function setPageMeta(title: string, description?: string) {
  const fullTitle = title ? `${title} — SOPECAM Médias` : 'SOPECAM Médias — Portail Principal'
  document.title = fullTitle
  const desc = description ?? 'Portail principal SOPECAM Médias : l\'information souveraine du Cameroun.'
  const mk = (attr: 'name' | 'property', v: string) => () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, v)
    return m
  }
  upsertMeta('meta[name="description"]', mk('name', 'description'), desc)
  // Open Graph dynamique (partage social par page)
  upsertMeta('meta[property="og:title"]', mk('property', 'og:title'), fullTitle)
  upsertMeta('meta[property="og:description"]', mk('property', 'og:description'), desc)
  upsertMeta('meta[property="og:url"]', mk('property', 'og:url'), SITE_URL + location.pathname)
  // Canonical
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = SITE_URL + location.pathname
}

// ─── Données structurées JSON-LD (Schema.org) ───────────────────
// Injecte/remplace un <script type="application/ld+json"> identifié.
// Sérialisation via JSON.stringify : aucun HTML injecté.
export function setJsonLd(id: string, data: object | null) {
  const attr = `script[type="application/ld+json"][data-jsonld="${id}"]`
  const existing = document.head.querySelector(attr)
  if (existing) existing.remove()
  if (!data) return
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.dataset.jsonld = id
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export const SITE_ORIGIN = SITE_URL

// ─── Initiales pour avatars ─────────────────────────────────────
export const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

// Palette déterministe pour les avatars
const AVATAR_COLORS = ['#006020', '#00A0E0', '#C02020', '#8B6914', '#0040A0', '#008040', '#B8860B']
export const avatarColor = (name: string) =>
  AVATAR_COLORS[[...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % AVATAR_COLORS.length]
