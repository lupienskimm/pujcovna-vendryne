"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Úvod" },
  { href: "/pujcovna", label: "Půjčovna" },
  { href: "/pujcit", label: "Půjčit" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="container-pv flex h-14 items-center justify-between gap-4 md:h-[3.75rem]">
        <Link
          href="/"
          className="header-logo flex shrink-0 items-center"
          aria-label={site.name}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logo-wordmark.svg"
            alt={site.name}
            className="header-logo-img"
          />
        </Link>

        <nav className="nav-desktop" aria-label="Hlavní menu">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${active ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
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

        <button
          type="button"
          className="nav-mobile-btn header-menu-btn"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-1">
            <span className="header-menu-bar" />
            <span className="header-menu-bar" />
            <span className="header-menu-bar" />
          </span>
        </button>
      </div>

      {open && (
        <div className="header-mobile-panel md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobilní menu">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link-mobile"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="nav-link-mobile font-semibold"
              data-track="tel-header-mobile"
              onClick={() => setOpen(false)}
            >
              Tel: {site.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
