import Image from "next/image";
import Link from "next/link";
import type { Product, Spec } from "@/data/site";
import { site } from "@/data/site";

export type ProductCardData = {
  name: string;
  slug: string;
  categorySlug: string;
  image: string | null;
  specs: Spec[];
  priceLabel: string | null;
};

export function toProductCardData(product: Product): ProductCardData {
  const cell = product.pricing?.[0]?.prices?.[0]?.price;
  let priceLabel: string | null = null;
  if (cell) {
    const match = cell.match(/[\d\s]+(?:,\d+)?\s*Kč/);
    priceLabel = match ? match[0].replace(/\s+/g, " ").trim() : null;
  }
  return {
    name: product.name,
    slug: product.slug,
    categorySlug: product.categorySlug,
    image: product.image,
    specs: product.specs.slice(0, 3),
    priceLabel,
  };
}

export function ProductCard({
  product,
  categoryName,
}: {
  product: ProductCardData;
  categoryName?: string;
}) {
  const productHref = `/pujcovna/${product.categorySlug}/${product.slug}`;

  return (
    <article className="pv-card card-lift group flex h-full flex-col overflow-hidden">
      <Link
        href={productHref}
        className="relative flex aspect-[4/3] items-center justify-center bg-white p-4"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={320}
            height={240}
            loading="lazy"
            quality={55}
            className="max-h-full max-w-full object-contain"
            sizes="160px"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryName ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {categoryName}
          </p>
        ) : null}
        <Link href={productHref}>
          <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        {product.specs.length > 0 ? (
          <ul className="mt-auto space-y-1 text-xs text-muted">
            {product.specs.map((s) => (
              <li key={s.label}>
                <span className="text-ink/70">{s.label}</span> {s.value}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-auto" />
        )}
        {product.priceLabel ? (
          <p className="pt-1 text-sm font-semibold text-brand">
            {product.priceLabel}
          </p>
        ) : null}
        <div className="card-cta mt-2 grid grid-cols-2 gap-2">
          <Link href={productHref} className="card-cta-btn is-primary col-span-2">
            Půjčit
          </Link>
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="card-cta-btn"
            data-track="tel-card"
          >
            Zavolat
          </a>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(
              `Dostupnost: ${product.name}`
            )}`}
            className="card-cta-btn"
          >
            E-mail
          </a>
        </div>
      </div>
    </article>
  );
}
