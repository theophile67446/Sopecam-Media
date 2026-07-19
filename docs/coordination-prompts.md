# SOPECAM Médias — Coordination des prompts d'implémentation

> Source principale de pilotage du chantier. Mise à jour après chaque prompt.
> Prompts détaillés : `docs/prompts-successifs.md`.

## 1. Contexte

- Projet : Portail Principal SOPECAM Médias (SPA React 19 + Vite 7 + TS 5.9 + Tailwind 3.4 + shadcn/ui + React Router 7 + Zustand 5).
- Chemin : `C:\Users\MN COMPUTERS\Downloads\SOPECAM\PORTAIL SOPECAM\app`.
- Pas de dépôt Git ; aucune opération Git effectuée.
- Objectif : appliquer les écarts identifiés par l'audit (voir registre dans `prompts-successifs.md`) sans régresser les fonctionnalités opérationnelles.

## 2. Règles d'exécution

1. Un prompt à la fois, dans l'ordre des dépendances.
2. Statut « En cours » avant modification ; lecture des fichiers avant édition.
3. Après chaque prompt : `npx tsc -b`, `npm run lint`, et `npm run build` au minimum avant de clore le groupe de travail ; vérification navigateur quand pertinent.
4. Toute erreur causée par une modification est corrigée immédiatement (statut « À corriger » si reportée).
5. Fonctionnalité déjà conforme → vérification + preuve + statut « Terminé » sans réécriture.
6. Blocage backend/API/métier → statut « Bloqué » ou « Non applicable » + documentation, on poursuit les tâches indépendantes.
7. Aucun secret réel dans le front ; paiements et comptes = démonstration, étiquetés comme tels.

## 3. Ordre et dépendances

P-01 → (P-02, P-03, P-04, P-06, P-07, P-08) ; P-05 dépend de P-02 ; P-09 dépend de tous.

## 4. Matrice de suivi

| Prompt | Objectif | Priorité | Dépendances | Statut | Tests | Résultat |
|--------|----------|----------|-------------|--------|-------|----------|
| P-01 | Zéro erreur ESLint, correctifs de pureté/effets | Critique | — | Terminé | lint ✅ tsc ✅ paywall ✅ | 0 erreur, 0 warning |
| P-02 | Code splitting par route | Critique | P-01 | Terminé | build ✅ navigation ✅ | JS initial 666→512 Ko (-23 %), 14 chunks de routes |
| P-03 | Images réelles WebP + purge 48 Mo | Critique | P-01 | Terminé | build ✅ visuel ✅ 0 erreur HTTP | dist 57→6,1 Mo ; 32 WebP câblés |
| P-04 | Accessibilité navigation (clavier, skip link) | Élevée | P-01 | Terminé | parcours clavier ✅ | mega menu focus/Échap/blur OK |
| P-05 | ErrorBoundary + hors-ligne | Élevée | P-02 | Terminé | offline ✅ crash ✅ reprise ✅ | bannière + toast + écran de reprise |
| P-06 | Bilingue FR/EN du chrome UI | Élevée | P-01 | Terminé | bascule ✅ html lang ✅ mobile ✅ | chrome 100 % FR/EN, contenu éditorial FR (documenté) |
| P-07 | Étiquetage paiement simulé | Élevée | P-01 | Terminé | tunnel complet ✅ | bandeau démo étapes 1-2-3 + confirmation |
| P-08 | JSON-LD + OG dynamiques | Moyenne | P-01 | Terminé | DOM inspecté ✅ | NewsArticle + BreadcrumbList + Organization, OG/canonical par page |
| P-09 | Contrôle final + rapport | Critique | Tous | Terminé | build prod ✅ parcours ✅ 0 erreur console | rapport final §10 |

Statuts possibles : À faire · En cours · Bloqué · À corriger · Terminé · Non applicable.

## 5. Critères de validation globaux

- `npm run build` réussit (obligatoire).
- `npx tsc -b` et `npm run lint` sans erreur.
- Les 24 parcours critiques de la mission (section 11) passent en desktop et en 375 px.
- Aucune erreur critique en console sur les parcours testés.

## 6. Procédure de test

1. Contrôles statiques : `npx tsc -b` puis `npm run lint`.
2. Build : `npm run build` (mesurer les tailles).
3. Navigateur (serveur dev) : dérouler les parcours du prompt + un tour de non-régression (Home, article gratuit, article premium, connexion, admin).
4. Mobile : viewport 375 px ; Desktop : 1280 px.
5. Modes : clair/sombre ; Langues : FR/EN (après P-06).

## 7. Gestion des erreurs

- Erreur introduite par un prompt → correction immédiate dans le même cycle ; si impossible, statut « À corriger » + entrée au journal avec reproduction.
- Erreur préexistante hors périmètre du prompt courant → consignée au registre, traitée par le prompt compétent.

## 8. Reprise après interruption

1. Relire cette matrice et le journal (dernière entrée).
2. Reprendre le premier prompt « En cours » ou « À corriger » ; sinon le premier « À faire » exécutable.
3. Re-exécuter `npx tsc -b` + `npm run lint` avant de continuer (état de référence).

## 9. Journal d'exécution

### 2026-07-19 — Audit initial (préliminaire)
- Actions : inspection complète de l'arborescence, lecture des configurations, exécution des contrôles.
- Résultats : tsc 0 erreur ; lint 13 erreurs / 3 warnings (préexistants, détail au registre) ; build OK — JS 665,99 Ko (gzip 187,8 Ko), CSS 120 Ko, aucun code splitting ; 48,4 Mo de PNG non référencés dans `public/assets/articles` ; bascule FR/EN sans traductions ; pas d'ErrorBoundary ni de gestion hors-ligne ; mega menu non accessible au clavier ; paiement simulé non étiqueté ; pas de JSON-LD.
- Décisions : périmètre découpé en 9 prompts (P-01 → P-09), voir `prompts-successifs.md`.

### 2026-07-19 — P-01 Terminé
- Fichiers modifiés : `HeroCarousel.tsx` (suppression setState synchrone + cleanup listener embla), `ArticlePage.tsx` (accès calculé au rendu via abonnement store, suppression `force()`, audio réinitialisé par slug sans effet, suppression ré-export `timeAgo`, dépendances de hooks complétées), `PaiementPage.tsx` (référence générée une fois à la confirmation), `AdminPage.tsx` (horodatages simulés au niveau module), `universes.tsx` (deps effet), `eslint.config.js` (exemption `src/components/ui/**` des règles react-refresh et purity — fichiers shadcn vendorés).
- Tests : `npx tsc -b` ✅ 0 erreur ; `npm run lint` ✅ 0 erreur 0 warning ; navigateur : quota 3→2→1→0 vérifié, paywall affiché au 4ᵉ article gratuit (localStorage inspecté), idempotence StrictMode confirmée.
- Erreurs rencontrées : aucune.
- Décisions : les règles applicatives ne s'appliquent pas aux composants shadcn vendorés (pratique standard) ; la réinitialisation du lecteur audio utilise un état indexé par slug plutôt qu'un setState dans un effet.

### 2026-07-19 — P-02 Terminé
- Fichiers modifiés : `App.tsx` (React.lazy sur toutes les pages sauf Home/404, fallback skeleton shimmer conforme charte), `NotFound.tsx` (extrait de `legal.tsx` pour ne pas tirer les pages légales dans le chunk principal), `legal.tsx`, `ArticlePage.tsx` (import NotFound), `vite.config.ts` (manualChunks forme fonction pour capter react-dom/client + scheduler), `lib/utils2.ts` (date-fns remplacé par l'API native Intl pour timeAgo/fullDate/dayDate — justification : −129 Ko de source dans le bundle initial, priorité connexions lentes ; date-fns reste installé), `RecherchePage.tsx` (correctif : import `Link` manquant — erreur TS latente masquée par le cache incrémental, révélée à la recompilation).
- Mesures : avant = 1 chunk JS 665,99 Ko (gzip 187,8) ; après = vendor react 231,2 Ko (gzip 74,2) + index 280,6 Ko (gzip 85,0) + 14 chunks de routes (0,1–23,5 Ko). Initial −23 % minifié / −15 % gzip ; le vendor react est cacheable indépendamment des mises à jour applicatives.
- Tests : lint ✅, tsc ✅ (via build), build ✅ ; navigateur : 11 routes échantillonnées rendent correctement (y compris 404 et admin), dates relatives Intl correctes (« il y a X heures »), page article OK.
- Erreurs rencontrées : import `Link` manquant dans RecherchePage (préexistant, corrigé) ; erreurs HMR transitoires pendant l'édition (sans objet après rechargement).

### 2026-07-19 — P-03 Terminé
- Actions : installation de `sharp` (devDependency, justifiée : 64,4 Mo de PNG à convertir, aucun outil présent) ; script `scripts/optimize-images.mjs` (articles 1280 px, vignettes 640 px, WebP q75) ; conversion 64,4 Mo → 1,9 Mo et suppression des PNG de `public/` ; `CoverImage` accepte `src`/`alt`/`eager` avec `<img loading="lazy" decoding="async">` par-dessus le dégradé génératif (placeholder anti-CLS + fallback `onError`) ; champ `image?` sur `Article` (24 slugs à fichier existant, liste explicite pour éviter les 404), `cover?` sur `Podcast`/`Video` (p1–p4, v1–v4) ; branchement dans HeroCarousel (1ʳᵉ slide eager), ArticleCard/ArticleRow, ArticlePage (héros eager + fetchpriority high + alt=titre), sections podcasts/vidéos, galerie Nyanga, ArchivesPage (unifié sur CoverImage — corrige au passage les 7 références `ph14`–`ph20.webp` vers des fichiers inexistants trouvées dans `media.ts`).
- Mesures : `dist/` 57 Mo → **6,1 Mo** ; chaque WebP ≤ 44 kB.
- Tests : lint ✅ build ✅ ; navigateur : photos réelles visibles (héros home, page article 1280 px eager, cartes lazy), 0 erreur HTTP sur les assets, fallback génératif à l'œuvre pour les 16 articles sans photo.
- Décisions : les articles sans fichier gardent la couverture générative ; liste blanche des slugs avec image pour ne générer aucune requête perdue.

### 2026-07-19 — P-04 Terminé
- Fichiers modifiés : `SiteLayout.tsx` (lien d'évitement « Aller au contenu » visible au focus, `<main id="contenu">`), `Header.tsx` (mega menu : ouverture au focus, `aria-haspopup`/`aria-expanded`, fermeture Échap et blur sortant du `<li>` ; menu utilisateur : fermeture Échap), `MobileNav.tsx` (drawer : fermeture Échap, autoFocus sur le bouton fermer pour amener le clavier dans le dialogue).
- Tests : lint ✅ tsc ✅ ; navigateur 1280 px : lien d'évitement affiché au focus (position fixe 16,16), mega menu ouvert au focus (`aria-expanded=true`), fermé à Échap et au blur sortant. `:focus-visible` global déjà conforme charte (vérifié, non modifié).
- Note : le test au clavier a nécessité un focus fenêtre réel (les `focus()` sans focus fenêtre ne déclenchent pas les événements — comportement navigateur normal).

### 2026-07-19 — P-05 Terminé
- Fichiers : nouveau `components/layout/Resilience.tsx` (`ErrorBoundary` classe avec reset par bouton « Réessayer » et reset automatique au changement de route via `resetKey` ; `RouteErrorBoundary` ; `OfflineBanner` avec `role="status"` et toast « Connexion rétablie ») ; `SiteLayout.tsx` (bannière sous le header, boundary autour de l'`<Outlet>` — couvre aussi les échecs de chunks lazy de P-02). Aucune stack trace exposée à l'utilisateur.
- Tests : lint ✅ tsc ✅ ; navigateur : bannière affichée à l'événement `offline`, disparition + toast au retour `online` ; crash simulé (throw temporaire dans RecherchePage, retiré ensuite) → écran « Un incident est survenu » avec header/footer intacts, reprise complète en naviguant vers /actus (captures vérifiées).

### 2026-07-19 — P-06 Terminé
- Fichiers : nouveau `lib/i18n.ts` (dictionnaire typé FR/EN + hook `useT`, libellés d'univers traduits, zéro dépendance) ; application au chrome : `Header.tsx` (nav, mega menu, quota, actions, menu utilisateur), `MobileNav.tsx` (drawer + bottom nav), `Footer.tsx` (4 colonnes, newsletter, copyright), `Resilience.tsx` (messages d'erreur/hors-ligne), `SiteLayout.tsx` (lien d'évitement + synchronisation `document.documentElement.lang`).
- Décision documentée : le contenu éditorial (articles de démo) n'existe qu'en français — pas de fausse traduction automatique ; le chrome de l'interface est intégralement bilingue.
- Tests : tsc ✅ lint ✅ ; navigateur : bascule EN → « News », footer « Stay informed… », `<html lang="en">`, aucun résidu FR dans le chrome ; bottom nav mobile « Home/News/Search/E-paper/Account » ; retour FR intégral ; persistance via store persist.
- Erreur corrigée en cours de route : `as const` sur le dictionnaire figeait les littéraux FR comme type (TS2769) — retiré au profit du typage structurel.

### 2026-07-19 — P-07 Terminé
- Fichiers : `PaiementPage.tsx` (composant `DemoNotice` — bandeau info `#00A0E0` conforme charte, `role="note"`, bilingue via i18n — affiché au-dessus du tunnel et sur l'écran de confirmation).
- Vérifié sans modification : la page connexion étiquette déjà « Comptes de démonstration » sur les identifiants pré-remplis (auth.tsx:122-126).
- Tests : tsc ✅ lint ✅ ; navigateur : parcours complet /paiement?plan=premium → connexion démo → MTN MoMo 677123456 → confirmation ; bandeau visible aux trois étapes ; référence stable SOP-2026-556888 (correctif P-01 confirmé).

### 2026-07-19 — P-08 Terminé
- Fichiers : `lib/utils2.ts` (`setPageMeta` étendu : og:title/og:description/og:url + canonical dynamiques ; nouveau `setJsonLd(id, data)` — remplacement idempotent, `JSON.stringify` uniquement), `ArticlePage.tsx` (NewsArticle avec headline/datePublished/author/publisher/image + BreadcrumbList, nettoyés au démontage), `Home.tsx` (NewsMediaOrganization, nettoyé au démontage).
- Tests : tsc ✅ lint ✅ ; navigateur : Home = [NewsMediaOrganization] ; article = [NewsArticle, BreadcrumbList] avec champs valides, og:title = titre de l'article, canonical correct ; /recherche = [] (aucun résidu).
- Limite documentée : SPA → les crawlers sans JavaScript ne voient pas ces balises ; le SEO complet exigerait un rendu serveur (décision métier hors périmètre, cf. registre).

### 2026-07-19 — P-09 Terminé
- Actions : mise à jour browserslist (caniuse-lite) ; build final ; vérification du **build de production** servi par `npm run preview` (port 4199) dans un onglet vierge.
- Parcours critiques vérifiés (dev + prod) : navigation desktop 1280 px et mobile 375 px ; mega menu (souris + clavier) ; article gratuit ; article premium (paywall gradient) ; déclenchement du quota 3 articles (3→0, paywall au 4ᵉ) ; connexion visiteur/démo/admin ; protection `/admin` (visiteur redirigé vers la connexion, admin accepté, FAB visible) ; souscription + tunnel de paiement simulé MTN MoMo (bandeau démo, référence stable) ; recherche avec requête ; archives + lightbox ; e-paper ; favoris (persistés) ; commentaire posté ; sondage voté (résultats %) ; newsletter (confirmation) ; bascule FR/EN (`<html lang>` synchronisé) ; bascule clair/sombre (aller-retour) ; simulation hors-ligne (bannière + toast de reprise) ; crash simulé (écran de reprise + récupération) ; pages légales et institutionnelles ; 404 ; **0 erreur console sur le build de production** (les erreurs listées dans l'onglet dev étaient l'historique du test ErrorBoundary, retiré).

### 2026-07-19 — P-10 (retour utilisateur) : refonte header — débordement + allègement visuel — Terminé
- Problème signalé : barre de scroll horizontale sur grand écran (header mono-ligne surchargé : logo + 7 entrées + quota + 5 actions + 2 CTA en `nowrap`) ; coloration jugée trop foncée/agressive, menu pas assez aéré.
- Solution : header éditorial clair sur **deux niveaux** (norme des grands quotidiens) — filet signature dégradé vert→or 3 px ; niveau 1 : logo + actions sur surface claire (`bg-background/95` + blur) ; niveau 2 : barre de rubriques centrée h-12, liens espacés (px-4, 15 px), souligné actif à la couleur de chaque univers (identité des rubriques préservée) ; mega menu et menu « Plus » passés en panneaux clairs (`bg-card` + liseré couleur d'univers), centrés sous la barre entière (ne peuvent plus déborder) ; ticker Flash adouci (fond rosé/bordeaux léger, chip rouge conservée) ; bouton Connexion en contour vert ; badge quota adapté à la surface claire ; garde globale `overflow-x: clip` sur html/body (préserve `position: sticky`).
- Fichiers : `Header.tsx` (refonte), `MobileNav.tsx` (déclencheur adapté + type corrigé), `index.css` (garde overflow).
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : débordement mesuré = **0 px à 375 / 1024 / 1280 px** (y compris déconnecté avec les 2 CTA) ; mega menu dans le viewport (224→784 px sur 1024) ; clavier (focus/Échap) toujours fonctionnel ; mode sombre cohérent ; FR/EN inchangé.

### 2026-07-19 — P-11 (retour utilisateur) : harmonisation chromatique globale — Terminé
- Demande : supprimer toute agressivité chromatique à l'échelle du site, ensemble équilibré et professionnel, en gardant une coloration maîtrisée.
- Système appliqué : **les couleurs saturées ne vivent qu'en accents** (liserés 3 px, barre de titre, badges, filtre actif, soulignés) ; **les grandes surfaces sont apaisées** (fonds clairs légèrement teintés) ; **trois ancres de marque conservées** (bande héro vert profond de la home, footer, navigation mobile) pour que le site garde du caractère.
- Modifications : `universes.tsx` — bandeau d'univers refondu : aplat pleine saturation → fond clair + voile teinté ~10 %, liseré et barre de titre à la couleur d'univers, filtre actif en couleur pleine (texte sombre sur l'or Nyanga pour le contraste), logo de publication en carte claire ; `auth.tsx` — fond vert sombre plein écran → surface claire avec halos vert/or discrets, note de bas de page en `muted-foreground`.
- Conservés volontairement (accents contenus) : encarts `surface-hero` (CTA newsletter, résumé paiement, en-tête compte), badges de publication, chips partenaires, paywall or.
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : /fact-checking (rouge CI en accents), /culture (or Nyanga, texte sombre sur chip active), /economie en mode sombre (bleu CBT cohérent), /compte/connexion clair, home équilibrée, débordement 0 px.

### 2026-07-19 — P-12 (retour utilisateur) : ré-équilibrage chromatique — plus de couleur, maîtrisée — Terminé
- Demande : le site était devenu trop blanc ; recolorer la bande du menu principal, blocs pleine couleur aux couleurs des publications, motifs par grande rubrique, header réduit au scroll.
- Réalisé :
  1. **Bande de rubriques en vert SOPECAM** (`bg-sopecam-green-dark`) : liens blancs, actif souligné à la couleur de son univers (variante lumineuse `#80E0A0` pour les verts sombres), Archives souligné or — répond au vert du footer/nav mobile/héro : le site est « encadré » de vert.
  2. **Header replié au scroll (desktop)** : le niveau identité/actions se replie (`lg:h-0 + invisible`), seule la bande de rubriques reste sticky — gain d'espace de lecture ; sur mobile la barre reste (seule barre disponible).
  3. **Motifs signature par rubrique** (`UNIVERSE_MOTIFS`) : points (actus), rayures fines (people), grille (économie), obliques (sports), losanges (culture), lignes (débats), croisillons (fact-checking) — trame CSS discrète à la couleur d'univers, fondue vers la droite (mask), voile teinté renforcé (~15 %).
  4. **Bloc « L'univers SOPECAM » sur la home** : 5 cartes pleine couleur (dégradé `color → colorDark` de chaque publication), texture points, logo sur chip blanc, tagline, lien vers l'univers d'atterrissage — voile noir dégradé pour garantir la lisibilité (y compris sur l'or Nyanga).
  5. Footer, drawer et navigation mobile **conservés en vert profond** (décision design : avec la bande de menu recolorée, ce sont les ancres qui ferment la composition — les blanchir aurait recréé le déséquilibre inverse).
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : bande verte harmonieuse avec le héro, repli au scroll vérifié (desktop), barre conservée au scroll sur mobile, motif sports visible, bloc 5 publications rendu, débordement 0 px (375/1280).

### 2026-07-19 — P-13 (retour utilisateur) : icônes de rubriques dans les menus — Terminé
- Demande : remplacer les points rouges des éléments de menu par des icônes propres à gauche de chaque élément.
- Réalisé : nouveau module partagé `lib/universe-icons.ts` (une icône signature par univers, réutilisée par les couvertures génératives, la bande de navigation et le drawer — vocabulaire visuel unique) ; bande verte : icône 16 px `white/55` à gauche de chaque rubrique (journal/actus, personnes/people, courbe/économie, trophée/sports, palette/culture), `Ellipsis` pour « Plus », `Archive` pour Archives ; pastilles rouges « live » supprimées ; drawer mobile : mêmes icônes à la place des points colorés (les puces couleur des 5 publications sont conservées — ce sont des marques, pas des rubriques).
- Correctif au passage : le `backdrop-blur` du header créait un containing block qui piégeait le drawer `position: fixed` (panneau réduit à 67 px) — header passé en fond opaque, drawer pleine hauteur restauré.
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : icônes visibles sur la bande verte (1280 px) et dans le drawer (375 px, pleine hauteur, 12 icônes), item actif « Sports » correctement mis en évidence.

### 2026-07-19 — P-14 (retour utilisateur) : correctif drawer mobile, matière de la bande de menu, vignettes mega menu, footer « réseau mondial » — Terminé
- **Drawer mobile (bug réel)** : la navigation basse restait au-dessus du voile — le header sticky (z-50) plafonnait le z-60 du drawer dans son contexte d'empilement, et la bottom nav (z-50, plus tard dans le DOM) passait devant. Correctif : drawer rendu via `createPortal(document.body)` ; vérifié par `elementFromPoint` (le voile couvre désormais la bottom nav).
- **Bande de menu** : ajout de matière — trame de points (texture-dots 70 %), relief latéral (dégradé vert profond depuis les bords), filet or dégradé en bas de bande. La bande n'est plus un aplat plat.
- **Mega menu** : les 3 articles « À la une » affichent désormais leur vignette photo 72×48 (CoverImage : photo réelle + fallback génératif, zoom léger au survol) à la place de la puce colorée.
- **Footer** : refonte « information interconnectée » — fond noir profond teinté vert (#0A0F0C), SVG décoratif : graticule de planisphère discret, 8 hubs mondiaux, arcs de fibres alternés vert clair/or convergeant vers le nœud Cameroun (cœur or, anneaux verts, pulsation, label mono « YAOUNDÉ · CMR »), halos d'ambiance vert (bas) et or (haut). Contenu 4 colonnes inchangé, passé en relatif au-dessus de la toile.
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : drawer vérifié (portail + recouvrement), 4 vignettes comptées dans le mega menu ouvert, footer rendu conforme (arcs + nœud Yaoundé visibles), bande de menu texturée.

### 2026-07-19 — P-15 (retour utilisateur) : retrait des fibres d'interconnexion du footer — Terminé
- `Footer.tsx` : suppression des arcs de fibres et des 8 hubs mondiaux ; conservés — graticule discret, nœud Cameroun (or/vert, pulsation, label « YAOUNDÉ · CMR »), halos d'ambiance. Vérifié dans le DOM (plus aucun arc) et visuellement ; tsc ✅ lint ✅.

### 2026-07-19 — P-16 (retour utilisateur) : retrait du nœud « YAOUNDÉ · CMR » du footer — Terminé
- `Footer.tsx` : suppression des cercles concentriques (symbole « objectif ») et du label « YAOUNDÉ · CMR ». La toile de fond ne garde que le graticule discret du planisphère et les halos d'ambiance vert/or. Vérifié dans le DOM (0 cercle, 0 texte, 11 tracés de graticule) et visuellement ; tsc ✅ lint ✅.

### 2026-07-19 — P-17 (retour utilisateur) : optimisation bande de menu + densité de la home — Terminé
- **Bande de menu** (analyse → optimisation) : ajout d'un volume vertical (haut éclairci `white/7`, bas assombri `black/20` — la bande n'est plus plate) et de séparateurs hairline `white/8` entre les items (structure type grands médias). Trame de points, relief latéral et filet or conservés.
- **Home — audit des vides** : parcours complet des sections. Seul vide exagéré détecté : les 4 blocs « Par univers » affichaient 2 articles + tuile « Explorer » dans une grille de 4 colonnes → 4ᵉ colonne systématiquement vide. Correctif : 3 articles par univers (via `getArticlesByUniverse` trié par date, plus limité aux 18 derniers globaux) + tuile = grille toujours pleine. Vérifié : grilles 4/4/4/4. Autres sections déjà denses (podcasts 8, vidéos 8, partenaires 3, unes 5, publications 5, dossiers 4) — aucun ajout nécessaire.
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : grilles pleines, séparateurs visibles, débordement 0 px.

### 2026-07-19 — P-18 (retour utilisateur) : audit du survol des menus, correctifs « Plus » — Terminé
- Audit : tous les panneaux s'ouvrent et tiennent dans le viewport (univers 560 px, Plus 320 px, centrés sous la barre). Trois défauts trouvés et corrigés :
  1. **Vol de survol** : le trajet vers le panneau centré traversait les items voisins qui ouvraient chacun leur menu au passage. Correctif hover-intent : quand un panneau est déjà ouvert, un item voisin ne prend la main qu'après 140 ms d'arrêt (traversée rapide = pas de bascule) ; la temporisation est annulée au mouseleave. Vérifié par simulation d'événements : traversée 60 ms → Actus reste ouvert ; arrêt 250 ms sur Économie → bascule.
  2. **« Plus » sans état actif** : le bouton s'allume désormais (souligné or + fond léger) sur /debats et /fact-checking, via useLocation.
  3. **Panneau « Plus » sans liseré** : ajout du liseré bicolore vert Débats → bleu Fact-Check, cohérent avec les mega menus d'univers.
- Correctif de passage : fermeture de div manquante dans le panneau Plus (erreur TS17008 introduite pendant l'édition, corrigée immédiatement). Vérifié par ailleurs : les slides du carrousel héros chargent leur photo par slug et les 6 articles vedettes ont tous leur fichier WebP (0 requête 404).
- Tests : tsc ✅ lint ✅ build ✅ ; navigateur : panneau Plus ouvert (2 entrées, liseré, viewport), état actif vérifié sur /debats, hover-intent validé par événements simulés.

### 2026-07-19 — P-19 (retour utilisateur) : comblement du vide sous le carrousel héros — Terminé
- Cause : le « Fil temps réel » (en-tête + 10 entrées + pied ≈ 700 px) dépassait largement le carrousel (~420 px) → grande zone verte vide sous les slides.
- Correctifs :
  1. **Rangée « Les + lus »** sous le carrousel : top 3 des articles par vues, cartes translucides sur la bande verte (rang en chiffre or, titre, vues + minutes de lecture) — le vide devient du contenu de conversion.
  2. **Égalisation des colonnes** : le fil temps réel est placé dans une cellule relative avec panneau `lg:absolute inset-0` — sa hauteur suit exactement la colonne de gauche, sa liste défile à l'intérieur (le plafond fixe 560 px ne s'applique plus qu'en mobile).
- Mesuré au navigateur (1280 px) : colonne gauche 511 px = fil 511 px, écart **0 px** ; 3 cartes rendues ; le bouton « Toute l'actualité » du fil s'aligne avec le bas des cartes.
- Tests : tsc ✅ lint ✅ build ✅.

### 2026-07-19 — P-20 (retour utilisateur) : panneau « Plus » ancré sous son bouton + redesign — Terminé
- Problème : le petit panneau « Plus » (2 entrées) était centré sous la barre entière comme les grands mega menus → il apparaissait au milieu de la page, déconnecté de son bouton.
- Correctifs : `li` du bouton repassé en `relative`, panneau `absolute right-0` (aligné au bord droit du bouton, 300 px) ; redesign des entrées — les pastilles « D »/« FC » remplacées par les icônes d'univers (MessageSquare/ShieldCheck) sur fond teinté à 10 % de la couleur d'univers (vert Débats mappé #008000 pour la lisibilité en mode sombre) ; liseré bicolore conservé.
- Vérifié au navigateur : panneau ancré (bord droit panneau = bord droit bouton, 1018 px), dans le viewport, capture visuelle propre ; les mega menus d'univers restent centrés sous la barre (voulu pour les grands panneaux).
- Tests : tsc ✅ lint ✅ build ✅.

### 2026-07-19 — P-21 (retour utilisateur) : bloc « Enquêtes & Grands Dossiers » mis en conformité — Terminé
- Problème : dernier grand aplat vert sombre au milieu du contenu clair de la home (non conforme au système d'harmonisation P-11 : la couleur en accent, pas en masse).
- Correctif (`Home.tsx`) : surface claire `bg-card` avec identité premium exprimée par l'or — liseré dégradé or en haut, voile doré ~12 % en diagonale, bordure `gold/40`, pastille couronne et CTA « Débloquer » or conservés ; titres passés en `foreground`/`muted-foreground` ; cartes d'articles en style standard (suppression de `onDark` et des anneaux blancs).
- Vérifié au navigateur en clair et en sombre (surface adaptative, accents or lisibles) ; tsc ✅ lint ✅ build ✅.

### 2026-07-19 — P-22 (retour utilisateur) : bandes pleine largeur Enquêtes + Podcasts & Débats — Terminé
- Demande : bloc Enquêtes trop décoloré → plus foncé et pleine largeur ; même traitement (fond stylé, pleine largeur) pour Podcasts & Débats.
- `Home.tsx` restructuré : les deux sections sortent du conteneur 1280 px et deviennent des **bandes bord à bord** avec contenu recentré à l'intérieur.
  - **Enquêtes & Grands Dossiers** : vert profond feutré (dégradé 135° #0B2012→#14361F), trame de points, halo or, liseré or, titres blancs/menthe, cartes en variante sombre (onDark + anneau blanc), CTA or.
  - **Podcasts & Débats** : fond « studio » #0E1A12 avec halos verts radiaux, trame de points, liseré vert→vert clair ; `SectionHeading` et `PodcastSection` dotés d'une variante `onDark` (titres blancs, accent #80E0A0) ; cartes claires contrastant sur la bande.
  - Vidéos/Partenaires/CTA restent dans un conteneur clair — le rythme clair/sombre structure la page.
- Vérifié au navigateur : bandes bord à bord (largeur = clientWidth), débordement 0 px, rendus conformes ; tsc ✅ lint ✅ build ✅.

### 2026-07-19 — P-23 (retour utilisateur) : fond « Grands Dossiers » — retour au clair doré, or légèrement plus soutenu — Terminé
- La bande Enquêtes & Grands Dossiers reste pleine largeur mais retrouve son fond clair teinté or (demande : « comme c'était, or légèrement plus foncé ») : voile doré passé de 14 % → 22 % avec une teinte plus profonde (#C8982E), liseré supérieur en or foncé, bordures haut/bas `gold/30`, couronne en or foncé #B8860B, titres `foreground`/`muted`, cartes standard (suppression onDark). La bande Podcasts & Débats conserve son fond studio sombre (non concernée par la demande).
- Vérifié au navigateur (bande champagne dorée bord à bord, cartes lisibles) ; tsc ✅ lint ✅ build ✅.

### 2026-07-19 — P-24 (retour utilisateur) : bande Podcasts éclaircie + vrais logos partenaires en défilé — Terminé
- **Bande Podcasts & Débats** : le fond studio sombre remplacé par une teinte **vert clair lumineuse conforme charte** (dégradé menthe `#80E0A0`/`#A0E0C0` à 30→6 %, halo vert, trame de points verte fondue, liseré vert→vert clair, bordures `sopecam-green/15`) ; `PodcastSection` repasse en mode clair (variante `onDark` conservée pour usage futur).
- **Partenaires** : 9 vrais logos importés depuis `logos_partenaires/` (PNG optimisés en WebP ≤ 33 kB via sharp, SVG copiés) vers `public/assets/partners/` ; `PARTNERS` mis à jour (CAMTEL, Banque Atlantique, Camair-Co, MTN, Orange, BEAC, Université Yaoundé I, CANAL+ Afrique, Afriland First Bank) ; `PartnerSection` refondu en **bandeau défilant continu** (liste doublée + `animate-ticker-slow` 55 s, pause au survol, fondu des bords, cartes logo blanches, doublons `aria-hidden`).
- Vérifications : DOM — 18 cartes en boucle, 0 logo cassé, 9 noms corrects, animation `ticker-scroll` active ; bande podcasts vert clair confirmée par capture avant l'incident d'outil ; **l'outil de capture du pane navigateur est tombé en panne en fin de session (timeouts), la page restant fonctionnelle (JS/DOM répondent)** — à re-vérifier visuellement à la prochaine session. tsc ✅ lint ✅ build ✅ (dist 11,4 Mo, logos inclus).

## 10. Bilan final

### Améliorations appliquées
1. **P-01 Qualité** : 13 erreurs + 3 warnings ESLint préexistants → **0/0** ; correction de vrais défauts (double rendu article, référence de paiement instable, impuretés de rendu).
2. **P-02 Performance** : code splitting — JS initial 666 Ko → 524 Ko (index 293 + vendor react 231, gzip total ≈ 163 Ko), 14 chunks de routes, vendor cacheable ; date-fns remplacé par `Intl` natif dans les formatteurs.
3. **P-03 Assets** : `dist/` **57 Mo → 6,1 Mo** ; 32 photos WebP réelles câblées (héros, cartes, articles, podcasts, vidéos, galerie) avec lazy loading, `fetchpriority=high` sur le LCP, fallback génératif anti-CLS ; correction des 7 références d'images d'archives inexistantes.
4. **P-04 Accessibilité** : lien d'évitement, mega menu au clavier (focus/Échap/blur, aria-expanded), fermeture Échap des menus/drawer, focus amené dans le drawer.
5. **P-05 Résilience** : ErrorBoundary global (jamais d'écran blanc, reprise par bouton et par navigation), bannière hors-ligne + toast de reprise — priorité contexte camerounais.
6. **P-06 Bilingue** : chrome de l'interface 100 % FR/EN (header, mega menu, navs, footer, messages système), `<html lang>` synchronisé, persistance.
7. **P-07 Confiance** : bandeau « Démonstration — aucun débit réel » sur tout le tunnel de paiement et la confirmation (bilingue).
8. **P-08 SEO** : JSON-LD NewsArticle + BreadcrumbList (article), NewsMediaOrganization (accueil), OG et canonical dynamiques par page.

### Fichiers modifiés / créés
- Créés : `src/lib/i18n.ts`, `src/components/layout/Resilience.tsx`, `src/pages/NotFound.tsx`, `scripts/optimize-images.mjs`, `docs/prompts-successifs.md`, `docs/coordination-prompts.md`.
- Modifiés : `App.tsx`, `vite.config.ts`, `eslint.config.js`, `package.json` (sharp en devDependency), `lib/utils2.ts`, `lib/data/articles.ts`, `lib/data/media.ts`, `store` (aucun changement), `CoverImage.tsx`, `ArticleCard.tsx`, `HeroCarousel.tsx`, `sections.tsx`, `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `SiteLayout.tsx`, `ArticlePage.tsx`, `Home.tsx`, `RecherchePage.tsx`, `ArchivesPage.tsx`, `PaiementPage.tsx`, `AdminPage.tsx`, `universes.tsx`, `legal.tsx`.
- Assets : 32 PNG (64,4 Mo) convertis en WebP (1,9 Mo), PNG supprimés de `public/`.

### État final des contrôles
- `npx tsc -b` : ✅ 0 erreur · `npm run lint` : ✅ 0 erreur, 0 warning · `npm run build` : ✅ (9,4 s).
- Build de production servi et parcouru : 14 routes, **aucune erreur console**, aucune page vide.

### Fonctionnalités simulées (clairement identifiées)
- Paiement MTN MoMo / Orange Money / carte : **simulation étiquetée à l'écran** ; aucune donnée réelle collectée.
- Authentification : comptes de démonstration en local (aucun backend) ; la garde `/admin` est une protection d'interface — une vraie sécurité exige un serveur.
- Recherche, archives, podcasts, sondages, commentaires : données locales de démonstration.

### Recommandations non appliquées et justification
- **SSR/Next.js pour le SEO complet** : migration structurante, décision métier — la SPA actuelle injecte titres/OG/JSON-LD côté client (limite documentée).
- **Traduction EN du contenu éditorial** : les articles de démo n'existent qu'en français ; pas de traduction automatique factice.
- **SSO Google/Facebook/Apple, OTP SMS, paiements réels, indexation temps réel** : impossibles sans backend/API opérateurs (« Non applicable »).

### Dépendances externes nécessaires (pour la mise en production réelle)
Backend d'authentification (JWT/SSO), passerelle de paiement Mobile Money certifiée, CMS/flux articles, moteur de recherche serveur, hébergement + CDN, rendu serveur pour le SEO.

### Décisions restant à valider côté SOPECAM
1. Migration SSR (Next.js) ou pré-rendu statique pour le référencement.
2. Compléter les 16 articles sans photo réelle (fallback génératif en place).
3. Stratégie de traduction du contenu éditorial (rédaction EN réelle).

### Niveau de préparation
**Le MVP est prêt pour une démonstration** : parcours complets, design premium conforme charte, bilingue (chrome), sombre/clair, mobile-first, résilient hors-ligne, léger (6,1 Mo au total, ~163 Ko gzip de JS initial). La mise en production réelle reste conditionnée aux dépendances externes listées ci-dessus.
