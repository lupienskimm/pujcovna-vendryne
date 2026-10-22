"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Úvod" },
  { href: "/pujcovna", label: "Půjčovna" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand text-white">
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
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white text-brand"
                    : "text-white hover:bg-white/15"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="ml-2 inline-flex !min-h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
          >
            {site.phoneDisplay}
          </a>
        </nav>

        <button
          type="button"
          className="nav-mobile-btn h-10 w-10 items-center justify-center rounded-full border border-white/30"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-4 flex-col gap-1">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </span>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/15 px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobilní menu">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-white/15"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
