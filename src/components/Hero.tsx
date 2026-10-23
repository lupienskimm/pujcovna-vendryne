import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { SearchBar } from "./SearchBar";

export function Hero() {
  return (
    <>
      <section className="hero-panel relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0">
          <Image
            src="/hero/excavator.jpg"
            alt=""
            fill
            priority
            quality={70}
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

        <div className="container-pv relative pb-16 pt-14 md:pb-20 md:pt-20">
          <p className="hero-eyebrow animate-fade-up text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
            {site.name}
          </p>
          <h1 className="animate-fade-up delay-1 mt-3 max-w-3xl text-3xl font-bold leading-[1.12] tracking-tight md:text-5xl">
            {site.heroTitle}
          </h1>
          <p className="animate-fade-up delay-2 mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
            {site.intro}
          </p>
          <div className="animate-fade-up delay-3 mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <span>{site.hours.weekdays}</span>
            <span>{site.hours.saturday}</span>
            <span>{site.address}</span>
          </div>
          <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
            <Link href="/pujcovna" className="btn btn-primary">
              Půjčovna
            </Link>
            <Link href="/pujcit" className="btn btn-ghost">
              Půjčit stroj
            </Link>
            <Link href="/kontakt" className="btn btn-ghost">
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
