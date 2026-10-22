"use client";

import { useEffect, useState } from "react";

export type PageBg = "white" | "red" | "black";
export type PageLayout = "page" | "island";
export type PagePattern = "on" | "off";

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
  { id: "on", label: "Vzor" },
  { id: "off", label: "Bez" },
];

const BG_KEY = "pv-page-bg";
const LAYOUT_KEY = "pv-page-layout";
const PATTERN_KEY = "pv-page-pattern";

export function ThemeDock() {
  const [bg, setBg] = useState<PageBg>("white");
  const [layout, setLayout] = useState<PageLayout>("page");
  const [pattern, setPattern] = useState<PagePattern>("on");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedBg = window.localStorage.getItem(BG_KEY) as PageBg | null;
    const savedLayout = window.localStorage.getItem(
      LAYOUT_KEY
    ) as PageLayout | null;
    const savedPattern = window.localStorage.getItem(
      PATTERN_KEY
    ) as PagePattern | null;

    const nextBg =
      savedBg === "white" || savedBg === "red" || savedBg === "black"
        ? savedBg
        : "white";
    const nextLayout =
      savedLayout === "page" || savedLayout === "island" ? savedLayout : "page";
    const nextPattern =
      savedPattern === "on" || savedPattern === "off" ? savedPattern : "on";

    setBg(nextBg);
    setLayout(nextLayout);
    setPattern(nextPattern);
    document.documentElement.dataset.bg = nextBg;
    document.documentElement.dataset.layout = nextLayout;
    document.documentElement.dataset.pattern = nextPattern;
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
      <div className="theme-dock-group" role="group" aria-label="Vzor pozadí">
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
    </div>
  );
}
