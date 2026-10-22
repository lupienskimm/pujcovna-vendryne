import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/data/site";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/pujcovna/${category.slug}`}
      className="pv-card card-lift group flex items-center justify-between gap-4 border border-line bg-white p-4"
    >
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold text-ink group-hover:text-brand">
          {category.name}
        </h3>
      </div>
      <div className="pv-card-media relative h-16 w-20 shrink-0 overflow-hidden bg-white">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-contain p-1"
            sizes="80px"
          />
        ) : null}
      </div>
    </Link>
  );
}
