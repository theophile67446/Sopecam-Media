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

// Univers d'atterrissage de chaque publication
const PUB_UNIVERSE_PATH: Record<PubCode, string> = {
  CT: '/actus',
  CBT: '/economie',
  CI: '/debats',
  NY: '/culture',
  WSL: '/sports',
}

export default function Home() {
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

        {/* ─── Partenaires ─────────────────────────────────── */}
        <div className="mt-14">
          <PartnerSection />
        </div>

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
