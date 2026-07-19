import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import {
  ArrowDownRight, ArrowUpRight, CheckCircle2, Flag, Minus, Send, ShieldCheck, Trophy,
} from 'lucide-react'
import { UNIVERSES, PUBLICATIONS, type UniverseKey, type PubCode } from '@/lib/data/publications'

// ─── Publication dominante par univers ──────────────────────────
const UNIVERSE_PUB: Record<UniverseKey, PubCode> = {
  actus: 'CT',
  people: 'NY',
  economie: 'CBT',
  sports: 'WSL',
  culture: 'NY',
  debats: 'CI',
  'fact-checking': 'CI',
}
import { getArticlesByUniverse, ARTICLES } from '@/lib/data/articles'
import { MATCHES, STANDINGS, ECO_INDICATORS, ECO_CHART, FACT_CHECKS, ARCHIVE_PHOTOS } from '@/lib/data/media'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { ArticleCard } from '@/components/ArticleCard'
import { SectionHeading } from '@/components/widgets'
import { PodcastSection } from '@/components/home/sections'
import { PollWidget } from '@/components/PollWidget'
import { LiveBadge } from '@/components/badges'
import { CoverImage } from '@/components/CoverImage'
import { setPageMeta } from '@/lib/utils2'
import { cn } from '@/lib/utils'

// ─── Motifs signature par grande rubrique (trame discrète) ──────
// Chaque univers a sa texture : points (actus), rayures fines
// (people), grille (économie), obliques (sports), losanges
// (culture), lignes (débats), croisillons (fact-checking).
const UNIVERSE_MOTIFS: Record<UniverseKey, (c: string) => React.CSSProperties> = {
  actus: (c) => ({
    backgroundImage: `radial-gradient(${c}2e 1.2px, transparent 1.3px)`,
    backgroundSize: '20px 20px',
  }),
  people: (c) => ({
    backgroundImage: `repeating-linear-gradient(45deg, ${c}24 0 1px, transparent 1px 14px)`,
  }),
  economie: (c) => ({
    backgroundImage: `linear-gradient(${c}1f 1px, transparent 1px), linear-gradient(90deg, ${c}1f 1px, transparent 1px)`,
    backgroundSize: '28px 28px',
  }),
  sports: (c) => ({
    backgroundImage: `repeating-linear-gradient(-45deg, ${c}21 0 2px, transparent 2px 20px)`,
  }),
  culture: (c) => ({
    backgroundImage: `repeating-linear-gradient(45deg, ${c}26 0 1px, transparent 1px 16px), repeating-linear-gradient(-45deg, ${c}26 0 1px, transparent 1px 16px)`,
  }),
  debats: (c) => ({
    backgroundImage: `repeating-linear-gradient(0deg, ${c}1f 0 1px, transparent 1px 12px)`,
  }),
  'fact-checking': (c) => ({
    backgroundImage: `repeating-linear-gradient(45deg, ${c}1f 0 1px, transparent 1px 12px), repeating-linear-gradient(-45deg, ${c}1f 0 1px, transparent 1px 12px)`,
  }),
}

// ─── Page univers générique ─────────────────────────────────────
function UniverseShell({
  universeKey, children, featuredCount = 6,
}: {
  universeKey: UniverseKey
  children?: React.ReactNode
  featuredCount?: number
}) {
  const u = UNIVERSES[universeKey]
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat')
  const all = getArticlesByUniverse(universeKey)
  const filtered = cat ? all.filter((a) => a.subcategory === cat) : all
  const pub = PUBLICATIONS[UNIVERSE_PUB[universeKey]]
  const accent = u.color === '#004000' ? '#008000' : u.color
  // L'or est trop clair pour du texte blanc
  const chipText = accent === '#D4A843' || accent === '#C4A35A' ? '#1A1A1A' : '#FFFFFF'
  const motif = UNIVERSE_MOTIFS[universeKey](accent)

  useEffect(() => {
    setPageMeta(u.label, u.description)
  }, [u.label, u.description])

  return (
    <div>
      {/* Bandeau univers — teinte légère : la couleur signature vit dans
          les accents (liseré, barre de titre, filtre actif), pas en aplat */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div className="h-[3px]" style={{ backgroundColor: accent }} aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${accent}26 0%, ${accent}0f 45%, transparent 80%)` }}
          aria-hidden="true"
        />
        {/* Motif signature de la rubrique, fondu vers la droite */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ ...motif, maskImage: 'linear-gradient(90deg, black 0%, transparent 70%)', WebkitMaskImage: 'linear-gradient(90deg, black 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        {/* Logo de la publication dominante */}
        <div className="pointer-events-none absolute -right-4 bottom-3 top-3 hidden w-1/3 items-center justify-center opacity-70 md:flex" aria-hidden="true">
          <span className="flex h-24 w-full max-w-[260px] items-center justify-center rounded-2xl bg-white p-4 shadow-sm ring-1 ring-border">
            <img src={pub.logo} alt="" className="max-h-full max-w-full object-contain" />
          </span>
        </div>
        <div className="relative mx-auto max-w-[1280px] px-4 py-10 lg:px-6">
          <p className="overline-label text-muted-foreground">Univers éditorial · {pub.name}</p>
          <h1 className="mt-2 flex items-center gap-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            <span className="h-8 w-1.5 shrink-0 rounded-full md:h-9" style={{ backgroundColor: accent }} aria-hidden="true" />
            {u.label}
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">{u.description}</p>
          {/* Filtres sous-rubriques */}
          <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Sous-rubriques">
            <button
              onClick={() => setParams({})}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
                !cat ? 'shadow-sm' : 'bg-secondary text-foreground/70 ring-1 ring-border hover:bg-border/60 hover:text-foreground',
              )}
              style={!cat ? { backgroundColor: accent, color: chipText } : undefined}
              role="tab"
              aria-selected={!cat}
            >
              Tout
            </button>
            {u.subcategories.map((s) => (
              <button
                key={s}
                onClick={() => setParams({ cat: s })}
                className={cn(
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150',
                  cat === s ? 'shadow-sm' : 'bg-secondary text-foreground/70 ring-1 ring-border hover:bg-border/60 hover:text-foreground',
                )}
                style={cat === s ? { backgroundColor: accent, color: chipText } : undefined}
                role="tab"
                aria-selected={cat === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      <PageContainer>
        <Breadcrumb items={[{ label: u.label }, ...(cat ? [{ label: cat }] : [])]} />

        {children}

        {/* Grille d'articles */}
        <section aria-label={`Articles ${u.label}`} className="mt-4">
          <SectionHeading
            title={cat ? `${cat} — ${u.label}` : `Toute la rubrique ${u.label}`}
            subtitle={`${filtered.length} article${filtered.length > 1 ? 's' : ''} publié${filtered.length > 1 ? 's' : ''}`}
            color={u.color === '#004000' ? '#008000' : u.color}
          />
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="font-medium text-muted-foreground">Aucun article dans « {cat} » pour le moment.</p>
              <button onClick={() => setParams({})} className="mt-3 text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
                Voir toute la rubrique
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, featuredCount).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </section>
      </PageContainer>
    </div>
  )
}

// ─── Les Actus ──────────────────────────────────────────────────
export function ActusPage() {
  return <UniverseShell universeKey="actus" featuredCount={9} />
}

// ─── People ─────────────────────────────────────────────────────
export function PeoplePage() {
  return <UniverseShell universeKey="people" featuredCount={9} />
}

// ─── Économie (widgets data-driven) ─────────────────────────────
export function EconomiePage() {
  const max = Math.max(...ECO_CHART.map((c) => c.value))
  return (
    <UniverseShell universeKey="economie" featuredCount={9}>
      {/* Indicateurs marchés */}
      <section aria-label="Indicateurs économiques" className="mb-10">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ECO_INDICATORS.map((ind) => (
            <div key={ind.label} className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{ind.label}</p>
              <p className="mt-1.5 font-mono text-xl font-bold">{ind.value}</p>
              <p className={cn('mt-1 inline-flex items-center gap-0.5 text-xs font-semibold', ind.up ? 'text-[#059669]' : 'text-[#DC2626]')}>
                {ind.change === 'stable' ? <Minus className="h-3 w-3" /> : ind.up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {ind.change}
              </p>
            </div>
          ))}
        </div>
      </section>
      {/* Graphique */}
      <section aria-label="Évolution des exportations" className="mb-10 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Exportations de produits de base</h3>
            <p className="text-sm text-muted-foreground">Indice base 100 · janvier-juillet 2026</p>
          </div>
          <span className="rounded-full bg-cbt-blue/10 px-3 py-1 text-xs font-bold text-cbt-blue ring-1 ring-cbt-blue/30">+59 % sur 7 mois</span>
        </div>
        <div className="flex h-44 items-end gap-3 sm:gap-5">
          {ECO_CHART.map((c) => (
            <div key={c.month} className="group flex flex-1 flex-col items-center gap-2">
              <span className="font-mono text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">{c.value}</span>
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-cbt-deep to-cbt-blue shadow-sm transition-all duration-250 group-hover:from-cbt-blue group-hover:to-cbt-blue/70"
                style={{ height: `${(c.value / max) * 100}%`, minHeight: 8 }}
                role="img"
                aria-label={`${c.month} : indice ${c.value}`}
              />
              <span className="text-xs font-medium text-muted-foreground">{c.month}</span>
            </div>
          ))}
        </div>
      </section>
    </UniverseShell>
  )
}

// ─── Sports (scores & classement) ───────────────────────────────
export function SportsPage() {
  return (
    <UniverseShell universeKey="sports" featuredCount={9}>
      <div className="mb-10 grid gap-6 lg:grid-cols-5">
        {/* Scores */}
        <section aria-label="Scores et résultats" className="lg:col-span-3">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
              <h3 className="flex items-center gap-2 font-display text-base font-bold">
                <Trophy className="h-4 w-4 text-wsl-red" />
                Scores & résultats
              </h3>
              <LiveBadge />
            </div>
            <ul className="divide-y divide-border">
              {MATCHES.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-secondary/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{m.competition}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold">
                      {m.home} <span className="text-muted-foreground">vs</span> {m.away}
                    </p>
                  </div>
                  <div className="text-right">
                    {m.status === 'upcoming' ? (
                      <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">{m.date}</span>
                    ) : (
                      <>
                        <span className={cn(
                          'rounded-md px-2.5 py-1 font-mono text-sm font-bold',
                          m.home === 'Cameroun' || m.home === 'Cameroun (F)' || m.homeScore! > m.awayScore!
                            ? 'bg-wsl-green/10 text-wsl-green dark:text-sopecam-green-light'
                            : 'bg-secondary text-foreground',
                        )}>
                          {m.homeScore} - {m.awayScore}
                        </span>
                        <p className="mt-1 text-[11px] text-muted-foreground">Terminé</p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
        {/* Classement */}
        <section aria-label="Classement MTN Elite One" className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-3.5">
              <h3 className="font-display text-base font-bold">Classement MTN Elite One</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">#</th>
                  <th className="py-2.5 font-semibold">Équipe</th>
                  <th className="py-2.5 text-center font-semibold">J</th>
                  <th className="py-2.5 text-center font-semibold">Pts</th>
                </tr>
              </thead>
              <tbody>
                {STANDINGS.map((t) => (
                  <tr key={t.pos} className={cn('border-b border-border/60 transition-colors hover:bg-secondary/50', t.pos <= 2 && 'bg-wsl-green/5 dark:bg-wsl-green/10')}>
                    <td className="px-4 py-2.5">
                      <span className={cn(
                        'inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold',
                        t.pos === 1 ? 'bg-gold text-[#1A1A1A]' : t.pos <= 3 ? 'bg-wsl-green/15 text-wsl-green dark:text-sopecam-green-light' : 'text-muted-foreground',
                      )}>
                        {t.pos}
                      </span>
                    </td>
                    <td className="py-2.5 font-semibold">{t.team}</td>
                    <td className="py-2.5 text-center font-mono text-muted-foreground">{t.j}</td>
                    <td className="py-2.5 text-center font-mono font-bold">{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-3 text-[11px] text-muted-foreground">Top 2 : qualification Ligue des Champions CAF</p>
          </div>
        </section>
      </div>
    </UniverseShell>
  )
}

// ─── Culture (galerie Nyanga) ───────────────────────────────────
export function CulturePage() {
  const gallery = ARCHIVE_PHOTOS.filter((p) => p.publication === 'NY').slice(0, 4)
  return (
    <UniverseShell universeKey="culture" featuredCount={9}>
      <section aria-label="Galerie Nyanga" className="mb-10">
        <SectionHeading title="La galerie Nyanga" subtitle="Le Cameroun en images, par nos photographes" linkTo="/archives" linkLabel="Photothèque" color="#D4A843" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gallery.map((p) => (
            <Link key={p.id} to="/archives" className="card-article group">
              <div className="relative aspect-[3/4] overflow-hidden">
                <CoverImage publication="NY" seed={p.seed} universe="culture" src={p.src} className="absolute inset-0" zoomClass="cover-zoom" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
                  <p className="text-sm font-semibold text-white">{p.title}</p>
                  <p className="mt-0.5 text-xs text-white/70">© {p.photographer}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </UniverseShell>
  )
}

// ─── Débats ─────────────────────────────────────────────────────
export function DebatsPage() {
  return (
    <UniverseShell universeKey="debats" featuredCount={9}>
      <div className="mb-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PodcastSection />
        </div>
        <PollWidget />
      </div>
    </UniverseShell>
  )
}

// ─── Fact-Checking ──────────────────────────────────────────────
const VERDICT_STYLES: Record<string, { bg: string; ring: string; text: string }> = {
  VRAI: { bg: 'bg-[#059669]/10', ring: 'ring-[#059669]/40', text: 'text-[#059669]' },
  FAUX: { bg: 'bg-[#DC2626]/10', ring: 'ring-[#DC2626]/40', text: 'text-[#DC2626]' },
  TROMPEUR: { bg: 'bg-[#E0A000]/10', ring: 'ring-[#E0A000]/40', text: 'text-[#B8860B] dark:text-[#E0A000]' },
  'INVÉRIFIABLE': { bg: 'bg-muted', ring: 'ring-border', text: 'text-muted-foreground' },
}

export function FactCheckingPage() {
  const [claim, setClaim] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!claim.trim()) return
    toast.success('Signalement transmis à notre cellule de vérification. Réponse sous 48h.')
    setClaim('')
  }

  return (
    <UniverseShell universeKey="fact-checking" featuredCount={6}>
      {/* Verdicts récents */}
      <section aria-label="Dernières vérifications" className="mb-10">
        <SectionHeading title="Nos derniers verdicts" subtitle="Chaque info douteuse vérifiée par notre cellule dédiée" color="#0040A0" icon={<ShieldCheck className="h-5 w-5 text-cbt-deep dark:text-cbt-blue" />} />
        <div className="grid gap-4 md:grid-cols-2">
          {FACT_CHECKS.map((fc) => {
            const s = VERDICT_STYLES[fc.verdict]
            const inner = (
              <div className={cn('card-article h-full p-5 ring-1', s.ring)}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ring-1', s.bg, s.text, s.ring)}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {fc.verdict}
                  </span>
                  <span className="text-xs text-muted-foreground">{fc.date}</span>
                </div>
                <h3 className="font-display text-base font-bold leading-snug">{fc.claim}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{fc.summary}</p>
              </div>
            )
            return fc.articleSlug ? (
              <Link key={fc.id} to={`/article/${fc.articleSlug}`} className="block">{inner}</Link>
            ) : (
              <div key={fc.id}>{inner}</div>
            )
          })}
        </div>
      </section>

      {/* Signalement */}
      <section aria-label="Signaler une information" className="mb-10 rounded-xl border border-cbt-deep/25 bg-gradient-to-br from-cbt-deep/5 to-cbt-blue/5 p-6 dark:from-cbt-blue/10 dark:to-transparent md:p-8">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-2 font-display text-xl font-bold">
              <Flag className="h-5 w-5 text-cbt-deep dark:text-cbt-blue" />
              Vous avez repéré une fake news ?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Copiez le lien ou décrivez l'information douteuse. Notre cellule la vérifiera sous 48 heures et publiera un verdict documenté.
            </p>
          </div>
          <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor="claim" className="sr-only">Information à vérifier</label>
            <input
              id="claim"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="Lien ou description de l'info à vérifier…"
              className="h-11 flex-1 rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-cbt-deep focus:ring-2 focus:ring-cbt-deep/15 dark:focus:border-cbt-blue"
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cbt-deep px-5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-cbt-blue">
              <Send className="h-4 w-4" />
              Signaler
            </button>
          </form>
        </div>
      </section>
    </UniverseShell>
  )
}

// Export groupé des articles pour réutilisation
export { ARTICLES }
