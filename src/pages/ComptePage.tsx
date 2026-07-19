import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { toast } from 'sonner'
import {
  Bell, Coins, Crown, Heart, History, LogOut, Moon, Settings, ShieldCheck, Sun, User, Wallet,
} from 'lucide-react'
import { ARTICLES, getArticleBySlug } from '@/lib/data/articles'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { ArticleRow } from '@/components/ArticleCard'
import { Avatar } from '@/components/badges'
import { setPageMeta, timeAgo } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

type Tab = 'profil' | 'historique' | 'favoris' | 'preferences'

// ─── Espace compte utilisateur (F-502 / F-503) ──────────────────
export default function ComptePage() {
  const { user, logout, history, favorites, theme, setTheme, lang, setLang } = useAppStore()
  const [tab, setTab] = useState<Tab>('profil')

  useEffect(() => { setPageMeta('Mon compte') }, [])

  if (!user) return <Navigate to="/compte/connexion" replace />

  const favArticles = favorites.map((s) => ARTICLES.find((a) => a.slug === s)).filter(Boolean)
  const histItems = history.map((h) => ({ ...h, article: getArticleBySlug(h.slug) })).filter((h) => h.article)
  const isPremium = user.plan === 'premium' || user.plan === 'institutionnel' || user.role === 'admin'

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'historique', label: 'Historique', icon: History, count: histItems.length },
    { id: 'favoris', label: 'Favoris', icon: Heart, count: favArticles.length },
    { id: 'preferences', label: 'Préférences', icon: Settings },
  ]

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Mon compte' }]} />

      {/* En-tête profil */}
      <div className="surface-hero texture-dots mb-8 flex flex-col items-start gap-5 rounded-2xl p-6 text-white shadow-xl sm:flex-row sm:items-center md:p-8">
        <Avatar name={user.name} size="lg" className="ring-2 ring-white/30" />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-bold md:text-3xl">{user.name}</h1>
          <p className="text-sm text-sopecam-mint">{user.email}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">
                <Crown className="h-3 w-3" /> Abonné {user.plan}
              </span>
            ) : (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/105 ring-1 ring-white/20">
                Compte gratuit
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-semibold text-white/105 ring-1 ring-white/20">
              <Coins className="h-3 w-3" /> {user.credits} crédits
            </span>
          </div>
        </div>
        {!isPremium && (
          <Link
            to="/abonnement"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 hover:-translate-y-0.5"
          >
            <Crown className="h-4 w-4" /> Passer Premium
          </Link>
        )}
      </div>

      {/* Onglets */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto border-b border-border" role="tablist" aria-label="Sections du compte">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            role="tab"
            aria-selected={tab === t.id}
            className={cn(
              'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors duration-150',
              tab === t.id
                ? 'border-sopecam-green text-sopecam-green dark:border-sopecam-green-light dark:text-sopecam-green-light'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold">{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Profil */}
      {tab === 'profil' && (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display font-bold"><ShieldCheck className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" /> Abonnement</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Offre actuelle : <strong className="text-foreground">{user.plan === 'free' ? 'Gratuit' : user.plan}</strong>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPremium ? 'Renouvellement automatique le 19 août 2026.' : 'Passez à une offre payante pour l\'illimité.'}
            </p>
            <Link to="/abonnement" className="mt-3 inline-block text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
              Gérer mon abonnement →
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display font-bold"><Wallet className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" /> Crédits</h3>
            <p className="mt-2 font-mono text-2xl font-bold">{user.credits}</p>
            <p className="mt-1 text-sm text-muted-foreground">Débloquez des articles Premium à 50 crédits pièce.</p>
            <button onClick={() => toast.info('Recharge de crédits simulée pour la démo')} className="mt-3 text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
              Recharger →
            </button>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-display font-bold"><Bell className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" /> Notifications</h3>
            <p className="mt-2 text-sm text-muted-foreground">Breaking news, newsletters et alertes de vos rubriques favorites.</p>
            <Link to="/newsletter" className="mt-3 inline-block text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
              Gérer mes newsletters →
            </Link>
          </div>
          <div className="md:col-span-3">
            <button
              onClick={() => { logout(); toast.success('Déconnexion réussie. À bientôt !') }}
              className="inline-flex items-center gap-2 rounded-lg border border-[#DC2626]/40 px-5 py-2.5 text-sm font-semibold text-[#DC2626] transition-colors hover:bg-[#DC2626]/5"
            >
              <LogOut className="h-4 w-4" /> Se déconnecter
            </button>
          </div>
        </div>
      )}

      {/* Historique */}
      {tab === 'historique' && (
        <div className="max-w-2xl space-y-3">
          {histItems.length === 0 ? (
            <EmptyState icon={<History className="h-8 w-8" />} text="Votre historique de lecture apparaîtra ici." />
          ) : (
            histItems.map((h) => (
              <div key={h.slug} className="relative">
                <ArticleRow article={h.article!} />
                <span className="absolute -top-1.5 right-3 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  lu {timeAgo(h.at)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Favoris */}
      {tab === 'favoris' && (
        <div className="max-w-2xl space-y-3">
          {favArticles.length === 0 ? (
            <EmptyState icon={<Heart className="h-8 w-8" />} text="Ajoutez des articles à vos favoris en cliquant sur le cœur." />
          ) : (
            favArticles.map((a) => <ArticleRow key={a!.id} article={a!} />)
          )}
        </div>
      )}

      {/* Préférences */}
      {tab === 'preferences' && (
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Apparence
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">Mode {theme === 'dark' ? 'sombre' : 'clair'} actif</p>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              role="switch"
              aria-checked={theme === 'dark'}
              className={cn('relative h-7 w-12 rounded-full transition-colors', theme === 'dark' ? 'bg-sopecam-green-light' : 'bg-border')}
            >
              <span className={cn('absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all', theme === 'dark' ? 'left-[22px]' : 'left-0.5')} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
            <div>
              <p className="font-semibold">Langue de l'interface</p>
              <p className="mt-0.5 text-sm text-muted-foreground">Contenus disponibles en français et en anglais</p>
            </div>
            <div className="flex rounded-lg border border-border p-0.5" role="radiogroup" aria-label="Langue">
              {(['fr', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  role="radio"
                  aria-checked={lang === l}
                  className={cn(
                    'rounded-md px-4 py-1.5 text-sm font-bold uppercase transition-colors',
                    lang === l ? 'bg-sopecam-green text-white dark:bg-sopecam-green-light dark:text-sopecam-green-deep' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="font-semibold">Centres d'intérêt</p>
            <p className="mt-0.5 text-sm text-muted-foreground">Personnalisez votre page d'accueil</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['Politique', 'Économie', 'Football', 'Culture', 'Justice', 'Santé', 'Tech', 'Régions'].map((t, i) => (
                <InterestChip key={t} label={t} defaultOn={i < 3} />
              ))}
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

function InterestChip({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      aria-pressed={on}
      className={cn(
        'rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-150',
        on ? 'border-sopecam-green bg-sopecam-green/10 text-sopecam-green dark:border-sopecam-green-light dark:text-sopecam-green-light' : 'border-border text-muted-foreground hover:bg-secondary',
      )}
    >
      {label}
    </button>
  )
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-14 text-center text-muted-foreground">
      {icon}
      <p className="text-sm">{text}</p>
      <Link to="/" className="text-sm font-semibold text-sopecam-green hover:underline dark:text-sopecam-green-light">
        Découvrir des articles →
      </Link>
    </div>
  )
}
