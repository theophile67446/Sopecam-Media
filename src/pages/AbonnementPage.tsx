import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Check, Crown, ShieldCheck, Smartphone, CreditCard, Building2 } from 'lucide-react'
import { PLANS } from '@/lib/data/media'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { setPageMeta, formatFCFA } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

// ─── Page offres d'abonnement (SUB-01) ──────────────────────────
export default function AbonnementPage() {
  const { user } = useAppStore()
  const [params] = useSearchParams()
  const from = params.get('from')

  useEffect(() => {
    setPageMeta('Abonnements', 'Découvrez nos offres : Gratuit, Standard, Famille, Premium et Institutionnel.')
  }, [])

  return (
    <div>
      {/* Bandeau */}
      <section className="surface-hero texture-dots">
        <div className="mx-auto max-w-[1280px] px-4 py-12 text-center lg:px-6">
          <p className="overline-label text-gold">Nos offres</p>
          <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-white md:text-4xl">
            Choisissez l'information sans limites
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sopecam-mint">
            Chaque abonnement finance directement le travail de nos rédactions dans les dix régions du Cameroun.
          </p>
        </div>
      </section>

      <PageContainer>
        <Breadcrumb items={[{ label: 'Abonnements' }]} />

        {/* Grille des offres */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {PLANS.map((p) => {
            const current = user?.plan === p.id || (p.id === 'gratuit' && (!user || user.plan === 'free'))
            return (
              <div
                key={p.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border bg-card p-6 shadow-sm transition-all duration-250 hover:-translate-y-1 hover:shadow-xl',
                  p.highlight ? 'border-gold shadow-lg ring-2 ring-gold/50' : 'border-border',
                )}
              >
                {p.highlight && (
                  <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A] shadow-md">
                    <Crown className="h-3 w-3" /> Recommandé
                  </span>
                )}
                <p className="overline-label text-muted-foreground">{p.cible}</p>
                <h2 className="mt-1.5 font-display text-xl font-bold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                <p className="mt-4">
                  <span className={cn('font-mono text-3xl font-bold', p.highlight && 'text-gold')}>
                    {formatFCFA(p.price)}
                  </span>
                  {p.period && <span className="text-sm text-muted-foreground">{p.period}</span>}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.highlight ? 'text-gold' : 'text-sopecam-green dark:text-sopecam-green-light')} strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {current ? (
                  <span className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-muted-foreground">
                    Votre offre actuelle
                  </span>
                ) : p.id === 'gratuit' ? (
                  <Link
                    to="/compte/inscription"
                    className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border-2 border-sopecam-green text-sm font-semibold uppercase tracking-wide text-sopecam-green transition-all duration-150 hover:bg-sopecam-green hover:text-white dark:border-sopecam-green-light dark:text-sopecam-green-light dark:hover:bg-sopecam-green-light dark:hover:text-sopecam-green-deep"
                  >
                    Créer un compte
                  </Link>
                ) : p.id === 'institutionnel' ? (
                  <Link
                    to="/contact?objet=offre-institutionnelle"
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-border text-sm font-semibold uppercase tracking-wide transition-all duration-150 hover:border-sopecam-green hover:text-sopecam-green dark:hover:border-sopecam-green-light"
                  >
                    <Building2 className="h-4 w-4" /> Demander un devis
                  </Link>
                ) : (
                  <Link
                    to={`/paiement?plan=${p.id}${from ? `&from=${from}` : ''}`}
                    className={cn(
                      'mt-6 inline-flex h-11 items-center justify-center rounded-lg text-sm font-semibold uppercase tracking-wide shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg',
                      p.highlight ? 'bg-gold text-[#1A1A1A]' : 'bg-sopecam-green text-white hover:bg-sopecam-green-dark dark:bg-sopecam-green-light dark:text-sopecam-green-deep',
                    )}
                  >
                    Choisir cette offre
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Tableau comparatif */}
        <section className="mt-14" aria-label="Comparatif détaillé">
          <h2 className="mb-5 text-center font-display text-2xl font-bold">Comparatif détaillé</h2>
          <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
            <table className="w-full min-w-[860px] bg-card text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/60 text-left">
                  <th className="px-5 py-3.5 font-semibold">Fonctionnalité</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Gratuit</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Standard</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Famille</th>
                  <th className="px-4 py-3.5 text-center font-semibold text-gold">Premium</th>
                  <th className="px-4 py-3.5 text-center font-semibold">Institutionnel</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Articles par jour', '3', 'Illimité', 'Illimité', 'Illimité', 'Illimité'],
                  ['E-paper', '—', '7 jours', 'Complet', 'Complet', 'Complet'],
                  ['Archives & photothèque HD', '—', '—', '—', '✔', '✔'],
                  ['Podcasts exclusifs', '—', '—', '—', '✔', '✔'],
                  ['Navigation sans publicité', '—', '—', '—', '✔', '✔'],
                  ['Profils utilisateurs', '1', '1', '4', '2', 'Multi-postes'],
                  ['Newsletters thématiques', '✔', '✔', '✔', '✔', '✔'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-border/60 transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium">{row[0]}</td>
                    {row.slice(1).map((v, i) => (
                      <td key={i} className={cn('px-4 py-3 text-center', i === 3 && 'font-semibold text-gold')}>
                        {v === '✔' ? <Check className="mx-auto h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" strokeWidth={2.5} /> : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Moyens de paiement */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3" aria-label="Moyens de paiement acceptés">
          {[
            { icon: Smartphone, title: 'MTN Mobile Money', desc: 'Paiement confirmé en moins de 60 secondes' },
            { icon: Smartphone, title: 'Orange Money', desc: 'Validation par code USSD sécurisé' },
            { icon: CreditCard, title: 'Carte bancaire', desc: 'Visa, Mastercard via passerelle PCI DSS' },
          ].map((m) => (
            <div key={m.title} className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sopecam-green/10 text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
                <m.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{m.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" />
          Paiement 100 % sécurisé · Confirmation SMS + email · Facture électronique immédiate · Résiliable à tout moment
        </p>
      </PageContainer>
    </div>
  )
}
