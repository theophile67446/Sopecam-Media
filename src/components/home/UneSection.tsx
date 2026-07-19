import { Link } from 'react-router'
import { BookOpen, ArrowRight } from 'lucide-react'
import { EPAPER_EDITIONS } from '@/lib/data/media'
import { PUBLICATIONS } from '@/lib/data/publications'
import { SectionHeading } from '@/components/widgets'

// ─── Les unes du jour (vraies couvertures du groupe) ────────────
export function UneSection() {
  return (
    <section aria-label="Les unes de nos publications" className="mt-12">
      <SectionHeading
        title="Les unes du jour"
        subtitle="Feuilletez les versions numériques de nos cinq publications"
        linkTo="/epaper"
        linkLabel="Ouvrir le kiosque"
        color="#8B6914"
        icon={<BookOpen className="h-5 w-5 text-gold" />}
      />
      <div className="no-scrollbar flex gap-5 overflow-x-auto pb-4 pt-1">
        {EPAPER_EDITIONS.map((e) => {
          const p = PUBLICATIONS[e.publication]
          return (
            <Link
              key={e.id}
              to="/epaper"
              className="group shrink-0"
              aria-label={`${p.name} — ${e.headline}`}
            >
              <div className="relative w-52 overflow-hidden rounded-xl border border-border bg-card shadow-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                {/* Reflet kiosque */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={e.cover}
                    alt={`Une de ${p.name}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-sm font-semibold leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Feuilleter l'édition →
                  </span>
                </div>
                <div className="border-t border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex h-7 items-center rounded-md bg-white px-2 shadow-sm ring-1 ring-border">
                      <img src={p.logo} alt="" className="max-h-4 w-auto object-contain" />
                    </span>
                    <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[10px] font-bold text-gold">
                      {e.price} FCFA
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] font-bold leading-tight">{e.headline}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{e.date} · {e.issue}</p>
                </div>
              </div>
            </Link>
          )
        })}
        {/* Tuile d'accès au kiosque */}
        <Link
          to="/epaper"
          className="group flex w-40 shrink-0 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-center transition-all duration-250 hover:border-gold/60 hover:bg-gold/5"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold transition-transform duration-250 group-hover:scale-110">
            <ArrowRight className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold">Tout le kiosque numérique</span>
          <span className="text-xs text-muted-foreground">Éditions PDF · Archives</span>
        </Link>
      </div>
    </section>
  )
}
