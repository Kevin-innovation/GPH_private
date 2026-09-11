import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { RelatedPages } from "@/components/layout/RelatedPages";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Contact | Global Public Health Lens",
  description: "Questions, feedback, or collaboration? Start a conversation with Global Public Health Lens.",
};

export default function ContactPage() {
  return (
    <RoutePage breadcrumb="Contact">
      <ContactSection />
      <div className="page-width route-related-wrap">
        <RelatedPages
          title="Continue exploring"
          pages={[
            {
              label: "Our Mission",
              href: "/about/mission",
              description: "See the six forces that shape everyday health.",
            },
            {
              label: "Country Spotlight",
              href: "/country-spotlight",
              description: "Start with a place and follow its public-health story.",
            },
          ]}
        />
      </div>
    </RoutePage>
  );
}
