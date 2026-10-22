"use client";

import { useEffect, useState } from "react";

export type PageBg = "white" | "red" | "black";
export type PageStyle = "classic" | "atelier";
export type PagePattern = "on" | "off";

const BG_OPTIONS: { id: PageBg; label: string; swatch: string }[] = [
  { id: "white", label: "Bílá", swatch: "#ffffff" },
  { id: "red", label: "Červená", swatch: "#E5322D" },
  { id: "black", label: "Černá", swatch: "#141414" },
];

const STYLE_OPTIONS: { id: PageStyle; label: string }[] = [
  { id: "classic", label: "Klasik" },
  { id: "atelier", label: "Ateliér" },
];

const PATTERN_OPTIONS: { id: PagePattern; label: string }[] = [
  { id: "on", label: "Vzor" },
  { id: "off", label: "Bez" },
];

const BG_KEY = "pv-page-bg";
const STYLE_KEY = "pv-page-style";
const PATTERN_KEY = "pv-page-pattern";

export function ThemeDock() {
  const [bg, setBg] = useState<PageBg>("white");
  const [style, setStyle] = useState<PageStyle>("classic");
  const [pattern, setPattern] = useState<PagePattern>("on");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedBg = window.localStorage.getItem(BG_KEY) as PageBg | null;
    const savedStyle = window.localStorage.getItem(STYLE_KEY) as PageStyle | null;
    const savedPattern = window.localStorage.getItem(
      PATTERN_KEY
    ) as PagePattern | null;

    const nextBg =
      savedBg === "white" || savedBg === "red" || savedBg === "black"
        ? savedBg
        : "white";
    const nextStyle =
      savedStyle === "classic" || savedStyle === "atelier"
        ? savedStyle
        : "classic";
    const nextPattern =
      savedPattern === "on" || savedPattern === "off" ? savedPattern : "on";

    setBg(nextBg);
    setStyle(nextStyle);
    setPattern(nextPattern);
    document.documentElement.dataset.bg = nextBg;
    document.documentElement.dataset.style = nextStyle;
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
    document.documentElement.dataset.style = style;
    window.localStorage.setItem(STYLE_KEY, style);
  }, [style, ready]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.pattern = pattern;
    window.localStorage.setItem(PATTERN_KEY, pattern);
  }, [pattern, ready]);

  return (
    <div className="theme-dock" aria-label="Vzhled stránky">
      <div className="theme-dock-group" role="group" aria-label="Styl webu">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-style${style === opt.id ? " is-active" : ""}`}
            aria-pressed={style === opt.id}
            onClick={() => setStyle(opt.id)}
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
