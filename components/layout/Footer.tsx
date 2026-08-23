import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { legal } from "@/content/legal";
import { siteConfig } from "@/content/site-config";

const exploreLinks = [
  { label: "Micronutrient Guide", href: "#micronutrients" },
  { label: "Nutrition App", href: "#app" },
  { label: "Solutions & Action", href: "#global-lens" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Sources", href: "#sources" },
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
          <a className="footer-brand" href="#hero">
            <Image src="/brand/logo-mark-reverse.svg" alt="" width={56} height={56} />
            <span>
              Global Public Health
              <br />
              Lens
            </span>
          </a>
          <p>
            Global Public Health Lens makes health easier to understand by connecting individual experiences with the global
            systems that shape them.
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

        <div className="footer-links">
          <Eyebrow>Explore</Eyebrow>
          {exploreLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="footer-links">
          <Eyebrow>Boundaries</Eyebrow>
          <p className="footer-pending">Privacy information will be published before launch.</p>
          <p>{legal.shortDisclaimer}</p>
        </div>
      </div>

      <div className="page-width footer-bottom">
        <span>© {copyrightYear} Global Public Health Lens</span>
        <span>Educational information · Not medical advice</span>
      </div>
    </footer>
  );
}
