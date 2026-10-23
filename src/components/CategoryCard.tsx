import Image from "next/image";
import Link from "next/link";

export type CategoryCardData = {
  name: string;
  slug: string;
  image: string | null;
};

export function CategoryCard({ category }: { category: CategoryCardData }) {
  return (
    <Link
      href={`/pujcovna/${category.slug}`}
      className="pv-card card-lift group flex items-center justify-between gap-4 p-4"
    >
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-semibold text-ink group-hover:text-brand">
          {category.name}
        </h3>
      </div>
      <div className="pv-card-media relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden bg-white">
        {category.image ? (
          <Image
            src={category.image}
            alt=""
            width={80}
            height={64}
            loading="lazy"
            quality={55}
            className="max-h-full max-w-full object-contain p-1"
            sizes="80px"
          />
        ) : null}
      </div>
    </Link>
  );
}
