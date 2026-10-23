import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} z 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden
          className={i < rating ? "text-brand" : "text-line"}
        >
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  );
}

/** Server-only reviews strip — no client JS on the homepage. */
export function HomeReviews() {
  const items = reviews.filter((r) => r.rating >= 4).slice(0, 3);

  return (
    <section id="recenze" className="surface-band overflow-hidden py-16 md:py-20">
      <div className="container-pv">
        <h2 className="section-title section-title-on-light">
          {site.reviewsTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((r) => (
            <article
              key={`${r.author}-${r.text.slice(0, 24)}`}
              className="pv-card p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand"
                  aria-hidden
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3.5" fill="white" />
                    <path
                      d="M5 19.5c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{r.author}</p>
                  <div className="mt-1">
                    <Stars rating={r.rating} />
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
