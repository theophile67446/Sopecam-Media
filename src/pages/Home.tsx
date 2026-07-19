import { useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Crown, Eye, Newspaper, Sparkles } from 'lucide-react'
import { ARTICLES, getLatestArticles, getArticlesByUniverse } from '@/lib/data/articles'
import { UNIVERSE_LIST, PUBLICATION_LIST, type PubCode } from '@/lib/data/publications'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { UneSection } from '@/components/home/UneSection'
import { NewsFeed, PodcastSection, VideoSection, PartnerSection } from '@/components/home/sections'
import { ArticleCard } from '@/components/ArticleCard'
import { SectionHeading } from '@/components/widgets'
import { setPageMeta, setJsonLd, formatViews, SITE_ORIGIN } from '@/lib/utils2'
import { useAppStore } from '@/store/appStore'
import { useT } from '@/lib/i18n'

// Univers d'atterrissage de chaque publication
const PUB_UNIVERSE_PATH: Record<PubCode, string> = {
  CT: '/actus',
  CBT: '/economie',
  CI: '/debats',
  NY: '/culture',
  WSL: '/sports',
}

export default function Home() {
  const { t } = useT()
  const { user } = useAppStore()
  useEffect(() => {
    setPageMeta('', 'SOPECAM Médias : Cameroon Tribune, CBT, Insider, Nyanga, Sports & Loisirs. L\'information souveraine du Cameroun.')
    setJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'NewsMediaOrganization',
      name: 'SOPECAM Médias',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/assets/logos/sopecam.png`,
      address: { '@type': 'PostalAddress', addressLocality: 'Yaoundé', addressCountry: 'CM' },
    })
    return () => setJsonLd('organization', null)
  }, [])

  const latest = getLatestArticles(18)
  // Top 3 par vues — remplit l'espace sous le carrousel héros
  const mostRead = [...ARTICLES].sort((a, b) => b.views - a.views).slice(0, 3)
  const dossiers = ARTICLES.filter((a) => a.subcategory === 'Enquêtes' || (a.access === 'premium' && a.universe !== 'economie')).slice(0, 4)
  // 3 articles + tuile « Explorer » = grille de 4 toujours pleine (pas de colonne vide)
  const byUniverse = UNIVERSE_LIST.map((u) => ({
    universe: u,
    articles: getArticlesByUniverse(u.key)
      .slice()
      .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
      .slice(0, 3),
  })).filter((x) => x.articles.length > 0)

  return (
    <div>
      {/* ─── Bandeau héro ─────────────────────────────────── */}
      <section className="surface-hero texture-dots">
        <div className="mx-auto max-w-[1280px] px-4 pb-10 pt-10 lg:px-6 lg:pt-14">
          <div className="mb-8 text-center">
            <p className="overline-label mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sopecam-green-light ring-1 ring-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              50 ans d'information souveraine · 1977-2027
            </p>
            <h1 className="mx-auto max-w-3xl font-display text-[32px] font-bold leading-tight text-white md:text-5xl">
              L'information du Cameroun, <em className="text-gold not-italic underline decoration-gold/40 decoration-2 underline-offset-8">par ceux qui la vivent</em>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-sopecam-mint md:text-lg">
              Cinq publications, une rédaction unie, des dizaines de correspondants sur tout le territoire national.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <HeroCarousel />
              {/* Les + lus : comble l'espace sous le carrousel */}
              <div className="mt-5 grid gap-3 sm:grid-cols-3" aria-label="Articles les plus lus">
                {mostRead.map((a, i) => (
                  <Link
                    key={a.id}
                    to={`/article/${a.slug}`}
                    className="group flex items-start gap-3 rounded-xl bg-white/[0.07] p-3.5 ring-1 ring-white/10 transition-all duration-150 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    <span className="font-display text-[26px] font-bold leading-none text-gold/85" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-medium leading-snug text-white/90 transition-colors group-hover:text-white">
                        {a.title}
                      </span>
                      <span className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/50">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {formatViews(a.views)} vues · {a.readMinutes} min
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {/* Cellule relative : le fil s'aligne exactement sur la hauteur
                de la colonne de gauche (liste défilante à l'intérieur) */}
            <div className="relative">
              <div className="lg:absolute lg:inset-0">
                <NewsFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        {/* ─── Les unes du jour ────────────────────────────── */}
        <UneSection />

        {/* ─── L'univers SOPECAM : 5 blocs pleine couleur ──── */}
        <section className="mt-12" aria-label="Nos publications">
          <SectionHeading
            title="L'univers SOPECAM"
            subtitle="Cinq publications, cinq identités, une même exigence"
            color="#D4A843"
            icon={<Sparkles className="h-5 w-5 text-gold" />}
          />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {PUBLICATION_LIST.map((p) => (
              <Link
                key={p.code}
                to={PUB_UNIVERSE_PATH[p.code]}
                className="group relative overflow-hidden rounded-2xl p-5 text-white shadow-md ring-1 ring-black/10 transition-all duration-250 hover:-translate-y-1 hover:shadow-xl"
                style={{ background: `linear-gradient(150deg, ${p.color} 0%, ${p.colorDark} 100%)` }}
              >
                <div className="texture-dots absolute inset-0 opacity-60" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" aria-hidden="true" />
                <div className="relative">
                  <span className="flex h-10 w-fit items-center rounded-lg bg-white/95 px-2.5 py-1.5 shadow-sm">
                    <img src={p.logo} alt="" className="max-h-7 w-auto object-contain" />
                  </span>
                  <p className="mt-4 font-display text-lg font-bold leading-tight drop-shadow-sm">{p.shortName}</p>
                  <p className="mt-1 text-[13px] leading-snug text-white/90">{p.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-white/95 transition-transform duration-250 group-hover:translate-x-1">
                    Découvrir <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Dernières actualités ────────────────────────── */}
        <section className="mt-12" aria-label="Dernières actualités">
          <SectionHeading
            title="À la une ce matin"
            subtitle="La sélection de la rédaction, actualisée en continu"
            linkTo="/actus"
            color="#008000"
            icon={<Newspaper className="h-5 w-5 text-sopecam-green dark:text-sopecam-green-light" />}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.slice(0, 4).map((a, i) => (
              <div key={a.id} className={`animate-fade-up stagger-${i + 1}`}>
                <ArticleCard article={a} />
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ─── Enquêtes & grands dossiers — bande pleine largeur ──
          Fond clair teinté or (légèrement plus soutenu), accents dorés */}
      <section className="relative mt-14 overflow-hidden border-y border-gold/30" aria-label="Enquêtes et grands dossiers">
        <div className="absolute inset-0 bg-card" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(196,152,46,0.22) 0%, rgba(196,152,46,0.10) 45%, rgba(196,152,46,0.04) 100%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#C8982E] via-gold/60 to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-10 md:py-12 lg:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 ring-1 ring-gold/50">
                <Crown className="h-5 w-5 text-[#B8860B]" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Enquêtes & Grands Dossiers</h2>
                <p className="text-sm text-muted-foreground">Nos contenus les plus aboutis, réservés aux abonnés</p>
              </div>
            </div>
            {!user && (
              <Link
                to="/abonnement"
                className="hidden items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg sm:inline-flex"
              >
                Débloquer <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dossiers.map((a) => (
              <ArticleCard key={a.id} article={a} compact />
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        {/* ─── Par univers ─────────────────────────────────── */}
        <section className="mt-14 space-y-12" aria-label="Nos univers éditoriaux">
          {byUniverse.slice(0, 4).map(({ universe, articles }) => (
            <div key={universe.key}>
              <SectionHeading
                title={universe.label}
                subtitle={universe.description}
                linkTo={universe.path}
                color={universe.color === '#004000' ? '#008000' : universe.color}
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
                {/* Tuile d'accès à l'univers */}
                <Link
                  to={universe.path}
                  className="group flex min-h-[180px] flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all duration-250 hover:border-solid hover:shadow-md"
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform duration-250 group-hover:scale-110"
                    style={{ backgroundColor: universe.color === '#004000' ? '#008000' : universe.color }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold">Explorer {universe.label}</span>
                  <span className="text-xs text-muted-foreground">{universe.subcategories.slice(0, 3).join(' · ')}</span>
                </Link>
              </div>
            </div>
          ))}
        </section>

      </div>

      {/* ─── Podcasts & Débats — bande pleine largeur, vert lumineux ──
          Teinte menthe/vert clair de la charte : éclatante sans être sombre */}
      <section className="relative mt-14 overflow-hidden border-y border-sopecam-green/15">
        <div className="absolute inset-0 bg-background" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(128, 224, 160, 0.30) 0%, rgba(160, 224, 192, 0.16) 45%, rgba(128, 224, 160, 0.06) 100%),
              radial-gradient(760px 300px at 90% -10%, rgba(0, 128, 0, 0.10), transparent 60%)
            `,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(rgba(0,128,0,0.10) 1.2px, transparent 1.3px)', backgroundSize: '20px 20px', maskImage: 'linear-gradient(90deg, black 0%, transparent 65%)', WebkitMaskImage: 'linear-gradient(90deg, black 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sopecam-green via-sopecam-green-light to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-[1280px] px-4 py-10 md:py-12 lg:px-6">
          <PodcastSection />
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
        {/* ─── Vidéos ──────────────────────────────────────── */}
        <div className="mt-14">
          <VideoSection />
        </div>

        {/* ─── SHOPecam ────────────────────────────────────── */}
        <section className="mt-14" aria-label="Boutique">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sopecam-green-dark via-sopecam-green to-sopecam-green-light p-8 shadow-lg md:p-10">
            <div className="texture-dots pointer-events-none absolute inset-0 opacity-30" aria-hidden />
            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
              <div className="flex-1">
                <p className="overline-label text-gold">{t('shopTitle')}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">SHOPecam</h2>
                <p className="mt-2 text-sopecam-mint">{t('shopTagline')}</p>
                <a
                  href="https://boutique-sopecam.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-gold px-6 text-sm font-bold uppercase tracking-wide text-[#1A1A1A] shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  {t('shopCta')} <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="flex shrink-0 gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="text-3xl font-black text-white" aria-hidden>🛒</span>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="text-3xl font-black text-white" aria-hidden>📰</span>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="text-3xl font-black text-white" aria-hidden>💳</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Régions — Carte du Cameroun ─────────────────── */}
        <section className="mt-14" aria-label="Régions">
          <div className="relative overflow-hidden rounded-2xl border border-sopecam-green/20 bg-card p-8 shadow-sm md:p-10">
            <div className="flex flex-col items-center gap-8 md:flex-row">
              <div className="w-full max-w-sm shrink-0">
                <svg viewBox="0 0 400 500" className="w-full drop-shadow-md" aria-label="Carte du Cameroun">
                  <rect x="0" y="0" width="400" height="500" fill="none" />
                  {/* Carte stylisée simplifiée du Cameroun */}
                  <path d="M200 30 L260 60 L290 100 L310 150 L320 200 L300 240 L310 280 L290 320 L270 350 L240 370 L210 380 L190 370 L160 350 L140 320 L120 280 L110 240 L100 200 L110 150 L130 100 L160 60 Z"
                    fill="#2d6a2d" stroke="#1a4a1a" strokeWidth="2" opacity="0.85" />
                  {/* Régions - points */}
                  <circle cx="200" cy="90" r="4" fill="#D4A843" /><text x="205" y="85" fontSize="9" fill="#D4A843" fontWeight="bold">Adamaoua</text>
                  <circle cx="260" cy="120" r="4" fill="#D4A843" /><text x="265" y="115" fontSize="9" fill="#D4A843" fontWeight="bold">Nord</text>
                  <circle cx="300" cy="180" r="4" fill="#D4A843" /><text x="305" y="175" fontSize="9" fill="#D4A843" fontWeight="bold">Extrême-Nord</text>
                  <circle cx="220" cy="200" r="4" fill="#D4A843" /><text x="225" y="195" fontSize="9" fill="#D4A843" fontWeight="bold">Nord-Ouest</text>
                  <circle cx="180" cy="220" r="4" fill="#D4A843" /><text x="155" y="215" fontSize="9" fill="#D4A843" fontWeight="bold">Sud-Ouest</text>
                  <circle cx="240" cy="240" r="4" fill="#D4A843" /><text x="245" y="250" fontSize="9" fill="#D4A843" fontWeight="bold">Ouest</text>
                  <circle cx="260" cy="290" r="4" fill="#D4A843" /><text x="265" y="300" fontSize="9" fill="#D4A843" fontWeight="bold">Centre</text>
                  <circle cx="200" cy="310" r="4" fill="#D4A843" /><text x="175" y="320" fontSize="9" fill="#D4A843" fontWeight="bold">Littoral</text>
                  <circle cx="280" cy="340" r="4" fill="#D4A843" /><text x="285" y="350" fontSize="9" fill="#D4A843" fontWeight="bold">Est</text>
                  <circle cx="220" cy="370" r="4" fill="#D4A843" /><text x="195" y="380" fontSize="9" fill="#D4A843" fontWeight="bold">Sud</text>
                </svg>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-sopecam-green/10 px-3 py-1 text-xs font-semibold text-sopecam-green-dark">
                  <span className="h-1.5 w-1.5 rounded-full bg-sopecam-green-dark" aria-hidden />
                  10 régions · 58 départements
                </div>
                <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">{t('regionsTitle')}</h2>
                <p className="mt-2 text-muted-foreground">{t('regionsTagline')}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
                  {['Adamaoua', 'Centre', 'Est', 'Extrême-Nord', 'Littoral', 'Nord', 'Nord-Ouest', 'Ouest', 'Sud', 'Sud-Ouest'].map((r) => (
                    <span key={r} className="inline-flex items-center gap-2 rounded-lg border border-sopecam-green/15 bg-sopecam-green/[0.04] px-3 py-2 text-foreground/80">
                      <span className="h-2 w-2 rounded-full bg-sopecam-green/60" aria-hidden />
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA abonnement ──────────────────────────────── */}
        <section className="surface-paywall texture-dots mt-14 overflow-hidden rounded-2xl p-8 text-center md:p-12" aria-label="Offre d'abonnement">
          <p className="overline-label text-gold">Offre de lancement</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-bold text-white md:text-4xl">
            Soutenez le journalisme camerounais de qualité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sopecam-mint">
            Dès 2 000 FCFA par mois, accédez à toute l'information SOPECAM Médias, sans limite et sans publicité.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/abonnement"
              className="inline-flex h-12 items-center gap-2 rounded-lg bg-gold px-8 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Crown className="h-4 w-4" />
              Découvrir les offres
            </Link>
            <Link
              to="/compte/inscription"
              className="inline-flex h-12 items-center rounded-lg border border-white/25 px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-150 hover:bg-white/10"
            >
              Créer un compte gratuit
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/50">Paiement sécurisé · MTN Mobile Money · Orange Money · Carte bancaire</p>
        </section>
      </div>
    </div>
  )
}
