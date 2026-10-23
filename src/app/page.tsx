import Link from "next/link";
import { Hero } from "@/components/Hero";
import { HomeCatalog } from "@/components/HomeCatalog";
import { HomeMap } from "@/components/HomeMap";
import { HomeReviews } from "@/components/HomeReviews";
import { site } from "@/data/site";

export default function HomePage() {
  return (
    <>
      <Hero />

      <HomeCatalog />

      <section className="surface-band py-16 md:py-20">
        <div className="container-pv grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="section-title section-title-left section-title-on-light">
              {site.serviceTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {site.serviceText}
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted">
              <p>{site.address}</p>
              <p>
                {site.hours.weekdays}, {site.hours.saturday}
              </p>
            </div>
            <a
              href={`tel:${site.phoneAlt.replace(/\s/g, "")}`}
              className="btn btn-primary mt-6"
              data-track="tel-service"
            >
              {site.phoneAlt}
            </a>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-surface px-6 py-10 text-center md:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">
              Servis a půjčovna
            </p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
              {site.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {site.address}
            </p>
            <Link href="/kontakt" className="btn btn-dark mt-6">
              Kontakt
            </Link>
          </div>
        </div>
      </section>

      <HomeReviews />

      <HomeMap />
    </>
  );
}
