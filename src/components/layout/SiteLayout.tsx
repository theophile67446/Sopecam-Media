import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import { Toaster } from 'sonner'
import { ChevronRight, ChevronUp, Home, LayoutDashboard } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'
import { MobileBottomNav } from './MobileNav'
import { OfflineBanner, RouteErrorBoundary } from './Resilience'
import { useT } from '@/lib/i18n'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'

// ─── Fil d'Ariane (§2 Design System) ────────────────────────────
export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-sopecam-green dark:hover:text-sopecam-green-light">
            <Home className="h-3.5 w-3.5" />
            Accueil
          </Link>
        </li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-border" aria-hidden="true" />
            {it.to ? (
              <Link to={it.to} className="transition-colors hover:text-sopecam-green dark:hover:text-sopecam-green-light">
                {it.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// ─── Bouton Retour en haut ─────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scroll}
      aria-label="Retour en haut de page"
      className={cn(
        'fixed bottom-20 right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-sopecam-green text-white shadow-xl ring-2 ring-white/20 transition-all duration-250 hover:-translate-y-1 hover:shadow-2xl lg:bottom-6 lg:right-6',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sopecam-green-light',
        visible ? 'scale-100 opacity-100' : 'pointer-events-none scale-75 opacity-0',
      )}
      title="Retour en haut"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  )
}

// ─── Bouton admin flottant (§2 Design System) ───────────────────
function AdminFab() {
  const { user } = useAppStore()
  const { pathname } = useLocation()
  if (user?.role !== 'admin' || pathname === '/admin') return null
  return (
    <Link
      to="/admin"
      aria-label="Accéder au back-office"
      className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-sopecam-green-dark text-white shadow-xl ring-2 ring-gold/60 transition-all duration-150 hover:-translate-y-1 hover:shadow-2xl lg:bottom-6 lg:right-6"
      title="Back-office"
    >
      <LayoutDashboard className="h-5 w-5" />
    </Link>
  )
}

// ─── Layout global ──────────────────────────────────────────────
export function SiteLayout() {
  const { theme, lang } = useAppStore()
  const { t } = useT()
  const { pathname } = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Lecteurs d'écran & SEO : la langue du document suit la langue choisie
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Lien d'évitement WCAG : visible uniquement au focus clavier */}
      <a
        href="#contenu"
        className="sr-only z-[100] rounded-lg bg-sopecam-green px-4 py-2.5 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {t.skipToContent}
      </a>
      <Header />
      <OfflineBanner />
      <main id="contenu" className="flex-1 pb-20 lg:pb-0">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <Footer />
      <MobileBottomNav />
      <ScrollToTop />
      <AdminFab />
      <Toaster position="top-right" richColors closeButton toastOptions={{ duration: 5000 }} />
    </div>
  )
}

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-[1280px] px-4 py-8 lg:px-6 lg:py-10', className)}>
      {children}
    </div>
  )
}
