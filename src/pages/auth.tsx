import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { CheckCircle2, KeyRound, Loader2, LogIn, Mail, ShieldCheck, UserPlus } from 'lucide-react'
import { DEMO_USERS } from '@/lib/data/media'
import { useAppStore } from '@/store/appStore'
import { setPageMeta } from '@/lib/utils2'
import { cn } from '@/lib/utils'

// ─── Layout commun des pages d'authentification ─────────────────
function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-secondary/40 px-4 py-12">
      {/* Ambiance légère : halos vert & or, plus d'aplat sombre plein écran */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(700px 380px at 85% -10%, rgba(0, 128, 0, 0.08), transparent 60%),
            radial-gradient(600px 340px at 0% 110%, rgba(212, 168, 67, 0.08), transparent 55%)
          `,
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-8 shadow-xl">
          <div className="mb-6 text-center">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-md ring-1 ring-border">
              <img src="/assets/logos/sopecam.png" alt="Logo SOPECAM" className="h-full w-full object-contain" />
            </span>
            <h1 className="font-display text-2xl font-bold">{title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Connexion sécurisée · Vos données sont protégées conformément à la loi camerounaise et au RGPD
        </p>
      </div>
    </div>
  )
}

const inputCls =
  'h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15 dark:focus:border-sopecam-green-light'

// ─── Boutons SSO simulés (F-501) ────────────────────────────────
function SsoButtons() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        { name: 'Google', color: '#EA4335' },
        { name: 'Facebook', color: '#1877F2' },
        { name: 'Apple', color: '#1A1A1A' },
      ].map((s) => (
        <button
          key={s.name}
          type="button"
          onClick={() => toast.info(`Connexion ${s.name} simulée pour la démo`)}
          className="flex h-11 items-center justify-center rounded-lg border border-border text-sm font-semibold transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          aria-label={`Continuer avec ${s.name}`}
        >
          <span className="mr-1.5 h-3 w-3 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
          {s.name}
        </button>
      ))}
    </div>
  )
}

// ─── Connexion (F-501) ──────────────────────────────────────────
export function ConnexionPage() {
  const { login } = useAppStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('demo@sopecam.cm')
  const [password, setPassword] = useState('Demo2026!')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { setPageMeta('Connexion') }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const res = login(email, password)
      setLoading(false)
      if (res.ok) {
        toast.success('Connexion réussie. Bonne lecture !')
        navigate('/')
      } else {
        setError(res.error ?? 'Erreur inconnue')
      }
    }, 600)
  }

  return (
    <AuthShell title="Bon retour parmi nous" subtitle="Accédez à votre espace SOPECAM Médias">
      <SsoButtons />
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> ou par email <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Adresse email</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
            <Link to="/compte/mot-de-passe-oublie" className="text-xs font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
              Mot de passe oublié ?
            </Link>
          </div>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} autoComplete="current-password" />
        </div>
        {error && (
          <p className="rounded-lg bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green-dark disabled:opacity-60 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Se connecter
        </button>
      </form>

      {/* Comptes démo pré-remplis */}
      <div className="mt-6 rounded-xl border border-dashed border-border bg-secondary/50 p-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Comptes de démonstration
        </p>
        <div className="space-y-1.5">
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => { setEmail(u.email); setPassword(u.password); setError('') }}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors',
                email === u.email ? 'bg-sopecam-green/10 ring-1 ring-sopecam-green/30 dark:bg-sopecam-green-light/10' : 'hover:bg-secondary',
              )}
            >
              <span className="font-mono font-medium">{u.email}</span>
              <span className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                u.role === 'admin' ? 'bg-[#E02020]/10 text-[#E02020]' : u.plan === 'premium' ? 'bg-gold/15 text-gold' : 'bg-secondary text-muted-foreground',
              )}>
                {u.role === 'admin' ? 'Admin' : u.plan === 'premium' ? 'Premium' : 'Gratuit'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{' '}
        <Link to="/compte/inscription" className="font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
          Inscrivez-vous gratuitement
        </Link>
      </p>
    </AuthShell>
  )
}

// ─── Inscription (F-501) ────────────────────────────────────────
export function InscriptionPage() {
  const { register } = useAppStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => { setPageMeta('Inscription') }, [])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (form.name.trim().length < 2) errs.name = 'Veuillez saisir votre nom complet.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Adresse email invalide.'
    if (form.password.length < 8) errs.password = '8 caractères minimum.'
    if (form.password !== form.confirm) errs.confirm = 'Les mots de passe ne correspondent pas.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    setTimeout(() => {
      register(form.name.trim(), form.email)
      toast.success('Compte créé ! Bienvenue sur SOPECAM Médias.')
      navigate('/')
    }, 700)
  }

  const field = (id: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      <input id={id} type={type} value={form[id]} onChange={set(id)} placeholder={placeholder} className={cn(inputCls, errors[id] && 'border-destructive')} required={id !== 'phone'} />
      {errors[id] && <p className="mt-1 text-xs font-medium text-destructive" role="alert">{errors[id]}</p>}
    </div>
  )

  return (
    <AuthShell title="Créez votre compte" subtitle="3 articles gratuits par jour, newsletters et favoris">
      <SsoButtons />
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> ou par email <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={submit} className="space-y-4" noValidate>
        {field('name', 'Nom complet', 'text', 'Ex : Amina Mbarga')}
        {field('email', 'Adresse email', 'email', 'vous@exemple.cm')}
        {field('phone', 'Téléphone (optionnel)', 'tel', '6XX XXX XXX')}
        {field('password', 'Mot de passe', 'password', '8 caractères minimum')}
        {field('confirm', 'Confirmer le mot de passe', 'password')}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green-dark disabled:opacity-60 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Créer mon compte
        </button>
        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          En vous inscrivant, vous acceptez nos{' '}
          <Link to="/cgv" className="font-semibold underline">CGV</Link> et notre{' '}
          <Link to="/politique-confidentialite" className="font-semibold underline">politique de confidentialité</Link>.
        </p>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        Déjà inscrit ?{' '}
        <Link to="/compte/connexion" className="font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
          Connectez-vous
        </Link>
      </p>
    </AuthShell>
  )
}

// ─── Mot de passe oublié (page 18) ──────────────────────────────
export function MotDePasseOubliePage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [newPwd, setNewPwd] = useState('')

  useEffect(() => { setPageMeta('Mot de passe oublié') }, [])

  return (
    <AuthShell title="Réinitialiser votre mot de passe" subtitle="Recevez un lien de réinitialisation par email">
      {!sent ? (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); toast.success('Email de réinitialisation envoyé.') }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium">Adresse email</label>
            <input id="reset-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.cm" className={inputCls} />
          </div>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
            <Mail className="h-4 w-4" /> Envoyer le lien
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); toast.success('Mot de passe mis à jour. Vous pouvez vous connecter.') }}
          className="animate-fade-up space-y-4"
        >
          <p className="flex items-start gap-2 rounded-lg bg-[#059669]/10 px-3.5 py-3 text-sm text-[#059669]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Un email a été envoyé à <strong>{email}</strong>. Pour la démo, définissez directement votre nouveau mot de passe :
          </p>
          <div>
            <label htmlFor="new-pwd" className="mb-1.5 block text-sm font-medium">Nouveau mot de passe</label>
            <input id="new-pwd" type="password" required minLength={8} value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="8 caractères minimum" className={inputCls} />
          </div>
          <button type="submit" className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-sopecam-green text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
            <KeyRound className="h-4 w-4" /> Mettre à jour
          </button>
        </form>
      )}
      <p className="mt-5 text-center text-sm text-muted-foreground">
        <Link to="/compte/connexion" className="font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
          ← Retour à la connexion
        </Link>
      </p>
    </AuthShell>
  )
}
