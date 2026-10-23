"use client";

import { useEffect, useState } from "react";

export type CardStyle = "lift" | "flat";

const OPTIONS: { id: CardStyle; label: string }[] = [
  { id: "lift", label: "Lift" },
  { id: "flat", label: "Flat" },
];

const KEY = "pv-card-style";

export function CardStyleDock() {
  const [style, setStyle] = useState<CardStyle>("flat");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) as CardStyle | null;
    const next = saved === "lift" || saved === "flat" ? saved : "flat";
    setStyle(next);
    document.documentElement.dataset.cards = next;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.cards = style;
    window.localStorage.setItem(KEY, style);
  }, [style, ready]);

  return (
    <div className="card-style-dock" role="group" aria-label="Styl karet">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`card-style-dock-btn${style === opt.id ? " is-active" : ""}`}
          aria-pressed={style === opt.id}
          onClick={() => setStyle(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
