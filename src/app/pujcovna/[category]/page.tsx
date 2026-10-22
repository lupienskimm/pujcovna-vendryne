import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory } from "@/data/site";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  return { title: category?.name ?? "Půjčovna" };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <nav className="text-sm text-muted">
          <Link href="/pujcovna" className="hover:text-brand">
            Půjčovna
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{category.name}</span>
        </nav>
        <h1 className="page-heading mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          {category.name}
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
