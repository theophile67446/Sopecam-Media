// ─── Publications SOPECAM Médias — Charte graphique §2.2 ────────
export type PubCode = 'CT' | 'CBT' | 'CI' | 'NY' | 'WSL'

export interface Publication {
  code: PubCode
  name: string
  shortName: string
  color: string
  colorDark: string
  tagline: string
  emoji: string
  logo: string
}

export const PUBLICATIONS: Record<PubCode, Publication> = {
  CT: {
    code: 'CT',
    name: 'Cameroon Tribune',
    shortName: 'Tribune',
    color: '#006020',
    colorDark: '#004018',
    tagline: 'Le quotidien national de référence',
    emoji: '🇨🇲',
    logo: '/assets/logos/ct.png',
  },
  CBT: {
    code: 'CBT',
    name: 'Cameroon Business Today',
    shortName: 'Business Today',
    color: '#00A0E0',
    colorDark: '#0040A0',
    tagline: "L'économie décryptée",
    emoji: '💼',
    logo: '/assets/logos/cbt.png',
  },
  CI: {
    code: 'CI',
    name: 'Cameroon Insider',
    shortName: 'Insider',
    color: '#E02020',
    colorDark: '#C02020',
    tagline: "L'analyse sans concession",
    emoji: '🌍',
    logo: '/assets/logos/ci.png',
  },
  NY: {
    code: 'NY',
    name: 'Nyanga',
    shortName: 'Nyanga',
    color: '#D4A843',
    colorDark: '#8B6914',
    tagline: "L'art de vivre camerounais",
    emoji: '✨',
    logo: '/assets/logos/ny.png',
  },
  WSL: {
    code: 'WSL',
    name: 'Weekend Sports & Loisirs',
    shortName: 'Sports & Loisirs',
    color: '#008040',
    colorDark: '#005028',
    tagline: 'Le sport en grandeur nature',
    emoji: '⚽',
    logo: '/assets/logos/wsl.png',
  },
}

export const PUBLICATION_LIST = Object.values(PUBLICATIONS)

// ─── Univers éditoriaux — Dossier technique §1.2 Module B ───────
export type UniverseKey =
  | 'actus' | 'people' | 'economie' | 'sports' | 'culture' | 'debats' | 'fact-checking'

export interface Universe {
  key: UniverseKey
  label: string
  path: string
  color: string
  description: string
  subcategories: string[]
}

export const UNIVERSES: Record<UniverseKey, Universe> = {
  actus: {
    key: 'actus',
    label: 'Les Actus',
    path: '/actus',
    color: '#006020',
    description: 'Actualités nationales, échos des régions, enquêtes et analyses.',
    subcategories: ['National', 'Régions', 'Enquêtes', 'Analyses', 'Tribunes', 'Agendas'],
  },
  people: {
    key: 'people',
    label: 'People',
    path: '/people',
    color: '#C4A35A',
    description: 'Portraits, invités, déclarations fortes et interviews.',
    subcategories: ['Portraits', 'Invités', 'Déclarations', 'Interviews', 'Tendance'],
  },
  economie: {
    key: 'economie',
    label: 'Économie',
    path: '/economie',
    color: '#00A0E0',
    description: 'Économie, entreprises, finances : le pouls des affaires au Cameroun.',
    subcategories: ['Entreprises', 'Finances', 'Marchés', 'Emploi', 'Énergie'],
  },
  sports: {
    key: 'sports',
    label: 'Sports',
    path: '/sports',
    color: '#E02020',
    description: 'Scores en direct, classements, résultats et jeunesse sportive.',
    subcategories: ['Football', 'Lions Indomptables', 'MTN Elite One', 'Basketball', 'Athlétisme'],
  },
  culture: {
    key: 'culture',
    label: 'Culture',
    path: '/culture',
    color: '#D4A843',
    description: 'Mode, arts, lifestyle et galeries photos signées Nyanga.',
    subcategories: ['Mode', 'Musique', 'Cinéma', 'Gastronomie', 'Lifestyle'],
  },
  debats: {
    key: 'debats',
    label: 'Débats',
    path: '/debats',
    color: '#004000',
    description: 'Talks, podcasts, sondages et tribunes libres.',
    subcategories: ['Talks', 'Podcasts', 'Sondages', 'Tribunes libres'],
  },
  'fact-checking': {
    key: 'fact-checking',
    label: 'Fact-Checking',
    path: '/fact-checking',
    color: '#0040A0',
    description: 'Vérification des informations et lutte contre les fake news.',
    subcategories: ['Vérifications', 'Fake news', 'Pédagogie', 'Signalements'],
  },
}

export const UNIVERSE_LIST = Object.values(UNIVERSES)
