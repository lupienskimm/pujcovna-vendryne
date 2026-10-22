"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} z 5`}>
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

function Avatar({
  src,
  name,
}: {
  src?: string | null;
  name: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }

  return (
    <span
      className="flex h-12 w-12 items-center justify-center rounded-full bg-brand"
      aria-hidden
      title={name}
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
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const count = reviews.length;

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 4500);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <section id="recenze" className="overflow-hidden bg-surface py-16 md:py-20">
      <div className="container-pv">
        <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
          {site.reviewsTitle}
        </h2>
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            aria-label="Předchozí"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand"
            onClick={() => setIndex((i) => (i - 1 + count) % count)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Další"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-brand hover:text-brand"
            onClick={() => setIndex((i) => (i + 1) % count)}
          >
            →
          </button>
        </div>

        <div className="relative mt-8 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {reviews.map((r) => (
              <article
                key={`${r.author}-${r.text.slice(0, 24)}`}
                className="w-full shrink-0 px-0.5"
              >
                <div className="mx-auto max-w-2xl rounded-[20px] border border-line bg-white p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <Avatar src={r.avatar} name={r.author} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{r.author}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars rating={r.rating} />
                        {r.date ? (
                          <time className="text-xs text-muted" dateTime={r.date}>
                            {r.date}
                          </time>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-muted">
                    {r.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.author + i}
              type="button"
              aria-label={`Recenze ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-brand" : "w-2 bg-line"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
