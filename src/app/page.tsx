import Image from "next/image";
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

      <section className="pt-20 pb-16 md:pt-24 md:pb-20">
        <div className="container-pv">
          <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
            Půjčovna
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
          {featured.length > 0 ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map(({ product, categoryName }) => (
                <ProductCard
                  key={`${product.categorySlug}-${product.slug}`}
                  product={product}
                  categoryName={categoryName}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-y border-line bg-white py-16 md:py-20">
        <div className="container-pv grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
              {site.serviceTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {site.serviceText}
            </p>
            <a
              href={`tel:${site.phoneAlt.replace(/\s/g, "")}`}
              className="btn btn-primary mt-6"
            >
              {site.phoneAlt}
            </a>
          </div>
          <div className="overflow-hidden rounded-[20px] bg-white">
            <Image
              src={site.heroImage}
              alt={site.heroTitle}
              width={1200}
              height={630}
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
