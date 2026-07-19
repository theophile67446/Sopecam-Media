import { Link } from 'react-router'
import { Facebook, Twitter, Youtube, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'
import { PUBLICATION_LIST, UNIVERSE_LIST } from '@/lib/data/publications'
import { NewsletterForm } from '@/components/widgets'
import { useT } from '@/lib/i18n'
import { Logo } from './Header'

// ─── Toile de fond : planisphère stylisé ────────────────────────
function FooterBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg viewBox="0 0 1440 520" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        {/* Graticule (trame planisphère) */}
        {[70, 165, 260, 355, 450].map((y) => (
          <path key={`h${y}`} d={`M0 ${y} Q 720 ${y - 26} 1440 ${y}`} fill="none" stroke="#FFFFFF" strokeOpacity="0.05" />
        ))}
        {[180, 420, 660, 900, 1140, 1380].map((x) => (
          <path key={`v${x}`} d={`M${x} 0 Q ${x + 22} 260 ${x} 520`} fill="none" stroke="#FFFFFF" strokeOpacity="0.05" />
        ))}
      </svg>
      {/* Halos d'ambiance */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(900px 380px at 50% 118%, rgba(0, 64, 0, 0.35), transparent 60%),
            radial-gradient(700px 300px at 88% -10%, rgba(212, 168, 67, 0.07), transparent 55%)
          `,
        }}
      />
    </div>
  )
}

// ─── Footer 4 colonnes (§2 Design System) ───────────────────────
export function Footer() {
  const { t, universeLabel } = useT()
  const socials = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'X (Twitter)', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  ]

  return (
    <footer className="relative mt-16 overflow-hidden bg-[#0A0F0C] text-white">
      <FooterBackdrop />
      {/* Bandeau newsletter */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-10 md:grid-cols-2 md:items-center lg:px-6">
          <div>
            <h3 className="font-display text-2xl font-bold">{t.footerNewsletterTitle}</h3>
            <p className="mt-1.5 text-sm text-sopecam-mint">
              {t.footerNewsletterText}
            </p>
          </div>
          <NewsletterForm dark />
        </div>
      </div>

      {/* Colonnes */}
      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div className="lg:col-span-1">
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {t.footerBaseline}
          </p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/75 transition-all duration-150 hover:-translate-y-0.5 hover:bg-sopecam-green hover:text-white"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Nos publications">
          <h4 className="overline-label mb-4 text-sopecam-green-light">{t.footerPublications}</h4>
          <ul className="space-y-3">
            {PUBLICATION_LIST.map((p) => {
              const universe = UNIVERSE_LIST.find((u) =>
                u.key === (p.code === 'CT' ? 'actus' : p.code === 'CBT' ? 'economie' : p.code === 'CI' ? 'actus' : p.code === 'NY' ? 'culture' : 'sports')
              )
              return (
                <li key={p.code}>
                  <Link
                    to={universe?.path ?? '/actus'}
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                  >
                    <span className="flex h-8 w-12 shrink-0 items-center justify-center rounded-md bg-white/95 px-1.5 py-1 shadow-sm">
                      <img src={p.logo} alt={p.name} className="max-h-6 max-w-full object-contain" />
                    </span>
                    <span className="text-[13px] leading-tight text-white/75 transition-colors hover:text-sopecam-green-light">{p.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <nav aria-label="Univers éditoriaux">
          <h4 className="overline-label mb-4 text-sopecam-green-light">{t.footerUniverses}</h4>
          <ul className="space-y-2.5 text-sm">
            {UNIVERSE_LIST.map((u) => (
              <li key={u.key}>
                <Link to={u.path} className="text-white/75 transition-colors hover:text-sopecam-green-light">
                  {universeLabel(u.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Services">
          <h4 className="overline-label mb-4 text-sopecam-green-light">{t.footerServices}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/abonnement" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerSubscriptions}</Link></li>
            <li><Link to="/epaper" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.epaper}</Link></li>
            <li><Link to="/archives" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerArchives}</Link></li>
            <li><Link to="/newsletter" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerNewsletters}</Link></li>
            <li><Link to="/contact" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerContact}</Link></li>
            <li><Link to="/qui-sommes-nous" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerAbout}</Link></li>
          </ul>
        </nav>

        <nav aria-label="Informations légales">
          <h4 className="overline-label mb-4 text-sopecam-green-light">{t.footerLegal}</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/mentions-legales" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerLegalNotice}</Link></li>
            <li><Link to="/politique-confidentialite" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerPrivacy}</Link></li>
            <li><Link to="/cgv" className="text-white/75 transition-colors hover:text-sopecam-green-light">{t.footerTerms}</Link></li>
          </ul>
          <div className="mt-6 space-y-2 text-[13px] text-white/55">
            <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Yaoundé, Cameroun</p>
            <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> (+237) 222 30 30 30</p>
            <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> contact@sopecam.cm</p>
          </div>
        </nav>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/45 sm:flex-row lg:px-6">
          <p>{t.footerCopyright(new Date().getFullYear())}</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-sopecam-green" />
            Cameroon Tribune · Nyanga · CBT · Insider · Sports & Loisirs
          </p>
        </div>
      </div>
    </footer>
  )
}
