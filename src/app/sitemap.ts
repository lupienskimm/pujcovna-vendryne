import type { MetadataRoute } from "next";
import { categories } from "@/data/site";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pujcovna.azervera.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/pujcovna",
    "/pujcit",
    "/kontakt",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${siteUrl}/pujcovna/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productRoutes = categories.flatMap((c) =>
    c.products.map((p) => ({
      url: `${siteUrl}/pujcovna/${c.slug}/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
