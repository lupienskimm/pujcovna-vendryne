import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, searchProducts } from "@/data/site";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata = {
  title: "Půjčovna",
};

export default async function PujcovnaPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const results = q ? searchProducts(q) : [];

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Půjčovna
        </h1>
        <div className="mt-6 max-w-3xl">
          <SearchBar />
        </div>

        {q ? (
          <section className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((product) => (
                <ProductCard
                  key={`${product.categorySlug}-${product.slug}`}
                  product={product}
                  categoryName={product.categoryName}
                />
              ))}
            </div>
          </section>
        ) : (
          <section className="mt-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
