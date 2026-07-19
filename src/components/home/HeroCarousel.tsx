import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { getFeaturedArticles } from '@/lib/data/articles'
import { PublicationBadge, PremiumBadge, BreakingBadge } from '@/components/badges'
import { timeAgo } from '@/lib/utils2'
import { cn } from '@/lib/utils'

// ─── Carrousel héro (RG-HP-01 : 6 slides, rotation 5s, pause hover) ──
export function HeroCarousel() {
  const slides = getFeaturedArticles().slice(0, 6)
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const onSelect = useCallback(() => {
    if (embla) setSelected(embla.selectedScrollSnap())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on('select', onSelect)
    return () => { embla.off('select', onSelect) }
  }, [embla, onSelect])

  useEffect(() => {
    if (paused || !embla) return
    timer.current = setInterval(() => embla.scrollNext(), 5000)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [embla, paused])

  return (
    <div
      className="group/carousel relative overflow-hidden rounded-2xl shadow-[0_16px_48px_rgba(0,32,0,0.25)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Actualités à la une"
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((a, i) => (
            <div key={a.id} className="relative min-w-0 flex-[0_0_100%]">
              <HeroSlide article={a} eager={i === 0} />
            </div>
          ))}
        </div>
      </div>

      {/* Flèches desktop */}
      <button
        onClick={() => embla?.scrollPrev()}
        aria-label="Slide précédent"
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-40 backdrop-blur-sm transition-all duration-250 hover:bg-black/55 group-hover/carousel:opacity-100 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => embla?.scrollNext()}
        aria-label="Slide suivant"
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-40 backdrop-blur-sm transition-all duration-250 hover:bg-black/55 group-hover/carousel:opacity-100 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            aria-label={`Aller à la slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-250',
              i === selected ? 'w-7 bg-gold' : 'w-1.5 bg-white/45 hover:bg-white/70',
            )}
          />
        ))}
      </div>
    </div>
  )
}

import type { Article } from '@/lib/data/articles'
import { CoverImage } from '@/components/CoverImage'

// Chemin d'image article basé sur le slug — chaque article a sa photo WebP
const articleImageSrc = (slug: string) => `/assets/articles/${slug}.webp`

function HeroSlide({ article: a, eager = false }: { article: Article; eager?: boolean }) {
  return (
    <Link
      to={`/article/${a.slug}`}
      className="group relative block aspect-[16/10] w-full overflow-hidden sm:aspect-[16/8] lg:aspect-[16/8]"
      aria-label={`Lire l'article : ${a.title}`}
    >
      {/* Image de fond avec effet de zoom au hover */}
      <CoverImage publication={a.publication} seed={a.seed} universe={a.universe} src={articleImageSrc(a.slug)} eager={eager} className="absolute inset-0" zoomClass="transition-transform duration-500 group-hover:scale-[1.03]" />

      {/* Dégradé progressif — plus opaque en bas pour la lisibilité */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/40 via-50% to-transparent" aria-hidden="true" />

      {/* Contenu superposé */}
      <div className="absolute inset-x-0 bottom-0 z-[3] p-5 sm:p-8">
        {/* Badges */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <PublicationBadge code={a.publication} />
          {a.breaking && <BreakingBadge />}
          {a.access === 'premium' && <PremiumBadge />}
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm ring-1 ring-white/20">
            {a.subcategory}
          </span>
        </div>

        {/* Titre — avec survol souligné partiel */}
        <h1 className="max-w-3xl font-display text-2xl font-bold leading-tight text-white drop-shadow-lg transition-colors duration-250 group-hover:text-gold sm:text-3xl lg:text-4xl">
          {a.title}
        </h1>

        {/* Chapô — visible sur desktop */}
        <p className="mt-3 hidden max-w-2xl text-sm leading-relaxed text-white/80 sm:line-clamp-2 lg:text-base">
          {a.excerpt}
        </p>

        {/* Meta + CTA */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-lg transition-all duration-150 group-hover:shadow-xl group-hover:-translate-y-0.5">
            Lire l'article
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
          <span className="text-xs text-white/60">
            {a.author} · {timeAgo(a.publishedAt)} · {a.readMinutes} min de lecture
          </span>
        </div>
      </div>
    </Link>
  )
}
