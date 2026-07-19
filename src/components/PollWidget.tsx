import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { POLL } from '@/lib/data/media'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Sondage (F-104) ────────────────────────────────────────────
export function PollWidget({ compact = false }: { compact?: boolean }) {
  const [voted, setVoted] = useState<string | null>(null)
  const total = POLL.totalVotes + (voted ? 1 : 0)

  const vote = (id: string) => {
    if (voted) return
    setVoted(id)
    toast.success('Merci pour votre vote !')
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-sm', compact ? 'p-4' : 'p-6')} role="region" aria-label="Sondage">
      <h3 className="mb-1 flex items-center gap-2 font-display text-base font-bold">
        <BarChart3 className="h-4 w-4 text-sopecam-green dark:text-sopecam-green-light" />
        Sondage du jour
      </h3>
      <p className="mb-4 text-sm font-medium leading-snug text-foreground/85">{POLL.question}</p>
      <div className="space-y-2">
        {POLL.options.map((o) => {
          const votes = o.votes + (voted === o.id ? 1 : 0)
          const pct = Math.round((votes / total) * 100)
          return voted ? (
            <div key={o.id} className="relative overflow-hidden rounded-lg bg-secondary px-3.5 py-2.5">
              <span
                className={cn(
                  'absolute inset-y-0 left-0 transition-all duration-500',
                  voted === o.id ? 'bg-sopecam-green/25 dark:bg-sopecam-green-light/25' : 'bg-border/60',
                )}
                style={{ width: `${pct}%` }}
                aria-hidden="true"
              />
              <span className="relative flex items-center justify-between text-sm">
                <span className={cn('font-medium', voted === o.id && 'font-bold text-sopecam-green dark:text-sopecam-green-light')}>
                  {o.label}
                </span>
                <span className="font-mono text-xs font-semibold">{pct} %</span>
              </span>
            </div>
          ) : (
            <button
              key={o.id}
              onClick={() => vote(o.id)}
              className="w-full rounded-lg border border-border px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-150 hover:border-sopecam-green hover:bg-sopecam-green/5 dark:hover:border-sopecam-green-light dark:hover:bg-sopecam-green-light/5"
            >
              {o.label}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{total.toLocaleString('fr-FR')} votants{voted && ' · Résultats actualisés'}</p>
    </div>
  )
}
