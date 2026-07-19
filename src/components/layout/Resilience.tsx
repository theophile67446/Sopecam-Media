import { Component, useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { toast } from 'sonner'
import { CloudOff, Home, RefreshCw, WifiOff } from 'lucide-react'
import { useT, type Messages } from '@/lib/i18n'

// ─── ErrorBoundary global ───────────────────────────────────────
// Jamais d'écran blanc : erreur JS ou échec de chargement d'un
// chunk (fréquent hors-ligne) → écran de reprise conforme charte.
interface EBProps { children: ReactNode; resetKey?: string; t: Messages }
interface EBState { error: Error | null }

export class ErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { error: null }

  static getDerivedStateFromError(error: Error): EBState {
    return { error }
  }

  componentDidUpdate(prev: EBProps) {
    // Changement de route : on retente automatiquement le rendu
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children
    const { t } = this.props
    const offline = !navigator.onLine
    return (
      <div className="mx-auto flex min-h-[55vh] w-full max-w-[1280px] flex-col items-center justify-center px-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sopecam-green/10 text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
          <CloudOff className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold md:text-3xl">
          {offline ? t.errorOfflineTitle : t.errorTitle}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {offline ? t.errorOfflineText : t.errorText}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => this.setState({ error: null })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-sopecam-green px-7 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
          >
            <RefreshCw className="h-4 w-4" />
            {t.retry}
          </button>
          <Link
            to="/"
            onClick={() => this.setState({ error: null })}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary"
          >
            <Home className="h-4 w-4" />
            {t.backHome}
          </Link>
        </div>
      </div>
    )
  }
}

/** ErrorBoundary reliée à la route : toute navigation retente le rendu. */
export function RouteErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const { t } = useT()
  return <ErrorBoundary resetKey={pathname} t={t}>{children}</ErrorBoundary>
}

// ─── Bannière hors-ligne ────────────────────────────────────────
export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine)
  const { t } = useT()

  useEffect(() => {
    const onOffline = () => setOffline(true)
    const onOnline = () => {
      setOffline(false)
      toast.success(t.backOnline)
    }
    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)
    return () => {
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [t])

  if (!offline) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[55] flex items-center justify-center gap-2 bg-[#1A1A1A] px-4 py-2 text-[13px] font-medium text-white dark:bg-[#333333]"
    >
      <WifiOff className="h-4 w-4 text-[#E0E000]" aria-hidden="true" />
      {t.offlineBanner}
    </div>
  )
}
