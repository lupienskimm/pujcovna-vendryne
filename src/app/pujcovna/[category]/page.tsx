import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, site } from "@/data/site";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Kategorie" };
  return {
    title: category.name,
    description: `Půjčení: ${category.name} — ${category.productCount} strojů u ${site.name}. ${site.address}.`,
    openGraph: {
      title: `${category.name} | ${site.name}`,
      description: `Katalog ${category.name.toLowerCase()} k půjčení ve Vendryni.`,
      images: category.image ? [{ url: category.image }] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <Breadcrumbs
          items={[
            { href: "/", label: "Úvod" },
            { href: "/pujcovna", label: "Půjčovna" },
            { label: category.name },
          ]}
        />
        <h1 className="page-heading mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {category.name}
        </h1>
        <p className="page-meta mt-2 text-sm">
          {category.productCount} strojů · {site.hours.weekdays}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
