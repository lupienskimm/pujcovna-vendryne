import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { SearchBar } from "./SearchBar";

const HERO_BG =
  "https://www.pujcovnavendryne.cz/wp-content/uploads/2021/05/Takeuchi-TB-210-siroko.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
      </div>

      <div className="container-pv relative pb-24 pt-14 md:pb-28 md:pt-20">
        <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
          {site.name}
        </p>
        <h1 className="animate-fade-up delay-1 mt-3 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight md:text-5xl">
          {site.heroTitle}
        </h1>
        <p className="animate-fade-up delay-2 mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
          {site.intro}
        </p>
        <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
          <Link href="/pujcovna" className="btn btn-primary">
            Půjčovna
          </Link>
          <Link href="/kontakt" className="btn btn-ghost">
            Kontakt
          </Link>
        </div>
      </div>

      <div className="container-pv relative -mb-10 md:-mb-12">
        <SearchBar />
      </div>
    </section>
  );
}
