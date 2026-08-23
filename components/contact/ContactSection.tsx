import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { legal } from "@/content/legal";
import { siteConfig } from "@/content/site-config";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <SectionShell id="contact" surface="cloud" labelledBy="contact-title" className="contact-section">
      <div className="page-width contact-grid">
        <div className="contact-intro">
          <SectionHeading
            eyebrow="Stay in touch"
            title="Q & A"
            id="contact-title"
          />
          <p>{legal.contactNotice}</p>
          <p className="contact-email">{siteConfig.email}</p>
        </div>
        <ContactForm />
      </div>
    </SectionShell>
  );
}
