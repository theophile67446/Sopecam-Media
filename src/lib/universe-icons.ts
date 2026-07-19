import { Newspaper, TrendingUp, Users, Trophy, Palette, MessageSquare, ShieldCheck } from 'lucide-react'
import type { UniverseKey } from '@/lib/data/publications'

// ─── Icône signature de chaque univers éditorial ────────────────
// Partagée entre la navigation (header, drawer) et les couvertures
// génératives : un seul vocabulaire visuel pour les rubriques.
export const UNIVERSE_ICONS: Record<UniverseKey, typeof Newspaper> = {
  actus: Newspaper,
  people: Users,
  economie: TrendingUp,
  sports: Trophy,
  culture: Palette,
  debats: MessageSquare,
  'fact-checking': ShieldCheck,
}
