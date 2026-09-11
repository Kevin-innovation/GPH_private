import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function RoutePage({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: string;
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="route-main">
        <div className="page-width route-breadcrumb" aria-label="Breadcrumb">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">Brand / Home</a>
          <span aria-hidden="true">/</span>
          <span>{breadcrumb}</span>
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
