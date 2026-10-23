import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/site";
import { site } from "@/data/site";

function firstPrice(product: Product) {
  const cell = product.pricing?.[0]?.prices?.[0]?.price;
  if (!cell) return null;
  const match = cell.match(/[\d\s]+(?:,\d+)?\s*Kč/);
  return match ? match[0].replace(/\s+/g, " ").trim() : null;
}

export function ProductCard({
  product,
  categoryName,
}: {
  product: Product;
  categoryName?: string;
}) {
  const price = firstPrice(product);
  const rentHref = `/pujcit?stroj=${encodeURIComponent(
    `${categoryName ? `${categoryName} — ` : ""}${product.name}`
  )}`;

  return (
    <article className="pv-card card-lift group flex h-full flex-col overflow-hidden">
      <Link
        href={`/pujcovna/${product.categorySlug}/${product.slug}`}
        className="relative aspect-[4/3] bg-white"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            loading="lazy"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryName ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {categoryName}
          </p>
        ) : null}
        <Link href={`/pujcovna/${product.categorySlug}/${product.slug}`}>
          <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">
            {product.name}
          </h3>
        </Link>
        {product.specs.slice(0, 3).length > 0 ? (
          <ul className="mt-auto space-y-1 text-xs text-muted">
            {product.specs.slice(0, 3).map((s) => (
              <li key={s.label}>
                <span className="text-ink/70">{s.label}</span> {s.value}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-auto" />
        )}
        {price ? (
          <p className="pt-1 text-sm font-semibold text-brand">{price}</p>
        ) : null}
        <div className="card-cta mt-2 flex flex-wrap gap-2">
          <a
            href={`tel:${site.phone.replace(/\s/g, "")}`}
            className="card-cta-btn"
            data-track="tel-card"
          >
            Zavolat
          </a>
          <Link href={rentHref} className="card-cta-btn is-primary">
            Půjčit
          </Link>
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent(
              `Dostupnost: ${product.name}`
            )}`}
            className="card-cta-btn"
          >
            Dostupnost
          </a>
        </div>
      </div>
    </article>
  );
}
