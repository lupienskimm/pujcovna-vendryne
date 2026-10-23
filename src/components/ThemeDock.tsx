"use client";

import { useEffect, useState } from "react";

const PATTERN_COLOR_OPTIONS: { id: string; label: string; color: string }[] = [
  { id: "white", label: "Bílá", color: "#ffffff" },
  { id: "brand", label: "Červená", color: "#E5322D" },
  { id: "gray", label: "Šedá", color: "#8a8a8a" },
  { id: "ink", label: "Černá", color: "#141414" },
];

const PATTERN_COLOR_MAP = Object.fromEntries(
  PATTERN_COLOR_OPTIONS.map((o) => [o.id, o.color])
) as Record<string, string>;

const PATTERN_COLOR_KEY = "pv-pattern-color";
const DEFAULT_PATTERN_COLOR = "white";
const PATTERN_OPACITY = "0.7";

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
  document.documentElement.dataset.pattern = "dots";
  document.documentElement.style.setProperty("--pattern-opacity", PATTERN_OPACITY);
  document.documentElement.style.setProperty("--pattern-color", color);
}

export function ThemeDock() {
  const [patternColorId, setPatternColorId] = useState(DEFAULT_PATTERN_COLOR);
  const [patternColor, setPatternColor] = useState(
    PATTERN_COLOR_MAP[DEFAULT_PATTERN_COLOR]
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedColor = window.localStorage.getItem(PATTERN_COLOR_KEY);
    const nextColor = resolvePatternColor(savedColor);

    setPatternColorId(nextColor.id);
    setPatternColor(nextColor.color);
    applyThemeVars(nextColor.color);
    window.localStorage.setItem("pv-page-bg", "black");
    window.localStorage.setItem("pv-page-pattern", "dots");
    setReady(true);
  }, []);

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
      <div className="theme-dock-group" role="group" aria-label="Barva teček">
        {PATTERN_COLOR_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`theme-dock-swatch-btn${patternColorId === opt.id ? " is-active" : ""}`}
            aria-pressed={patternColorId === opt.id}
            aria-label={`Barva teček: ${opt.label}`}
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
          <span className="sr-only">Vlastní barva teček</span>
          <input
            type="color"
            value={patternColor}
            aria-label="Vlastní barva teček"
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
