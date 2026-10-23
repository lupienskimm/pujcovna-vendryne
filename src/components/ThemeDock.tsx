"use client";

import { useEffect, useState } from "react";

export type PageBg = "white" | "red" | "black";
export type PageLayout = "page" | "island";
export type PagePattern = "none" | "poly" | "grid" | "dots" | "lines" | "chevrons";

const BG_OPTIONS: { id: PageBg; label: string; swatch: string }[] = [
  { id: "white", label: "Bílá", swatch: "#ffffff" },
  { id: "red", label: "Červená", swatch: "#E5322D" },
  { id: "black", label: "Černá", swatch: "#141414" },
];

const LAYOUT_OPTIONS: { id: PageLayout; label: string }[] = [
  { id: "page", label: "Plná" },
  { id: "island", label: "Ostrov" },
];

const PATTERN_OPTIONS: { id: PagePattern; label: string }[] = [
  { id: "none", label: "Bez" },
  { id: "poly", label: "Poly" },
  { id: "grid", label: "Mříž" },
  { id: "dots", label: "Tečky" },
  { id: "lines", label: "Pruhy" },
  { id: "chevrons", label: "Šipky" },
];

const PATTERN_IDS = new Set(PATTERN_OPTIONS.map((o) => o.id));

const BG_KEY = "pv-page-bg";
const LAYOUT_KEY = "pv-page-layout";
const PATTERN_KEY = "pv-page-pattern";
const OPACITY_KEY = "pv-pattern-opacity";

const DEFAULT_OPACITY = 55;

function clampOpacity(value: number) {
  if (Number.isNaN(value)) return DEFAULT_OPACITY;
  return Math.min(100, Math.max(0, Math.round(value)));
}

function migratePattern(raw: string | null): PagePattern {
  if (raw === "on") return "poly";
  if (raw === "off") return "none";
  if (raw && PATTERN_IDS.has(raw as PagePattern)) return raw as PagePattern;
  return "poly";
}

function applyOpacity(value: number) {
  document.documentElement.style.setProperty(
    "--pattern-opacity",
    String(value / 100)
  );
}

export function ThemeDock() {
  const [bg, setBg] = useState<PageBg>("white");
  const [layout, setLayout] = useState<PageLayout>("page");
  const [pattern, setPattern] = useState<PagePattern>("poly");
  const [opacity, setOpacity] = useState(DEFAULT_OPACITY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedBg = window.localStorage.getItem(BG_KEY) as PageBg | null;
    const savedLayout = window.localStorage.getItem(
      LAYOUT_KEY
    ) as PageLayout | null;
    const savedPattern = window.localStorage.getItem(PATTERN_KEY);
    const savedOpacity = window.localStorage.getItem(OPACITY_KEY);

    const nextBg =
      savedBg === "white" || savedBg === "red" || savedBg === "black"
        ? savedBg
        : "white";
    const nextLayout =
      savedLayout === "page" || savedLayout === "island" ? savedLayout : "page";
    const nextPattern = migratePattern(savedPattern);
    const nextOpacity = clampOpacity(
      savedOpacity == null ? DEFAULT_OPACITY : Number(savedOpacity)
    );

    setBg(nextBg);
    setLayout(nextLayout);
    setPattern(nextPattern);
    setOpacity(nextOpacity);
    document.documentElement.dataset.bg = nextBg;
    document.documentElement.dataset.layout = nextLayout;
    document.documentElement.dataset.pattern = nextPattern;
    applyOpacity(nextOpacity);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.bg = bg;
    window.localStorage.setItem(BG_KEY, bg);
  }, [bg, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.layout = layout;
    window.localStorage.setItem(LAYOUT_KEY, layout);
  }, [layout, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.pattern = pattern;
    window.localStorage.setItem(PATTERN_KEY, pattern);
  }, [pattern, ready]);

  useEffect(() => {
    if (!ready) return;
    applyOpacity(opacity);
    window.localStorage.setItem(OPACITY_KEY, String(opacity));
  }, [opacity, ready]);

  return (
    <div className="theme-dock" aria-label="Vzhled stránky">
      <div className="theme-dock-group" role="group" aria-label="Layout stránky">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-style${layout === opt.id ? " is-active" : ""}`}
            aria-pressed={layout === opt.id}
            onClick={() => setLayout(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <span className="theme-dock-sep" aria-hidden />
      <div className="theme-dock-group" role="group" aria-label="Pozadí stránky">
        {BG_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-swatch-btn${bg === opt.id ? " is-active" : ""}`}
            aria-pressed={bg === opt.id}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setBg(opt.id)}
          >
            <span
              className="theme-dock-swatch"
              style={{ background: opt.swatch }}
            />
          </button>
        ))}
      </div>
      <span className="theme-dock-sep" aria-hidden />
      <div
        className="theme-dock-group theme-dock-patterns"
        role="group"
        aria-label="Vzor pozadí"
      >
        {PATTERN_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-style${pattern === opt.id ? " is-active" : ""}`}
            aria-pressed={pattern === opt.id}
            onClick={() => setPattern(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <span className="theme-dock-sep" aria-hidden />
      <label className="theme-dock-opacity">
        <span className="theme-dock-opacity-label">
          Vzor {pattern === "none" ? "—" : `${opacity}%`}
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={opacity}
          disabled={pattern === "none"}
          aria-label="Průhlednost vzoru"
          onChange={(e) => setOpacity(clampOpacity(Number(e.target.value)))}
        />
      </label>
    </div>
  );
}
