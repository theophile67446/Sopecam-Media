import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import {
  Archive, Bell, ChevronDown, Crown, Ellipsis, Home, LayoutDashboard, LogOut, Moon, Search, Sun, User, Zap,
} from 'lucide-react'
import { UNIVERSE_ICONS } from '@/lib/universe-icons'
import { CoverImage } from '@/components/CoverImage'
import { UNIVERSE_LIST, PUBLICATION_LIST } from '@/lib/data/publications'
import { getBreakingArticles, getLatestArticles } from '@/lib/data/articles'
import { useAppStore } from '@/store/appStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/badges'
import { timeAgo } from '@/lib/utils2'

// ─── Logo SOPECAM officiel ──────────────────────────────────────
export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="SOPECAM Médias — Accueil">
      <span className={cn(
        'flex h-9 w-auto min-w-[36px] max-w-[52px] items-center justify-center overflow-hidden rounded-lg bg-white px-1.5 py-1',
        dark ? 'shadow-sm ring-1 ring-border' : 'shadow-md ring-1 ring-white/20',
      )}>
        <img src="/assets/logos/sopecam.png" alt="Logo SOPECAM" className="h-full w-auto object-contain" />
      </span>
      <span className="leading-tight">
        <span className={cn('block font-display text-lg font-bold tracking-tight', dark ? 'text-sopecam-green-dark dark:text-foreground' : 'text-white')}>
          SOPECAM
        </span>
        <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.22em]', dark ? 'text-sopecam-green' : 'text-sopecam-green-light')}>
          Médias
        </span>
      </span>
    </Link>
  )
}

// ─── Mega menu ──────────────────────────────────────────────────
function MegaMenu({ universeKey }: { universeKey: string }) {
  const { t, universeLabel } = useT()
  const u = UNIVERSE_LIST.find((x) => x.key === universeKey)!
  const trending = getLatestArticles(20).filter((a) => a.universe === universeKey).slice(0, 3)
  const pubs = PUBLICATION_LIST.filter((p) => trending.some((a) => a.publication === p.code)).slice(0, 2)
  const accent = u.color === '#004000' ? '#008000' : u.color
  return (
    <div className="absolute left-1/2 top-full z-50 w-[560px] -translate-x-1/2 pt-2">
      <div className="animate-fade-up overflow-hidden rounded-xl bg-card shadow-[0_20px_50px_rgba(0,32,0,0.14)] ring-1 ring-border" style={{ animationDuration: '250ms' }}>
        {/* Liseré à la couleur de l'univers : identité de rubrique préservée */}
        <div className="h-[3px]" style={{ backgroundColor: accent }} aria-hidden="true" />
        {/* Logos des publications liées */}
        {pubs.length > 0 && (
          <div className="flex items-center gap-5 border-b border-border bg-secondary/50 px-5 py-3">
            {pubs.map((p) => (
              <span key={p.code} className="flex h-8 items-center rounded-md bg-white px-3 py-1 ring-1 ring-border">
                <img src={p.logo} alt={p.name} className="max-h-6 w-auto object-contain" />
              </span>
            ))}
          </div>
        )}
        <div className="grid grid-cols-5">
          <div className="col-span-2 border-r border-border p-5">
            <p className="overline-label mb-3 text-sopecam-green dark:text-sopecam-green-light">
              {universeLabel(u.key)}
            </p>
            <ul className="space-y-1">
              {u.subcategories.map((s) => (
                <li key={s}>
                  <Link
                    to={`${u.path}?cat=${encodeURIComponent(s)}`}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-foreground/75 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-3 p-5">
            <p className="overline-label mb-3 text-muted-foreground">{t.topStories}</p>
            <ul className="space-y-3">
              {trending.map((a) => (
                <li key={a.id}>
                  <Link to={`/article/${a.slug}`} className="group flex items-start gap-3">
                    {/* Vignette : photo réelle, fallback génératif */}
                    <span className="relative h-12 w-[72px] shrink-0 overflow-hidden rounded-md ring-1 ring-border">
                      <CoverImage
                        publication={a.publication}
                        seed={a.seed}
                        universe={a.universe}
                        src={a.image}
                        className="absolute inset-0"
                        zoomClass="transition-transform duration-250 group-hover:scale-[1.05]"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-medium leading-snug text-foreground/85 transition-colors group-hover:text-sopecam-green dark:group-hover:text-sopecam-green-light">
                        {a.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{timeAgo(a.publishedAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={u.path}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-sopecam-green hover:underline dark:text-sopecam-green-light"
            >
              {t.explore} {universeLabel(u.key)} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Bandeau breaking news (charte §6.3) ────────────────────────
function BreakingTicker() {
  const breaking = getBreakingArticles()
  if (breaking.length === 0) return null
  const items = [...breaking, ...breaking]
  return (
    <div className="animate-slide-from-top relative z-40 flex h-8 items-center border-b border-[#E00020]/15 bg-[#FFF6F6] text-[#9d1220] dark:border-[#E00020]/25 dark:bg-[#230a0e] dark:text-red-200/90">
      <span className="z-10 flex h-full shrink-0 items-center gap-1.5 bg-[#E00020] px-3 text-[11px] font-bold uppercase tracking-wider text-white">
        <Zap className="h-3.5 w-3.5 animate-pulse-live" fill="currentColor" />
        Flash
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-ticker flex w-max items-center whitespace-nowrap">
          {items.map((a, i) => (
            <Link
              key={`${a.id}-${i}`}
              to={`/article/${a.slug}`}
              className="mx-8 inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-70"
            >
              <span className="text-[#E00020]/45">●</span>
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Header principal (charte §4.3) ─────────────────────────────
export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [userMenu, setUserMenu] = useState(false)
  const menuTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { user, logout, theme, setTheme, lang, setLang, freeLeft, freeDate } = useAppStore()
  const { t, universeLabel } = useT()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  // « Plus » regroupe Débats & Fact-Check : il doit s'allumer sur ces routes
  const plusActive = pathname.startsWith('/debats') || pathname.startsWith('/fact-checking')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hover-intent : quand un panneau est déjà ouvert, traverser les
  // items voisins (trajet vers le panneau centré) ne doit pas voler
  // l'ouverture — on ne change de menu que si la souris s'installe.
  const switchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const enter = (key: string) => {
    if (menuTimeout.current) clearTimeout(menuTimeout.current)
    if (switchTimeout.current) clearTimeout(switchTimeout.current)
    if (openMenu === null || openMenu === key) {
      setOpenMenu(key)
    } else {
      switchTimeout.current = setTimeout(() => setOpenMenu(key), 140)
    }
  }
  const leave = () => {
    if (switchTimeout.current) clearTimeout(switchTimeout.current)
    menuTimeout.current = setTimeout(() => setOpenMenu(null), 180)
  }
  // Clavier : Échap ferme le mega menu ; le blur sortant du <li> le ferme aussi
  const onNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpenMenu(null)
  }
  const onItemBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) leave()
  }

  const isSubscriber = user && (user.plan !== 'free' || user.role === 'admin')
  const today = new Date().toISOString().slice(0, 10)
  const quota = freeDate === today ? freeLeft : 3

  return (
    <>
      <header
        className={cn(
          // Fond opaque volontaire : backdrop-filter créerait un containing
          // block qui piégerait le drawer mobile (position: fixed) dans le header
          'sticky top-0 z-50 border-b border-border bg-background transition-shadow duration-300',
          scrolled ? 'shadow-[0_8px_28px_rgba(0,32,0,0.10)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.45)]' : '',
        )}
      >
        {/* Filet signature SOPECAM : le vert reste le fil conducteur */}
        <div className="h-[3px] bg-gradient-to-r from-sopecam-green-deep via-sopecam-green to-gold" aria-hidden="true" />

        {/* ── Niveau 1 : identité & actions (aéré, surface claire).
            Au scroll (desktop), il se replie : seule la bande de
            rubriques reste — gain d'espace de lecture. ── */}
        <div className={cn(
          'mx-auto flex max-w-[1280px] items-center gap-3 px-4 transition-all duration-300 lg:px-6',
          scrolled ? 'h-14 lg:invisible lg:h-0 lg:opacity-0' : 'h-16',
        )}>
          {/* Menu mobile */}
          <MobileMenuButton />
          <Logo dark />

          <div className="ml-auto flex items-center gap-1">
            {/* Quota articles gratuits */}
            {!isSubscriber && (
              <span className="mr-1 hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E0E000]/15 px-3 py-1.5 text-xs font-semibold text-[#7a7a00] ring-1 ring-[#E0E000]/40 dark:text-[#E0E000] xl:inline-flex" title={t.freeArticlesTitle}>
                <Bell className="h-3.5 w-3.5" />
                {t.freeArticles(quota)}
              </span>
            )}
            <Link
              to="/recherche"
              aria-label={t.search}
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="rounded-lg px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
              aria-label={t.switchLang}
              title={t.switchLang}
            >
              {lang === 'fr' ? 'FR' : 'EN'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? t.lightMode : t.darkMode}
              className="rounded-lg p-2 text-foreground/60 transition-colors duration-150 hover:bg-secondary hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* CTA Abonnement gold — masqué si déjà abonné payant */}
            {(!user || user.plan === 'free') && (
              <Link
                to="/abonnement"
                className="ml-2 hidden items-center gap-1.5 rounded-lg bg-gold px-3.5 py-2 text-[13px] font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md md:inline-flex"
              >
                <Crown className="h-4 w-4" />
                {t.subscribe}
              </Link>
            )}

            {user ? (
              <div className="relative" onKeyDown={(e) => { if (e.key === 'Escape') setUserMenu(false) }}>
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 rounded-full p-1 pl-1.5 pr-2 transition-colors duration-150 hover:bg-secondary"
                  aria-haspopup="menu"
                  aria-expanded={userMenu}
                >
                  <Avatar name={user.name} size="sm" />
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {userMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenu(false)} aria-hidden="true" />
                    <div className="animate-modal-in absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border">
                      <div className="border-b border-border bg-secondary/60 p-4">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {user.plan === 'premium' || user.plan === 'institutionnel' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A1A1A]">
                              <Crown className="h-2.5 w-2.5" /> {user.plan}
                            </span>
                          ) : (
                            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground ring-1 ring-border">
                              {user.plan === 'free' ? 'Gratuit' : user.plan}
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-muted-foreground">{user.credits} {t.credits}</span>
                        </div>
                      </div>
                      <ul className="p-1.5 text-sm">
                        <li>
                          <Link to="/compte" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-secondary">
                            <User className="h-4 w-4 text-muted-foreground" /> {t.myAccount}
                          </Link>
                        </li>
                        {user.role === 'admin' && (
                          <li>
                            <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-secondary">
                              <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> {t.backOffice}
                            </Link>
                          </li>
                        )}
                        <li>
                          <button
                            onClick={() => { logout(); setUserMenu(false); navigate('/'); }}
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[#C02020] transition-colors hover:bg-secondary dark:text-red-400"
                          >
                            <LogOut className="h-4 w-4" /> {t.logout}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/compte/connexion"
                className="ml-1 hidden items-center gap-2 rounded-lg border border-sopecam-green/35 px-4 py-2 text-sm font-semibold text-sopecam-green transition-all duration-150 hover:bg-sopecam-green hover:text-white dark:border-sopecam-green-light/40 dark:text-sopecam-green-light dark:hover:bg-sopecam-green-light dark:hover:text-sopecam-green-deep md:inline-flex"
              >
                <User className="h-4 w-4" />
                {t.login}
              </Link>
            )}
          </div>
        </div>

        {/* ── Niveau 2 : rubriques éditoriales — bande verte SOPECAM,
            actifs soulignés à la couleur de chaque univers ── */}
        {/* relative : les panneaux (mega menu, « Plus ») se centrent sous la barre
            entière et ne peuvent donc jamais déborder du viewport */}
        <nav className="relative hidden bg-sopecam-green-dark lg:block" aria-label="Navigation principale" onKeyDown={onNavKeyDown}>
          {/* Matière de la bande : trame de points, relief latéral,
              volume vertical (haut éclairci), filet or */}
          <div className="texture-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sopecam-green-deep/90 via-transparent to-sopecam-green-deep/90" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.07] via-transparent to-black/20" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" aria-hidden="true" />
          <ul className="relative mx-auto flex h-12 max-w-[1280px] items-stretch justify-center divide-x divide-white/[0.08] px-4 lg:px-6">
            {/* Accueil */}
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  cn(
                    'flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white',
                    isActive && 'border-gold bg-white/5 font-semibold text-white',
                  )
                }
              >
                <Home className="h-4 w-4 text-white/55" strokeWidth={1.8} aria-hidden="true" />
                Accueil
              </NavLink>
            </li>
            {/* Univers principaux (5 piliers) — Débats & Fact-Check sous « Plus » */}
            {UNIVERSE_LIST.filter((u) => u.key !== 'debats' && u.key !== 'fact-checking').map((u) => {
              // Variante lumineuse sur bande verte sombre
              const accent = u.color === '#004000' || u.color === '#006020' ? '#80E0A0' : u.color
              const Icon = UNIVERSE_ICONS[u.key]
              return (
                <li key={u.key} onMouseEnter={() => enter(u.key)} onMouseLeave={leave} onBlur={onItemBlur}>
                  <NavLink
                    to={u.path}
                    onFocus={() => enter(u.key)}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === u.key}
                    className={({ isActive }) =>
                      cn(
                        'flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white',
                        isActive && 'bg-white/5 font-semibold text-white',
                      )
                    }
                    style={({ isActive }) => (isActive ? { borderBottomColor: accent } : undefined)}
                  >
                    <Icon className="h-4 w-4 text-white/55" strokeWidth={1.8} aria-hidden="true" />
                    {universeLabel(u.key)}
                    <ChevronDown className="h-3 w-3 text-white/50" />
                  </NavLink>
                  {openMenu === u.key && (
                    <div onMouseEnter={() => enter(u.key)} onMouseLeave={leave}>
                      <MegaMenu universeKey={u.key} />
                    </div>
                  )}
                </li>
              )
            })}
            {/* « Plus » — Débats & Fact-Check. Panneau compact ancré
                sous le bouton lui-même (pas centré sous la barre). */}
            <li className="relative" onMouseEnter={() => enter('plus')} onMouseLeave={leave} onBlur={onItemBlur}>
              <button
                onFocus={() => enter('plus')}
                aria-haspopup="menu"
                aria-expanded={openMenu === 'plus'}
                className={cn(
                  'flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white',
                  plusActive && 'border-gold bg-white/5 font-semibold text-white',
                )}
              >
                <Ellipsis className="h-4 w-4 text-white/55" strokeWidth={1.8} aria-hidden="true" />
                Plus
                <ChevronDown className="h-3 w-3 text-white/50" />
              </button>
              {openMenu === 'plus' && (
                <div onMouseEnter={() => enter('plus')} onMouseLeave={leave}>
                  <div className="absolute right-0 top-full z-50 w-[300px] pt-2">
                    <div className="animate-fade-up overflow-hidden rounded-xl bg-card shadow-[0_20px_50px_rgba(0,32,0,0.14)] ring-1 ring-border" style={{ animationDuration: '250ms' }}>
                      {/* Liseré bicolore : vert Débats → bleu Fact-Check */}
                      <div className="h-[3px] bg-gradient-to-r from-sopecam-green to-[#0040A0]" aria-hidden="true" />
                      <div className="p-2">
                        {(['debats', 'fact-checking'] as const).map((key) => {
                          const du = UNIVERSE_LIST.find((x) => x.key === key)!
                          const DuIcon = UNIVERSE_ICONS[key]
                          const duAccent = du.color === '#004000' ? '#008000' : du.color
                          return (
                            <NavLink
                              key={key}
                              to={du.path}
                              className={({ isActive }) =>
                                cn(
                                  'flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm font-medium text-foreground/85 transition-colors hover:bg-secondary hover:text-foreground',
                                  isActive && 'bg-secondary text-foreground',
                                )
                              }
                            >
                              <span
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                                style={{ backgroundColor: `${duAccent}1a`, color: duAccent }}
                              >
                                <DuIcon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                              </span>
                              <span>
                                <span className="block font-semibold">{universeLabel(key)}</span>
                                <span className="block text-xs text-muted-foreground">{du.description}</span>
                              </span>
                            </NavLink>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <NavLink
                to="/archives"
                className={({ isActive }) =>
                  cn(
                    'flex h-full items-center gap-2 border-b-2 border-transparent px-4 text-[15px] font-medium text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white',
                    isActive && 'border-gold bg-white/5 font-semibold text-white',
                  )
                }
              >
                <Archive className="h-4 w-4 text-white/55" strokeWidth={1.8} aria-hidden="true" />
                {t.archives}
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <BreakingTicker />
    </>
  )
}

// ─── Bouton menu mobile (import tardif pour éviter les cycles) ──
import { MobileMenuButton } from './MobileNav'
