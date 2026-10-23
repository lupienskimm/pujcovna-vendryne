import Image from "next/image";
import Link from "next/link";
import { CategoryCard } from "@/components/CategoryCard";
import { Hero } from "@/components/Hero";
import { MapBlock } from "@/components/MapBlock";
import { ProductCard } from "@/components/ProductCard";
import { Reviews } from "@/components/Reviews";
import { categories, site } from "@/data/site";

export default function HomePage() {
  const featured = categories
    .flatMap((c) =>
      c.products.slice(0, 1).map((p) => ({ product: p, categoryName: c.name }))
    )
    .slice(0, 8);

  return (
    <>
      <Hero />

      <section className="pt-14 pb-10 md:pt-16 md:pb-12">
        <div className="container-pv">
          <h2 className="section-title">Kategorie</h2>
          <p className="page-meta mx-auto mt-3 max-w-2xl text-center text-sm">
            Vyberte typ techniky a prohlédněte kompletní sortiment.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pujcovna" className="btn btn-primary">
              Celý sortiment
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="pb-16 pt-6 md:pb-20 md:pt-8">
          <div className="container-pv">
            <h2 className="section-title">Výběr strojů</h2>
            <p className="page-meta mx-auto mt-3 max-w-2xl text-center text-sm">
              Ukázka strojů z jednotlivých kategorií — ceny a specifikace najdete
              u detailu.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map(({ product, categoryName }) => (
                <ProductCard
                  key={`${product.categorySlug}-${product.slug}`}
                  product={product}
                  categoryName={categoryName}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-white">
            <Image
              src={site.heroImage}
              alt={site.heroTitle}
              width={1200}
              height={630}
              loading="lazy"
              className="h-auto w-full object-contain"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <Reviews />

      <MapBlock />
    </>
  );
}
