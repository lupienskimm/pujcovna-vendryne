import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { BgSwitcher } from "@/components/BgSwitcher";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
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

const bgInitScript = `(function(){try{var b=localStorage.getItem('pv-page-bg');if(b==='white'||b==='red'||b==='black'){document.documentElement.dataset.bg=b;}else{document.documentElement.dataset.bg='white';}}catch(e){document.documentElement.dataset.bg='white';}})();`;

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
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bgInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <div className="site-shell">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <BgSwitcher />
      </body>
    </html>
  );
}
