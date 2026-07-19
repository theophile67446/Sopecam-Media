import { useEffect } from 'react'
import { Breadcrumb, PageContainer } from '@/components/layout/SiteLayout'
import { setPageMeta } from '@/lib/utils2'

// ─── Gabarit de page légale ─────────────────────────────────────
function LegalShell({ title, intro, sections }: {
  title: string
  intro: string
  sections: { h: string; p: string[] }[]
}) {
  return (
    <PageContainer className="max-w-3xl">
      <Breadcrumb items={[{ label: title }]} />
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <section key={s.h} aria-labelledby={`legal-${i}`}>
            <h2 id={`legal-${i}`} className="font-display text-xl font-bold">
              <span className="mr-2 font-mono text-sopecam-green dark:text-sopecam-green-light">{i + 1}.</span>
              {s.h}
            </h2>
            {s.p.map((par, j) => (
              <p key={j} className="mt-3 leading-[1.75] text-foreground/85">{par}</p>
            ))}
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
        Dernière mise à jour : juillet 2026 — SOPECAM Médias, Yaoundé, Cameroun.
      </p>
    </PageContainer>
  )
}

// ─── Mentions légales ───────────────────────────────────────────
export function MentionsLegalesPage() {
  useEffect(() => { setPageMeta('Mentions légales') }, [])
  return (
    <LegalShell
      title="Mentions légales"
      intro="Informations relatives à l'éditeur du portail SOPECAM Médias et aux conditions d'utilisation du site."
      sections={[
        {
          h: 'Éditeur du site',
          p: [
            'Le portail SOPECAM Médias est édité par la Société de Presse et d\'Éditions du Cameroun (SOPECAM), société publique de presse dont le siège social est situé Avenue de l\'Indépendance, Yaoundé, Cameroun.',
            'Directeur de la publication : Direction de la Production Numérique et du Marketing Digital.',
          ],
        },
        {
          h: 'Hébergement',
          p: [
            'Le site est hébergé sur une infrastructure multi-cloud (AWS, région eu-west, et OVH pour la continuité d\'activité), garantissant un taux de disponibilité de 99,9 %.',
          ],
        },
        {
          h: 'Propriété intellectuelle',
          p: [
            'L\'ensemble des contenus du portail (articles, photographies, vidéos, podcasts, infographies, logos des publications Cameroon Tribune, Cameroon Business Today, Cameroon Insider, Nyanga et Weekend Sports & Loisirs) est protégé par le droit d\'auteur.',
            'Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation écrite préalable de la SOPECAM est interdite et constituerait une contrefaçon.',
          ],
        },
        {
          h: 'Crédits',
          p: [
            'Photographies : photothèque SOPECAM et photographes crédités. Charte graphique : Direction de la Production Numérique. Icônes : Lucide (licence ISC). Polices : Playfair Display, Inter, JetBrains Mono (Google Fonts, SIL Open Font License).',
          ],
        },
        {
          h: 'Contact',
          p: [
            'Pour toute question relative au site : contact@sopecam.cm — (+237) 222 30 30 30.',
          ],
        },
      ]}
    />
  )
}

// ─── Politique de confidentialité ───────────────────────────────
export function PolitiqueConfidentialitePage() {
  useEffect(() => { setPageMeta('Politique de confidentialité') }, [])
  return (
    <LegalShell
      title="Politique de confidentialité"
      intro="La SOPECAM s'engage à protéger vos données personnelles conformément à la loi camerounaise n° 2010/012 sur la cybersécurité et la cybercriminalité et au RGPD pour les utilisateurs concernés."
      sections={[
        {
          h: 'Données collectées',
          p: [
            'Nous collectons les données nécessaires à la fourniture de nos services : identité et coordonnées (compte), données de navigation (lecture, favoris), données de paiement (via des prestataires certifiés PCI DSS — nous ne conservons jamais vos numéros de carte) et préférences (langue, centres d\'intérêt).',
          ],
        },
        {
          h: 'Finalités du traitement',
          p: [
            'Vos données servent à : gérer votre compte et votre abonnement, personnaliser votre expérience de lecture, mesurer l\'audience de façon anonymisée, prévenir la fraude et assurer la sécurité de la plateforme.',
          ],
        },
        {
          h: 'Conservation et sécurité',
          p: [
            'Les données sont conservées pendant la durée de la relation contractuelle, puis archivées selon les durées légales. Elles sont protégées par chiffrement AES-256 au repos et TLS 1.3 en transit, avec accès restreint et journalisé.',
          ],
        },
        {
          h: 'Vos droits',
          p: [
            'Vous disposez d\'un droit d\'accès, de rectification, d\'effacement, de portabilité et d\'opposition. Exercez-les depuis votre espace compte ou en écrivant à dpo@sopecam.cm. Réponse sous 30 jours maximum.',
          ],
        },
        {
          h: 'Cookies',
          p: [
            'Nous utilisons des cookies strictement nécessaires au fonctionnement, des cookies de mesure d\'audience et, avec votre consentement, des cookies de personnalisation. Vous pouvez modifier vos choix à tout moment dans les préférences de votre compte.',
          ],
        },
      ]}
    />
  )
}

// ─── CGV ────────────────────────────────────────────────────────
export function CgvPage() {
  useEffect(() => { setPageMeta('Conditions générales de vente') }, [])
  return (
    <LegalShell
      title="Conditions générales de vente"
      intro="Les présentes conditions régissent la souscription et l'utilisation des offres d'abonnement SOPECAM Médias."
      sections={[
        {
          h: 'Offres et tarifs',
          p: [
            'Les offres d\'abonnement (Gratuit, Package Standard à 2 000 FCFA/mois, Package Famille à 3 500 FCFA/mois, Premium à 5 000 FCFA/mois et Institutionnel sur devis) sont décrites sur la page Abonnements. Les tarifs sont exprimés en francs CFA, toutes taxes comprises.',
          ],
        },
        {
          h: 'Paiement',
          p: [
            'Le paiement s\'effectue via MTN Mobile Money, Orange Money ou carte bancaire, sur une passerelle sécurisée certifiée PCI DSS. Toute transaction validée fait l\'objet d\'une confirmation par SMS, email et notification in-app, accompagnée d\'une facture électronique.',
            'En cas d\'échec, trois tentatives sont autorisées avant un blocage temporaire de 15 minutes du moyen de paiement.',
          ],
        },
        {
          h: 'Durée et renouvellement',
          p: [
            'Les abonnements sont souscrits pour un mois et renouvelés automatiquement par tacite reconduction, sauf résiliation avant la date d\'échéance depuis votre espace compte. Aucun remboursement n\'est dû pour la période entamée.',
          ],
        },
        {
          h: 'Droit de rétractation',
          p: [
            'Conformément à la réglementation applicable aux contenus numériques fournis immédiatement, l\'accès immédiat au service emporte renonciation expresse au droit de rétractation.',
          ],
        },
        {
          h: 'Litiges',
          p: [
            'Tout litige relatif aux présentes conditions est soumis aux tribunaux compétents de Yaoundé, Cameroun, après tentative de résolution amiable auprès de notre service client (contact@sopecam.cm).',
          ],
        },
      ]}
    />
  )
}

