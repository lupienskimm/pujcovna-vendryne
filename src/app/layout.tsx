import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ThemeDock } from "@/components/ThemeDock";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.tagline,
  icons: {
    icon: "/favicon.png",
  },
};

const themeInitScript = `(function(){try{var b=localStorage.getItem('pv-page-bg');var s=localStorage.getItem('pv-page-style');document.documentElement.dataset.bg=(b==='white'||b==='red'||b==='black')?b:'white';document.documentElement.dataset.style=(s==='classic'||s==='atelier')?s:'classic';}catch(e){document.documentElement.dataset.bg='white';document.documentElement.dataset.style='classic';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} h-full antialiased`}
      data-bg="white"
      data-style="classic"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <div className="site-shell">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <ThemeDock />
      </body>
    </html>
  );
}
