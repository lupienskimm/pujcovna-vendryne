"use client";

import Image from "next/image";
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
    <header className="sticky top-0 z-50">
      <div className="bg-ink text-white">
        <div className="container-pv flex h-9 items-center justify-between gap-4 text-[13px]">
          <p className="truncate opacity-90">{site.address}</p>
          <div className="flex shrink-0 items-center gap-4">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hover:text-white/80"
            >
              Tel: {site.phoneDisplay}
            </a>
            <a href={`mailto:${site.email}`} className="hidden sm:inline hover:text-white/80">
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-white/95 backdrop-blur-md">
        <div className="container-pv flex h-14 items-center justify-between gap-4 md:h-16">
          <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand md:h-10 md:w-10">
              <Image
                src="/logos/logo-mark.svg"
                alt=""
                width={28}
                height={30}
                className="brightness-0 invert"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-tight text-ink md:text-base">
                {site.name}
              </span>
              <span className="hidden max-w-[280px] truncate text-[11px] text-muted lg:block">
                {site.tagline}
              </span>
            </span>
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
                      ? "bg-brand text-white"
                      : "text-ink hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="btn btn-primary ml-2 !min-h-10 !px-4 text-sm"
            >
              {site.phoneDisplay}
            </a>
          </nav>

          <button
            type="button"
            className="nav-mobile-btn h-10 w-10 items-center justify-center rounded-full border border-line"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1">
              <span className="h-0.5 w-full bg-ink" />
              <span className="h-0.5 w-full bg-ink" />
              <span className="h-0.5 w-full bg-ink" />
            </span>
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobilní menu">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
