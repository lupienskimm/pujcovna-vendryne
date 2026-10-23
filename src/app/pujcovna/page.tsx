import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { categories } from "@/data/site";
import { searchProducts } from "@/lib/search";

type Props = {
  searchParams: Promise<{ q?: string; kategorie?: string }>;
};

export const metadata: Metadata = {
  title: "Sortiment",
  description:
    "Kompletní katalog stavební techniky k půjčení — rypadla, dumpery, plošiny a další.",
};

export default async function PujcovnaPage({ searchParams }: Props) {
  const { q, kategorie } = await searchParams;
  const results = q ? searchProducts(q) : [];

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <Breadcrumbs
          items={[
            { href: "/", label: "Úvod" },
            { label: "Sortiment" },
          ]}
        />
        <h1 className="page-heading mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Sortiment
        </h1>
        <div className="mt-6 max-w-3xl">
          <SearchBar />
        </div>

        {q ? (
          <section className="mt-10">
            <h2 className="page-heading text-xl font-semibold">
              Výsledky pro „{q}“
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.length === 0 ? (
                <p className="page-meta">Nic nenalezeno.</p>
              ) : (
                results.map((product) => (
                  <ProductCard
                    key={`${product.categorySlug}-${product.slug}`}
                    product={product}
                    categoryName={product.categoryName}
                  />
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="mt-10">
            <CatalogFilters
              categories={categories}
              initialCategory={kategorie || "all"}
            />
          </section>
        )}
      </div>
    </div>
  );
}
