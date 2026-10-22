import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { SearchBar } from "./SearchBar";

const HERO_BG =
  "https://images.pexels.com/photos/1078884/pexels-photo-1078884.jpeg?auto=compress&cs=tinysrgb&w=2400";

export function Hero() {
  return (
    <section className="hero-panel relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt=""
          fill
          priority
          className="object-cover object-[center_45%] opacity-50"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,.82) 0%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.35) 100%)",
          }}
        />
      </div>

      <div className="container-pv relative pb-24 pt-14 md:pb-28 md:pt-20">
        <p className="hero-eyebrow animate-fade-up text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
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
