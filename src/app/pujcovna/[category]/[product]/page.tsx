import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RentalForm } from "@/components/RentalForm";
import {
  categories,
  getCategory,
  getProduct,
  site,
} from "@/data/site";

type Props = {
  params: Promise<{ category: string; product: string }>;
};

export function generateStaticParams() {
  return categories.flatMap((c) =>
    c.products.map((p) => ({ category: c.slug, product: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product } = await params;
  const item = getProduct(category, product);
  const cat = getCategory(category);
  if (!item) return { title: "Stroj" };
  return {
    title: item.name,
    description:
      item.description ??
      `${item.name} k půjčení — ${cat?.name ?? ""} | ${site.name}`,
    openGraph: {
      title: `${item.name} | ${site.name}`,
      description: item.description ?? undefined,
      images: item.image ? [{ url: item.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, product: productSlug } = await params;
  const category = getCategory(categorySlug);
  const product = getProduct(categorySlug, productSlug);
  if (!category || !product) notFound();

  const machineValue = `${category.name} — ${product.name}`;

  return (
    <div className="pb-16 pt-8 md:pb-20 md:pt-12">
      <div className="container-pv">
        <Breadcrumbs
          items={[
            { href: "/", label: "Úvod" },
            { href: "/pujcovna", label: "Sortiment" },
            { href: `/pujcovna/${category.slug}`, label: category.name },
            { label: product.name },
          ]}
        />

        <div className="product-layout mt-6 md:mt-8">
          <div className="product-intro">
            <p className="page-meta text-sm font-medium">{category.name}</p>
            <h1 className="page-heading mt-1 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-3 text-sm leading-relaxed text-white/80 md:text-base">
                {product.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="btn btn-primary"
                data-track="tel-product"
              >
                Tel: {site.phoneDisplay}
              </a>
              <a
                href={`mailto:${site.email}`}
                className="btn border border-line bg-white text-ink"
              >
                E-mail
              </a>
            </div>
          </div>

          <div className="product-media relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white sm:aspect-square lg:aspect-[4/3]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4 sm:p-6"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>

          <div className="product-rent surface-panel p-4 sm:p-6 md:p-8">
            <h2 className="text-lg font-semibold text-ink">Půjčit tento stroj</h2>
            <div className="mt-4">
              <RentalForm defaultMachine={machineValue} />
            </div>
          </div>

          <div className="product-details space-y-6">
            {product.specs.length > 0 ? (
              <div className="surface-panel overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map((spec) => (
                      <tr
                        key={spec.label}
                        className="border-b border-line last:border-0"
                      >
                        <th className="w-[40%] bg-surface px-3 py-2.5 text-left font-medium text-ink sm:px-4 sm:py-3">
                          {spec.label}
                        </th>
                        <td className="bg-white px-3 py-2.5 text-muted sm:px-4 sm:py-3">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {product.pricing.length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Cena vypůjčení
                </h2>
                <div className="price-cards mt-3 md:hidden">
                  {product.pricing.map((row) => (
                    <div key={row.label} className="price-card">
                      <p className="price-card-title">{row.label}</p>
                      <ul className="price-card-list">
                        {row.prices.map((p) => (
                          <li key={p.period}>
                            <span>{p.period}</span>
                            <strong>{p.price}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="surface-panel mt-3 hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="bg-surface text-left">
                        <th className="px-4 py-3 font-medium text-ink">
                          Doba vypůjčení
                        </th>
                        {product.pricing[0]?.prices.map((p) => (
                          <th
                            key={p.period}
                            className="px-4 py-3 font-medium text-ink"
                          >
                            {p.period}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.pricing.map((row) => (
                        <tr
                          key={row.label}
                          className="border-t border-line bg-white"
                        >
                          <td className="px-4 py-3 font-medium text-ink">
                            {row.label}
                          </td>
                          {row.prices.map((p) => (
                            <td key={p.period} className="px-4 py-3 text-muted">
                              {p.price}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {product.pricingNote ? (
                  <p className="page-meta mt-3 text-sm">{product.pricingNote}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
