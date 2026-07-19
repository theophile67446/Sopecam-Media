import type { PubCode } from '@/lib/data/publications'
import { PUBLICATIONS } from '@/lib/data/publications'
import { Crown, Radio, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Badge publication (charte §4.2) ────────────────────────────
export function PublicationBadge({ code, className }: { code: PubCode; className?: string }) {
  const pub = PUBLICATIONS[code]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-white shadow-sm',
        className,
      )}
      style={{ backgroundColor: pub.color }}
      title={pub.name}
    >
      {pub.code}
    </span>
  )
}

// ─── Badge Premium (charte §2.4) ────────────────────────────────
export function PremiumBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-[#1A1A1A] shadow-sm',
        className,
      )}
    >
      <Crown className="h-3 w-3" strokeWidth={2.2} />
      Premium
    </span>
  )
}

// ─── Badge Breaking ─────────────────────────────────────────────
export function BreakingBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-[#E00020] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-white shadow-sm',
        className,
      )}
    >
      <Zap className="h-3 w-3" strokeWidth={2.2} fill="currentColor" />
      Flash
    </span>
  )
}

// ─── Badge Live pulsant ─────────────────────────────────────────
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-[#E02020] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-white shadow-sm',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-white animate-soft-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      Direct
    </span>
  )
}

// ─── Avatar déterministe ────────────────────────────────────────
import { initials, avatarColor } from '@/lib/utils2'

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white shadow-inner',
        sizes[size],
        className,
      )}
      style={{ background: `linear-gradient(135deg, ${avatarColor(name)}, ${avatarColor(name)}cc)` }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  )
}

export { Radio }
