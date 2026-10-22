import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

export async function generateMetadata({ params }: Props) {
  const { category, product } = await params;
  const item = getProduct(category, product);
  return { title: item?.name ?? "Stroj" };
}

export default async function ProductPage({ params }: Props) {
  const { category: categorySlug, product: productSlug } = await params;
  const category = getCategory(categorySlug);
  const product = getProduct(categorySlug, productSlug);
  if (!category || !product) notFound();

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <nav className="text-sm text-muted">
          <Link href="/pujcovna" className="hover:text-brand">
            Půjčovna
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/pujcovna/${category.slug}`} className="hover:text-brand">
            {category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-line bg-surface lg:aspect-[4/3]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-6"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
              />
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium text-muted">{category.name}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
              {product.name}
            </h1>
            {product.description ? (
              <p className="mt-4 text-base leading-relaxed text-muted">
                {product.description}
              </p>
            ) : null}

            {product.specs.length > 0 ? (
              <div className="mt-8 overflow-hidden rounded-[16px] border border-line">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map((spec) => (
                      <tr key={spec.label} className="border-b border-line last:border-0">
                        <th className="w-[42%] bg-surface px-4 py-3 text-left font-medium text-ink">
                          {spec.label}
                        </th>
                        <td className="px-4 py-3 text-muted">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {product.pricing.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-ink">Cena vypůjčení</h2>
                <div className="mt-3 overflow-x-auto rounded-[16px] border border-line">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="bg-surface text-left">
                        <th className="px-4 py-3 font-medium">Doba vypůjčení</th>
                        {product.pricing[0]?.prices.map((p) => (
                          <th key={p.period} className="px-4 py-3 font-medium">
                            {p.period}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.pricing.map((row) => (
                        <tr key={row.label} className="border-t border-line">
                          <td className="px-4 py-3 font-medium text-ink">{row.label}</td>
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
                  <p className="mt-3 text-sm text-muted">{product.pricingNote}</p>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 rounded-[18px] bg-surface p-5">
              <p className="text-sm leading-relaxed text-muted">
                V případě zájmu nás kontaktujte přes kontaktní formulář, telefonicky či email:
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="btn btn-primary"
                >
                  Tel: {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="btn btn-dark">
                  E-mail
                </a>
                <Link href="/kontakt" className="btn border border-line bg-white text-ink">
                  Kontakt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
