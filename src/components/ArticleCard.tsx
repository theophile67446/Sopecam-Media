import { Link } from 'react-router'
import type { Article } from '@/lib/data/articles'
import { CoverImage } from './CoverImage'
import { PublicationBadge, PremiumBadge, BreakingBadge } from './badges'
import { timeAgo, formatViews } from '@/lib/utils2'
import { Clock, Eye, Share2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Carte article (charte §4.2) ────────────────────────────────
export function ArticleCard({ article, compact = false, onDark = false }: { article: Article; compact?: boolean; onDark?: boolean }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className={cn(
        'card-article group block focus-visible:outline-2',
        onDark && 'bg-white/8 border-white/15 dark:bg-white/5',
      )}
      aria-label={article.title}
    >
      <div className="relative aspect-video overflow-hidden">
        <CoverImage
          publication={article.publication}
          seed={article.seed}
          universe={article.universe}
          src={article.image}
          className="absolute inset-0"
          zoomClass="cover-zoom"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <PublicationBadge code={article.publication} />
          {article.breaking && <BreakingBadge />}
        </div>
        {article.access === 'premium' && (
          <div className="absolute right-3 top-3">
            <PremiumBadge />
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="overline-label mb-2" style={{ color: 'var(--pub-' + article.publication.toLowerCase() + ')' }}>
          {article.subcategory}
        </p>
        <h3 className={`font-display font-bold leading-snug text-foreground group-hover:text-sopecam-green dark:group-hover:text-sopecam-green-light transition-colors duration-150 ${compact ? 'text-base' : 'text-lg'}`}>
          {article.title}
        </h3>
        {!compact && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground/80">{article.author}</span>
          <span aria-hidden="true">•</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{article.readMinutes} min</span>
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{formatViews(article.views)}</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

// ─── Carte horizontale (listes) ─────────────────────────────────
export function ArticleRow({ article }: { article: Article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-3 transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
        <CoverImage publication={article.publication} seed={article.seed} universe={article.universe} src={article.image} className="absolute inset-0" zoomClass="cover-zoom transition-transform duration-250 group-hover:scale-[1.03]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <PublicationBadge code={article.publication} />
          {article.access === 'premium' && <PremiumBadge />}
        </div>
        <h4 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-sopecam-green dark:group-hover:text-sopecam-green-light transition-colors">
          {article.title}
        </h4>
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{timeAgo(article.publishedAt)}</span>
          <span className="inline-flex items-center gap-1"><Share2 className="h-3 w-3" />{formatViews(article.shares)}</span>
          {article.comments.length > 0 && (
            <span className="inline-flex items-center gap-1"><MessageCircle className="h-3 w-3" />{article.comments.length}</span>
          )}
        </p>
      </div>
    </Link>
  )
}
