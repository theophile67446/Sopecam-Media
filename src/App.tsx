import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { SiteLayout } from '@/components/layout/SiteLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'

const ArticlePage = lazy(() => import('@/pages/ArticlePage'))

// ─── Pages secondaires chargées à la demande (connexions lentes) ─
const ActusPage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.ActusPage })))
const PeoplePage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.PeoplePage })))
const EconomiePage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.EconomiePage })))
const SportsPage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.SportsPage })))
const CulturePage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.CulturePage })))
const DebatsPage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.DebatsPage })))
const FactCheckingPage = lazy(() => import('@/pages/universes').then((m) => ({ default: m.FactCheckingPage })))
const RecherchePage = lazy(() => import('@/pages/RecherchePage'))
const ArchivesPage = lazy(() => import('@/pages/ArchivesPage'))
const EpaperPage = lazy(() => import('@/pages/EpaperPage'))
const AbonnementPage = lazy(() => import('@/pages/AbonnementPage'))
const PaiementPage = lazy(() => import('@/pages/PaiementPage'))
const ComptePage = lazy(() => import('@/pages/ComptePage'))
const ConnexionPage = lazy(() => import('@/pages/auth').then((m) => ({ default: m.ConnexionPage })))
const InscriptionPage = lazy(() => import('@/pages/auth').then((m) => ({ default: m.InscriptionPage })))
const MotDePasseOubliePage = lazy(() => import('@/pages/auth').then((m) => ({ default: m.MotDePasseOubliePage })))
const NewsletterPage = lazy(() => import('@/pages/static').then((m) => ({ default: m.NewsletterPage })))
const ContactPage = lazy(() => import('@/pages/static').then((m) => ({ default: m.ContactPage })))
const QuiSommesNousPage = lazy(() => import('@/pages/static').then((m) => ({ default: m.QuiSommesNousPage })))
const MentionsLegalesPage = lazy(() => import('@/pages/legal').then((m) => ({ default: m.MentionsLegalesPage })))
const PolitiqueConfidentialitePage = lazy(() => import('@/pages/legal').then((m) => ({ default: m.PolitiqueConfidentialitePage })))
const CgvPage = lazy(() => import('@/pages/legal').then((m) => ({ default: m.CgvPage })))
const AdminPage = lazy(() => import('@/pages/AdminPage'))

// ─── Squelette de chargement conforme charte (shimmer) ──────────
function RouteFallback() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-10 lg:px-6" role="status" aria-label="Chargement de la page">
      <div className="skeleton-shimmer h-8 w-2/3 max-w-sm rounded-lg bg-secondary" />
      <div className="mt-4 skeleton-shimmer h-4 w-1/2 max-w-xs rounded bg-secondary" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="skeleton-shimmer aspect-video bg-secondary" />
            <div className="space-y-2.5 p-4">
              <div className="skeleton-shimmer h-4 w-full rounded bg-secondary" />
              <div className="skeleton-shimmer h-4 w-3/4 rounded bg-secondary" />
              <div className="skeleton-shimmer h-3 w-1/2 rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Chargement…</span>
    </div>
  )
}

// ─── Portail Principal SOPECAM Médias — MVP ─────────────────────
// 25+ routes, aucune page morte. Parcours principal (accueil,
// article) en chargement immédiat ; le reste à la demande.
export default function App() {
  return (
    <Routes>
      <Route
        element={<SiteLayout />}
      >
        {/* Homepage */}
        <Route path="/" element={<Home />} />

        {/* Article */}
        <Route path="/article/:slug" element={<Lazy><ArticlePage /></Lazy>} />

        {/* Univers éditoriaux */}
        <Route path="/actus" element={<Lazy><ActusPage /></Lazy>} />
        <Route path="/people" element={<Lazy><PeoplePage /></Lazy>} />
        <Route path="/economie" element={<Lazy><EconomiePage /></Lazy>} />
        <Route path="/sports" element={<Lazy><SportsPage /></Lazy>} />
        <Route path="/culture" element={<Lazy><CulturePage /></Lazy>} />
        <Route path="/debats" element={<Lazy><DebatsPage /></Lazy>} />
        <Route path="/fact-checking" element={<Lazy><FactCheckingPage /></Lazy>} />

        {/* Services */}
        <Route path="/recherche" element={<Lazy><RecherchePage /></Lazy>} />
        <Route path="/archives" element={<Lazy><ArchivesPage /></Lazy>} />
        <Route path="/epaper" element={<Lazy><EpaperPage /></Lazy>} />
        <Route path="/abonnement" element={<Lazy><AbonnementPage /></Lazy>} />
        <Route path="/paiement" element={<Lazy><PaiementPage /></Lazy>} />

        {/* Compte */}
        <Route path="/compte" element={<Lazy><ComptePage /></Lazy>} />
        <Route path="/compte/connexion" element={<Lazy><ConnexionPage /></Lazy>} />
        <Route path="/compte/inscription" element={<Lazy><InscriptionPage /></Lazy>} />
        <Route path="/compte/mot-de-passe-oublie" element={<Lazy><MotDePasseOubliePage /></Lazy>} />

        {/* Pages institutionnelles */}
        <Route path="/newsletter" element={<Lazy><NewsletterPage /></Lazy>} />
        <Route path="/contact" element={<Lazy><ContactPage /></Lazy>} />
        <Route path="/qui-sommes-nous" element={<Lazy><QuiSommesNousPage /></Lazy>} />
        <Route path="/mentions-legales" element={<Lazy><MentionsLegalesPage /></Lazy>} />
        <Route path="/politique-confidentialite" element={<Lazy><PolitiqueConfidentialitePage /></Lazy>} />
        <Route path="/cgv" element={<Lazy><CgvPage /></Lazy>} />

        {/* Back-office */}
        <Route path="/admin" element={<Lazy><AdminPage /></Lazy>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}
