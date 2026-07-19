import { useEffect } from 'react'
import { Link } from 'react-router'
import { Home, SearchX } from 'lucide-react'
import { PageContainer } from '@/components/layout/SiteLayout'
import { setPageMeta } from '@/lib/utils2'

// ─── Page 404 ───────────────────────────────────────────────────
export default function NotFound() {
  useEffect(() => { setPageMeta('Page introuvable') }, [])
  return (
    <PageContainer>
      <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
        <p className="font-mono text-[100px] font-bold leading-none text-sopecam-green/15 dark:text-sopecam-green-light/15" aria-hidden="true">
          404
        </p>
        <span className="-mt-10 flex h-14 w-14 items-center justify-center rounded-full bg-sopecam-green/10 text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
          <SearchX className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">Cette page a déménagé… ou n'a jamais existé</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Le lien que vous avez suivi est peut-être rompu. Nos rédactions, elles, continuent de publier : retrouvez toute l'actualité sur l'accueil.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-sopecam-green px-7 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
          >
            <Home className="h-4 w-4" /> Retour à l'accueil
          </Link>
          <Link
            to="/recherche"
            className="inline-flex h-12 items-center rounded-lg border border-border px-6 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-secondary"
          >
            Rechercher un article
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
