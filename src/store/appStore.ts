import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEMO_USERS, type DemoUser } from '@/lib/data/media'

export interface SessionUser {
  email: string
  name: string
  role: 'reader' | 'admin'
  plan: DemoUser['plan']
  credits: number
}

const todayKey = () => new Date().toISOString().slice(0, 10)

interface AppState {
  // Auth
  user: SessionUser | null
  login: (email: string, password: string) => { ok: boolean; error?: string }
  register: (name: string, email: string) => void
  logout: () => void
  // Quota d'articles gratuits (RB-01 : 3/jour)
  freeLeft: number
  freeDate: string
  consumedIds: string[]
  consumeFreeArticle: (id: string) => void
  hasConsumed: (id: string) => boolean
  // Crédits & déblocage (F-202)
  unlockedIds: string[]
  unlockWithCredits: (id: string, cost: number) => boolean
  isUnlocked: (id: string) => boolean
  // Abonnement
  subscribe: (plan: SessionUser['plan']) => void
  // Favoris (F-503)
  favorites: string[]
  toggleFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
  // Historique de lecture (F-503)
  history: { slug: string; at: string }[]
  pushHistory: (slug: string) => void
  // Thème & langue
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  lang: 'fr' | 'en'
  setLang: (l: 'fr' | 'en') => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      login: (email, password) => {
        const found = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password,
        )
        if (!found) return { ok: false, error: 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.' }
        set({ user: { email: found.email, name: found.name, role: found.role, plan: found.plan, credits: found.credits } })
        return { ok: true }
      },
      register: (name, email) =>
        set({ user: { email, name, role: 'reader', plan: 'free', credits: 50 } }),
      logout: () => set({ user: null }),

      freeLeft: 3,
      freeDate: todayKey(),
      consumedIds: [],
      consumeFreeArticle: (id) => {
        const s = get()
        const today = todayKey()
        let { freeLeft, consumedIds } = s
        if (s.freeDate !== today) {
          freeLeft = 3
          consumedIds = []
        }
        if (consumedIds.includes(id)) {
          set({ freeDate: today, freeLeft, consumedIds })
          return
        }
        set({ freeDate: today, freeLeft: Math.max(0, freeLeft - 1), consumedIds: [...consumedIds, id] })
      },
      hasConsumed: (id) => {
        const s = get()
        return s.freeDate === todayKey() && s.consumedIds.includes(id)
      },

      unlockedIds: [],
      unlockWithCredits: (id, cost) => {
        const s = get()
        if (!s.user || s.user.credits < cost) return false
        set({
          user: { ...s.user, credits: s.user.credits - cost },
          unlockedIds: [...s.unlockedIds, id],
        })
        return true
      },
      isUnlocked: (id) => get().unlockedIds.includes(id),

      subscribe: (plan) => {
        const s = get()
        if (s.user) set({ user: { ...s.user, plan } })
      },

      favorites: [],
      toggleFavorite: (slug) => {
        const s = get()
        set({
          favorites: s.favorites.includes(slug)
            ? s.favorites.filter((f) => f !== slug)
            : [...s.favorites, slug],
        })
      },
      isFavorite: (slug) => get().favorites.includes(slug),

      history: [],
      pushHistory: (slug) => {
        const s = get()
        const rest = s.history.filter((h) => h.slug !== slug)
        set({ history: [{ slug, at: new Date().toISOString() }, ...rest].slice(0, 50) })
      },

      theme: 'light',
      setTheme: (theme) => set({ theme }),
      lang: 'fr',
      setLang: (lang) => set({ lang }),
    }),
    { name: 'sopecam-mvp' },
  ),
)

// ─── Règles d'accès (RB-01 à RB-03) ─────────────────────────────
export type AccessCheck =
  | { allowed: true }
  | { allowed: false; reason: 'premium' | 'quota' }

export function checkAccess(articleAccess: 'free' | 'premium', articleId: string): AccessCheck {
  const s = useAppStore.getState()
  const plan = s.user?.plan
  const bypass = plan === 'premium' || plan === 'institutionnel' || plan === 'standard' || plan === 'famille' || s.user?.role === 'admin'
  if (articleAccess === 'premium') {
    if (bypass || s.isUnlocked(articleId)) return { allowed: true }
    return { allowed: false, reason: 'premium' }
  }
  // Article gratuit : quota RB-01 pour les comptes gratuits / visiteurs
  if (bypass) return { allowed: true }
  if (s.isUnlocked(articleId)) return { allowed: true }
  const today = todayKey()
  const freeLeft = s.freeDate === today ? s.freeLeft : 3
  const already = s.freeDate === today && s.consumedIds.includes(articleId)
  if (already || freeLeft > 0) return { allowed: true }
  return { allowed: false, reason: 'quota' }
}

export const UNLOCK_COST = 50
