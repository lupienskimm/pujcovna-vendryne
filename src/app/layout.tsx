import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin-ext"],
  display: "swap",
  adjustFontFallback: true,
  preload: false,
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pujcovna.azervera.cz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.intro,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: site.name,
    description: site.tagline,
    url: siteUrl,
    siteName: site.name,
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/hero/excavator-900.webp"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <div className="site-shell">
          <Header />
          <main className="flex-1 min-w-0">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
