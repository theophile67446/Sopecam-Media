import type { PubCode } from './publications'

// ─── Podcasts ───────────────────────────────────────────────────
export interface Podcast {
  id: string
  title: string
  show: string
  durationSec: number
  date: string
  publication: PubCode
  description: string
  seed: number
  /** Vignette WebP (fallback : couverture générative via seed). */
  cover?: string
}

export const PODCASTS: Podcast[] = [
  {
    id: 'p1',
    title: 'Souveraineté médiatique : le Cameroun peut-il porter son propre récit ?',
    show: 'Le Grand Débat',
    durationSec: 2540,
    date: '2026-07-17',
    publication: 'CT',
    description: 'Éditeurs, journalistes et chercheurs débattent de la place des médias nationaux face aux plateformes.',
    seed: 5,
  },
  {
    id: 'p2',
    title: 'Cacao, café, pétrole : la vraie richesse du Cameroun en 2026',
    show: 'Business Club',
    durationSec: 1860,
    date: '2026-07-15',
    publication: 'CBT',
    description: 'Analyse des filières exportatrices et des stratégies de transformation locale.',
    seed: 17,
  },
  {
    id: 'p3',
    title: 'Makossa forever : 70 ans de rythme doualaman',
    show: 'Nyanga Culture',
    durationSec: 2130,
    date: '2026-07-12',
    publication: 'NY',
    description: 'De Manu Dibango à la nouvelle scène urbaine, retour sur une légende musicale.',
    seed: 31,
  },
  {
    id: 'p4',
    title: 'CAN 2026 : les Lions peuvent-ils aller au bout ?',
    show: 'Vestiaire WSL',
    durationSec: 1620,
    date: '2026-07-14',
    publication: 'WSL',
    description: 'Décryptage tactique et pronostics de nos journalistes sportifs.',
    seed: 44,
  },
  {
    id: 'p5',
    title: 'Café Éco — Décryptage des marchés financiers de la zone CEMAC',
    show: 'Café Éco',
    durationSec: 1870,
    date: '2026-07-16',
    publication: 'CBT',
    description: 'Analyse des tendances monétaires, taux directeurs et perspectives pour les entreprises.',
    seed: 14,
  },
  {
    id: 'p6',
    title: 'Les Couleurs de Nyanga — Mode et artisanat : le renouveau du made in Cameroun',
    show: 'Nyanga Culture',
    durationSec: 1950,
    date: '2026-07-15',
    publication: 'NY',
    description: 'Créateurs, artisans et entrepreneurs de la mode camerounaise en pleine effervescence.',
    seed: 51,
  },
  {
    id: 'p7',
    title: 'Tribune des Sports — La formation des jeunes, clé du football camerounais',
    show: 'Vestiaire WSL',
    durationSec: 2420,
    date: '2026-07-18',
    publication: 'WSL',
    description: 'Débat sur les centres de formation, les investissements et la nécessité d\'un plan national.',
    seed: 78,
  },
  {
    id: 'p8',
    title: 'Insider Talk — Diplomatie africaine : quel rôle pour le Cameroun dans un monde multipolaire ?',
    show: 'Insider Talk',
    durationSec: 2150,
    date: '2026-07-19',
    publication: 'CI',
    description: 'Analyse géopolitique des alliances camerounaises entre partenaires traditionnels et émergents.',
    seed: 94,
  },
]

// ─── Vidéos ─────────────────────────────────────────────────────
export interface Video {
  id: string
  title: string
  duration: string
  views: number
  date: string
  publication: PubCode
  seed: number
  /** Vignette WebP (fallback : couverture générative via seed). */
  cover?: string
}

export const VIDEOS: Video[] = [
  {
    id: 'v1',
    title: 'Reportage — Kribi, le port qui change la donne',
    duration: '08:24',
    views: 45230,
    date: '2026-07-17',
    publication: 'CT',
    seed: 12,
  },
  {
    id: 'v2',
    title: 'Les coulisses de la Douala Fashion Week 2026',
    duration: '05:47',
    views: 28940,
    date: '2026-07-18',
    publication: 'NY',
    seed: 26,
  },
  {
    id: 'v3',
    title: 'Maroc 1-3 Cameroun : tous les buts des Lions',
    duration: '03:12',
    views: 128450,
    date: '2026-07-18',
    publication: 'WSL',
    seed: 39,
  },
  {
    id: 'v4',
    title: 'PayLék : dans les bureaux de la fintech qui monte',
    duration: '06:58',
    views: 17680,
    date: '2026-07-19',
    publication: 'CBT',
    seed: 58,
  },
  {
    id: 'v5',
    title: 'Documentaire — Sur la route du cacao : de la fève à la tablette',
    duration: '12:35',
    views: 34560,
    date: '2026-07-15',
    publication: 'CT',
    seed: 7,
  },
  {
    id: 'v6',
    title: 'Interview — Rebecca Enyegue : « Le moringa peut transformer l\'Est du Cameroun »',
    duration: '07:20',
    views: 12890,
    date: '2026-07-17',
    publication: 'NY',
    seed: 23,
  },
  {
    id: 'v7',
    title: 'Sports — Les plus beaux buts de la saison en MTN Elite One 2026',
    duration: '04:45',
    views: 67890,
    date: '2026-07-19',
    publication: 'WSL',
    seed: 40,
  },
  {
    id: 'v8',
    title: 'Enquête — Dans les coulisses de la Douane camerounaise au port de Douala',
    duration: '10:12',
    views: 21340,
    date: '2026-07-18',
    publication: 'CI',
    seed: 62,
  },
]

// Vignettes WebP disponibles pour tous les podcasts et vidéos
for (const p of PODCASTS) p.cover = '/assets/media/podcasts/' + p.id + '.webp'
for (const v of VIDEOS) v.cover = '/assets/media/videos/' + v.id + '.webp'

// ─── Photothèque ────────────────────────────────────────────────
export interface ArchivePhoto {
  id: string
  title: string
  photographer: string
  date: string
  event: string
  publication: PubCode
  seed: number
  src?: string // photo réelle de la photothèque
}

export const ARCHIVE_PHOTOS: ArchivePhoto[] = [
  { id: 'ph1', title: 'Le stade Japoma illuminé pour la CAN', photographer: 'Jean-Bosco Ela', date: '2026-06-28', event: 'CAN 2026', publication: 'WSL', seed: 3, src: '/assets/photos/ph1.webp' },
  { id: 'ph2', title: 'Marché Mokolo au petit matin', photographer: 'Aminatou Ahidjo', date: '2026-06-15', event: 'Vie quotidienne', publication: 'CT', seed: 9, src: '/assets/photos/ph2.webp' },
  { id: 'ph3', title: 'Récolte de cacao à Obala', photographer: 'Pierre Ndi', date: '2026-06-02', event: 'Campagne cacaoyère', publication: 'CBT', seed: 16, src: '/assets/photos/ph3.webp' },
  { id: 'ph4', title: 'Danse traditionnelle au festival Ngondo', photographer: 'Marlyse Abena', date: '2025-12-07', event: 'Festival Ngondo', publication: 'NY', seed: 22, src: '/assets/photos/ph4.webp' },
  { id: 'ph5', title: 'Pose de la première pierre du centre de données', photographer: 'Jean-Bosco Ela', date: '2026-03-11', event: 'Plan numérique', publication: 'CT', seed: 28, src: '/assets/photos/ph5.webp' },
  { id: 'ph6', title: 'Les Lionnes à l\'entraînement à Olembe', photographer: 'Sandrine Bekono', date: '2026-07-10', event: 'Préparation CAN', publication: 'WSL', seed: 34, src: '/assets/photos/ph6.webp' },
  { id: 'ph7', title: 'Fête nationale : la foule en liesse au centre-ville', photographer: 'Pierre Ndi', date: '2026-05-20', event: 'Fête nationale', publication: 'CT', seed: 41, src: '/assets/photos/ph7.webp' },
  { id: 'ph8', title: 'Couchers de soleil sur le mont Cameroun', photographer: 'Marlyse Abena', date: '2026-04-19', event: 'Patrimoine naturel', publication: 'NY', seed: 47, src: '/assets/photos/ph8.webp' },
  { id: 'ph9', title: 'Traders à la bourse de Douala', photographer: 'Kevin Njomo', date: '2026-06-24', event: 'Économie', publication: 'CBT', seed: 53, src: '/assets/photos/ph9.webp' },
  { id: 'ph10', title: 'Le fleuve Wouri au crépuscule', photographer: 'Aminatou Ahidjo', date: '2026-05-30', event: 'Patrimoine naturel', publication: 'CT', seed: 59, src: '/assets/photos/ph10.webp' },
  { id: 'ph11', title: 'Backstage avant le grand concert de l\'été', photographer: 'Marlyse Abena', date: '2026-07-05', event: 'Musique', publication: 'NY', seed: 65, src: '/assets/photos/ph11.webp' },
  { id: 'ph12', title: 'L\'explosion de joie des buteurs en Elite One', photographer: 'Kevin Njomo', date: '2026-07-17', event: 'MTN Elite One', publication: 'WSL', seed: 70, src: '/assets/photos/ph12.webp' },
  { id: 'ph13', title: 'Douala Fashion Week : le ndop triomphe sur le podium', photographer: 'Laurence Ekindi', date: '2026-07-18', event: 'Fashion Week', publication: 'NY', seed: 76, src: '/assets/photos/ph13.webp' },
  { id: 'ph14', title: 'Conseil des ministres à la présidence de la République', photographer: 'Pierre Ndi', date: '2026-07-15', event: 'Politique nationale', publication: 'CT', seed: 82, src: '/assets/photos/ph14.webp' },
  { id: 'ph15', title: 'Inauguration du nouveau marché moderne de Mfoundi', photographer: 'Aminatou Ahidjo', date: '2026-07-14', event: 'Infrastructures', publication: 'CT', seed: 90, src: '/assets/photos/ph15.webp' },
  { id: 'ph16', title: 'Séance de travail au siège de la BEAC à Yaoundé', photographer: 'Kevin Njomo', date: '2026-07-11', event: 'Économie', publication: 'CBT', seed: 95, src: '/assets/photos/ph16.webp' },
  { id: 'ph17', title: 'Chantier de la nouvelle zone industrielle de Douala', photographer: 'Kevin Njomo', date: '2026-06-28', event: 'Économie', publication: 'CBT', seed: 4, src: '/assets/photos/ph17.webp' },
  { id: 'ph18', title: 'Défilé de mode Nyanga — Collection automne-hiver 2026', photographer: 'Laurence Ekindi', date: '2026-07-16', event: 'Fashion Week', publication: 'NY', seed: 18, src: '/assets/photos/ph18.webp' },
  { id: 'ph19', title: 'Exposition d\'art contemporain à l\'espace Doual\'Art', photographer: 'Marlyse Abena', date: '2026-07-08', event: 'Art', publication: 'NY', seed: 30, src: '/assets/photos/ph19.webp' },
  { id: 'ph20', title: 'Entraînement des Lionnes sous les couleurs du Cameroun', photographer: 'Sandrine Bekono', date: '2026-07-12', event: 'Préparation CAN', publication: 'WSL', seed: 35, src: '/assets/photos/ph20.webp' },
  { id: 'ph21', title: 'Finale des play-offs de basketball — BEAC contre FAP', photographer: 'Kevin Njomo', date: '2026-07-19', event: 'Basketball', publication: 'WSL', seed: 43, src: '/assets/photos/ph21.webp' },
  { id: 'ph22', title: 'Conférence de presse au Palais des Congrès de Yaoundé', photographer: 'Pierre Ndi', date: '2026-07-10', event: 'Conférences', publication: 'CI', seed: 49, src: '/assets/photos/ph22.webp' },
  { id: 'ph23', title: 'Campagne de vaccination dans le district de santé de Yaoundé', photographer: 'Aminatou Ahidjo', date: '2026-07-18', event: 'Santé', publication: 'CT', seed: 57, src: '/assets/photos/ph23.webp' },
  { id: 'ph24', title: 'SOPECAM 50 ans — Photo de groupe de la rédaction', photographer: 'Jean-Bosco Ela', date: '2026-07-01', event: 'SOPECAM', publication: 'CT', seed: 67, src: '/assets/photos/ph24.webp' },
]

// ─── Partenaires ────────────────────────────────────────────────
export const PARTNERS = [
  { id: 'pt1', name: 'CAMTEL', sector: 'Télécommunications', logo: '/assets/partners/camtel.webp' },
  { id: 'pt2', name: 'Banque Atlantique', sector: 'Banque & Finance', logo: '/assets/partners/banque_atlantique.webp' },
  { id: 'pt3', name: 'Camair-Co', sector: 'Transport aérien', logo: '/assets/partners/camair-co.webp' },
  { id: 'pt4', name: 'MTN Cameroon', sector: 'Télécommunications', logo: '/assets/partners/mtn_cameroon.svg' },
  { id: 'pt5', name: 'Orange Cameroun', sector: 'Télécommunications', logo: '/assets/partners/orange_cameroun.svg' },
  { id: 'pt6', name: 'BEAC', sector: 'Banque centrale', logo: '/assets/partners/beac.webp' },
  { id: 'pt7', name: 'Université de Yaoundé I', sector: 'Enseignement supérieur', logo: '/assets/partners/universite_yaounde_i.webp' },
  { id: 'pt8', name: 'CANAL+ Afrique', sector: 'Audiovisuel', logo: '/assets/partners/canal_plus_afrique.svg' },
  { id: 'pt9', name: 'Afriland First Bank', sector: 'Banque & Finance', logo: '/assets/partners/afriland_first_bank.webp' },
]

// ─── Scores sportifs (page Sports) ─────────────────────────────
export interface MatchScore {
  id: string
  competition: string
  home: string
  away: string
  homeScore: number | null
  awayScore: number | null
  status: 'live' | 'finished' | 'upcoming'
  minute?: string
  date: string
}

export const MATCHES: MatchScore[] = [
  { id: 'm1', competition: 'CAN 2026 — Qualif.', home: 'Cameroun', away: 'Maroc', homeScore: 3, awayScore: 1, status: 'finished', date: 'Hier · 20:00' },
  { id: 'm2', competition: 'MTN Elite One', home: 'Canon Yaoundé', away: 'Aigle Moungo', homeScore: 1, awayScore: 0, status: 'finished', date: '17 juil. · 16:00' },
  { id: 'm3', competition: 'MTN Elite One', home: 'Colombe', away: 'Coton Sport', homeScore: 2, awayScore: 2, status: 'finished', date: '17 juil. · 16:00' },
  { id: 'm4', competition: 'Amical féminin', home: 'Cameroun (F)', away: 'France (F)', homeScore: null, awayScore: null, status: 'upcoming', date: '25 juil. · 19:30' },
  { id: 'm5', competition: 'Basket — Élite', home: 'FAP Yaoundé', away: 'BEAC BC', homeScore: 78, awayScore: 71, status: 'finished', date: '18 juil. · 18:00' },
  { id: 'm6', competition: 'Ligue des Champions CAF', home: 'Coton Sport', away: 'FAR Rabat', homeScore: null, awayScore: null, status: 'upcoming', date: '26 juil. · 19:00' },
  { id: 'm7', competition: 'Basketball — Élite (Play-offs)', home: 'BEAC BC', away: 'FAP Yaoundé', homeScore: 84, awayScore: 76, status: 'finished', date: '19 juil. · 20:00' },
  { id: 'm8', competition: 'Athlétisme — Meeting international', home: 'Cameroun', away: 'Kenya', homeScore: null, awayScore: null, status: 'upcoming', date: '2 août · 15:00' },
]

export const STANDINGS = [
  { pos: 1, team: 'Canon de Yaoundé', pts: 68, j: 30, g: 20, n: 8, p: 2 },
  { pos: 2, team: 'Colombe du Dja', pts: 66, j: 30, g: 19, n: 9, p: 2 },
  { pos: 3, team: 'Coton Sport', pts: 61, j: 30, g: 17, n: 10, p: 3 },
  { pos: 4, team: 'Union de Douala', pts: 57, j: 30, g: 15, n: 12, p: 3 },
  { pos: 5, team: 'Aigle du Moungo', pts: 52, j: 30, g: 14, n: 10, p: 6 },
  { pos: 6, team: 'PWD Bamenda', pts: 48, j: 30, g: 12, n: 12, p: 6 },
]

// ─── Indicateurs économiques (page Économie) ────────────────────
export const ECO_INDICATORS = [
  { label: 'Cacao (FCFA/kg)', value: '1 850', change: '+12,4 %', up: true },
  { label: 'Café robusta (FCFA/kg)', value: '1 420', change: '+6,1 %', up: true },
  { label: 'Pétrole Brent (USD)', value: '84,20', change: '-1,8 %', up: false },
  { label: 'Taux directeur BEAC', value: '5,00 %', change: 'stable', up: true },
  { label: 'Inflation CEMAC', value: '3,1 %', change: '-0,4 pt', up: true },
  { label: 'USD/XAF', value: '598,4', change: '+0,6 %', up: false },
  { label: 'Café arabica (FCFA/kg)', value: '2 100', change: '+3,2 %', up: true },
  { label: 'Bois (FCFA/m³)', value: '85 000', change: '-2,1 %', up: false },
  { label: 'Caoutchouc (FCFA/kg)', value: '780', change: '+5,8 %', up: true },
  { label: 'Or (FCFA/g)', value: '42 500', change: '+1,4 %', up: true },
]

export const ECO_CHART = [
  { month: 'Jan', value: 42 }, { month: 'Fév', value: 47 }, { month: 'Mar', value: 45 },
  { month: 'Avr', value: 53 }, { month: 'Mai', value: 58 }, { month: 'Juin', value: 61 },
  { month: 'Juil', value: 67 },
]

// ─── Sondages (page Débats) ─────────────────────────────────────
export const POLL = {
  id: 'poll1',
  question: 'Le numérique doit-il devenir la priorité nationale n°1 d\'ici 2030 ?',
  options: [
    { id: 'o1', label: 'Oui, absolument', votes: 1842 },
    { id: 'o2', label: 'Oui, mais après la santé', votes: 967 },
    { id: 'o3', label: 'Non, l\'agriculture d\'abord', votes: 534 },
    { id: 'o4', label: 'Sans opinion', votes: 121 },
  ],
  totalVotes: 3464,
}

// ─── Offres d'abonnement — Dossier technique §3.4 ───────────────
export interface Plan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlight?: boolean
  cible: string
}

export const PLANS: Plan[] = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: 0,
    period: '',
    description: 'Découvrez l\'essentiel de l\'information',
    features: ['3 articles gratuits par jour', 'Vidéos courtes', 'Newsletters gratuites', 'Commentaires'],
    cible: 'Grand public',
  },
  {
    id: 'standard',
    name: 'Package Standard',
    price: 2000,
    period: '/mois',
    description: 'L\'information illimitée au quotidien',
    features: ['Articles illimités', 'E-paper 7 jours', 'Sans compteur d\'articles', 'Application mobile'],
    cible: 'Particuliers',
  },
  {
    id: 'famille',
    name: 'Package Famille',
    price: 3500,
    period: '/mois',
    description: 'Un abonnement pour toute la maison',
    features: ['4 profils personnalisés', 'Articles illimités', 'E-paper complet', 'Contrôle parental'],
    cible: 'Familles',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 5000,
    period: '/mois',
    description: 'L\'expérience SOPECAM intégrale',
    features: ['Tout le Package Standard', 'Archives complètes (40 000+ photos)', 'Podcasts exclusifs', 'Navigation sans publicité', 'Contenus Premium réservés'],
    highlight: true,
    cible: 'Professionnels',
  },
  {
    id: 'institutionnel',
    name: 'Institutionnel',
    price: -1,
    period: '',
    description: 'Solutions pour organisations',
    features: ['Accès groupe multi-postes', 'Veille personnalisée', 'API de données', 'Support dédié 7j/7'],
    cible: 'Entreprises & Administrations',
  },
]

// ─── Éditions e-paper (unes réelles du groupe) ──────────────────
export interface EpaperEdition {
  id: string
  publication: PubCode
  title: string
  date: string
  pages: number
  headline: string
  price: number
  issue: string
  cover: string
}

export const EPAPER_EDITIONS: EpaperEdition[] = [
  {
    id: 'ep1',
    publication: 'CT',
    title: 'Cameroon Tribune — Quotidien',
    date: 'Vendredi 3 juillet 2026',
    pages: 32,
    headline: 'Réinsertion des ex-combattants : Pari gagnant',
    price: 400,
    issue: 'N° 13636 / 9835 · 53e année',
    cover: '/assets/covers/une-ct.webp',
  },
  {
    id: 'ep2',
    publication: 'CBT',
    title: 'Cameroon Business Today — Hebdo',
    date: '8 au 14 juillet 2026',
    pages: 32,
    headline: 'Niveau des prix : La pression retombe',
    price: 1000,
    issue: 'N° 468',
    cover: '/assets/covers/une-cbt.webp',
  },
  {
    id: 'ep3',
    publication: 'CI',
    title: 'Cameroon Insider — Bi-hebdo',
    date: 'Sunday 19 July 2026',
    pages: 28,
    headline: 'Digital Economy: Cameroon Unveils 2030 Roadmap',
    price: 400,
    issue: 'Issue N° 538 · Eighth Year',
    cover: '/assets/covers/une-ci-2026.webp',
  },
  {
    id: 'ep4',
    publication: 'NY',
    title: 'Nyanga — Mensuel',
    date: 'Juillet 2026',
    pages: 52,
    headline: 'Elizabeth Tchoungui : L\'icône de la justice sociale',
    price: 1500,
    issue: 'N° 230',
    cover: '/assets/covers/une-nyanga.webp',
  },
  {
    id: 'ep5',
    publication: 'WSL',
    title: 'Weekend Sports & Loisirs — Grand Format',
    date: '3 au 9 juillet 2026',
    pages: 24,
    headline: 'Vacances : Ça va chauffer !',
    price: 500,
    issue: 'N° 823',
    cover: '/assets/covers/une-wsl.webp',
  },
]

// ─── Unes d'archives (photothèque) ──────────────────────────────
export const ARCHIVE_COVERS = [
  {
    id: 'ac1',
    publication: 'CI' as PubCode,
    title: 'Cameroon Insider N° 479 — « Kribi Port In Search Of FCFA 1,312 Billion »',
    date: '29 avril 2024',
    cover: '/assets/covers/une-ci-2024.webp',
    collector: true,
  },
]

// ─── Comptes de démonstration — §3 du prompt MVP ────────────────
export interface DemoUser {
  email: string
  password: string
  name: string
  role: 'reader' | 'admin'
  plan: 'free' | 'standard' | 'famille' | 'premium' | 'institutionnel'
  credits: number
}

export const DEMO_USERS: DemoUser[] = [
  { email: 'demo@sopecam.cm', password: 'Demo2026!', name: 'Amina Demo', role: 'reader', plan: 'free', credits: 120 },
  { email: 'premium@sopecam.cm', password: 'Premium2026!', name: 'Olivier Premium', role: 'reader', plan: 'premium', credits: 500 },
  { email: 'admin@sopecam.cm', password: 'Admin2026!', name: 'Eric Admin', role: 'admin', plan: 'premium', credits: 999 },
]

// ─── Fact-checks (page dédiée) ──────────────────────────────────
export interface FactCheck {
  id: string
  claim: string
  verdict: 'VRAI' | 'FAUX' | 'TROMPEUR' | 'INVÉRIFIABLE'
  summary: string
  date: string
  articleSlug?: string
  seed: number
}

export const FACT_CHECKS: FactCheck[] = [
  {
    id: 'fc1',
    claim: '« Une vidéo montre des violences dans un bureau de vote à Yaoundé »',
    verdict: 'FAUX',
    summary: 'Les images proviennent d\'archives tournées au Nigéria en février 2023, détournées de leur contexte.',
    date: '19 juillet 2026',
    articleSlug: 'fake-news-video-truquee-elections',
    seed: 19,
  },
  {
    id: 'fc2',
    claim: '« Le prix du carburant a été divisé par deux ce week-end »',
    verdict: 'FAUX',
    summary: 'Aucun arrêté publié. Le document est un montage à partir d\'un communiqué de 2024.',
    date: '19 juillet 2026',
    articleSlug: 'verification-subvention-carburant-rumeur',
    seed: 45,
  },
  {
    id: 'fc3',
    claim: '« Le makossa est déjà inscrit au patrimoine de l\'UNESCO »',
    verdict: 'TROMPEUR',
    summary: 'Le dossier est validé au niveau national, mais la décision finale de l\'UNESCO n\'interviendra qu\'en 2027.',
    date: '17 juillet 2026',
    seed: 77,
  },
  {
    id: 'fc4',
    claim: '« La BEAC a baissé son taux directeur de 2 points »',
    verdict: 'FAUX',
    summary: 'Le taux directeur est maintenu à 5 %. Aucune modification annoncée lors du dernier comité.',
    date: '18 juillet 2026',
    seed: 88,
  },
  {
    id: 'fc5',
    claim: '« Le cacao camerounais a atteint son prix historique »',
    verdict: 'VRAI',
    summary: 'À 1 850 FCFA/kg au bord du champ, le record est confirmé par le Conseil national du cacao.',
    date: '19 juillet 2026',
    seed: 13,
  },
]
