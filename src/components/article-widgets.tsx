import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Check, Crown, Facebook, Heart, Link2, Linkedin, MessageCircle, Share2, Twitter, Unlock } from 'lucide-react'
import type { Article } from '@/lib/data/articles'
import { Avatar } from './badges'
import { timeAgo } from '@/lib/utils2'
import { useAppStore, UNLOCK_COST } from '@/store/appStore'
import { cn } from '@/lib/utils'

// ─── Partage social (F-502 / RG-ART) ────────────────────────────
export function ShareButtons({ title, compact = false }: { title: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const encoded = encodeURIComponent(url)
  const text = encodeURIComponent(title)

  const links = [
    { name: 'WhatsApp', href: `https://wa.me/?text=${text}%20${encoded}`, bg: '#25D366', icon: <MessageCircle className="h-4 w-4" /> },
    { name: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`, bg: '#1877F2', icon: <Facebook className="h-4 w-4" /> },
    { name: 'X (Twitter)', href: `https://twitter.com/intent/tweet?text=${text}&url=${encoded}`, bg: '#1A1A1A', icon: <Twitter className="h-4 w-4" /> },
    { name: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`, bg: '#0A66C2', icon: <Linkedin className="h-4 w-4" /> },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* clipboard indisponible : on simule */
    }
    setCopied(true)
    toast.success('Lien copié dans le presse-papiers')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex items-center gap-2', compact && 'gap-1.5')}>
      {!compact && (
        <span className="mr-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Share2 className="h-4 w-4" /> Partager
        </span>
      )}
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Partager sur ${l.name}`}
          className={cn(
            'inline-flex items-center justify-center rounded-full text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md',
            compact ? 'h-8 w-8' : 'h-9 w-9',
          )}
          style={{ backgroundColor: l.bg }}
        >
          {l.icon}
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copier le lien"
        className={cn(
          'inline-flex items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md',
          compact ? 'h-8 w-8' : 'h-9 w-9',
        )}
      >
        {copied ? <Check className="h-4 w-4 text-sopecam-green" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}

// ─── Bouton favori ──────────────────────────────────────────────
export function FavoriteButton({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useAppStore()
  const fav = isFavorite(slug)
  return (
    <button
      onClick={() => {
        toggleFavorite(slug)
        toast.success(fav ? 'Retiré de vos favoris' : 'Ajouté à vos favoris')
      }}
      aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={fav}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
    >
      <Heart className={cn('h-4 w-4 transition-colors', fav ? 'fill-[#E02020] text-[#E02020]' : 'text-muted-foreground')} />
    </button>
  )
}

// ─── Paywall (charte §4.4) ──────────────────────────────────────
export function PaywallBox({ article, reason }: { article: Article; reason: 'premium' | 'quota' }) {
  const { user, unlockWithCredits } = useAppStore()
  const canUnlock = user && user.credits >= UNLOCK_COST

  return (
    <div className="surface-paywall animate-fade-up relative overflow-hidden rounded-2xl p-8 text-center shadow-2xl md:p-10" role="region" aria-label="Contenu réservé">
      <div className="texture-dots absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <span className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 ring-1 ring-gold/40">
          <Crown className="h-7 w-7 text-gold" />
        </span>
        <h3 className="font-display text-2xl font-bold text-white md:text-[28px]">
          {reason === 'premium' ? 'Cet article est réservé à nos abonnés' : 'Vous avez lu vos 3 articles gratuits'}
        </h3>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-sopecam-mint">
          {reason === 'premium'
            ? 'Accédez à l\'intégralité de cette enquête et à tous nos contenus exclusifs, archives et podcasts.'
            : 'Abonnez-vous pour un accès illimité à toute l\'information SOPECAM Médias, dès aujourd\'hui.'}
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to={`/abonnement?from=${article.slug}`}
            className="inline-flex h-12 items-center gap-2 rounded-lg bg-gold px-7 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Crown className="h-4 w-4" />
            Voir les offres
          </Link>
          {user ? (
            <button
              onClick={() => {
                if (canUnlock && unlockWithCredits(article.id, UNLOCK_COST)) {
                  toast.success(`Article débloqué pour ${UNLOCK_COST} crédits`)
                } else {
                  toast.error('Crédits insuffisants. Rechargez votre compte.')
                }
              }}
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-150 hover:bg-white/10"
            >
              <Unlock className="h-4 w-4" />
              Débloquer · {UNLOCK_COST} crédits
            </button>
          ) : (
            <Link
              to="/compte/connexion"
              className="inline-flex h-12 items-center rounded-lg border border-white/25 px-6 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-150 hover:bg-white/10"
            >
              Se connecter
            </Link>
          )}
        </div>
        <p className="mt-4 text-xs text-white/50">
          {user
            ? `Solde : ${user.credits} crédits · Débloquez cet article sans abonnement`
            : 'Déjà abonné ? Connectez-vous pour retrouver votre accès.'}
        </p>
      </div>
    </div>
  )
}

// ─── Section commentaires (RG-ART-03) ───────────────────────────
export function CommentSection({ article }: { article: Article }) {
  const { user } = useAppStore()
  const [comments, setComments] = useState(article.comments)
  const [draft, setDraft] = useState('')
  const [liked, setLiked] = useState<Record<string, boolean>>({})

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft.trim()) return
    setComments([
      {
        id: `new-${Date.now()}`,
        author: user?.name ?? 'Invité',
        date: new Date().toISOString(),
        content: draft.trim(),
        likes: 0,
      },
      ...comments,
    ])
    setDraft('')
    toast.success(user ? 'Commentaire publié' : 'Commentaire envoyé en modération (utilisateurs non vérifiés)')
  }

  return (
    <section aria-label="Commentaires" className="mt-10">
      <h2 className="mb-5 flex items-center gap-2 font-display text-xl font-bold">
        <MessageCircle className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" />
        Commentaires ({comments.length})
      </h2>
      <form onSubmit={submit} className="mb-6">
        <label htmlFor="comment" className="sr-only">Votre commentaire</label>
        <textarea
          id="comment"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={user ? 'Partagez votre point de vue…' : 'Connectez-vous ou commentez en invité (modéré a priori)…'}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-all duration-150 focus:border-sopecam-green focus:ring-4 focus:ring-sopecam-green/15 dark:focus:border-sopecam-green-light"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!draft.trim()}
            className="inline-flex h-10 items-center rounded-lg bg-sopecam-green px-5 text-sm font-semibold uppercase tracking-wide text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green-dark disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
          >
            Publier
          </button>
        </div>
      </form>
      <ul className="space-y-4">
        {comments.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Soyez le premier à commenter cet article.
          </li>
        )}
        {comments.map((cm) => (
          <li key={cm.id} className="flex gap-3 rounded-xl border border-border bg-card p-4">
            <Avatar name={cm.author} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-sm font-semibold">{cm.author}</span>
                <span className="text-xs text-muted-foreground">{timeAgo(cm.date)}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{cm.content}</p>
              <button
                onClick={() => {
                  setLiked((l) => ({ ...l, [cm.id]: !l[cm.id] }))
                  setComments((cs) => cs.map((x) => (x.id === cm.id ? { ...x, likes: x.likes + (liked[cm.id] ? -1 : 1) } : x)))
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-[#E02020]"
              >
                <Heart className={cn('h-3.5 w-3.5', liked[cm.id] && 'fill-[#E02020] text-[#E02020]')} />
                {cm.likes > 0 ? cm.likes : 'J\'aime'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
