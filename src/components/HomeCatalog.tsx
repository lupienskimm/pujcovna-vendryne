import Link from "next/link";
import { categories, site } from "@/data/site";

function firstPrice(pricing: { prices: { price: string }[] }[] | undefined) {
  const cell = pricing?.[0]?.prices?.[0]?.price;
  if (!cell) return null;
  const match = cell.match(/[\d\s]+(?:,\d+)?\s*Kč/);
  return match ? match[0].replace(/\s+/g, " ").trim() : null;
}

/** Homepage catalog: thumbs load after idle so they never contend with LCP. */
export function HomeCatalog() {
  const categoryCards = categories.map((c) => ({
    name: c.name,
    slug: c.slug,
    productCount: c.productCount,
    image: c.image,
  }));

  const featured = categories
    .flatMap((c) =>
      c.products.slice(0, 1).map((p) => ({
        name: p.name,
        slug: p.slug,
        categorySlug: p.categorySlug,
        categoryName: c.name,
        priceLabel: firstPrice(p.pricing),
      }))
    )
    .slice(0, 4);

  return (
    <>
      <section className="pt-14 pb-10 md:pt-16 md:pb-12">
        <div className="container-pv">
          <h2 className="section-title">Kategorie</h2>
          <p className="page-meta mx-auto mt-3 max-w-2xl text-center text-sm">
            Vyberte typ techniky a prohlédněte kompletní sortiment.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categoryCards.map((category) => (
              <Link
                key={category.slug}
                href={`/pujcovna/${category.slug}`}
                prefetch={false}
                className="pv-card card-lift group flex items-center justify-between gap-4 p-4"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-[15px] font-semibold text-ink group-hover:text-brand">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted">
                    {category.productCount} strojů
                  </p>
                </div>
                <div className="pv-card-media relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden bg-white">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      data-defer={category.image}
                      alt=""
                      width={80}
                      height={64}
                      decoding="async"
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/pujcovna" prefetch={false} className="btn btn-primary">
              Celý sortiment
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="pb-16 pt-6 md:pb-20 md:pt-8">
          <div className="container-pv">
            <h2 className="section-title">Výběr strojů</h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {featured.map((item) => (
                <li key={`${item.categorySlug}-${item.slug}`}>
                  <Link
                    href={`/pujcovna/${item.categorySlug}/${item.slug}`}
                    prefetch={false}
                    className="flex flex-wrap items-center justify-between gap-3 py-4 transition hover:text-brand"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted">
                        {item.categoryName}
                      </p>
                      <p className="mt-0.5 text-[15px] font-semibold text-ink">
                        {item.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.priceLabel ? (
                        <span className="text-sm font-semibold text-brand">
                          {item.priceLabel}
                        </span>
                      ) : null}
                      <span className="btn btn-primary !min-h-0 px-3 py-1.5 text-sm">
                        Půjčit
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="btn btn-ghost"
                data-track="tel-home-featured"
              >
                Zavolat {site.phoneDisplay}
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){function arm(img){var s=img.getAttribute("data-defer");if(!s)return;var io=new IntersectionObserver(function(entries){if(!entries.some(function(e){return e.isIntersecting;}))return;io.disconnect();img.src=s;img.removeAttribute("data-defer");},{rootMargin:"120px"});io.observe(img);}document.querySelectorAll("img[data-defer]").forEach(arm);})();`,
        }}
      />
    </>
  );
}
