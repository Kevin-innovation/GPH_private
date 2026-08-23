import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Single family, three roles (display / body / label) separated by weight and tracking.
// Weight 300 carries display sizes; 400 body; 500-600 labels and buttons.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

const title = "Global Public Health Lens | Understanding Health Globally";
const description =
  "Explore how nutrition, food access, policy, geography, and inequality shape health across communities worldwide.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/brand/favicon.svg", shortcut: "/brand/favicon.svg", apple: "/brand/logo-mark.svg" },
  openGraph: { title, description, type: "website", images: [{ url: "/og.jpg", width: 1774, height: 887, alt: "Global Public Health Lens — Understanding health through a global lens." }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.jpg"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
