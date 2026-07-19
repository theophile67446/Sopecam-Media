# SOPECAM Médias — Prompts d'implémentation successifs

> Généré le 2026-07-19 à partir de l'audit réel du dépôt `app/`.
> Chaque prompt est autonome, numéroté et exécutable séparément.
> Statuts et journal : voir `docs/coordination-prompts.md`.

---

## Registre des recommandations (issu de l'audit)

### Constats de l'audit initial (avant toute intervention)

| Contrôle | Résultat |
|----------|----------|
| `npx tsc -b` | ✅ 0 erreur |
| `npm run lint` | ❌ 13 erreurs, 3 warnings (préexistants) |
| `npm run build` | ✅ Réussit — JS 665,99 Ko (187,8 Ko gzip), CSS 120 Ko, **aucun code splitting** |
| Git | Pas de dépôt Git (aucun risque d'écrasement de modifications) |
| Assets | `public/assets/articles` = **48,4 Mo de PNG non référencés dans le code** (copiés dans `dist/`), podcasts = 8 Mo |

### Fonctionnalités vérifiées comme déjà correctement implémentées (ne pas réécrire)

- 25+ routes câblées sans lien mort (`src/App.tsx`), page 404 dédiée.
- Mega menu par univers avec tendances et sous-rubriques (souris).
- Paywall souple 3 articles/jour avec persistance et reset quotidien (`appStore.ts`), système de crédits (50 crédits/déblocage), plans d'abonnement.
- Favoris, historique de lecture, commentaires, sondages, partage social.
- Mode sombre persistant (classe `dark` sur `<html>`).
- Ticker breaking news, navigation mobile inférieure + drawer.
- Back-office protégé par `<Navigate>` si rôle ≠ admin + bouton flottant admin.
- Titres/description par page (`setPageMeta`), microdata `itemProp` partielles sur l'article.
- Tunnel paiement 3 étapes MTN MoMo / Orange Money / Carte (simulé).
- Recherche full-text avec filtres, archives avec `loading="lazy"`, e-paper.

### Écarts identifiés

| ID | Catégorie | Constat | Priorité | Effort | Fichiers concernés |
|----|-----------|---------|----------|--------|--------------------|
| QUAL-01 | Qualité du code | 13 erreurs lint : setState dans effet (`HeroCarousel`, `ArticlePage`), fonctions impures au rendu (`PaiementPage`, `AdminPage`, `ui/sidebar`), exports non-composants (8 fichiers shadcn + `ArticlePage`) | Critique | M | `HeroCarousel.tsx`, `ArticlePage.tsx`, `PaiementPage.tsx`, `AdminPage.tsx`, `eslint.config.js` |
| PERF-01 | Performance | Bundle JS unique de 666 Ko — pénalisant sur connexions mobiles camerounaises | Critique | M | `App.tsx`, `vite.config.ts` |
| PERF-02 | Performance | 48,4 Mo de PNG d'articles non utilisés copiés dans `dist/` ; images réelles jamais affichées | Critique | L | `public/assets/articles`, `CoverImage.tsx`, `articles.ts` |
| I18N-01 | Bilingue FR/EN | Bouton FR/EN présent mais aucune traduction appliquée ; `<html lang>` figé à `fr` | Élevée | L | `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, nouveau `lib/i18n.ts` |
| A11Y-01 | Accessibilité | Mega menu inaccessible au clavier (hover uniquement), pas de lien d'évitement, pas de fermeture Échap des menus | Élevée | M | `Header.tsx`, `SiteLayout.tsx`, `index.css` |
| UX-01 | UX / réseau | Aucune gestion hors-ligne, aucun ErrorBoundary global (écran blanc en cas d'erreur JS) | Élevée | M | `SiteLayout.tsx`, nouveau composant |
| SEC-01 | Sécurité / confiance | Le paiement simulé n'est signalé nulle part comme simulation de démonstration | Élevée | S | `PaiementPage.tsx`, `AbonnementPage.tsx` |
| SEO-01 | SEO | Aucune donnée structurée JSON-LD (NewsArticle, Organization, BreadcrumbList) ; balises OG statiques | Moyenne | S | `utils2.ts`, `ArticlePage.tsx`, `index.html` |
| QUAL-02 | Qualité | 3 warnings lint de dépendances de hooks | Moyenne | S | `ArticlePage.tsx`, `universes.tsx` |
| PERF-03 | Performance | Données browserslist obsolètes (7 mois) | Faible | S | `package.json` |

### Recommandations non applicables sans backend (documentées, non exécutées)

- Véritable authentification JWT, SSO Google/Facebook/Apple, OTP SMS : impossible côté front seul. Les comptes `demo@sopecam.cm` / `premium@sopecam.cm` / `admin@sopecam.cm` sont des **comptes de démonstration** ; la garde `/admin` est une protection d'interface, pas une sécurité serveur.
- Paiement réel MTN MoMo / Orange Money : nécessite les API opérateurs ; le tunnel reste une simulation clairement étiquetée (voir P-07).
- Indexation temps réel, SSR/ISR : l'app est une SPA Vite ; le SEO complet exigerait une migration Next.js (hors périmètre, décision métier).
- Recherche Elasticsearch, archives 40K images, OCR : simulées avec les données locales.

---

## P-01 — Stabilisation : zéro erreur ESLint

1. **Identifiant et titre** : P-01 — Stabilisation du projet et correction des erreurs lint.
2. **Objectif** : `npm run lint` sort avec 0 erreur et 0 warning, sans changer le comportement visible.
3. **Problème** : 13 erreurs et 3 warnings préexistants ; deux sont de vrais risques (re-rendus en cascade, référence de paiement qui change à chaque re-rendu).
4. **Priorité** : Critique.
5. **Recommandations** : QUAL-01, QUAL-02.
6. **Dépendances** : aucune (premier prompt).
7. **À inspecter** : `src/components/home/HeroCarousel.tsx`, `src/pages/ArticlePage.tsx`, `src/pages/PaiementPage.tsx`, `src/pages/AdminPage.tsx`, `src/pages/universes.tsx`, `src/components/ui/sidebar.tsx`, `eslint.config.js`.
8. **Modifications attendues** :
   - `HeroCarousel` : supprimer l'appel synchrone `onSelect()` dans l'effet (état initial 0 suffit) ;
   - `ArticlePage` : supprimer le `force()` redondant (le store notifie déjà), calculer l'accès à partir des valeurs abonnées du store, retirer le ré-export `timeAgo`, compléter/purger les dépendances des hooks ;
   - `PaiementPage` : générer la référence `SOP-2026-XXXXXX` une seule fois au moment du paiement (état), pas au rendu ;
   - `AdminPage` : sortir les horodatages simulés du rendu (constante module ou `useMemo`) ;
   - `universes.tsx` : compléter les dépendances de l'effet ;
   - `eslint.config.js` : exempter `src/components/ui/**` (fichiers shadcn vendorés) des règles `react-refresh/only-export-components` et `react-hooks/purity` — pratique standard, on ne modifie pas les fichiers de librairie vendorés.
9. **Comportement attendu** : identique sur desktop/tablette/mobile — aucun changement visuel.
10. **FR/EN** : sans objet (aucun texte modifié).
11. **Clair/sombre** : inchangé.
12. **États** : inchangés ; vérifier que le paywall se déclenche toujours (quota) et que la référence de paiement reste stable à l'écran de confirmation.
13. **Accessibilité** : inchangée.
14. **Performance** : suppression d'un double rendu (ArticlePage), pas de régression.
15. **Sécurité** : aucune.
16. **Critères d'acceptation** : `npm run lint` → 0 erreur, 0 warning ; `npx tsc -b` → 0 erreur ; quota d'articles décrémente toujours ; référence de paiement fixe après confirmation.
17. **Tests** : lint, tsc, build ; test manuel : ouvrir 4 articles gratuits en visiteur → paywall au 4ᵉ ; payer une offre → la référence ne change pas au re-rendu.
18. **Terminé quand** : tous les contrôles ci-dessus passent et le journal est mis à jour.

---

## P-02 — Performance : code splitting par route

1. **Identifiant et titre** : P-02 — Découpage du bundle par route (lazy loading).
2. **Objectif** : réduire le JS initial d'au moins 30 % pour les connexions lentes.
3. **Problème** : bundle unique de 666 Ko ; un visiteur mobile télécharge tout le portail (admin compris) pour lire un article.
4. **Priorité** : Critique.
5. **Recommandations** : PERF-01.
6. **Dépendances** : P-01 (base saine).
7. **À inspecter** : `src/App.tsx`, `vite.config.ts`, `src/pages/*`.
8. **Modifications attendues** :
   - convertir les pages secondaires (admin, paiement, abonnement, archives, e-paper, compte, auth, légal, static, recherche, univers) en `React.lazy()` + `<Suspense>` avec fallback skeleton conforme à la charte (shimmer) ;
   - garder `Home`, `ArticlePage` et le layout en import statique (parcours principal instantané) ;
   - `vite.config.ts` : `manualChunks` pour isoler `react`/`react-dom`/`react-router` (vendor stable et cacheable).
9. **Comportement attendu** : navigation identique ; sur mobile lent, première peinture plus rapide ; fallback shimmer visible pendant le chargement d'une page secondaire.
10. **FR/EN** : inchangé.
11. **Clair/sombre** : le fallback respecte `bg-background`.
12. **États** : chargement = skeleton ; échec de chargement de chunk = couvert par l'ErrorBoundary (P-05, si déjà exécuté sinon comportement navigateur).
13. **Accessibilité** : le fallback ne vole pas le focus.
14. **Performance** : chunk initial < 450 Ko ; total inchangé ±5 %.
15. **Sécurité** : aucune.
16. **Critères d'acceptation** : `npm run build` liste plusieurs chunks ; le chunk d'entrée (index + vendor initial) < 450 Ko ; toutes les routes se chargent sans erreur console.
17. **Tests** : build + navigation complète des 25 routes dans le navigateur.
18. **Terminé quand** : critères mesurés au build et navigation vérifiée.

---

## P-03 — Assets : images d'articles réelles, compressées, chargées paresseusement

1. **Identifiant et titre** : P-03 — Exploitation des vraies images d'articles en WebP + purge des 48 Mo.
2. **Objectif** : ne plus expédier 48,4 Mo inutiles dans `dist/` et enrichir visuellement le portail avec les images réelles disponibles.
3. **Problème** : `public/assets/articles/*.png` (48,4 Mo, ~2 Mo/fichier) n'est référencé nulle part ; les couvertures sont des dégradés génératifs. Les images existent pourtant et correspondent aux slugs des articles.
4. **Priorité** : Critique.
5. **Recommandations** : PERF-02.
6. **Dépendances** : P-01.
7. **À inspecter** : `public/assets/articles`, `src/components/CoverImage.tsx`, `src/lib/data/articles.ts`, usages de `CoverImage` (HeroCarousel, ArticleCard, ArticlePage…), `public/assets/media` (podcasts, 8 Mo).
8. **Modifications attendues** :
   - installer `sharp` en **devDependency uniquement** (justification : 48 Mo → ~2-3 Mo, aucun outil de conversion présent sur la machine) ; script one-shot `scripts/optimize-images.mjs` : PNG → WebP 1280 px, qualité ~75, dans `public/assets/articles-webp/` ;
   - supprimer les PNG originaux de `public/` (après conversion réussie) — les originaux restent dans le dossier parent du projet ;
   - `CoverImage` : accepter une prop `src` optionnelle ; si présente, afficher `<img loading="lazy" decoding="async">` par-dessus le dégradé génératif (qui devient placeholder anti-CLS et fallback `onError`) ;
   - mapper `slug → image` pour les articles disposant d'un visuel ;
   - vérifier l'usage réel de `public/assets/media` (podcasts 8 Mo) : si non référencé, supprimer également.
9. **Comportement attendu** : cartes et héros affichent les vraies photos ; ratio 16:9 stable (pas de saut de mise en page) ; dégradé visible pendant le chargement.
10. **FR/EN** : `alt` descriptif en français (langue du contenu).
11. **Clair/sombre** : les images sont identiques ; l'overlay de lisibilité existant est conservé.
12. **États** : image absente ou en échec → dégradé génératif actuel (aucun rectangle gris).
13. **Accessibilité** : `alt` = titre de l'article sur la page article ; `alt=""`+`aria-hidden` dans les cartes où le titre est adjacent.
14. **Performance** : `dist/` total < 15 Mo ; chaque WebP < 200 Ko ; `loading="lazy"` partout sauf le héros de la page article (LCP, `fetchpriority="high"`).
15. **Sécurité** : aucune.
16. **Critères d'acceptation** : taille de `dist/` mesurée avant/après ; images visibles sur Home, cartes et pages articles ; aucun 404 d'image en console.
17. **Tests** : build + mesure de taille ; navigation Home/article/univers avec réseau throttlé (DevTools).
18. **Terminé quand** : `dist/` allégé, images affichées, fallback vérifié.

---

## P-04 — Accessibilité : clavier, lien d'évitement, mega menu

1. **Identifiant et titre** : P-04 — Accessibilité de la navigation (WCAG 2.1 AA).
2. **Objectif** : tout le portail est utilisable au clavier seul.
3. **Problème** : mega menu ouvert uniquement au survol ; pas de lien « Aller au contenu » ; menus non refermables à Échap.
4. **Priorité** : Élevée.
5. **Recommandations** : A11Y-01.
6. **Dépendances** : P-01.
7. **À inspecter** : `Header.tsx`, `MobileNav.tsx`, `SiteLayout.tsx`, `index.css` (focus-visible).
8. **Modifications attendues** :
   - lien d'évitement « Aller au contenu » (visible au focus) avant le header, cible `#contenu` sur `<main>` ;
   - mega menu : ouverture au focus des liens d'univers, fermeture à Échap et au blur sortant, `aria-expanded`/`aria-haspopup` sur les déclencheurs ;
   - menu utilisateur et drawer mobile : fermeture à Échap, retour du focus au déclencheur ;
   - vérifier/renforcer `:focus-visible` global conforme charte (anneau `#008000` / `#80E0A0` en sombre).
9. **Comportement attendu** : parcours Tab logique header → contenu → footer sur les trois formats.
10. **FR/EN** : libellés d'accessibilité traduits via i18n (si P-06 exécuté, sinon FR).
11. **Clair/sombre** : anneau de focus contrasté dans les deux modes.
12. **États** : sans objet (navigation).
13. **Accessibilité** : c'est l'objet du prompt ; cible AA.
14. **Performance** : négligeable.
15. **Sécurité** : aucune.
16. **Critères d'acceptation** : au clavier seul : ouvrir le mega menu, atteindre une sous-rubrique, fermer à Échap ; lien d'évitement fonctionnel ; focus visible sur tous les éléments interactifs testés.
17. **Tests** : parcours clavier manuel dans le navigateur (Tab/Shift+Tab/Entrée/Échap) sur desktop et mobile.
18. **Terminé quand** : le parcours clavier complet est démontré sans piège de focus.

---

## P-05 — Résilience : ErrorBoundary global et mode hors-ligne

1. **Identifiant et titre** : P-05 — Gestion des erreurs et des coupures réseau.
2. **Objectif** : jamais d'écran blanc ; l'utilisateur est informé quand la connexion tombe.
3. **Problème** : aucune ErrorBoundary ; aucun retour visuel hors-ligne (contexte : connexions mobiles instables).
4. **Priorité** : Élevée.
5. **Recommandations** : UX-01.
6. **Dépendances** : P-02 (les chunks lazy peuvent échouer hors-ligne → l'ErrorBoundary doit les couvrir).
7. **À inspecter** : `SiteLayout.tsx`, `main.tsx`, `App.tsx`.
8. **Modifications attendues** :
   - composant `ErrorBoundary` (classe React) autour de l'`<Outlet>` : message conforme charte, bouton « Réessayer » (reset + re-render) et lien accueil ;
   - bannière hors-ligne globale (`online`/`offline` de `navigator`), réapparition avec toast « Connexion rétablie » ;
   - le fallback d'erreur distingue le cas hors-ligne (« Vérifiez votre connexion ») du crash générique.
9. **Comportement** : identique sur tous formats ; bannière compacte sur mobile (au-dessus de la bottom nav).
10. **FR/EN** : messages traduits (clé i18n si P-06 fait).
11. **Clair/sombre** : styles `bg-card`/`border-border` adaptatifs.
12. **États** : erreur JS → fallback ; hors-ligne → bannière ; reprise → toast ; chunk lazy échoué → fallback avec « Réessayer » qui relance le chargement.
13. **Accessibilité** : bannière `role="status"` (`aria-live="polite"`), fallback avec titre h1.
14. **Performance** : négligeable.
15. **Sécurité** : ne pas afficher la stack trace à l'utilisateur.
16. **Critères d'acceptation** : passer DevTools en « Offline » → bannière visible ; revenir en ligne → toast ; erreur simulée → fallback avec récupération fonctionnelle.
17. **Tests** : simulation offline dans le navigateur ; navigation vers une route lazy hors-ligne.
18. **Terminé quand** : les trois scénarios sont démontrés.

---

## P-06 — Bilingue : rendre la bascule FR/EN réellement fonctionnelle

1. **Identifiant et titre** : P-06 — Internationalisation du chrome de l'interface.
2. **Objectif** : la bascule FR/EN change réellement la langue de l'interface (navigation, actions, messages système) et `<html lang>`.
3. **Problème** : `lang` est stocké dans le store et le bouton bascule, mais **aucun texte n'est traduit** — fonctionnalité annoncée non tenue.
4. **Priorité** : Élevée.
5. **Recommandations** : I18N-01.
6. **Dépendances** : P-01.
7. **À inspecter** : `appStore.ts` (lang), `Header.tsx`, `Footer.tsx`, `MobileNav.tsx`, `SiteLayout.tsx`, pages à fort chrome (compte, abonnement, recherche).
8. **Modifications attendues** :
   - créer `src/lib/i18n.ts` : dictionnaire typé `{ fr: {...}, en: {...} }` + hook `useT()` branché sur le store (pas de nouvelle dépendance) ;
   - traduire le **chrome** : navigation (univers, Archives, E-paper), actions header (Connexion, Rechercher, quota d'articles, menu utilisateur), bottom nav, drawer mobile, footer, bannières P-05, lien d'évitement P-04 ;
   - synchroniser `document.documentElement.lang` avec la langue choisie ;
   - le **contenu éditorial reste en français** (les articles de démo n'existent qu'en FR) : l'indiquer par un noscript de doc dans `docs/` et une note dans le rapport — pas de fausse traduction automatique.
9. **Comportement** : bascule instantanée sans rechargement, persistée (store persist), identique sur tous formats.
10. **FR/EN** : c'est l'objet ; libellés vérifiés dans les deux langues (pas de texte tronqué).
11. **Clair/sombre** : sans objet.
12. **États** : aucun état réseau ; les toasts système utilisent la langue active.
13. **Accessibilité** : `aria-label` traduits ; `lang` correct pour les lecteurs d'écran.
14. **Performance** : dictionnaire < 8 Ko, inclus au bundle principal.
15. **Sécurité** : aucune.
16. **Critères d'acceptation** : bascule EN → header/footer/navs/messages en anglais, `<html lang="en">` ; retour FR intégral ; aucun mélange dans le chrome ; persistance après rechargement.
17. **Tests** : vérification visuelle des deux langues sur Home, article, compte, mobile.
18. **Terminé quand** : chrome 100 % bilingue et attribut lang synchronisé.

---

## P-07 — Confiance : étiqueter la simulation de paiement

1. **Identifiant et titre** : P-07 — Transparence du paiement simulé et du mode démonstration.
2. **Objectif** : aucun utilisateur ne peut croire qu'un paiement réel a eu lieu.
3. **Problème** : le tunnel affiche « Paiement confirmé ! Facture envoyée… » sans aucune mention de simulation — contraire aux règles de la mission et à la confiance (enjeu clé au Cameroun).
4. **Priorité** : Élevée.
5. **Recommandations** : SEC-01.
6. **Dépendances** : P-01 (la référence stable y est corrigée).
7. **À inspecter** : `PaiementPage.tsx`, `AbonnementPage.tsx`, `auth.tsx` (comptes démo).
8. **Modifications attendues** :
   - badge/bandeau discret mais permanent « Démonstration — aucun débit réel » sur le tunnel de paiement (étapes 2 et 3) et l'écran de confirmation ;
   - mention équivalente près des identifiants pré-remplis de connexion (« comptes de démonstration ») ;
   - aucun changement du parcours ni du design premium (ton informatif, style charte : encart `#00A0E0` info).
9. **Comportement** : identique sur tous formats ; le bandeau ne masque aucun contrôle.
10. **FR/EN** : mention traduite si P-06 exécuté.
11. **Clair/sombre** : encart adaptatif.
12. **États** : visible à chaque étape du tunnel, y compris succès.
13. **Accessibilité** : texte réel (pas seulement une couleur), contraste AA.
14. **Performance** : nulle.
15. **Sécurité** : réduit le risque de confusion ; aucune donnée sensible collectée (les champs restent factices).
16. **Critères d'acceptation** : mention visible aux étapes compte/paiement/confirmation et sur la page connexion.
17. **Tests** : parcours abonnement complet dans le navigateur.
18. **Terminé quand** : mention vérifiée sur toutes les vues concernées.

---

## P-08 — SEO : données structurées et métadonnées dynamiques

1. **Identifiant et titre** : P-08 — JSON-LD et Open Graph dynamiques.
2. **Objectif** : chaque article expose un `NewsArticle` JSON-LD valide ; le site expose `Organization` ; les balises OG suivent la page.
3. **Problème** : seuls titre/description changent ; aucune donnée structurée (limite connue d'une SPA, mais on maximise ce qui est possible côté client).
4. **Priorité** : Moyenne.
5. **Recommandations** : SEO-01.
6. **Dépendances** : P-01.
7. **À inspecter** : `utils2.ts` (`setPageMeta`), `ArticlePage.tsx`, `index.html`.
8. **Modifications attendues** :
   - étendre `setPageMeta` : mise à jour `og:title`, `og:description`, `og:url`, `canonical` ;
   - helper `setJsonLd(id, data)` injectant/remplaçant un `<script type="application/ld+json">` ;
   - `ArticlePage` : `NewsArticle` (headline, datePublished, author, publisher SOPECAM, image) + `BreadcrumbList` ; nettoyage au démontage ;
   - `Home` : `Organization` (logo, nom, url).
9. **Comportement** : aucun changement visuel.
10. **FR/EN** : `inLanguage: "fr"` (contenu FR).
11. **Clair/sombre** : sans objet.
12. **États** : article introuvable → aucun JSON-LD résiduel.
13. **Accessibilité** : sans objet.
14. **Performance** : négligeable.
15. **Sécurité** : échapper correctement le JSON (sérialisation `JSON.stringify`, pas de HTML injecté).
16. **Critères d'acceptation** : sur une page article, `document.querySelector('script[type="application/ld+json"]')` contient un NewsArticle valide ; OG mis à jour ; plus de résidu après navigation vers une autre page.
17. **Tests** : inspection DOM dans le navigateur sur 2 articles + Home + recherche.
18. **Terminé quand** : JSON-LD vérifié dans le DOM et build OK.

---

## P-09 — Contrôle final et préparation production

1. **Identifiant et titre** : P-09 — Vérification transversale complète et rapport final.
2. **Objectif** : dérouler les 24 parcours critiques de la mission, mesurer le build final, rédiger le rapport.
3. **Problème** : consolider et prouver l'ensemble.
4. **Priorité** : Critique.
5. **Recommandations** : toutes.
6. **Dépendances** : P-01 → P-08.
7. **À inspecter** : ensemble de l'app dans le navigateur (dev + preview du build).
8. **Modifications attendues** : uniquement des correctifs de régression si découverts ; mise à jour browserslist (PERF-03).
9. **Comportement attendu** : les 24 parcours critiques passent (desktop + 375 px).
10. **FR/EN** : bascule testée.
11. **Clair/sombre** : bascule testée.
12. **États** : offline, 404, paywall, accès admin refusé testés.
13. **Accessibilité** : parcours clavier re-testé après toutes les modifications.
14. **Performance** : tailles de chunks et de `dist/` consignées au rapport.
15. **Sécurité** : garde `/admin` re-testée (visiteur, lecteur, admin).
16. **Critères d'acceptation** : `npm run lint` 0 erreur ; `npx tsc -b` 0 erreur ; `npm run build` OK ; parcours critiques validés ; rapport final rédigé dans `docs/coordination-prompts.md`.
17. **Tests** : la liste des 24 parcours de la section 11 de la mission.
18. **Terminé quand** : rapport final publié avec preuves.
