import { useEffect } from 'react'
import { Link, Navigate } from 'react-router'
import {
  ArrowUpRight, Banknote, Crown, FileText, LayoutDashboard, TrendingUp, Users,
} from 'lucide-react'
import { ARTICLES } from '@/lib/data/articles'
import { PLANS } from '@/lib/data/media'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { PublicationBadge } from '@/components/badges'
import { setPageMeta, formatViews, timeAgo } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

// Horodatages simulés figés au chargement du module (rendu pur)
const agoH = (h: number) => new Date(Date.now() - h * 3600000).toISOString()
const RECENT_PAYMENTS = [
  { ref: 'SOP-2026-781234', user: 'Amina M.', plan: 'Premium', amount: '5 000', method: 'MTN MoMo', at: agoH(0.4) },
  { ref: 'SOP-2026-781229', user: 'Olivier K.', plan: 'Standard', amount: '2 000', method: 'Orange Money', at: agoH(1.1) },
  { ref: 'SOP-2026-781218', user: 'Nadège F.', plan: 'Famille', amount: '3 500', method: 'Carte bancaire', at: agoH(2.3) },
  { ref: 'SOP-2026-781204', user: 'Brice T.', plan: 'Standard', amount: '2 000', method: 'MTN MoMo', at: agoH(3.2) },
  { ref: 'SOP-2026-781199', user: 'Solange E.', plan: 'Premium', amount: '5 000', method: 'Orange Money', at: agoH(4.5) },
]

// ─── Back-office (F-404 : tableau de bord revenus) ──────────────
export default function AdminPage() {
  const { user } = useAppStore()
  useEffect(() => { setPageMeta('Back-office') }, [])

  if (!user || user.role !== 'admin') return <Navigate to="/compte/connexion" replace />

  const kpis = [
    { icon: Banknote, label: 'Revenus du mois', value: '48,2 M FCFA', delta: '+112 % vs 2025', up: true },
    { icon: Users, label: 'Abonnés actifs', value: '21 470', delta: '+18,4 %', up: true },
    { icon: Crown, label: 'Taux de conversion', value: '4,7 %', delta: '+0,9 pt', up: true },
    { icon: TrendingUp, label: 'ARPU mensuel', value: '3 890 FCFA', delta: '+6,2 %', up: true },
  ]

  const revenue = [22, 25, 24, 29, 33, 38, 41, 48]
  const maxR = Math.max(...revenue)
  const months = ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil']

  const recentPayments = RECENT_PAYMENTS

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Back-office' }]} />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 font-display text-3xl font-bold">
            <LayoutDashboard className="h-7 w-7 text-sopecam-green dark:text-sopecam-green-light" />
            Tableau de bord
          </h1>
          <p className="mt-1 text-muted-foreground">Vue d'ensemble des revenus, abonnements et contenus</p>
        </div>
        <span className="rounded-full bg-[#059669]/10 px-4 py-1.5 text-sm font-bold text-[#059669] ring-1 ring-[#059669]/30">
          Objectif 2026 : en avance de 12 %
        </span>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-250 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sopecam-green/10 text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
                <k.icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-[#059669]">
                <ArrowUpRight className="h-3.5 w-3.5" /> {k.delta}
              </span>
            </div>
            <p className="mt-3 font-mono text-2xl font-bold">{k.value}</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Courbe revenus */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-3" aria-label="Évolution des revenus">
          <h2 className="font-display text-lg font-bold">Revenus digitaux (en millions FCFA)</h2>
          <p className="text-sm text-muted-foreground">Doublement annuel en cours — trajectoire conforme à l'objectif 2030</p>
          <div className="mt-6 flex h-48 items-end gap-3">
            {revenue.map((v, i) => (
              <div key={months[i]} className="group flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-xs font-bold opacity-0 transition-opacity group-hover:opacity-100">{v}</span>
                <div
                  className={cn(
                    'w-full rounded-t-lg shadow-sm transition-all duration-250 group-hover:brightness-110',
                    i === revenue.length - 1
                      ? 'bg-gradient-to-t from-gold/100 to-gold'
                      : 'bg-gradient-to-t from-sopecam-green-dark to-sopecam-green dark:from-sopecam-green dark:to-sopecam-green-light',
                  )}
                  style={{ height: `${(v / maxR) * 100}%`, minHeight: 10 }}
                />
                <span className="text-xs text-muted-foreground">{months[i]}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Répartition des abonnements */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2" aria-label="Répartition des abonnements">
          <h2 className="font-display text-lg font-bold">Répartition des abonnés</h2>
          <div className="mt-5 space-y-3.5">
            {[
              { plan: PLANS[1], pct: 46 },
              { plan: PLANS[2], pct: 21 },
              { plan: PLANS[3], pct: 28 },
              { plan: PLANS[4], pct: 5 },
            ].map(({ plan, pct }) => (
              <div key={plan.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{plan.name}</span>
                  <span className="font-mono font-bold">{pct} %</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn('h-full rounded-full', plan.id === 'premium' ? 'bg-gold' : 'bg-sopecam-green dark:bg-sopecam-green-light')}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 rounded-lg bg-secondary px-3.5 py-2.5 text-xs text-muted-foreground">
            Le Premium progresse de 4 points ce trimestre, porté par les contenus exclusifs et les archives.
          </p>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Paiements récents */}
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:col-span-3" aria-label="Paiements récents">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="font-display text-base font-bold">Paiements récents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2.5 font-semibold">Référence</th>
                  <th className="py-2.5 font-semibold">Client</th>
                  <th className="py-2.5 font-semibold">Offre</th>
                  <th className="py-2.5 font-semibold">Montant</th>
                  <th className="py-2.5 font-semibold">Moyen</th>
                  <th className="py-2.5 pr-5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((p) => (
                  <tr key={p.ref} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{p.ref}</td>
                    <td className="py-3 font-medium">{p.user}</td>
                    <td className="py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', p.plan === 'Premium' ? 'bg-gold/15 text-gold' : 'bg-secondary text-muted-foreground')}>
                        {p.plan}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold">{p.amount} F</td>
                    <td className="py-3 text-muted-foreground">{p.method}</td>
                    <td className="py-3 pr-5 text-muted-foreground">{timeAgo(p.at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Articles les plus lus */}
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:col-span-2" aria-label="Articles les plus lus">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold">
              <FileText className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" />
              Top articles (vues)
            </h2>
          </div>
          <ol className="divide-y divide-border/60">
            {[...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 6).map((a, i) => (
              <li key={a.id}>
                <Link to={`/article/${a.slug}`} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-secondary/40">
                  <span className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    i === 0 ? 'bg-gold text-[#1A1A1A]' : 'bg-secondary text-muted-foreground',
                  )}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{a.title}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <PublicationBadge code={a.publication} />
                      <span className="font-mono">{formatViews(a.views)} vues</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </PageContainer>
  )
}
