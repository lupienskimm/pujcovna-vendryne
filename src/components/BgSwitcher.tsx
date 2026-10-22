"use client";

import { useEffect, useState } from "react";

export type PageBg = "white" | "red" | "black";

const OPTIONS: { id: PageBg; label: string; swatch: string }[] = [
  { id: "white", label: "Bílá", swatch: "#ffffff" },
  { id: "red", label: "Červená", swatch: "#E5322D" },
  { id: "black", label: "Černá", swatch: "#141414" },
];

const STORAGE_KEY = "pv-page-bg";

export function BgSwitcher() {
  const [bg, setBg] = useState<PageBg>("white");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as PageBg | null;
    if (saved === "white" || saved === "red" || saved === "black") {
      setBg(saved);
      document.documentElement.dataset.bg = saved;
    } else {
      document.documentElement.dataset.bg = "white";
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.bg = bg;
    window.localStorage.setItem(STORAGE_KEY, bg);
  }, [bg, ready]);

  return (
    <div
      className="bg-switcher"
      role="group"
      aria-label="Pozadí stránky"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`bg-switcher-btn${bg === opt.id ? " is-active" : ""}`}
          aria-pressed={bg === opt.id}
          aria-label={opt.label}
          title={opt.label}
          onClick={() => setBg(opt.id)}
        >
          <span
            className="bg-switcher-swatch"
            style={{ background: opt.swatch }}
          />
        </button>
      ))}
    </div>
  );
}
