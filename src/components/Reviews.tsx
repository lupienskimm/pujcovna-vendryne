import { reviews, site } from "@/data/site";

export function Reviews() {
  return (
    <section className="bg-surface py-16 md:py-20">
      <div className="container-pv">
        <h2 className="text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {site.reviewsTitle}
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <article
              key={`${r.author}-${r.date}`}
              className="rounded-[18px] border border-line bg-white p-5 md:p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-ink">{r.author}</p>
                <time className="text-xs text-muted" dateTime={r.date}>
                  {r.date}
                </time>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
