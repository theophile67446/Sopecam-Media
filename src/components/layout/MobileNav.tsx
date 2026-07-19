import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router'
import { Home, Menu, Newspaper, Search, User, X, Archive, Crown } from 'lucide-react'
import { UNIVERSE_ICONS } from '@/lib/universe-icons'
import { UNIVERSE_LIST, PUBLICATION_LIST } from '@/lib/data/publications'
import { useAppStore } from '@/store/appStore'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// ─── Menu mobile (drawer) ───────────────────────────────────────
export function MobileMenuButton() {
  const [open, setOpen] = useState(false)
  const { user } = useAppStore()
  const { t, universeLabel } = useT()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t.openMenu}
        className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>
      {/* Portail vers <body> : échappe au contexte d'empilement du header
          sticky — le voile couvre bien la navigation basse (z-50) */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t.menu}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="animate-slide-from-left absolute inset-y-0 left-0 flex w-[300px] flex-col bg-sopecam-green-deep shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <span className="font-display text-lg font-bold text-white">{t.menu}</span>
              {/* autoFocus : amène le clavier dans le drawer à l'ouverture */}
              <button autoFocus onClick={() => setOpen(false)} aria-label={t.closeMenu} className="rounded-md p-2 text-white hover:bg-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="nice-scroll flex-1 overflow-y-auto p-3" aria-label="Navigation mobile">
              <ul className="space-y-0.5">
                {UNIVERSE_LIST.filter((u) => u.key !== 'debats' && u.key !== 'fact-checking').map((u) => {
                  const Icon = UNIVERSE_ICONS[u.key]
                  return (
                    <li key={u.key}>
                      <NavLink
                        to={u.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white',
                            isActive && 'bg-white/10 text-white ring-1 ring-white/15',
                          )
                        }
                      >
                        <Icon className="h-4 w-4 text-white/60" strokeWidth={1.8} aria-hidden="true" />
                        {universeLabel(u.key)}
                      </NavLink>
                    </li>
                  )
                })}
                {/* « Plus » — Débats & Fact-Check */}
                <li>
                  <details className="group">
                    <summary className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/10">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sopecam-green-light/20 text-xs font-bold text-sopecam-green-light">+</span>
                      Plus
                    </summary>
                    {(['debats', 'fact-checking'] as const).map((key) => {
                      const du = UNIVERSE_LIST.find((x) => x.key === key)!
                      const Icon = UNIVERSE_ICONS[key]
                      return (
                        <NavLink
                          key={key}
                          to={du.path}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            cn(
                              'ml-3 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white',
                              isActive && 'bg-white/10 text-white',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 text-white/60" strokeWidth={1.8} aria-hidden="true" />
                          {universeLabel(key)}
                        </NavLink>
                      )
                    })}
                  </details>
                </li>
              </ul>
              <div className="my-3 border-t border-white/10" />
              <ul className="space-y-0.5">
                <li>
                  <NavLink to="/archives" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">
                    <Archive className="h-4 w-4" /> {t.footerArchives}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/epaper" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">
                    <Newspaper className="h-4 w-4" /> {t.epaper}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/abonnement" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gold hover:bg-white/10">
                    <Crown className="h-4 w-4" /> {t.subscribe}
                  </NavLink>
                </li>
                {!user && (
                  <li>
                    <NavLink to="/compte/connexion" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/90 hover:bg-white/10">
                      <User className="h-4 w-4" /> {t.login}
                    </NavLink>
                  </li>
                )}
              </ul>
              <div className="my-3 border-t border-white/10" />
              <p className="overline-label px-4 pb-2 text-white/40">{t.ourPublications}</p>
              <ul className="space-y-1 px-2">
                {PUBLICATION_LIST.map((p) => {
                  const pubPath = p.code === 'CBT' ? '/economie' : p.code === 'NY' ? '/culture' : p.code === 'WSL' ? '/sports' : '/actus'
                  return (
                    <li key={p.code}>
                      <NavLink
                        to={pubPath}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: p.color }} />
                        {p.name}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t border-white/10 p-4 text-center text-[11px] text-white/40">
              SOPECAM Médias © 2027 — 50 ans d'information
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

// ─── Barre de navigation inférieure mobile ──────────────────────
export function MobileBottomNav() {
  const { pathname } = useLocation()
  const { t } = useT()
  const items = [
    { to: '/', label: t.navHome, icon: Home },
    { to: '/actus', label: t.navNews, icon: Newspaper },
    { to: '/recherche', label: t.navSearch, icon: Search },
    { to: '/abonnement', label: t.subscribe, icon: Crown },
    { to: '/compte', label: t.navAccount, icon: User },
  ]
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-sopecam-green-dark/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Navigation rapide"
    >
      <ul className="mx-auto flex max-w-md items-center justify-around">
        {items.map((it) => {
          const active = pathname === it.to || (it.to !== '/' && pathname.startsWith(it.to))
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2.5 text-[10px] font-medium transition-colors duration-150',
                  active ? 'text-sopecam-green-light' : 'text-white/60 hover:text-white',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <it.icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                {it.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
