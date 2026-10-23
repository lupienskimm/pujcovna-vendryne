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

const themeInitScript = `(function(){try{var patterns={none:1,poly:1,grid:1,dots:1,lines:1,chevrons:1};var b=localStorage.getItem('pv-page-bg');var l=localStorage.getItem('pv-page-layout');var p=localStorage.getItem('pv-page-pattern');var o=localStorage.getItem('pv-pattern-opacity');if(p==='on')p='poly';if(p==='off')p='none';document.documentElement.dataset.bg=(b==='white'||b==='red'||b==='black')?b:'white';document.documentElement.dataset.layout=(l==='page'||l==='island')?l:'page';document.documentElement.dataset.pattern=patterns[p]?p:'poly';var op=parseInt(o||'55',10);if(isNaN(op))op=55;if(op<0)op=0;if(op>100)op=100;document.documentElement.style.setProperty('--pattern-opacity',String(op/100));}catch(e){document.documentElement.dataset.bg='white';document.documentElement.dataset.layout='page';document.documentElement.dataset.pattern='poly';document.documentElement.style.setProperty('--pattern-opacity','0.55');}})();`;

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
      data-layout="page"
      data-pattern="poly"
      style={{ ["--pattern-opacity" as string]: "0.55" }}
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
