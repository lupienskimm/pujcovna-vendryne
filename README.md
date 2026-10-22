# Půjčovna Vendryně

Redesign webu [pujcovnavendryne.cz](https://www.pujcovnavendryne.cz/) inspirovaný layoutem [minoda.cz](https://minoda.cz/) — Inter, barva `#E5322D`, kompaktní header, zaoblené prvky. Texty a katalog jsou převzaté z původního webu.

## Stack

- Next.js (App Router)
- Tailwind CSS
- TypeScript

## Spuštění

```bash
npm install
npm run dev
```

Otevřete [http://localhost:3000](http://localhost:3000).

## Aktualizace katalogu

```bash
node scripts/scrape-catalog.mjs
node scripts/enrich-from-sitemap.mjs
```

Vyžaduje stažený sitemap do `../.firecrawl/page-sitemap.xml` (nebo upravte cestu ve skriptu).
