import { NutritionAppPreview } from "@/components/app-preview/NutritionAppPreview";
import { ContactSection } from "@/components/contact/ContactSection";
import { FounderSection } from "@/components/founder/FounderSection";
import { CountrySpotlightSection } from "@/components/global-lens/CountrySpotlight";
import { GlobalLensSection } from "@/components/global-lens/GlobalLensSection";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MissionSection } from "@/components/mission/MissionSection";
import { MicronutrientSection } from "@/components/micronutrients/MicronutrientSection";
import { SourcesSection } from "@/components/sources/SourcesSection";

// Server component. Only Header (mobile nav state) and ContactForm (form state)
// cross the client boundary, so the landing page ships almost no JavaScript.
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <Hero />
        <MissionSection />
        <CountrySpotlightSection />
        <MicronutrientSection />
        <GlobalLensSection />
        <NutritionAppPreview />
        <FounderSection />
        <SourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
