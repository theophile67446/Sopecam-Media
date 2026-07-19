import { Link } from 'react-router'
import { Clock, Play, Radio, TrendingUp } from 'lucide-react'
import { getLatestArticles } from '@/lib/data/articles'
import { PODCASTS, VIDEOS, PARTNERS } from '@/lib/data/media'
import { PUBLICATIONS } from '@/lib/data/publications'
import { PublicationBadge, LiveBadge } from '@/components/badges'
import { CoverImage } from '@/components/CoverImage'
import { AudioPlayer, SectionHeading } from '@/components/widgets'
import { timeAgo, formatViews, formatDuration } from '@/lib/utils2'

// ─── Fil d'actualité temps réel (F-002) ─────────────────────────
export function NewsFeed() {
  const latest = getLatestArticles(10)
  return (
    <aside
      className="flex h-full flex-col rounded-2xl border border-border bg-card shadow-sm"
      aria-label="Fil d'actualité en temps réel"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Radio className="h-5 w-5 text-[#E02020]" />
          Fil temps réel
        </h2>
        <LiveBadge />
      </div>
      {/* lg : la hauteur suit la colonne du carrousel (cellule absolue) */}
      <ol className="nice-scroll max-h-[560px] flex-1 space-y-1 overflow-y-auto p-3 lg:max-h-none">
        {latest.map((a, i) => (
          <li key={a.id}>
            <Link
              to={`/article/${a.slug}`}
              className="group flex gap-3 rounded-xl p-2.5 transition-colors duration-150 hover:bg-secondary"
            >
              <div className="flex flex-col items-center pt-1" aria-hidden="true">
                <span
                  className="h-2.5 w-2.5 rounded-full ring-4"
                  style={{
                    backgroundColor: PUBLICATIONS[a.publication].color,
                    ['--tw-ring-color' as string]: `${PUBLICATIONS[a.publication].color}22`,
                  }}
                />
                {i < latest.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </div>
              <div className="min-w-0 pb-2">
                <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:text-sopecam-green dark:group-hover:text-sopecam-green-light">
                  {a.title}
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <PublicationBadge code={a.publication} />
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(a.publishedAt)}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
      <div className="border-t border-border p-3">
        <Link
          to="/actus"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-border"
        >
          <TrendingUp className="h-4 w-4" />
          Toute l'actualité
        </Link>
      </div>
    </aside>
  )
}

// ─── Section podcasts (F-004) ───────────────────────────────────
export function PodcastSection({ onDark = false }: { onDark?: boolean }) {
  return (
    <section aria-label="Podcasts et débats">
      <SectionHeading
        title="Podcasts & Débats"
        subtitle="Écoutez nos rédactions où que vous soyez"
        linkTo="/debats"
        color={onDark ? '#80E0A0' : '#004000'}
        onDark={onDark}
        icon={<Radio className={`h-5 w-5 ${onDark ? 'text-sopecam-green-light' : 'text-sopecam-green-dark dark:text-sopecam-green-light'}`} />}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {PODCASTS.map((p) => (
          <div key={p.id} className="card-article group p-4">
            <div className="mb-3 flex items-start gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                <CoverImage publication={p.publication} seed={p.seed} universe="debats" src={p.cover} className="absolute inset-0" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <PublicationBadge code={p.publication} />
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{p.show}</span>
                </div>
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{p.title}</h3>
              </div>
            </div>
            <AudioPlayer durationSec={p.durationSec} compact />
            <p className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>{timeAgo(p.date + 'T10:00:00+01:00')}</span>
              <span className="font-mono">{formatDuration(p.durationSec)}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Section vidéos (F-004) ─────────────────────────────────────
export function VideoSection() {
  return (
    <section aria-label="Vidéos du jour">
      <SectionHeading
        title="Vidéos du jour"
        subtitle="Le meilleur de nos reportages en images"
        linkTo="/actus"
        color="#E02020"
        icon={<Play className="h-5 w-5 text-[#E02020]" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VIDEOS.map((v) => (
          <div key={v.id} className="card-article group cursor-pointer">
            <div className="relative aspect-video overflow-hidden">
              <CoverImage publication={v.publication} seed={v.seed} src={v.cover} className="absolute inset-0" zoomClass="cover-zoom" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-250 group-hover:bg-black/40">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-sopecam-green-dark shadow-lg transition-transform duration-250 group-hover:scale-110">
                  <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                </span>
              </div>
              <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">
                {v.duration}
              </span>
              <div className="absolute left-2 top-2">
                <PublicationBadge code={v.publication} />
              </div>
            </div>
            <div className="p-3.5">
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-sopecam-green dark:group-hover:text-sopecam-green-light">
                {v.title}
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {formatViews(v.views)} vues · {timeAgo(v.date + 'T12:00:00+01:00')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Espace partenaires (F-303) — bandeau de logos défilant ─────
export function PartnerSection() {
  // Liste doublée pour une boucle sans couture (translateX -50 %)
  const loop = [...PARTNERS, ...PARTNERS]
  return (
    <section aria-label="Espace partenaires" className="overflow-hidden rounded-2xl border border-border bg-secondary/50 py-6 md:py-8">
      <div className="mb-6 flex items-center justify-between px-6 md:px-8">
        <div>
          <p className="overline-label text-muted-foreground">Espace partenaires</p>
          <h2 className="mt-1 font-display text-xl font-bold">Ils nous font confiance</h2>
        </div>
        <Link to="/contact" className="hidden text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light sm:block">
          Devenir partenaire →
        </Link>
      </div>
      {/* Défilé continu, pause au survol, fondu sur les bords */}
      <div className="relative overflow-hidden" aria-label="Logos de nos partenaires">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-secondary/90 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-secondary/90 to-transparent" aria-hidden="true" />
        <div className="animate-ticker-slow flex w-max items-stretch gap-4 px-6">
          {loop.map((p, i) => (
            <div
              key={`${p.id}-${i}`}
              className="flex w-[240px] shrink-0 items-center gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md"
              aria-hidden={i >= PARTNERS.length ? 'true' : undefined}
            >
              <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 ring-1 ring-border">
                <img src={p.logo} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{p.name}</p>
                <p className="truncate text-xs text-muted-foreground">{p.sector}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
