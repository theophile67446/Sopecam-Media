import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { CalendarDays, Clock, Eye, Headphones, TrendingUp } from 'lucide-react'
import { getArticleBySlug, getRelatedArticles, getLatestArticles, type ArticleBlock } from '@/lib/data/articles'
import { UNIVERSES, PUBLICATIONS } from '@/lib/data/publications'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { CoverImage } from '@/components/CoverImage'
import { PublicationBadge, PremiumBadge, BreakingBadge, Avatar } from '@/components/badges'
import { ShareButtons, FavoriteButton, PaywallBox, CommentSection } from '@/components/article-widgets'
import { AudioPlayer, SectionHeading } from '@/components/widgets'
import { ArticleCard, ArticleRow } from '@/components/ArticleCard'
import { PollWidget } from '@/components/PollWidget'
import { setPageMeta, setJsonLd, fullDate, formatViews, SITE_ORIGIN } from '@/lib/utils2'
import { useAppStore, checkAccess } from '@/store/appStore'
import NotFound from './NotFound'

// ─── Rendu des blocs de corps d'article ─────────────────────────
function BodyBlock({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mb-4 mt-8 font-display text-[22px] font-bold leading-snug text-foreground md:text-2xl">{block.text}</h2>
    case 'quote':
      return (
        <blockquote className="my-7 rounded-r-xl border-l-4 border-sopecam-green bg-secondary/60 px-6 py-5 dark:border-sopecam-green-light">
          <p className="font-display text-lg italic leading-relaxed text-foreground/90">« {block.text} »</p>
          {block.author && <cite className="mt-2 block text-sm font-semibold not-italic text-sopecam-green dark:text-sopecam-green-light">— {block.author}</cite>}
        </blockquote>
      )
    case 'callout':
      return (
        <div className="my-7 rounded-xl border border-gold/40 bg-gold/10 px-6 py-5 dark:bg-gold/10">
          <p className="text-sm font-semibold uppercase tracking-wide text-gold">Le chiffre clé</p>
          <p className="mt-1.5 text-base font-medium leading-relaxed text-foreground">{block.text}</p>
        </div>
      )
    default:
      return <p className="mb-5 text-[17px] leading-[1.75] text-foreground/90 md:text-lg">{block.text}</p>
  }
}

// ─── Page article (ART-01 / ART-02) ─────────────────────────────
export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug ?? '')
  const { user, consumeFreeArticle, pushHistory, freeLeft, freeDate } = useAppStore()
  // Lecteur audio actif pour un slug donné : se réinitialise naturellement au changement d'article
  const [audioSlug, setAudioSlug] = useState<string | null>(null)
  const audioOn = audioSlug === article?.slug

  // Le composant est abonné au store (user, freeLeft…) : recalculé à chaque notification
  const access = article ? checkAccess(article.access, article.id) : null

  useEffect(() => {
    if (!article) return
    setPageMeta(article.title, article.excerpt)
    // Données structurées Schema.org (SPA : injectées côté client)
    const u = UNIVERSES[article.universe]
    setJsonLd('article', {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      inLanguage: 'fr',
      author: { '@type': 'Person', name: article.author },
      publisher: {
        '@type': 'Organization',
        name: 'SOPECAM Médias',
        logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/assets/logos/sopecam.png` },
      },
      ...(article.image ? { image: [SITE_ORIGIN + article.image] } : {}),
      mainEntityOfPage: `${SITE_ORIGIN}/article/${article.slug}`,
    })
    setJsonLd('breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_ORIGIN + '/' },
        { '@type': 'ListItem', position: 2, name: u.label, item: SITE_ORIGIN + u.path },
        { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_ORIGIN}/article/${article.slug}` },
      ],
    })
    pushHistory(article.slug)
    // Consommation du quota RB-01 (articles gratuits uniquement)
    if (article.access === 'free') {
      const s = useAppStore.getState()
      const plan = s.user?.plan
      const bypass = plan === 'premium' || plan === 'institutionnel' || plan === 'standard' || plan === 'famille' || s.user?.role === 'admin'
      if (!bypass && checkAccess(article.access, article.id).allowed) {
        consumeFreeArticle(article.id)
      }
    }
    // Aucun JSON-LD résiduel en quittant l'article
    return () => {
      setJsonLd('article', null)
      setJsonLd('breadcrumb', null)
    }
  }, [article, consumeFreeArticle, pushHistory])

  if (!article) return <NotFound />

  const universe = UNIVERSES[article.universe]
  const pub = PUBLICATIONS[article.publication]
  const related = getRelatedArticles(article, 4)
  const trending = getLatestArticles(6).filter((a) => a.id !== article.id).slice(0, 4)
  const allowed = access?.allowed ?? false
  // Résumé gratuit de ~300 mots : chapô + 2 premiers blocs
  const previewBlocks = article.body.filter((b) => b.type === 'p').slice(0, 2)
  const today = new Date().toISOString().slice(0, 10)
  const quota = freeDate === today ? freeLeft : 3

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: universe.label, to: universe.path },
          { label: article.subcategory, to: `${universe.path}?cat=${encodeURIComponent(article.subcategory)}` },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ─── Colonne principale ─────────────────────────── */}
        <article className="lg:col-span-2" itemScope itemType="https://schema.org/NewsArticle">
          {/* En-tête */}
          <header>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <PublicationBadge code={article.publication} />
              {article.breaking && <BreakingBadge />}
              {article.access === 'premium' && <PremiumBadge />}
              <Link
                to={`${universe.path}?cat=${encodeURIComponent(article.subcategory)}`}
                className="overline-label rounded-full bg-secondary px-3 py-1 transition-colors hover:bg-border"
                style={{ color: universe.color === '#004000' ? '#008000' : universe.color }}
              >
                {article.subcategory}
              </Link>
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-balance md:text-4xl" itemProp="headline">
              {article.title}
            </h1>
            <p className="mt-4 font-display text-lg italic leading-relaxed text-muted-foreground md:text-xl" itemProp="description">
              {article.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2.5">
                <Avatar name={article.author} size="sm" />
                <span>
                  <span className="block font-semibold text-foreground" itemProp="author">{article.author}</span>
                  <span className="block text-xs">{article.authorRole} — {pub.name}</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-4 w-4" />{fullDate(article.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.readMinutes} min de lecture</span>
              <span className="inline-flex items-center gap-1.5"><Eye className="h-4 w-4" />{formatViews(article.views)} vues</span>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <ShareButtons title={article.title} />
              <FavoriteButton slug={article.slug} />
            </div>
          </header>

          {/* Visuel héro */}
          <figure className="mt-6">
            <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
              <CoverImage publication={article.publication} seed={article.seed} universe={article.universe} src={article.image} alt={article.title} eager className="absolute inset-0" />
            </div>
            <figcaption className="mt-2 text-xs text-muted-foreground">
              Illustration · {pub.name} — © SOPECAM Médias
            </figcaption>
          </figure>

          {/* Lecteur audio TTS (RG-ART-02) */}
          <div className="mt-6">
            {audioOn ? (
              <AudioPlayer durationSec={article.readMinutes * 48} />
            ) : (
              <button
                onClick={() => setAudioSlug(article.slug)}
                className="flex w-full items-center gap-3 rounded-xl border border-sopecam-green/30 bg-sopecam-green/5 px-4 py-3.5 text-left transition-all duration-150 hover:bg-sopecam-green/10 dark:border-sopecam-green-light/30 dark:bg-sopecam-green-light/5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sopecam-green text-white dark:bg-sopecam-green-light dark:text-sopecam-green-deep">
                  <Headphones className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Écouter cet article</span>
                  <span className="block text-xs text-muted-foreground">Synthèse vocale FR/EN · environ {article.readMinutes} minutes</span>
                </span>
              </button>
            )}
          </div>

          {/* Corps de l'article */}
          <div className="mx-auto mt-8 max-w-[680px]" itemProp="articleBody">
            {allowed ? (
              <>
                {article.body.map((b, i) => <BodyBlock key={i} block={b} />)}
                {/* Tags */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {article.tags.map((t) => (
                    <Link
                      key={t}
                      to={`/recherche?q=${encodeURIComponent(t)}`}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <>
                {previewBlocks.map((b, i) => <BodyBlock key={i} block={b} />)}
                {/* Voile de floutage avant paywall */}
                <div className="relative" aria-hidden="true">
                  <p className="mb-5 select-none text-[17px] leading-[1.75] text-foreground/90 blur-[6px] md:text-lg">
                    La suite de cet article est réservée à nos abonnés. Ce paragraphe simulé représente le contenu intégral de l'enquête, avec ses analyses, ses témoignages exclusifs et ses données chiffrées collectées par nos journalistes sur le terrain.
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 to-transparent" />
                </div>
                <PaywallBox article={article} reason={access?.allowed === false ? access.reason : 'premium'} />
              </>
            )}
          </div>

          {/* Quota restant (visiteurs/comptes gratuits) */}
          {allowed && article.access === 'free' && (!user || user.plan === 'free') && (
            <p className="mx-auto mt-8 max-w-[680px] rounded-lg bg-[#E0E000]/10 px-4 py-3 text-center text-sm font-medium text-[#8a8a00] ring-1 ring-[#E0E000]/30 dark:text-[#E0E000]">
              Il vous reste {quota} article{quota > 1 ? 's' : ''} gratuit{quota > 1 ? 's' : ''} aujourd'hui.{' '}
              <Link to="/abonnement" className="font-bold underline">Passez à l'illimité</Link>
            </p>
          )}

          {/* Partage bas + commentaires */}
          <div className="mx-auto mt-10 max-w-[680px]">
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-semibold">Cet article vous a été utile ? Partagez-le.</p>
              <ShareButtons title={article.title} compact />
            </div>
            {allowed && <CommentSection article={article} />}
          </div>
        </article>

        {/* ─── Sidebar ────────────────────────────────────── */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:nice-scroll" aria-label="Contenus associés">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
              <TrendingUp className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" />
              En tendance
            </h3>
            <div className="space-y-3">
              {trending.map((a) => <ArticleRow key={a.id} article={a} />)}
            </div>
          </div>
          <PollWidget compact />
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <div className="surface-hero texture-dots p-5">
              <p className="overline-label text-gold">La newsletter du matin</p>
              <p className="mt-2 font-display text-lg font-bold leading-snug text-white">
                L'essentiel de l'actualité, chaque jour à 6h30
              </p>
              <Link
                to="/newsletter"
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-gold px-5 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-md transition-all duration-150 hover:-translate-y-0.5"
              >
                Je m'abonne
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* ─── À lire aussi ─────────────────────────────────── */}
      <section className="mt-14" aria-label="À lire aussi">
        <SectionHeading title="À lire aussi" color={pub.color} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>
    </PageContainer>
  )
}

