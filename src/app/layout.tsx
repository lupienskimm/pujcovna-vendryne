import type { CSSProperties } from "react";
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

const themeInitScript = `(function(){try{var colors={ink:'#141414',brand:'#E5322D',white:'#ffffff',gray:'#8a8a8a'};var c=localStorage.getItem('pv-pattern-color');document.documentElement.dataset.bg='black';document.documentElement.dataset.layout='page';document.documentElement.dataset.pattern='dots';var col=colors[c]||(/^#[0-9a-fA-F]{6}$/.test(c||'')?c:colors.white);document.documentElement.style.setProperty('--pattern-opacity','0.7');document.documentElement.style.setProperty('--pattern-color',col);localStorage.setItem('pv-page-bg','black');localStorage.setItem('pv-page-pattern','dots');}catch(e){document.documentElement.dataset.bg='black';document.documentElement.dataset.layout='page';document.documentElement.dataset.pattern='dots';document.documentElement.style.setProperty('--pattern-opacity','0.7');document.documentElement.style.setProperty('--pattern-color','#ffffff');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${inter.variable} h-full antialiased`}
      data-bg="black"
      data-layout="page"
      data-pattern="dots"
      style={
        {
          ["--pattern-opacity"]: "0.7",
          ["--pattern-color"]: "#ffffff",
        } as CSSProperties
      }
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
