import { HomeDirectory } from "@/components/home/HomeDirectory";
import { Hero } from "@/components/hero/Hero";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

// The landing page keeps its content server-rendered; Header and the small
// project-directory navigation cross the client boundary for reliable routing.
export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HomeDirectory />
      </main>
      <Footer />
    </>
  );
}
