import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//api.fontshare.com" />
        <link rel="dns-prefetch" href="//cdn.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
