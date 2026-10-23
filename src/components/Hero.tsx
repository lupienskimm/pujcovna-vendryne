import Link from "next/link";
import { site } from "@/data/site";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <>
      <section className="hero-panel relative overflow-hidden bg-ink text-white">
        <div className="hero-media" aria-hidden />
        <div className="hero-scrim" aria-hidden />

        <div className="container-pv relative pb-14 pt-12 md:pb-20 md:pt-20">
          <p
            className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70"
            style={{
              fontFamily:
                'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',
            }}
          >
            {site.name}
          </p>
          <h1
            className="mt-3 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight md:text-5xl"
            style={{
              color: "#fff",
              fontFamily:
                'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',
            }}
          >
            {site.heroTitle}
          </h1>
          <p className="hero-intro mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {site.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <span>{site.hours.weekdays}</span>
            <span>{site.hours.saturday}</span>
            <span>{site.address}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/pujcovna" prefetch={false} className="btn btn-primary">
              Sortiment
            </Link>
            <Link href="/pujcit" prefetch={false} className="btn btn-ghost">
              Půjčit stroj
            </Link>
            <Link href="/kontakt" prefetch={false} className="btn btn-ghost">
              Kontakt
            </Link>
          </div>
        </div>
      </section>

      <div className="container-pv relative z-10 -mt-8 md:-mt-10">
        <SearchBar />
      </div>
    </>
  );
}
