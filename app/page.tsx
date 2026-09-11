import { HomeDirectory } from "@/components/home/HomeDirectory";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

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
        <HomeDirectory />
      </main>
      <Footer />
    </>
  );
}
