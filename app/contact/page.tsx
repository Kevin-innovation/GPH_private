import type { Metadata } from "next";
import { ContactSection } from "@/components/contact/ContactSection";
import { RoutePage } from "@/components/layout/RoutePage";

export const metadata: Metadata = {
  title: "Contact | Global Public Health Lens",
  description: "Questions, feedback, or collaboration? Start a conversation with Global Public Health Lens.",
};

export default function ContactPage() {
  return (
    <RoutePage breadcrumb="Contact">
      <ContactSection />
    </RoutePage>
  );
}
