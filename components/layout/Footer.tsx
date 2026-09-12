import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { legal } from "@/content/legal";
import { siteConfig } from "@/content/site-config";

const exploreLinks = [
  { label: "Country Spotlight", href: "/country-spotlight" },
  { label: "Micronutrients", href: "/lens/micronutrients" },
  { label: "How the Lens Works", href: "/lens/how-it-works" },
  { label: "Solutions & Action", href: "/lens/solutions" },
  { label: "Nutrition App", href: "/nutrition-app" },
  { label: "Evidence Base", href: "/evidence-base" },
  { label: "Contact", href: "/contact" },
];

// Owner-supplied values are still placeholders, so these render as plain text
// rather than links that would send a reader somewhere unrelated.
const hasEmail = !siteConfig.email.startsWith("[");

// Resolved once at module scope so the route stays statically prerenderable.
const copyrightYear = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-grid">
        <div className="footer-mission">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a className="footer-brand" href="/">
            <Image src="/brand/logo-mark-3d.webp" alt="" width={64} height={64} />
            <span>
              Global Public Health
              <br />
              Lens
            </span>
          </a>
          <p>
            Global Public Health Lens connects individual experiences with the places, environments, policies, and
            <span className="no-orphan"> systems that shape health.</span>
          </p>
          {hasEmail ? <a className="footer-email" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> : null}
          {siteConfig.socialLinks.length > 0 ? (
            <p className="footer-social">
              {siteConfig.socialLinks.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ))}
            </p>
          ) : null}
        </div>

        <nav className="footer-links" aria-label="Explore">
          <Eyebrow>Explore</Eyebrow>
          {exploreLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer-links">
          <Eyebrow>Boundaries</Eyebrow>
          <p className="footer-pending">Privacy information will be published before launch.</p>
          <p>{orphanSafeText(legal.shortDisclaimer)}</p>
        </div>
      </div>

      <div className="page-width footer-bottom">
        <span>© {copyrightYear} Global Public Health Lens</span>
        <span>Educational information · Not medical advice</span>
      </div>
    </footer>
  );
}
