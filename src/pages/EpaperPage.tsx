import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { BookOpen, CalendarDays, ChevronLeft, ChevronRight, Download, Newspaper } from 'lucide-react'
import { EPAPER_EDITIONS } from '@/lib/data/media'
import { PUBLICATIONS } from '@/lib/data/publications'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { CoverImage } from '@/components/CoverImage'
import { setPageMeta } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

// ─── Lecteur e-paper / flipbook (F-203) ─────────────────────────
export default function EpaperPage() {
  const [edition, setEdition] = useState(EPAPER_EDITIONS[0])
  const [page, setPage] = useState(1)
  const [flipping, setFlipping] = useState<'next' | 'prev' | null>(null)
  const { user } = useAppStore()
  const canRead = user && (user.plan !== 'free' || user.role === 'admin')

  useEffect(() => {
    setPageMeta('E-paper', 'Feuilletez les versions numériques de nos publications en haute définition.')
  }, [])

  const flip = (dir: 'next' | 'prev') => {
    if (flipping) return
    const target = dir === 'next' ? page + 1 : page - 1
    if (target < 1 || target > edition.pages) return
    setFlipping(dir)
    setTimeout(() => { setPage(target); setFlipping(null) }, 280)
  }

  const selectEdition = (id: string) => {
    const e = EPAPER_EDITIONS.find((x) => x.id === id)!
    setEdition(e)
    setPage(1)
  }

  const pub = PUBLICATIONS[edition.publication]

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'E-paper' }]} />
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-display text-3xl font-bold">
          <BookOpen className="h-7 w-7 text-sopecam-green dark:text-sopecam-green-light" />
          E-paper — Éditions numériques
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Feuilletez nos publications en haute définition, comme le papier, où que vous soyez.
        </p>
      </div>

      {/* Sélecteur d'édition — vraies couvertures */}
      <div className="no-scrollbar mt-8 flex justify-start gap-4 overflow-x-auto pb-3 lg:justify-center" role="tablist" aria-label="Éditions disponibles">
        {EPAPER_EDITIONS.map((e) => {
          const p = PUBLICATIONS[e.publication]
          const active = e.id === edition.id
          return (
            <button
              key={e.id}
              onClick={() => selectEdition(e.id)}
              role="tab"
              aria-selected={active}
              className={cn(
                'group shrink-0 overflow-hidden rounded-xl border text-left shadow-sm transition-all duration-250',
                active
                  ? 'border-transparent shadow-xl ring-2 ring-sopecam-green ring-offset-2 ring-offset-background dark:ring-sopecam-green-light'
                  : 'border-border bg-card hover:-translate-y-1 hover:shadow-lg',
              )}
            >
              <div className="relative h-44 w-32 overflow-hidden">
                <img
                  src={e.cover}
                  alt={`Une — ${p.name}`}
                  className={cn('h-full w-full object-cover object-top transition-transform duration-250', !active && 'group-hover:scale-[1.04]')}
                />
                {active && (
                  <span className="absolute inset-x-0 bottom-0 bg-sopecam-green/90 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white">
                    En lecture
                  </span>
                )}
              </div>
              <div className="w-32 p-2.5">
                <p className="line-clamp-2 text-[11px] font-bold leading-tight">{e.headline}</p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <CalendarDays className="h-2.5 w-2.5" /> {e.date}
                </p>
                <p className="mt-0.5 font-mono text-[10px] font-semibold text-muted-foreground">{e.issue}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Lecteur */}
      <div className="mx-auto mt-8 max-w-4xl">
        {canRead ? (
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-8">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-9 items-center rounded-md bg-white px-2.5 py-1 shadow-sm ring-1 ring-border">
                  <img src={pub.logo} alt={pub.name} className="max-h-6 w-auto object-contain" />
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">{edition.title}</p>
                  <p className="text-xs text-muted-foreground">{edition.issue} · {edition.price} FCFA (papier)</p>
                </div>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 font-mono text-xs font-semibold">
                Page {page} / {edition.pages}
              </span>
            </div>

            {/* Double page */}
            <div className="perspective-1200 grid grid-cols-2 gap-0 overflow-hidden rounded-lg shadow-inner ring-1 ring-border">
              {[0, 1].map((half) => {
                const pageNum = page * 2 - 1 + half
                const isCover = page === 1 && half === 0
                return (
                  <div
                    key={half}
                    className={cn(
                      'preserve-3d relative aspect-[3/4] overflow-hidden transition-transform duration-300',
                      flipping === 'next' && half === 1 && '-rotate-y-6',
                      half === 0 ? 'border-r border-border/70' : '',
                    )}
                    style={{ transformOrigin: half === 0 ? 'right center' : 'left center' }}
                  >
                    {isCover ? (
                      /* Vraie une de l'édition */
                      <>
                        <img
                          src={edition.cover}
                          alt={`Une de ${edition.title}`}
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                          Couverture
                        </span>
                      </>
                    ) : (
                      <>
                        <CoverImage
                          publication={edition.publication}
                          seed={edition.id.charCodeAt(2) * 7 + pageNum}
                          universe={edition.publication === 'WSL' ? 'sports' : edition.publication === 'NY' ? 'culture' : edition.publication === 'CBT' ? 'economie' : 'actus'}
                          className="absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                        <div className="absolute inset-x-0 top-0 p-4">
                          <p className="font-display text-sm font-bold text-white/90">{pub.name}</p>
                          <p className="text-[10px] uppercase tracking-widest text-white/60">{edition.date}</p>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="font-display text-base font-bold leading-snug text-white md:text-lg">
                            {pageNum === 1 ? edition.headline : `Suite page ${pageNum} — ${edition.headline}`}
                          </p>
                          <p className="mt-1 text-[11px] text-white/70">Page {pageNum} · {pub.shortName}</p>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Contrôles */}
            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => flip('prev')}
                disabled={page <= 1}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-all duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Page précédente
              </button>
              <button
                onClick={() => toast.success(`Téléchargement du PDF de l'édition (${edition.pages} pages)…`)}
                className="inline-flex items-center gap-2 rounded-lg bg-sopecam-green px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green-dark dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
              >
                <Download className="h-4 w-4" /> Télécharger PDF
              </button>
              <button
                onClick={() => flip('next')}
                disabled={page * 2 >= edition.pages}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-all duration-150 hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Page suivante <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="surface-paywall texture-dots rounded-2xl p-10 text-center">
            <Newspaper className="mx-auto h-12 w-12 text-gold" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">L'e-paper est réservé aux abonnés</h2>
            <p className="mx-auto mt-2 max-w-md text-sopecam-mint">
              Dès le Package Standard (2 000 FCFA/mois), feuilletez toutes nos éditions numériques et téléchargez-les en PDF.
            </p>
            <a
              href="/abonnement"
              className="mt-6 inline-flex h-12 items-center rounded-lg bg-gold px-8 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 hover:-translate-y-0.5"
            >
              Voir les offres
            </a>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
