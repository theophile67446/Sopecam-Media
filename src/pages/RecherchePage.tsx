import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { CalendarDays, FileText, Search, SlidersHorizontal, User } from 'lucide-react'
import { ARTICLES } from '@/lib/data/articles'
import { PUBLICATION_LIST, UNIVERSE_LIST, type PubCode } from '@/lib/data/publications'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { ArticleCard } from '@/components/ArticleCard'
import { setPageMeta } from '@/lib/utils2'
import { cn } from '@/lib/utils'

type SortKey = 'pertinence' | 'recent' | 'ancien' | 'lu'

// ─── Page recherche (SRC-01) ────────────────────────────────────
export default function RecherchePage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [pub, setPub] = useState<PubCode | 'all'>('all')
  const [universe, setUniverse] = useState<string>('all')
  const [access, setAccess] = useState<'all' | 'free' | 'premium'>('all')
  const [sort, setSort] = useState<SortKey>('pertinence')
  const [showFilters, setShowFilters] = useState(false)
  const [suggest, setSuggest] = useState<string[]>([])

  useEffect(() => { setPageMeta('Recherche', 'Recherchez dans toute l\'actualité SOPECAM Médias.') }, [])
  useEffect(() => { setInput(q) }, [q])

  // Auto-complétion simulée (API /search/suggest)
  useEffect(() => {
    if (input.trim().length < 2) { setSuggest([]); return }
    const term = input.toLowerCase()
    const found = new Set<string>()
    ARTICLES.forEach((a) => {
      a.tags.forEach((t) => { if (t.toLowerCase().includes(term)) found.add(t) })
      a.title.split(' ').forEach((w) => {
        const clean = w.replace(/[«»',:;.]/g, '')
        if (clean.length > 4 && clean.toLowerCase().startsWith(term)) found.add(clean)
      })
    })
    setSuggest([...found].slice(0, 6))
  }, [input])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    let list = ARTICLES.filter((a) => {
      const matchQ = !term ||
        a.title.toLowerCase().includes(term) ||
        a.excerpt.toLowerCase().includes(term) ||
        a.tags.some((t) => t.toLowerCase().includes(term)) ||
        a.author.toLowerCase().includes(term)
      const matchPub = pub === 'all' || a.publication === pub
      const matchUni = universe === 'all' || a.universe === universe
      const matchAccess = access === 'all' || a.access === access
      return matchQ && matchPub && matchUni && matchAccess
    })
    switch (sort) {
      case 'recent': list = [...list].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)); break
      case 'ancien': list = [...list].sort((a, b) => +new Date(a.publishedAt) - +new Date(b.publishedAt)); break
      case 'lu': list = [...list].sort((a, b) => b.views - a.views); break
    }
    return list
  }, [q, pub, universe, access, sort])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setParams(input.trim() ? { q: input.trim() } : {})
    setSuggest([])
  }

  return (
    <PageContainer>
      <Breadcrumb items={[{ label: 'Recherche' }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold">
          <Search className="h-7 w-7 text-sopecam-green dark:text-sopecam-green-light" />
          Recherche avancée
        </h1>
        <p className="mt-2 text-muted-foreground">Explorez l'intégralité des publications SOPECAM Médias, indexée en temps réel.</p>

        {/* Champ de recherche + suggestions */}
        <form onSubmit={submit} className="relative mt-6" role="search">
          <label htmlFor="search" className="sr-only">Rechercher</label>
          <input
            id="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mot-clé, auteur, événement…"
            autoComplete="off"
            className="h-13 w-full rounded-xl border border-input bg-background py-4 pl-12 pr-28 text-base shadow-sm outline-none transition-all focus:border-sopecam-green focus:ring-4 focus:ring-sopecam-green/15 dark:focus:border-sopecam-green-light"
          />
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 h-9 -translate-y-1/2 rounded-lg bg-sopecam-green px-4 text-sm font-semibold uppercase tracking-wide text-white transition-all duration-150 hover:bg-sopecam-green-dark dark:bg-sopecam-green-light dark:text-sopecam-green-deep"
          >
            Chercher
          </button>
          {suggest.length > 0 && (
            <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl" role="listbox">
              {suggest.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => { setInput(s); setParams({ q: s }); setSuggest([]) }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                    role="option"
                    aria-selected={false}
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Filtres */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors',
              showFilters ? 'border-sopecam-green bg-sopecam-green/5 text-sopecam-green dark:border-sopecam-green-light dark:text-sopecam-green-light' : 'border-border hover:bg-secondary',
            )}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres {(pub !== 'all' || universe !== 'all' || access !== 'all') && '•'}
          </button>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="sort" className="text-muted-foreground">Trier :</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium outline-none focus:border-sopecam-green"
            >
              <option value="pertinence">Pertinence</option>
              <option value="recent">Plus récent</option>
              <option value="ancien">Plus ancien</option>
              <option value="lu">Plus lu</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="animate-fade-up mt-3 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-3">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> Publication
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={pub === 'all'} onClick={() => setPub('all')}>Toutes</FilterChip>
                {PUBLICATION_LIST.map((p) => (
                  <FilterChip key={p.code} active={pub === p.code} onClick={() => setPub(p.code)} color={p.color}>{p.code}</FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> Univers
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={universe === 'all'} onClick={() => setUniverse('all')}>Tous</FilterChip>
                {UNIVERSE_LIST.map((u) => (
                  <FilterChip key={u.key} active={universe === u.key} onClick={() => setUniverse(u.key)}>{u.label}</FilterChip>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <User className="h-3.5 w-3.5" /> Accès
              </p>
              <div className="flex flex-wrap gap-1.5">
                <FilterChip active={access === 'all'} onClick={() => setAccess('all')}>Tous</FilterChip>
                <FilterChip active={access === 'free'} onClick={() => setAccess('free')}>Gratuit</FilterChip>
                <FilterChip active={access === 'premium'} onClick={() => setAccess('premium')} color="#D4A843">Premium</FilterChip>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Résultats */}
      <div className="mt-10">
        <p className="mb-5 text-sm text-muted-foreground" role="status">
          <span className="font-bold text-foreground">{results.length}</span> résultat{results.length > 1 ? 's' : ''}
          {q && <> pour « <span className="font-semibold text-foreground">{q}</span> »</>}
        </p>
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-14 text-center">
            <Search className="mx-auto h-10 w-10 text-border" />
            <p className="mt-4 font-display text-lg font-bold">Aucun résultat</p>
            <p className="mt-1 text-sm text-muted-foreground">Essayez d'autres mots-clés ou élargissez les filtres.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {UNIVERSE_LIST.slice(0, 5).map((u) => (
                <Link
                  key={u.key}
                  to={u.path}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5"
                  style={{ backgroundColor: u.color === '#004000' ? '#008000' : u.color }}
                >
                  Parcourir {u.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

function FilterChip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150',
        active ? 'border-transparent text-white shadow-sm' : 'border-border bg-background hover:bg-secondary',
      )}
      style={active ? { backgroundColor: color ?? '#008000' } : undefined}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}
