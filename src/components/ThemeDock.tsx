"use client";

import { useEffect, useState } from "react";

export type PagePattern = "grid" | "dots";

const PATTERN_OPTIONS: { id: PagePattern; label: string }[] = [
  { id: "dots", label: "Tečky" },
  { id: "grid", label: "Mříž" },
];

const PATTERN_COLOR_OPTIONS: { id: string; label: string; color: string }[] = [
  { id: "white", label: "Bílá", color: "#ffffff" },
  { id: "brand", label: "Červená", color: "#E5322D" },
  { id: "gray", label: "Šedá", color: "#8a8a8a" },
  { id: "ink", label: "Černá", color: "#141414" },
];

const PATTERN_IDS = new Set(PATTERN_OPTIONS.map((o) => o.id));
const PATTERN_COLOR_MAP = Object.fromEntries(
  PATTERN_COLOR_OPTIONS.map((o) => [o.id, o.color])
) as Record<string, string>;

const PATTERN_KEY = "pv-page-pattern";
const PATTERN_COLOR_KEY = "pv-pattern-color";

const DEFAULT_PATTERN: PagePattern = "dots";
const DEFAULT_PATTERN_COLOR = "white";
const PATTERN_OPACITY = "0.7";

function migratePattern(raw: string | null): PagePattern {
  if (raw && PATTERN_IDS.has(raw as PagePattern)) return raw as PagePattern;
  return DEFAULT_PATTERN;
}

function resolvePatternColor(raw: string | null): { id: string; color: string } {
  if (raw && PATTERN_COLOR_MAP[raw]) {
    return { id: raw, color: PATTERN_COLOR_MAP[raw] };
  }
  if (raw && /^#[0-9a-fA-F]{6}$/.test(raw)) {
    const match = PATTERN_COLOR_OPTIONS.find(
      (o) => o.color.toLowerCase() === raw.toLowerCase()
    );
    return { id: match?.id ?? "custom", color: raw };
  }
  return {
    id: DEFAULT_PATTERN_COLOR,
    color: PATTERN_COLOR_MAP[DEFAULT_PATTERN_COLOR],
  };
}

function applyThemeVars(color: string) {
  document.documentElement.dataset.bg = "black";
  document.documentElement.dataset.layout = "page";
  document.documentElement.style.setProperty("--pattern-opacity", PATTERN_OPACITY);
  document.documentElement.style.setProperty("--pattern-color", color);
}

export function ThemeDock() {
  const [pattern, setPattern] = useState<PagePattern>(DEFAULT_PATTERN);
  const [patternColorId, setPatternColorId] = useState(DEFAULT_PATTERN_COLOR);
  const [patternColor, setPatternColor] = useState(
    PATTERN_COLOR_MAP[DEFAULT_PATTERN_COLOR]
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedPattern = window.localStorage.getItem(PATTERN_KEY);
    const savedColor = window.localStorage.getItem(PATTERN_COLOR_KEY);
    const nextPattern = migratePattern(savedPattern);
    const nextColor = resolvePatternColor(savedColor);

    setPattern(nextPattern);
    setPatternColorId(nextColor.id);
    setPatternColor(nextColor.color);
    document.documentElement.dataset.pattern = nextPattern;
    applyThemeVars(nextColor.color);
    window.localStorage.setItem("pv-page-bg", "black");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.pattern = pattern;
    window.localStorage.setItem(PATTERN_KEY, pattern);
  }, [pattern, ready]);

  useEffect(() => {
    if (!ready) return;
    applyThemeVars(patternColor);
    window.localStorage.setItem(
      PATTERN_COLOR_KEY,
      patternColorId === "custom" ? patternColor : patternColorId
    );
  }, [patternColor, patternColorId, ready]);

  return (
    <div className="theme-dock" aria-label="Vzhled stránky">
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
      <span className="theme-dock-sep" aria-hidden />
      <div className="theme-dock-group" role="group" aria-label="Barva vzoru">
        {PATTERN_COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-swatch-btn${patternColorId === opt.id ? " is-active" : ""}`}
            aria-pressed={patternColorId === opt.id}
            aria-label={`Barva vzoru: ${opt.label}`}
            title={opt.label}
            onClick={() => {
              setPatternColorId(opt.id);
              setPatternColor(opt.color);
            }}
          >
            <span
              className="theme-dock-swatch"
              style={{ background: opt.color }}
            />
          </button>
        ))}
        <label className="theme-dock-color-pick" title="Vlastní barva">
          <span className="sr-only">Vlastní barva vzoru</span>
          <input
            type="color"
            value={patternColor}
            aria-label="Vlastní barva vzoru"
            onChange={(e) => {
              setPatternColorId("custom");
              setPatternColor(e.target.value);
            }}
          />
        </label>
      </div>
    </div>
  );
}
