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

const title = "Global Public Health Lens | See Health in Context";
const description =
  "Explore how place, environment, inequality, policy, care access, and nutrition shape health across communities worldwide.";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: { url: "/brand/favicon-3d.png", type: "image/png", sizes: "64x64" },
    shortcut: "/brand/favicon-3d.png",
    apple: "/brand/logo-mark-3d-512.png",
  },
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
