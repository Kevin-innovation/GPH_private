import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { orphanSafeText } from "@/components/ui/orphanSafeText";
import { legal } from "@/content/legal";
import { siteConfig } from "@/content/site-config";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  const hasEmail = !siteConfig.email.startsWith("[");

  return (
    <SectionShell id="contact" surface="cloud" labelledBy="contact-title" className="contact-section">
      <div className="page-width contact-grid">
        <div className="contact-intro">
          <SectionHeading
            eyebrow="Join the conversation"
            title={<>Questions, feedback, <span className="no-orphan">or collaboration?</span></>}
            id="contact-title"
            level="h1"
          />
          <p>{orphanSafeText(legal.contactNotice)}</p>
          {hasEmail ? <p className="contact-email">{siteConfig.email}</p> : null}
        </div>
        <ContactForm />
      </div>
    </SectionShell>
  );
}
