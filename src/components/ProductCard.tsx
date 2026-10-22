import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/site";

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

  return (
    <Link
      href={`/pujcovna/${product.categorySlug}/${product.slug}`}
      className="pv-card card-lift group flex h-full flex-col overflow-hidden border border-line bg-white"
    >
      <div className="relative aspect-[4/3] bg-white">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {categoryName ? (
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            {categoryName}
          </p>
        ) : null}
        <h3 className="text-[15px] font-semibold leading-snug text-ink group-hover:text-brand">
          {product.name}
        </h3>
        {product.specs.slice(0, 3).length > 0 ? (
          <ul className="mt-auto space-y-1 text-xs text-muted">
            {product.specs.slice(0, 3).map((s) => (
              <li key={s.label}>
                <span className="text-ink/70">{s.label}</span> {s.value}
              </li>
            ))}
          </ul>
        ) : null}
        {price ? (
          <p className="pt-1 text-sm font-semibold text-brand">{price}</p>
        ) : null}
      </div>
    </Link>
  );
}
