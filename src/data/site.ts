import catalog from "./catalog.json";

export type Spec = { label: string; value: string };
export type PriceCell = { period: string; price: string };
export type PricingRow = { label: string; prices: PriceCell[] };

export type Product = {
  name: string;
  slug: string;
  categorySlug: string;
  image: string | null;
  specs: Spec[];
  pricing: PricingRow[];
  pricingNote: string | null;
  description: string | null;
};

export type Category = {
  name: string;
  slug: string;
  path: string;
  image: string | null;
  productCount: number;
  products: Product[];
};

export const site = catalog.site;
export const categories = catalog.categories as Category[];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(
  categorySlug: string,
  productSlug: string
): Product | undefined {
  return getCategory(categorySlug)?.products.find((p) => p.slug === productSlug);
}

export function allProducts(): (Product & { categoryName: string })[] {
  return categories.flatMap((c) =>
    c.products.map((p) => ({ ...p, categoryName: c.name }))
  );
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return allProducts().filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.slug.includes(q)
  );
}
