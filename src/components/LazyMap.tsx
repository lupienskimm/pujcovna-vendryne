"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

export function LazyMap({
  className = "",
  minHeight = 360,
}: {
  className?: string;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {show ? (
        <iframe
          title={site.address}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&z=15&output=embed`}
          className="h-full w-full border-0"
          style={{ minHeight }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <button
          type="button"
          className="flex w-full items-center justify-center bg-surface text-sm font-semibold text-ink"
          style={{ minHeight }}
          onClick={() => setShow(true)}
        >
          Zobrazit mapu
        </button>
      )}
    </div>
  );
}
