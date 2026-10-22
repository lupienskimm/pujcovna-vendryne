import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as cheerio from "cheerio";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE = "https://www.pujcovnavendryne.cz";

const CATEGORIES = [
  { name: "Rypadla", slug: "rypadla", path: "/pujcovna/rypadla/" },
  {
    name: "Příslušenství k rypadlům",
    slug: "prislusenstvi-k-rypadlum",
    path: "/pujcovna/prislusenstvi-k-rypadlum/",
  },
  { name: "Dumpery", slug: "dumpery", path: "/pujcovna/dumpery/" },
  {
    name: "Vibrační technika",
    slug: "vibracni-technika",
    path: "/pujcovna/vibracni-technika/",
  },
  { name: "Nakladače", slug: "nakladace", path: "/pujcovna/nakladace/" },
  {
    name: "Manipulátory",
    slug: "manipulatory",
    path: "/pujcovna/manipulatory/",
  },
  {
    name: "Elektrocentrály",
    slug: "elektrocentraly",
    path: "/pujcovna/elektrocentraly/",
  },
  {
    name: "Řezací a brousící technika",
    slug: "rezaci-technika",
    path: "/pujcovna/rezaci-technika/",
  },
  {
    name: "Bourací a vrtací technika",
    slug: "bouraci-a-vrtaci-technika",
    path: "/pujcovna/bouraci-a-vrtaci-technika/",
  },
  { name: "Svářečky", slug: "svarecky", path: "/pujcovna/svarecky/" },
  {
    name: "Kotvení a spojování",
    slug: "kotveni-a-spojovani",
    path: "/pujcovna/kotveni-a-spojovani/",
  },
  { name: "Čerpadla", slug: "cerpadla", path: "/pujcovna/cerpadla/" },
  {
    name: "Odvlhčovač vzduchu, topidla",
    slug: "odvlhcovac-vzduchu-topidla",
    path: "/pujcovna/odvlhcovac-vzduchu-topidla/",
  },
  {
    name: "Elektrické plošiny",
    slug: "plosiny-a-leseni",
    path: "/pujcovna/plosiny-a-leseni/",
  },
  {
    name: "Dieselové plošiny",
    slug: "dieselove-plosiny",
    path: "/dieselove-plosiny/",
  },
  {
    name: "Měřící technika",
    slug: "merici-technika",
    path: "/pujcovna/merici-technika/",
  },
  {
    name: "Zahradní technika",
    slug: "zahradni-technika",
    path: "/pujcovna/zahradni-technika/",
  },
  {
    name: "Vysavače a čističe",
    slug: "vysavace-a-cistice",
    path: "/pujcovna/vysavace-a-cistice/",
  },
  {
    name: "Úprava betonu",
    slug: "uprava-betonu",
    path: "/pujcovna/uprava-betonu/",
  },
  { name: "Volný čas", slug: "volny-cas", path: "/pujcovna/volny-cas/" },
  { name: "Ostatní", slug: "ostatni", path: "/pujcovna/ostatni/" },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PujcovnaVendryneRebuild/1.0; +local)",
      Accept: "text/html",
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function absolutize(src) {
  if (!src) return null;
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("/")) return `${BASE}${src}`;
  return src;
}

function text($el) {
  return $el.text().replace(/\s+/g, " ").trim();
}

async function scrapeCategory(cat) {
  const url = `${BASE}${cat.path}`;
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  const image =
    absolutize(
      $(".entry-content img, .post-thumbnail img, article img")
        .first()
        .attr("src")
    ) ||
    absolutize($('meta[property="og:image"]').attr("content")) ||
    null;

  const products = [];
  const seen = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href") || "";
    const full = absolutize(href);
    if (!full || !full.startsWith(BASE)) return;

    const path = full.replace(BASE, "").replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);

    // product pages: /pujcovna/{cat}/{product} or top-level dieselové plošiny
    let productSlug = null;
    let categorySlug = cat.slug;

    if (
      parts[0] === "pujcovna" &&
      parts.length >= 3 &&
      (parts[1] === cat.slug ||
        (cat.slug === "plosiny-a-leseni" && parts[1] === "plosiny-a-leseni") ||
        (cat.slug === "dieselove-plosiny" && parts[1] === "dieselove-plosiny"))
    ) {
      productSlug = parts[2];
    } else if (
      cat.slug === "dieselove-plosiny" &&
      parts.length === 1 &&
      !["kontakt", "pujcovna"].includes(parts[0]) &&
      (parts[0].includes("plosina") ||
        parts[0].includes("genie") ||
        parts[0].includes("nifty") ||
        parts[0].includes("sloupcova") ||
        parts[0].includes("teleskopicka") ||
        parts[0].includes("nuzkova") ||
        parts[0].includes("kloubova") ||
        parts[0].includes("privesna"))
    ) {
      productSlug = parts[0];
      categorySlug = "dieselove-plosiny";
    } else if (
      cat.slug === "kotveni-a-spojovani" &&
      parts[0] === "pujcovna" &&
      parts[1] === "kotveni-a-spojovani" &&
      parts[2]
    ) {
      productSlug = parts[2];
    }

    if (!productSlug) return;
    if (seen.has(productSlug)) return;

    const name = text($(el)) || productSlug;
    // skip empty image-only duplicates later; keep first with name
    if (!name || name.length < 2) return;

    seen.add(productSlug);
    products.push({
      name: name.replace(/^Pásové rypadlo\s+/i, "Pásové rypadlo "),
      slug: productSlug,
      categorySlug,
      href: full,
      image: null,
      specs: [],
      pricing: [],
      pricingNote: null,
      description: null,
    });
  });

  return { ...cat, image, url, products };
}

async function scrapeProduct(product) {
  const html = await fetchHtml(product.href);
  const $ = cheerio.load(html);

  const title =
    text($("h1").first()) ||
    text($("title").first()).replace(/\s*-\s*Půjčovna Vendryně.*$/i, "") ||
    product.name;

  const image =
    absolutize(
      $(".entry-content img, .wp-block-image img, article img")
        .first()
        .attr("src")
    ) ||
    absolutize($('meta[property="og:image"]').attr("content")) ||
    null;

  const specs = [];
  $("table").each((_, table) => {
    const rows = $(table).find("tr");
    const firstCell = text($(rows.first()).find("td, th").first()).toLowerCase();
    if (firstCell.includes("doba") || firstCell.includes("cena")) return;

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
      const rowLabel = text($(cells[0]));
      const prices = [];
      cells.slice(1).each((i, cell) => {
        prices.push({
          period: headers[i + 1] || `Col ${i + 1}`,
          price: text($(cell)),
        });
      });
      pricing.push({ label: rowLabel, prices });
    });
  });

  const bodyText = text($(".entry-content, article .post-content, main"));
  const noteMatch = bodyText.match(
    /Cena je uvedena[^.]+\./i
  );
  if (noteMatch) pricingNote = noteMatch[0];

  // short description: first paragraph-like content before tables
  let description = null;
  $(".entry-content p, article p").each((_, p) => {
    const t = text($(p));
    if (
      t &&
      t.length > 20 &&
      !t.toLowerCase().includes("kontaktní údaje") &&
      !t.toLowerCase().includes("otevírací doba") &&
      !description
    ) {
      description = t;
    }
  });

  return {
    ...product,
    name: title,
    image,
    specs,
    pricing,
    pricingNote,
    description,
  };
}

async function mapPool(items, concurrency, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      try {
        results[idx] = await fn(items[idx], idx);
      } catch (err) {
        console.error("FAIL", items[idx]?.href || items[idx], err.message);
        results[idx] = null;
      }
      await sleep(80);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

async function main() {
  console.log("Scraping categories…");
  const categories = [];
  for (const cat of CATEGORIES) {
    process.stdout.write(`  ${cat.name}… `);
    try {
      const scraped = await scrapeCategory(cat);
      console.log(`${scraped.products.length} products`);
      categories.push(scraped);
    } catch (err) {
      console.log(`ERR ${err.message}`);
      categories.push({ ...cat, image: null, url: `${BASE}${cat.path}`, products: [] });
    }
    await sleep(150);
  }

  const allProducts = categories.flatMap((c) =>
    c.products.map((p) => ({ ...p, categoryName: c.name }))
  );
  console.log(`\nScraping ${allProducts.length} products…`);

  const detailed = await mapPool(allProducts, 6, async (p, idx) => {
    if (idx % 20 === 0) console.log(`  ${idx}/${allProducts.length}`);
    return scrapeProduct(p);
  });

  const bySlug = new Map();
  for (const p of detailed.filter(Boolean)) {
    bySlug.set(`${p.categorySlug}/${p.slug}`, p);
  }

  const catalog = {
    scrapedAt: new Date().toISOString(),
    site: {
      name: "Půjčovna Vendryně",
      tagline:
        "Pronájem, prodej a servis stavebních strojů – Rypadla, Dumpery, Plošiny",
      heroTitle: "PRONÁJEM, PRODEJ A SERVIS STAVEBNÍCH STROJŮ",
      intro:
        "Půjčovna Vendryně – odborníci na pronájem, prodej a servis stavební techniky v okolí Třince, Jablunkova a Frýdku. Nabízíme moderní rypadla, dumpery, nakladače a plošiny pro efektivní a bezpečné dokončení vašich projektů. Spolehněte se na kvalitu a profesionální služby.",
      serviceTitle: "Servis a Prodej",
      serviceText:
        "Nabízíme nejen půjčovnu, ale i prodej a servis strojů a stavební techniky. Pro více informací nás neváhejte kontaktovat na čísle +420 608 099 522.",
      reviewsTitle: "Recenze našich zákazníků",
      mapTitle: "Najdete nás zde:",
      phone: "+420 792 464 333",
      phoneDisplay: "792 464 333",
      phoneAlt: "+420 608 099 522",
      email: "info@pujcovnavendryne.cz",
      emailServis: "servis@pujcovnavendryne.cz",
      address: "Vendryně 1272, 739 94 Vendryně",
      ico: "08749949",
      dic: "CZ08749949",
      hours: {
        weekdays: "PO-PÁ: 7:00-16:00",
        saturday: "SO: 7:00-10:00",
        sunday: "NE: zavřeno.",
      },
      facebook: "https://www.facebook.com/pujcovnavendryne",
      heroImage:
        "https://www.pujcovnavendryne.cz/wp-content/uploads/2020/09/Projekt-Pujcovna-e1600943158267.jpg",
    },
    reviews: [
      {
        author: "DISK DISK",
        date: "2023-09-01",
        text: "Doporučuji, velice ochotný personál , poradí se strojem a používáním.. Skvěla domluva :) určitě se znovu stavím. Děkuji",
      },
      {
        author: "Michal Kopťár",
        date: "2023-08-12",
        text: "Navštíveno několikrát a vždy spokojenost. Když nevím, poradí. Rád se vracím.",
      },
      {
        author: "Martin Gryga",
        date: "2023-08-10",
        text: "Doporučuji",
      },
      {
        author: "Radim Górecki",
        date: "2022-12-29",
        text: "Vřele mohu doporučit. Půjčovnu jsem využil už několikrát. Jak s rezačkou na venkovní dlažbu, vibrační desku, tak teď i v zimě elektrické ohřívače. Mají zde opravdu velký výběr všeho co člověk nejvíc používá. Mají zde i velké stroje jako nakladače, plošiny apod. Ale s tím zatím zkušenost nemám. Závěrem velkým plusem je jejich pozitivní přístup , ten je opravdu z 1*",
      },
    ],
    categories: categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      path: c.path,
      image: c.image,
      productCount: c.products.length,
      products: c.products
        .map((p) => bySlug.get(`${p.categorySlug}/${p.slug}`) || p)
        .filter(Boolean)
        .map(({ href, ...rest }) => rest),
    })),
  };

  const outDir = join(ROOT, "src", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "catalog.json"),
    JSON.stringify(catalog, null, 2),
    "utf8"
  );
  console.log(
    `\nDone. Categories: ${catalog.categories.length}, products: ${catalog.categories.reduce((n, c) => n + c.products.length, 0)}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
