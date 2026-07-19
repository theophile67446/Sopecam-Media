import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'sonner'
import {
  Award, Building2, CheckCircle2, History, Mail, MapPin, Newspaper, Phone, Send, Target, Users,
} from 'lucide-react'
import { PUBLICATION_LIST } from '@/lib/data/publications'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { setPageMeta } from '@/lib/utils2'
import { cn } from '@/lib/utils'

// ─── Newsletter (F-205) ─────────────────────────────────────────
const NEWSLETTERS = [
  { id: 'matin', name: 'La Matinale', desc: 'L\'essentiel de l\'actualité chaque jour à 6h30', freq: 'Quotidienne', color: '#006020' },
  { id: 'business', name: 'Business Hebdo', desc: 'Économie, marchés et entreprises chaque lundi', freq: 'Hebdomadaire', color: '#00A0E0' },
  { id: 'sports', name: 'Vestiaire', desc: 'Résultats, transferts et analyses sportives du vendredi', freq: 'Hebdomadaire', color: '#E02020' },
  { id: 'culture', name: 'Nyanga Lifestyle', desc: 'Mode, gastronomie et sorties du week-end', freq: 'Hebdomadaire', color: '#D4A843' },
  { id: 'regions', name: 'Échos des Régions', desc: 'L\'actualité des dix régions, chaque mercredi', freq: 'Hebdomadaire', color: '#008040' },
  { id: 'breaking', name: 'Alertes Flash', desc: 'Breaking news en temps réel, dès publication', freq: 'Temps réel', color: '#8f0013' },
]

export function NewsletterPage() {
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string[]>(['matin'])
  const [done, setDone] = useState(false)

  useEffect(() => { setPageMeta('Newsletters', 'Inscrivez-vous à nos newsletters thématiques.') }, [])

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Veuillez saisir une adresse email valide.')
      return
    }
    if (selected.length === 0) {
      toast.error('Sélectionnez au moins une newsletter.')
      return
    }
    setDone(true)
    toast.success('Préférences enregistrées !')
  }

  return (
    <PageContainer className="max-w-3xl">
      <Breadcrumb items={[{ label: 'Newsletters' }]} />
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-3 font-display text-3xl font-bold">
          <Mail className="h-7 w-7 text-sopecam-green dark:text-sopecam-green-light" />
          Nos newsletters thématiques
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
          Choisissez vos rendez-vous d'information. Désinscription en un clic, à tout moment.
        </p>
      </div>

      {done ? (
        <div className="animate-fade-up mt-10 rounded-2xl border border-[#059669]/30 bg-[#059669]/5 p-10 text-center dark:bg-[#059669]/10">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[#059669]" />
          <h2 className="mt-4 font-display text-2xl font-bold">Inscription confirmée !</h2>
          <p className="mt-2 text-muted-foreground">
            Vous recevrez {selected.length} newsletter{selected.length > 1 ? 's' : ''} sur <strong className="text-foreground">{email}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2">
            {NEWSLETTERS.map((n) => {
              const on = selected.includes(n.id)
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggle(n.id)}
                  aria-pressed={on}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all duration-150',
                    on ? 'border-sopecam-green bg-sopecam-green/5 shadow-sm dark:border-sopecam-green-light dark:bg-sopecam-green-light/5' : 'border-border hover:border-input',
                  )}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: n.color }}
                  >
                    <Newspaper className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{n.name}</span>
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{n.freq}</span>
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{n.desc}</span>
                  </span>
                  <span className={cn('mt-1 h-5 w-5 shrink-0 rounded-full border-2 transition-colors', on ? 'border-sopecam-green bg-sopecam-green dark:border-sopecam-green-light dark:bg-sopecam-green-light' : 'border-input')}>
                    {on && <CheckCircle2 className="h-full w-full text-white dark:text-sopecam-green-deep" strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="nl-page-email" className="sr-only">Adresse email</label>
            <input
              id="nl-page-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              className="h-12 flex-1 rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15"
            />
            <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-sopecam-green px-8 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
              <Send className="h-4 w-4" /> Valider mes inscriptions
            </button>
          </div>
        </form>
      )}
    </PageContainer>
  )
}

// ─── Contact (F-007 / page 20) ──────────────────────────────────
export function ContactPage() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '',
    subject: params.get('objet') === 'offre-institutionnelle' ? 'Offre institutionnelle' : 'Question générale',
    message: '',
  })
  const [sent, setSent] = useState(false)

  useEffect(() => { setPageMeta('Contact', 'Contactez la rédaction et les services SOPECAM Médias.') }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    toast.success('Message envoyé ! Notre équipe vous répondra sous 48h.')
  }

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Contact' }]} />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl font-bold">Contactez-nous</h1>
          <p className="mt-2 text-muted-foreground">Rédaction, abonnements, partenariats : notre équipe vous répond sous 48 heures ouvrées.</p>
          <div className="mt-8 space-y-4">
            {[
              { icon: MapPin, label: 'Siège', value: 'Avenue de l\'Indépendance, Yaoundé — Cameroun' },
              { icon: Phone, label: 'Standard', value: '(+237) 222 30 30 30' },
              { icon: Mail, label: 'Email', value: 'contact@sopecam.cm' },
            ].map((c) => (
              <div key={c.label} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sopecam-green/10 text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
                  <p className="font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-[#00A0E0]/30 bg-[#00A0E0]/5 p-5 dark:bg-[#00A0E0]/10">
            <p className="font-display font-bold">Numéros utiles</p>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <li>SAMU : <strong className="font-mono text-foreground">119</strong></li>
              <li>Pompiers : <strong className="font-mono text-foreground">118</strong></li>
              <li>Police : <strong className="font-mono text-foreground">117</strong></li>
              <li>Santé (numéro vert) : <strong className="font-mono text-foreground">1510</strong></li>
            </ul>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="animate-fade-up flex h-full flex-col items-center justify-center rounded-2xl border border-[#059669]/30 bg-[#059669]/5 p-10 text-center dark:bg-[#059669]/10">
              <CheckCircle2 className="h-12 w-12 text-[#059669]" />
              <h2 className="mt-4 font-display text-2xl font-bold">Message bien reçu !</h2>
              <p className="mt-2 text-muted-foreground">Nous vous répondrons à <strong className="text-foreground">{form.email}</strong> sous 48h ouvrées.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="mb-1.5 block text-sm font-medium">Nom complet</label>
                  <input id="ct-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                </div>
                <div>
                  <label htmlFor="ct-email" className="mb-1.5 block text-sm font-medium">Email</label>
                  <input id="ct-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="ct-subject" className="mb-1.5 block text-sm font-medium">Objet</label>
                <select id="ct-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-sopecam-green">
                  {['Question générale', 'Abonnement & facturation', 'Offre institutionnelle', 'Partenariat & publireportage', 'Correction d\'article', 'Presse & médias'].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label htmlFor="ct-msg" className="mb-1.5 block text-sm font-medium">Message</label>
                <textarea id="ct-msg" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15" />
              </div>
              <button type="submit" className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
                <Send className="h-4 w-4" /> Envoyer le message
              </button>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

// ─── Qui sommes-nous (page 24) ──────────────────────────────────
export function QuiSommesNousPage() {
  useEffect(() => { setPageMeta('Qui sommes-nous', 'Découvrez la SOPECAM, 50 ans d\'information au service du Cameroun.') }, [])

  const timeline = [
    { year: '1977', text: 'Création de la SOPECAM et lancement de Cameroon Tribune.' },
    { year: '1985', text: 'Naissance de Nyanga, le magazine de l\'art de vivre camerounais.' },
    { year: '2001', text: 'Lancement de Cameroon Insider, la perspective anglophone.' },
    { year: '2012', text: 'Cameroon Business Today rejoint le bouquet économique.' },
    { year: '2018', text: 'Weekend Sports & Loisirs devient la référence sportive du week-end.' },
    { year: '2026', text: 'Reconfiguration numérique : un portail unifié pour les 5 publications.' },
    { year: '2027', text: '50 ans de la SOPECAM — cap sur le milliard de recettes digitales.' },
  ]

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Qui sommes-nous' }]} />
      {/* Héro */}
      <div className="surface-hero texture-dots rounded-2xl p-8 text-center text-white md:p-12">
        <p className="overline-label text-gold">Depuis 1977</p>
        <h1 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold md:text-4xl">
          La SOPECAM, mémoire et avenir de l'information camerounaise
        </h1>
        <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-sopecam-mint">
          Société de Presse et d'Éditions du Cameroun, la SOPECAM édite cinq publications de référence et emploie plus de 300 journalistes et correspondants dans les dix régions du pays.
        </p>
      </div>

      {/* Chiffres */}
      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { icon: History, n: '50 ans', l: 'd\'excellence éditoriale' },
          { icon: Newspaper, n: '5', l: 'publications' },
          { icon: Users, n: '300+', l: 'journalistes' },
          { icon: Award, n: '1 Md', l: 'FCFA de recettes visées en 2030' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-border bg-card p-5 text-center shadow-sm">
            <s.icon className="mx-auto h-6 w-6 text-sopecam-green dark:text-sopecam-green-light" />
            <p className="mt-2 font-mono text-2xl font-bold">{s.n}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Target className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" /> Notre mission
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Garantir la souveraineté informationnelle du Cameroun en produisant un journalisme rigoureux, indépendant et accessible à tous — du papier au numérique, en français comme en anglais.
          </p>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Notre projet 2026-2028 vise le doublement annuel des recettes digitales pour atteindre un milliard de FCFA de recettes annuelles dès 2030, et financer durablement l'excellence éditoriale.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Building2 className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" /> Nos publications
          </h2>
          <ul className="mt-4 space-y-3.5">
            {PUBLICATION_LIST.map((p) => (
              <li key={p.code} className="flex items-center gap-3">
                <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded-md bg-white px-1.5 py-1 shadow-sm ring-1 ring-border">
                  <img src={p.logo} alt={p.name} className="max-h-6 max-w-full object-contain" />
                </span>
                <span className="text-sm font-semibold">{p.name}</span>
                <span className="hidden text-[13px] text-muted-foreground sm:block">— {p.tagline}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Frise */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h2 className="font-display text-xl font-bold">50 ans en dates clés</h2>
        <ol className="mt-6 space-y-0">
          {timeline.map((t, i) => (
            <li key={t.year} className="relative flex gap-5 pb-6 last:pb-0">
              <div className="flex flex-col items-center" aria-hidden="true">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sopecam-green/10 font-mono text-[10px] font-bold text-sopecam-green ring-1 ring-sopecam-green/30 dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
                  {i + 1}
                </span>
                {i < timeline.length - 1 && <span className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-1">
                <p className="font-mono text-sm font-bold text-sopecam-green dark:text-sopecam-green-light">{t.year}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </PageContainer>
  )
}
