import { useAppStore } from '@/store/appStore'
import type { UniverseKey } from '@/lib/data/publications'

// ─── i18n léger du chrome de l'interface ────────────────────────
// Le contenu éditorial (articles de démo) n'existe qu'en français ;
// ce dictionnaire couvre la navigation, les actions et les messages
// système. Aucune dépendance externe : un objet typé + un hook.

const MESSAGES = {
  fr: {
    // Navigation & header
    skipToContent: 'Aller au contenu',
    login: 'Connexion',
    logout: 'Se déconnecter',
    search: 'Rechercher',
    myAccount: 'Mon compte',
    backOffice: 'Back-office',
    archives: 'Archives',
    epaper: 'E-paper',
    subscribe: "S'abonner",
    menu: 'Menu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    ourPublications: 'Nos publications',
    switchLang: 'Switch to English',
    darkMode: 'Passer en mode sombre',
    lightMode: 'Passer en mode clair',
    credits: 'crédits',
    freeArticles: (n: number) => `${n} article${n > 1 ? 's' : ''} gratuit${n > 1 ? 's' : ''}`,
    freeArticlesTitle: "Articles gratuits restants aujourd'hui",
    // Bottom nav mobile
    navHome: 'Accueil',
    navNews: 'Actus',
    navSearch: 'Recherche',
    navEpaper: 'E-paper',
    navAccount: 'Compte',
    // Footer
    footerBaseline: "Le portail de référence de l'information camerounaise. Cinq publications, une seule exigence : l'excellence éditoriale.",
    footerNewsletterTitle: 'Restez informé, où que vous soyez',
    footerNewsletterText: "Recevez chaque matin l'essentiel de l'actualité camerounaise, sélectionné par nos rédactions.",
    footerPublications: 'Publications',
    footerUniverses: 'Univers',
    footerServices: 'Services',
    footerLegal: 'Légal',
    footerSubscriptions: 'Abonnements',
    footerArchives: 'Archives & Photothèque',
    footerNewsletters: 'Newsletters',
    footerContact: 'Contact',
    footerAbout: 'Qui sommes-nous',
    footerLegalNotice: 'Mentions légales',
    footerPrivacy: 'Politique de confidentialité',
    footerTerms: 'CGV',
    footerCopyright: (y: number) => `SOPECAM Médias © ${y} — 50 ans d'information au service du Cameroun`,
    // Résilience
    offlineBanner: 'Hors connexion — certains contenus peuvent être indisponibles. Vérifiez votre connexion.',
    backOnline: 'Connexion rétablie',
    errorTitle: 'Un incident est survenu',
    errorOfflineTitle: 'Vous êtes hors connexion',
    errorText: 'Nos équipes techniques ont été prévenues. Vous pouvez réessayer ou revenir à l\'accueil.',
    errorOfflineText: 'Cette page n\'a pas pu être chargée. Vérifiez votre connexion mobile ou Wi-Fi, puis réessayez.',
    retry: 'Réessayer',
    backHome: "Retour à l'accueil",
    // Mega menu
    topStories: 'À la une',
    explore: 'Explorer',
    // Démo
    demoNotice: 'Démonstration — aucun débit réel ne sera effectué.',
    demoAccounts: 'Comptes de démonstration',
  },
  en: {
    skipToContent: 'Skip to content',
    login: 'Sign in',
    logout: 'Sign out',
    search: 'Search',
    myAccount: 'My account',
    backOffice: 'Back office',
    archives: 'Archives',
    epaper: 'E-paper',
    subscribe: 'Subscribe',
    menu: 'Menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    ourPublications: 'Our publications',
    switchLang: 'Passer au français',
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    credits: 'credits',
    freeArticles: (n: number) => `${n} free article${n > 1 ? 's' : ''}`,
    freeArticlesTitle: 'Free articles remaining today',
    navHome: 'Home',
    navNews: 'News',
    navSearch: 'Search',
    navEpaper: 'E-paper',
    navAccount: 'Account',
    footerBaseline: 'Cameroon\'s reference news portal. Five publications, one standard: editorial excellence.',
    footerNewsletterTitle: 'Stay informed, wherever you are',
    footerNewsletterText: 'Every morning, receive the essentials of Cameroonian news, curated by our newsrooms.',
    footerPublications: 'Publications',
    footerUniverses: 'Sections',
    footerServices: 'Services',
    footerLegal: 'Legal',
    footerSubscriptions: 'Subscriptions',
    footerArchives: 'Archives & Photo library',
    footerNewsletters: 'Newsletters',
    footerContact: 'Contact',
    footerAbout: 'About us',
    footerLegalNotice: 'Legal notice',
    footerPrivacy: 'Privacy policy',
    footerTerms: 'Terms of sale',
    footerCopyright: (y: number) => `SOPECAM Médias © ${y} — 50 years of news serving Cameroon`,
    offlineBanner: 'Offline — some content may be unavailable. Please check your connection.',
    backOnline: 'Back online',
    errorTitle: 'Something went wrong',
    errorOfflineTitle: 'You are offline',
    errorText: 'Our technical team has been notified. You can retry or go back to the homepage.',
    errorOfflineText: 'This page could not be loaded. Check your mobile or Wi-Fi connection, then retry.',
    retry: 'Retry',
    backHome: 'Back to homepage',
    topStories: 'Top stories',
    explore: 'Explore',
    demoNotice: 'Demonstration — no real payment will be made.',
    demoAccounts: 'Demo accounts',
  },
}

export type Lang = keyof typeof MESSAGES
export type Messages = typeof MESSAGES.fr

/** Libellés des univers éditoriaux (les données restent en FR). */
const UNIVERSE_LABELS: Record<Lang, Record<UniverseKey, string>> = {
  fr: {
    actus: 'Les Actus', people: 'People', economie: 'Économie', sports: 'Sports',
    culture: 'Culture', debats: 'Débats', 'fact-checking': 'Fact-Checking',
  },
  en: {
    actus: 'News', people: 'People', economie: 'Economy', sports: 'Sports',
    culture: 'Culture', debats: 'Debates', 'fact-checking': 'Fact-Checking',
  },
}

export function getMessages(lang: Lang): Messages {
  return MESSAGES[lang]
}

/** Hook : dictionnaire réactif à la langue du store. */
export function useT() {
  const lang = useAppStore((s) => s.lang)
  return { t: MESSAGES[lang], lang, universeLabel: (k: UniverseKey) => UNIVERSE_LABELS[lang][k] }
}
