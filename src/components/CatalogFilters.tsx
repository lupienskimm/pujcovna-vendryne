"use client";

import { useMemo, useState, useTransition } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard, toProductCardData } from "@/components/ProductCard";
import { ProductSkeletonGrid } from "@/components/ProductSkeleton";
import type { Category, Product } from "@/data/site";

function specValue(product: Product, labels: string[]) {
  const hit = product.specs.find((s) =>
    labels.some((l) => s.label.replace(/:$/, "").toLowerCase() === l.toLowerCase())
  );
  return hit?.value ?? "";
}

function hasPower(product: Product, band: string) {
  if (band === "all") return true;
  const raw = specValue(product, ["Výkon"]);
  const num = parseFloat(raw.replace(",", ".").replace(/[^\d.]/g, ""));
  if (Number.isNaN(num)) return band === "unknown";
  if (band === "small") return num < 20;
  if (band === "mid") return num >= 20 && num < 50;
  if (band === "large") return num >= 50;
  return true;
}

function hasVoltage(product: Product, band: string) {
  if (band === "all") return true;
  const raw = specValue(product, ["Napětí"]).toLowerCase();
  if (!raw) return band === "unknown";
  if (band === "230") return raw.includes("230");
  if (band === "400") return raw.includes("400");
  return true;
}

export function CatalogFilters({
  categories,
  initialCategory = "all",
}: {
  categories: Category[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [power, setPower] = useState("all");
  const [voltage, setVoltage] = useState("all");
  const [pending, startTransition] = useTransition();

  const products = useMemo(() => {
    const pool =
      category === "all"
        ? categories.flatMap((c) =>
            c.products.map((p) => ({ product: p, categoryName: c.name }))
          )
        : categories
            .filter((c) => c.slug === category)
            .flatMap((c) =>
              c.products.map((p) => ({ product: p, categoryName: c.name }))
            );

    return pool.filter(
      ({ product }) => hasPower(product, power) && hasVoltage(product, voltage)
    );
  }, [categories, category, power, voltage]);

  return (
    <div>
      <div className="catalog-filters">
        <label>
          <span>Kategorie</span>
          <select
            value={category}
            onChange={(e) =>
              startTransition(() => setCategory(e.target.value))
            }
          >
            <option value="all">Všechny</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Výkon</span>
          <select
            value={power}
            onChange={(e) => startTransition(() => setPower(e.target.value))}
          >
            <option value="all">Vše</option>
            <option value="small">Do 20 kW</option>
            <option value="mid">20–50 kW</option>
            <option value="large">Nad 50 kW</option>
            <option value="unknown">Neuvedeno</option>
          </select>
        </label>
        <label>
          <span>Napětí</span>
          <select
            value={voltage}
            onChange={(e) => startTransition(() => setVoltage(e.target.value))}
          >
            <option value="all">Vše</option>
            <option value="230">230 V</option>
            <option value="400">400 V</option>
            <option value="unknown">Neuvedeno</option>
          </select>
        </label>
      </div>

      {category === "all" && power === "all" && voltage === "all" ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      ) : pending ? (
        <div className="mt-8">
          <ProductSkeletonGrid count={6} />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <p className="page-meta col-span-full text-sm">
              Nic neodpovídá filtru.
            </p>
          ) : (
            products.map(({ product, categoryName }) => (
              <ProductCard
                key={`${product.categorySlug}-${product.slug}`}
                product={toProductCardData(product)}
                categoryName={categoryName}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
