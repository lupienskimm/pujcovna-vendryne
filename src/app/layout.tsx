import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { CardStyleDock } from "@/components/CardStyleDock";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
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

const cardStyleInit = `(function(){try{var s=localStorage.getItem('pv-card-style');document.documentElement.dataset.cards=(s==='lift'||s==='flat')?s:'flat';}catch(e){document.documentElement.dataset.cards='flat';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} h-full antialiased`}
      data-cards="flat"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: cardStyleInit }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <div className="site-shell">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CardStyleDock />
        <Analytics />
      </body>
    </html>
  );
}
