import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import {
  CheckCircle2, ChevronLeft, CreditCard, Crown, Info, Loader2, Lock, Smartphone, User,
} from 'lucide-react'
import { PLANS } from '@/lib/data/media'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { setPageMeta, formatFCFA } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ─── Bandeau de transparence : paiement simulé (démo) ───────────
function DemoNotice() {
  const { t } = useT()
  return (
    <p
      role="note"
      className="mx-auto mb-6 flex max-w-2xl items-center justify-center gap-2 rounded-lg bg-[#00A0E0]/10 px-4 py-2.5 text-center text-[13px] font-medium text-[#0060A0] ring-1 ring-[#00A0E0]/30 dark:text-[#7fd0f5]"
    >
      <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
      {t.demoNotice}
    </p>
  )
}

type Method = 'mtn' | 'orange' | 'card'
type Step = 1 | 2 | 3

// ─── Tunnel de paiement (SUB-02) ────────────────────────────────
export default function PaiementPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { user, login, subscribe } = useAppStore()
  const plan = useMemo(() => PLANS.find((p) => p.id === params.get('plan')) ?? PLANS[3], [params])
  const from = params.get('from')

  const [step, setStep] = useState<Step>(user ? 2 : 1)
  const [method, setMethod] = useState<Method>('mtn')
  const [phone, setPhone] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvc: '' })
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  // Référence générée une seule fois à la confirmation (stable entre re-rendus)
  const [reference, setReference] = useState('')
  const [email, setEmail] = useState('demo@sopecam.cm')
  const [password, setPassword] = useState('Demo2026!')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    setPageMeta(`Paiement — ${plan.name}`, 'Finalisez votre abonnement SOPECAM Médias en toute sécurité.')
  }, [plan])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const res = login(email, password)
    if (res.ok) {
      toast.success(`Bienvenue ! Vous pouvez finaliser votre abonnement.`)
      setStep(2)
    } else {
      setLoginError(res.error ?? 'Erreur de connexion')
    }
  }

  const pay = (e: React.FormEvent) => {
    e.preventDefault()
    if (method !== 'card' && !/^\+?\d{9,13}$/.test(phone.replace(/\s/g, ''))) {
      toast.error('Veuillez saisir un numéro de téléphone valide (ex : 6XX XXX XXX).')
      return
    }
    setProcessing(true)
    // Simulation RG-SUB-01 : confirmation opérateur sous 60s (ici 2,4s)
    setTimeout(() => {
      setProcessing(false)
      setReference(`SOP-2026-${Math.floor(100000 + Math.random() * 899999)}`)
      setDone(true)
      subscribe(plan.id as 'standard' | 'famille' | 'premium')
      toast.success('Paiement confirmé ! Facture envoyée par email et SMS.')
    }, 2400)
  }

  if (done) {
    return (
      <PageContainer className="max-w-2xl">
        <DemoNotice />
        <div className="animate-fade-up rounded-2xl border border-[#059669]/30 bg-[#059669]/5 p-10 text-center shadow-lg dark:bg-[#059669]/10">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#059669] text-white shadow-lg">
            <CheckCircle2 className="h-9 w-9" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold">Paiement confirmé !</h1>
          <p className="mt-3 text-muted-foreground">
            Votre abonnement <strong className="text-foreground">{plan.name}</strong> est actif. Une confirmation vous a été envoyée par SMS, email et notification in-app, avec votre facture électronique.
          </p>
          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-border bg-card p-4 text-left text-sm">
            <p className="flex justify-between py-1"><span className="text-muted-foreground">Référence</span><span className="font-mono font-semibold">{reference}</span></p>
            <p className="flex justify-between py-1"><span className="text-muted-foreground">Offre</span><span className="font-semibold">{plan.name}</span></p>
            <p className="flex justify-between py-1"><span className="text-muted-foreground">Montant</span><span className="font-mono font-semibold">{formatFCFA(plan.price)}</span></p>
            <p className="flex justify-between py-1"><span className="text-muted-foreground">Moyen</span><span className="font-semibold">{method === 'card' ? 'Carte bancaire' : method === 'mtn' ? 'MTN MoMo' : 'Orange Money'}</span></p>
          </div>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to={from ? `/article/${from}` : '/'}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-sopecam-green px-7 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
            >
              <Crown className="h-4 w-4" />
              {from ? 'Lire mon article' : 'Profiter de mon abonnement'}
            </Link>
            <Link to="/compte" className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary">
              Mon compte
            </Link>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="max-w-4xl">
      <Breadcrumb items={[{ label: 'Abonnements', to: '/abonnement' }, { label: 'Paiement' }]} />
      <DemoNotice />

      {/* Étapes */}
      <ol className="mb-8 flex items-center justify-center gap-2 text-sm sm:gap-4" aria-label="Étapes du paiement">
        {[
          { n: 1, label: 'Compte', icon: User },
          { n: 2, label: 'Paiement', icon: CreditCard },
          { n: 3, label: 'Confirmation', icon: CheckCircle2 },
        ].map((s, i) => (
          <li key={s.n} className="flex items-center gap-2 sm:gap-4">
            <span className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm transition-colors',
              step >= s.n ? 'bg-sopecam-green text-white dark:bg-sopecam-green-light dark:text-sopecam-green-deep' : 'bg-secondary text-muted-foreground',
            )}>
              {s.n}
            </span>
            <span className={cn('hidden font-medium sm:block', step >= s.n ? 'text-foreground' : 'text-muted-foreground')}>{s.label}</span>
            {i < 2 && <span className="h-px w-8 bg-border sm:w-14" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Récapitulatif */}
        <aside className="lg:col-span-2">
          <div className="surface-hero texture-dots sticky top-24 rounded-2xl p-6 text-white shadow-xl">
            <p className="overline-label text-gold">Votre commande</p>
            <h2 className="mt-2 font-display text-2xl font-bold">{plan.name}</h2>
            <p className="mt-1 text-sm text-sopecam-mint">{plan.description}</p>
            <ul className="mt-5 space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-white/105">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-white/15 pt-4">
              <p className="flex items-baseline justify-between">
                <span className="text-sm text-white/70">Total mensuel</span>
                <span className="font-mono text-2xl font-bold text-gold">{formatFCFA(plan.price)}</span>
              </p>
              <p className="mt-1 text-xs text-white/50">Sans engagement · Résiliable à tout moment</p>
            </div>
          </div>
        </aside>

        {/* Formulaires */}
        <div className="lg:col-span-3">
          {step === 1 && !user && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-display text-xl font-bold">Étape 1 — Identifiez-vous</h2>
              <p className="mt-1 text-sm text-muted-foreground">Connectez-vous ou créez un compte pour continuer.</p>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="pay-email" className="mb-1.5 block text-sm font-medium">Adresse email</label>
                  <input id="pay-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                </div>
                <div>
                  <label htmlFor="pay-pwd" className="mb-1.5 block text-sm font-medium">Mot de passe</label>
                  <input id="pay-pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                </div>
                {loginError && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">{loginError}</p>}
                <button type="submit" className="h-11 w-full rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
                  Continuer
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{' '}
                  <Link to="/compte/inscription" className="font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
                    Inscription gratuite
                  </Link>
                </p>
              </form>
            </div>
          )}

          {(step >= 2 || user) && (
            <form onSubmit={pay} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <h2 className="font-display text-xl font-bold">Étape 2 — Moyen de paiement</h2>
              <p className="mt-1 text-sm text-muted-foreground">Choisissez votre méthode préférée. Confirmation sous 60 secondes.</p>

              <div className="mt-6 grid grid-cols-3 gap-3" role="radiogroup" aria-label="Moyen de paiement">
                {[
                  { id: 'mtn' as Method, label: 'MTN MoMo', color: '#FFCC00', text: '#1A1A1A' },
                  { id: 'orange' as Method, label: 'Orange Money', color: '#FF7900', text: '#FFFFFF' },
                  { id: 'card' as Method, label: 'Carte bancaire', color: '#1A1A1A', text: '#FFFFFF' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={method === m.id}
                    onClick={() => setMethod(m.id)}
                    className={cn(
                      'flex h-14 flex-col items-center justify-center gap-1 rounded-xl border-2 text-xs font-bold transition-all duration-150',
                      method === m.id ? 'border-sopecam-green shadow-md dark:border-sopecam-green-light' : 'border-border hover:border-input',
                    )}
                  >
                    <span className="rounded-md px-2.5 py-1" style={{ backgroundColor: m.color, color: m.text }}>
                      {m.id === 'card' ? <CreditCard className="h-4 w-4" /> : <Smartphone className="h-4 w-4" />}
                    </span>
                    {m.label}
                  </button>
                ))}
              </div>

              {method !== 'card' ? (
                <div className="mt-6">
                  <label htmlFor="pay-phone" className="mb-1.5 block text-sm font-medium">
                    Numéro {method === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'}
                  </label>
                  <input
                    id="pay-phone"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex : 690 123 456"
                    required
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15"
                  />
                  <p className="mt-2 rounded-lg bg-secondary px-3 py-2.5 text-xs text-muted-foreground">
                    Vous recevrez une notification USSD/Push sur ce numéro pour valider le paiement de <strong>{formatFCFA(plan.price)}</strong>.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="cc-num" className="mb-1.5 block text-sm font-medium">Numéro de carte</label>
                    <input id="cc-num" inputMode="numeric" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} placeholder="4242 4242 4242 4242" required
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 font-mono text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                  </div>
                  <div>
                    <label htmlFor="cc-name" className="mb-1.5 block text-sm font-medium">Nom sur la carte</label>
                    <input id="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="NOM Prénom" required
                      className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cc-exp" className="mb-1.5 block text-sm font-medium">Expiration</label>
                      <input id="cc-exp" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} placeholder="MM/AA" required
                        className="h-11 w-full rounded-lg border border-input bg-background px-4 font-mono text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                    </div>
                    <div>
                      <label htmlFor="cc-cvc" className="mb-1.5 block text-sm font-medium">CVC</label>
                      <input id="cc-cvc" inputMode="numeric" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="123" required maxLength={4}
                        className="h-11 w-full rounded-lg border border-input bg-background px-4 font-mono text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gold text-sm font-bold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-70"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validation {method === 'card' ? 'bancaire' : 'opérateur'} en cours…
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    Payer {formatFCFA(plan.price)}
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                <Lock className="h-3 w-3" /> Transaction chiffrée · Aucune donnée bancaire conservée · 3 tentatives max avant blocage 15 min
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button onClick={() => navigate('/abonnement')} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Retour aux offres
        </button>
      </div>
    </PageContainer>
  )
}
