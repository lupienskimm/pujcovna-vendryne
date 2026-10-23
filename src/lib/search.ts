import { allProducts, type Product } from "@/data/site";

/** Strip diacritics + lowercase for tolerant matching */
export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s/+.-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Common CZ typos / slang → canonical tokens present in catalog */
const SYNONYMS: Record<string, string[]> = {
  bagr: ["rypadl", "takeuchi", "caterpillar", "kubota", "jcb"],
  bagry: ["rypadl"],
  bagrik: ["rypadl"],
  excavator: ["rypadl"],
  rypadlo: ["rypadl"],
  rypadla: ["rypadl"],
  ripadlo: ["rypadl"],
  ripadla: ["rypadl"],
  rypad: ["rypadl"],
  dempr: ["dumper"],
  dumper: ["dumper"],
  dumpery: ["dumper"],
  nakladac: ["nakladac"],
  nakladace: ["nakladac"],
  plosina: ["plosin", "lesen"],
  plosiny: ["plosin"],
  leseni: ["lesen", "plosin"],
  vibro: ["vibracni", "vibra"],
  vibračni: ["vibracni"],
  vibrační: ["vibracni"],
  deska: ["vibracni", "deska"],
  svarecka: ["svareck"],
  svářečka: ["svareck"],
  svarecky: ["svareck"],
  cerpadlo: ["cerpad"],
  čerpadlo: ["cerpad"],
  cerpadla: ["cerpad"],
  elektrocentrala: ["elektrocentral"],
  agregat: ["elektrocentral"],
  generator: ["elektrocentral"],
  bruska: ["rezaci", "brous"],
  rezačka: ["rezaci"],
  rezacka: ["rezaci"],
  bouracka: ["bouraci", "vrtaci"],
  vrtacka: ["vrtaci", "bouraci"],
  kladivo: ["bouraci", "kladiv", "prislusenstvi"],
  manipulátor: ["manipulator"],
  manipulator: ["manipulator"],
  topidlo: ["topidl", "odvlhcov"],
  topeni: ["topidl", "odvlhcov"],
  vysavac: ["vysavac", "cistic"],
  sekačka: ["zahradni", "sekac"],
  sekacka: ["zahradni", "sekac"],
  beton: ["beton", "uprava"],
  merač: ["merici"],
  meric: ["merici"],
};

function expandQueryTokens(q: string): string[] {
  const base = normalizeText(q);
  if (!base) return [];
  const tokens = base.split(" ").filter(Boolean);
  const out = new Set<string>([base, ...tokens]);

  for (const t of tokens) {
    const syn = SYNONYMS[t];
    if (syn) syn.forEach((s) => out.add(s));

    // Prefix fuzzy for short typos like ripadlo → rypadlo group
    for (const [key, vals] of Object.entries(SYNONYMS)) {
      if (levenshtein(t, key) <= 2 && t.length >= 4) {
        out.add(key);
        vals.forEach((s) => out.add(s));
      }
    }
  }

  return [...out];
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 0; i < a.length; i++) {
    let prev = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cur =
        a[i] === b[j]
          ? row[j]
          : 1 + Math.min(row[j], row[j + 1], prev);
      row[j] = prev;
      prev = cur;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function fuzzyIncludes(hay: string, needle: string): boolean {
  if (!needle) return true;
  if (hay.includes(needle)) return true;
  if (needle.length < 4) return false;

  const words = hay.split(" ").filter((w) => w.length >= 3);
  const maxDist = needle.length <= 5 ? 1 : 2;
  return words.some((w) => {
    if (w.includes(needle) || needle.includes(w)) return true;
    if (Math.abs(w.length - needle.length) > maxDist) return false;
    return levenshtein(w, needle) <= maxDist;
  });
}

function scoreProduct(
  p: Product & { categoryName: string },
  tokens: string[]
): number {
  const blob = normalizeText(
    [
      p.name,
      p.slug.replace(/-/g, " "),
      p.categoryName,
      p.categorySlug.replace(/-/g, " "),
      p.description ?? "",
      ...p.specs.map((s) => `${s.label} ${s.value}`),
    ].join(" ")
  );

  let score = 0;
  for (const t of tokens) {
    if (blob.includes(t)) {
      score += t.length >= 5 ? 6 : 4;
      if (normalizeText(p.name).includes(t)) score += 4;
      if (normalizeText(p.categoryName).includes(t)) score += 3;
      continue;
    }
    if (fuzzyIncludes(blob, t)) {
      score += 2;
    }
  }
  return score;
}

export function searchProducts(query: string) {
  const tokens = expandQueryTokens(query);
  if (!tokens.length) return [];

  return allProducts()
    .map((p) => ({ product: p, score: scoreProduct(p, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "cs"))
    .map((x) => x.product);
}
