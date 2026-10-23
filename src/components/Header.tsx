import Link from "next/link";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Úvod" },
  { href: "/pujcovna", label: "Sortiment" },
  { href: "/pujcit", label: "Půjčit" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-pv flex h-14 items-center justify-between gap-4 md:h-[3.75rem]">
        <Link
          href="/"
          prefetch={false}
          className="header-logo flex shrink-0 items-center"
          aria-label={site.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-wordmark.svg"
            alt={site.name}
            width={200}
            height={71}
            decoding="async"
            fetchPriority="low"
            className="header-logo-img"
          />
        </Link>

        <nav className="nav-desktop" aria-label="Hlavní menu">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="nav-link"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="header-phone"
            data-track="tel-header"
          >
            {site.phoneDisplay}
          </a>
          <Link href="/pujcit" className="header-rent">
            Půjčit
          </Link>
        </nav>

        <details className="header-mobile-nav md:hidden">
          <summary className="nav-mobile-btn header-menu-btn" aria-label="Menu">
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1" aria-hidden>
              <span className="header-menu-bar" />
              <span className="header-menu-bar" />
              <span className="header-menu-bar" />
            </span>
          </summary>
          <div className="header-mobile-panel">
            <nav className="flex flex-col gap-1" aria-label="Mobilní menu">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link-mobile"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="nav-link-mobile font-semibold"
                data-track="tel-header-mobile"
              >
                Tel: {site.phoneDisplay}
              </a>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
