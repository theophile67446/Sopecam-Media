import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { BookOpen, Camera, ChevronLeft, ChevronRight, Download, Image as ImageIcon, Search, Share2, X, ZoomIn } from 'lucide-react'
import { ARCHIVE_PHOTOS, ARCHIVE_COVERS, type ArchivePhoto } from '@/lib/data/media'
import { PUBLICATIONS } from '@/lib/data/publications'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { CoverImage } from '@/components/CoverImage'
import { PublicationBadge } from '@/components/badges'
import { setPageMeta } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

// ─── Photothèque & archives (ARC-01) ────────────────────────────
export default function ArchivesPage() {
  const [q, setQ] = useState('')
  const [lightbox, setLightbox] = useState<number | null>(null)
  const { user } = useAppStore()
  const isPremium = user && (user.plan === 'premium' || user.plan === 'institutionnel' || user.role === 'admin')

  useEffect(() => {
    setPageMeta('Archives & Photothèque', 'Explorez 40 000+ photos d\'archives et documents numérisés SOPECAM.')
  }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return ARCHIVE_PHOTOS
    return ARCHIVE_PHOTOS.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.photographer.toLowerCase().includes(term) ||
      p.event.toLowerCase().includes(term),
    )
  }, [q])

  const download = (p: ArchivePhoto) => {
    if (!isPremium) {
      toast.error('Le téléchargement haute résolution est réservé aux abonnés Premium.')
      return
    }
    toast.success(`Téléchargement de « ${p.title} » en haute résolution…`)
  }

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Archives & Photothèque' }]} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold">
            <Camera className="h-7 w-7 text-sopecam-green dark:text-sopecam-green-light" />
            Photothèque SOPECAM
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Plus de 40 000 images numérisées, cinquante ans de mémoire visuelle du Cameroun. Recherchez par mot-clé, photographe ou événement.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-md" role="search">
          <label htmlFor="photo-q" className="sr-only">Rechercher dans la photothèque</label>
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="photo-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mot-clé, photographe, événement…"
            className="h-11 w-full rounded-lg border border-input bg-background pl-11 pr-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15 dark:focus:border-sopecam-green-light"
          />
        </form>
      </div>

      {!isPremium && (
        <p className="mt-6 rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-foreground dark:bg-gold/10">
          <strong className="font-semibold">Accès limité :</strong> la visualisation est libre, le téléchargement haute résolution nécessite un abonnement Premium.
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground" role="status">
        <span className="font-bold text-foreground">{filtered.length}</span> photo{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p, i) => (
          <figure key={p.id} className="card-article group cursor-pointer" onClick={() => setLightbox(i)}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <CoverImage publication={p.publication} seed={p.seed} src={p.src} alt={p.title} className="absolute inset-0" zoomClass="cover-zoom" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-250 group-hover:bg-black/30 group-hover:opacity-100">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg">
                  <ZoomIn className="h-5 w-5" />
                </span>
              </div>
              <div className="absolute left-2.5 top-2.5"><PublicationBadge code={p.publication} /></div>
            </div>
            <figcaption className="p-3.5">
              <p className="line-clamp-1 text-sm font-semibold">{p.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">© {p.photographer} · {p.event}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={filtered[lightbox].title}
          onClick={() => setLightbox(null)}
        >
          <button aria-label="Fermer" className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/25">
            <X className="h-5 w-5" />
          </button>
          <button
            aria-label="Photo précédente"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + filtered.length) % filtered.length) }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            aria-label="Photo suivante"
            onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % filtered.length) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/25"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-2xl">
              <CoverImage publication={filtered[lightbox].publication} seed={filtered[lightbox].seed} src={filtered[lightbox].src} alt={filtered[lightbox].title} eager className="absolute inset-0" />
              <div className="absolute left-3 top-3"><PublicationBadge code={filtered[lightbox].publication} /></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="text-white">
                <p className="font-display text-lg font-bold">{filtered[lightbox].title}</p>
                <p className="text-sm text-white/70">
                  © {filtered[lightbox].photographer} · {filtered[lightbox].event} · {filtered[lightbox].date}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => download(filtered[lightbox])}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-md transition-all duration-150 hover:-translate-y-0.5',
                    isPremium ? 'bg-gold text-[#1A1A1A]' : 'bg-white/15 text-white',
                  )}
                >
                  <Download className="h-4 w-4" />
                  {isPremium ? 'Télécharger HD' : 'HD réservé Premium'}
                </button>
                <button
                  onClick={() => toast.success('Lien de partage copié (crédit photo inclus)')}
                  className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/25"
                >
                  <Share2 className="h-4 w-4" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unes historiques */}
      <section className="mt-14" aria-label="Unes historiques">
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-bold">
          <BookOpen className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" />
          Unes historiques — collection numérisée
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHIVE_COVERS.map((ac) => (
            <figure key={ac.id} className="card-article group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <img src={ac.cover} alt={ac.title} loading="lazy" className="cover-zoom absolute inset-0 h-full w-full object-cover object-top" />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] shadow-md">
                  N° collector
                </span>
              </div>
              <figcaption className="p-3.5">
                <p className="text-sm font-semibold">{PUBLICATIONS[ac.publication].name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{ac.title}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">{ac.date}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Archives textuelles */}
      <section className="mt-14 rounded-xl border border-border bg-card p-6 md:p-8" aria-label="Archives textuelles">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-xl font-bold">
              <ImageIcon className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" />
              Archives textuelles numérisées
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Cinquante ans d'éditions papier numérisées par OCR et interrogeables en texte intégral : de la première édition de Cameroon Tribune en 1977 à nos jours.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { n: '50', l: 'années d\'archives' },
              { n: '40K+', l: 'photos indexées' },
              { n: 'OCR', l: 'recherche plein texte' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-secondary/70 px-3 py-4">
                <p className="font-mono text-2xl font-bold text-sopecam-green dark:text-sopecam-green-light">{s.n}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  )
}
