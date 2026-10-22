import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = "https://www.pujcovnavendryne.cz";
const catalogPath = join(ROOT, "src", "data", "catalog.json");
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

const xml = readFileSync(join(ROOT, "..", ".firecrawl", "page-sitemap.xml"), "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const categoryBySlug = new Map(catalog.categories.map((c) => [c.slug, c]));
const existing = new Set(
  catalog.categories.flatMap((c) => c.products.map((p) => `${c.slug}/${p.slug}`))
);

function absolutize(src) {
  if (!src) return null;
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) return `${BASE}${src}`;
  return src;
}

function text($el) {
  return $el.text().replace(/\s+/g, " ").trim();
}

function parseUrl(url) {
  const path = url.replace(BASE, "").replace(/\/$/, "");
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "pujcovna" && parts.length >= 3) {
    return { categorySlug: parts[1], slug: parts[2], href: url };
  }
  if (
    parts.length === 1 &&
    /(plosina|genie|nifty|sloupcova|teleskopicka|nuzkova|kloubova|privesna)/i.test(
      parts[0]
    )
  ) {
    return { categorySlug: "dieselove-plosiny", slug: parts[0], href: url };
  }
  return null;
}

async function scrapeProduct({ categorySlug, slug, href }) {
  const res = await fetch(href, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PujcovnaRebuild/1.0)" },
  });
  if (!res.ok) throw new Error(`${res.status}`);
  const $ = cheerio.load(await res.text());
  const title =
    text($("h1").first()) ||
    text($("title").first()).replace(/\s*-\s*Půjčovna Vendryně.*$/i, "") ||
    slug;
  const image =
    absolutize(
      $(".entry-content img, .wp-block-image img, article img")
        .first()
        .attr("src")
    ) || absolutize($('meta[property="og:image"]').attr("content"));

  const specs = [];
  $("table").each((_, table) => {
    const rows = $(table).find("tr");
    const first = text($(rows.first()).find("td, th").first()).toLowerCase();
    if (first.includes("doba") || first.includes("cena")) return;
    rows.each((__, tr) => {
      const cells = $(tr).find("td, th");
      if (cells.length >= 2) {
        const label = text($(cells[0]));
        const value = text($(cells[1]));
        if (label && value) specs.push({ label, value });
      }
    });
  });

  const pricing = [];
  let pricingNote = null;
  $("table").each((_, table) => {
    const rows = $(table).find("tr");
    const header = text($(rows.first()).find("td, th").first()).toLowerCase();
    if (!header.includes("doba") && !header.includes("cena")) return;
    const headers = [];
    $(rows.first())
      .find("td, th")
      .each((__, cell) => headers.push(text($(cell))));
    rows.slice(1).each((__, tr) => {
      const cells = $(tr).find("td, th");
      if (cells.length < 2) return;
      const prices = [];
      cells.slice(1).each((i, cell) => {
        prices.push({ period: headers[i + 1] || "", price: text($(cell)) });
      });
      pricing.push({ label: text($(cells[0])), prices });
    });
  });
  const bodyText = text($(".entry-content, article, main"));
  const noteMatch = bodyText.match(/Cena je uvedena[^.]+\./i);
  if (noteMatch) pricingNote = noteMatch[0];

  let description = null;
  $(".entry-content p, article p").each((_, p) => {
    const t = text($(p));
    if (
      t &&
      t.length > 20 &&
      !/kontaktní údaje|otevírací doba/i.test(t) &&
      !description
    ) {
      description = t;
    }
  });

  return {
    name: title,
    slug,
    categorySlug,
    image,
    specs,
    pricing,
    pricingNote,
    description,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const missing = [];
for (const loc of locs) {
  const parsed = parseUrl(loc);
  if (!parsed) continue;
  if (!categoryBySlug.has(parsed.categorySlug)) continue;
  const key = `${parsed.categorySlug}/${parsed.slug}`;
  if (existing.has(key)) continue;
  missing.push(parsed);
}

console.log(`Missing from sitemap: ${missing.length}`);

for (let i = 0; i < missing.length; i++) {
  const item = missing[i];
  try {
    const product = await scrapeProduct(item);
    categoryBySlug.get(item.categorySlug).products.push(product);
    existing.add(`${item.categorySlug}/${item.slug}`);
    if (i % 10 === 0) console.log(`${i}/${missing.length} ${product.name}`);
  } catch (err) {
    console.log(`FAIL ${item.href} ${err.message}`);
  }
  await sleep(80);
}

for (const c of catalog.categories) {
  c.productCount = c.products.length;
}

catalog.site.facebook =
  "https://www.facebook.com/P%C5%AFj%C4%8Dovna-Vendryn%C4%9B-287037822017584";
catalog.scrapedAt = new Date().toISOString();

writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log(
  "Total products:",
  catalog.categories.reduce((n, c) => n + c.products.length, 0)
);
