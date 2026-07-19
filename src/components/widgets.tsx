import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Pause, Play, Send, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Titre de section ───────────────────────────────────────────
export function SectionHeading({
  title, subtitle, linkTo, linkLabel = 'Tout voir', color = '#008000', icon, onDark = false,
}: {
  title: string
  subtitle?: string
  linkTo?: string
  linkLabel?: string
  color?: string
  icon?: React.ReactNode
  /** true sur bande sombre : titres blancs */
  onDark?: boolean
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="h-6 w-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
          {icon}
          <h2 className={`font-display text-2xl font-bold md:text-[28px] ${onDark ? 'text-white' : 'text-foreground'}`}>{title}</h2>
        </div>
        {subtitle && <p className={`mt-1.5 pl-4 text-sm ${onDark ? 'text-white/60' : 'text-muted-foreground'}`}>{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group hidden shrink-0 items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors sm:inline-flex"
          style={{ color }}
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

// ─── Lecteur audio simulé avec waveform ─────────────────────────
export function AudioPlayer({ durationSec, compact = false }: { durationSec: number; compact?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const raf = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (playing) {
      raf.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false)
            return 0
          }
          return p + 100 / durationSec
        })
      }, 1000)
    }
    return () => { if (raf.current) clearInterval(raf.current) }
  }, [playing, durationSec])

  const bars = 36
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  const current = (progress / 100) * durationSec

  return (
    <div className={cn('flex items-center gap-3 rounded-xl border border-border bg-card', compact ? 'p-2.5' : 'p-4')}>
      <button
        onClick={() => setPlaying(!playing)}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sopecam-green text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green-dark hover:shadow-lg"
        aria-label={playing ? 'Mettre en pause' : 'Écouter'}
      >
        {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
      </button>
      <div className="flex h-8 flex-1 items-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: bars }).map((_, i) => {
          const h = 25 + Math.abs(Math.sin(i * 1.7)) * 55 + ((i * 13) % 20)
          const active = (i / bars) * 100 < progress
          return (
            <span
              key={i}
              className={cn(
                'w-[3px] rounded-full transition-colors duration-150',
                playing && 'wave-bar',
                active ? 'bg-sopecam-green dark:bg-sopecam-green-light' : 'bg-border',
              )}
              style={{ height: `${h}%`, animationDelay: `${(i % 8) * 0.09}s` }}
            />
          )
        })}
      </div>
      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        {fmt(current)} / {fmt(durationSec)}
      </span>
    </div>
  )
}

// ─── Formulaire newsletter ──────────────────────────────────────
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'error' | 'done'>('idle')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState('error')
      return
    }
    setState('done')
  }

  if (state === 'done') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-sopecam-green/10 px-4 py-3 text-sm font-medium text-sopecam-green dark:bg-sopecam-green-light/10 dark:text-sopecam-green-light">
        <CheckCircle2 className="h-4 w-4" />
        Merci ! Votre inscription à la newsletter est confirmée.
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="w-full" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={dark ? 'nl-footer' : 'nl-main'} className="sr-only">Adresse email</label>
        <input
          id={dark ? 'nl-footer' : 'nl-main'}
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setState('idle') }}
          placeholder="Votre adresse email"
          className={cn(
            'h-11 flex-1 rounded-lg border px-4 text-sm outline-none transition-all duration-150',
            dark
              ? 'border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-sopecam-green-light focus:ring-2 focus:ring-sopecam-green-light/30'
              : 'border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-sopecam-green focus:ring-2 focus:ring-sopecam-green/15',
            state === 'error' && 'border-destructive focus:border-destructive focus:ring-destructive/15',
          )}
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gold px-5 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <Send className="h-4 w-4" />
          S'inscrire
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 text-xs font-medium text-[#E00020]">Veuillez saisir une adresse email valide.</p>
      )}
    </form>
  )
}

// ─── Skeleton carte (loading states) ────────────────────────────
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="skeleton-shimmer aspect-video" />
      <div className="space-y-3 p-5">
        <div className="skeleton-shimmer h-3 w-1/4 rounded" />
        <div className="skeleton-shimmer h-5 w-full rounded" />
        <div className="skeleton-shimmer h-5 w-3/4 rounded" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  )
}

export function SkeletonRows({ n = 4 }: { n?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-xl border border-border bg-card p-3">
          <div className="skeleton-shimmer h-20 w-28 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2 py-1">
            <div className="skeleton-shimmer h-3 w-16 rounded" />
            <div className="skeleton-shimmer h-4 w-full rounded" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
