import type { PriceCell, PricingRow, Product } from "@/data/site";

export type RentalEstimate = {
  days: number;
  periodLabel: string;
  dailyPrice: number | null;
  total: number | null;
  priceLabel: string;
  note: string | null;
};

function parseAmount(price: string): number | null {
  const cleaned = price
    .replace(/\u00a0/g, " ")
    .replace(/[^\d,.\s]/g, " ")
    .trim();
  const match = cleaned.match(/(\d[\d\s]*)([.,]\d{1,2})?/);
  if (!match) return null;
  const whole = match[1].replace(/\s+/g, "");
  const frac = (match[2] || "").replace(",", ".");
  const n = Number(whole + frac);
  return Number.isFinite(n) ? n : null;
}

function isPerDay(price: string, period: string): boolean {
  const t = `${price} ${period}`.toLowerCase();
  if (/víkend|vikend/.test(t) && !/\/\s*1?\s*den|za\s*1\s*den/.test(t)) {
    return false;
  }
  if (/\/\s*1?\s*den|za\s*1\s*den|cena za 1 den|mth\/den/.test(t)) {
    return true;
  }
  // Day-range tiers are almost always daily rates (per catalog notes).
  if (/\ddn|dní|dny|den/.test(period.toLowerCase())) return true;
  return true;
}

function isWeekendPeriod(period: string): boolean {
  return /víkend|vikend/i.test(period);
}

function isHourPeriod(period: string): boolean {
  return /hod/i.test(period);
}

/** Inclusive calendar days between YYYY-MM-DD dates. */
export function rentalDays(from: string, to: string): number | null {
  if (!from || !to) return null;
  const a = new Date(`${from}T12:00:00`);
  const b = new Date(`${to}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime()) || b < a) {
    return null;
  }
  return Math.floor((b.getTime() - a.getTime()) / 86400000) + 1;
}

function parseDayRange(period: string): { min: number; max: number } | null {
  const p = period.toLowerCase().replace(/\s+/g, " ");
  if (isWeekendPeriod(p) || isHourPeriod(p)) return null;

  let m = p.match(/(\d+)\s*[–\-]\s*(\d+)\s*(?:dn|dí)/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };

  m = p.match(/(\d+)\s*[–\-]\s*(\d+)\s*dn/);
  if (m) return { min: Number(m[1]), max: Number(m[2]) };

  m = p.match(/(\d+)\s+a\s+více/);
  if (m) return { min: Number(m[1]), max: Infinity };

  m = p.match(/(\d+)\s*dn[íiy]?\s+a\s+více/);
  if (m) return { min: Number(m[1]), max: Infinity };

  m = p.match(/^(\d+)\s*den\b/);
  if (m) return { min: Number(m[1]), max: Number(m[1]) };

  return null;
}

function pickDayCell(prices: PriceCell[], days: number): PriceCell | null {
  const dayCells = prices
    .map((cell) => ({ cell, range: parseDayRange(cell.period) }))
    .filter((x): x is { cell: PriceCell; range: { min: number; max: number } } =>
      Boolean(x.range)
    );

  if (dayCells.length === 0) return null;

  const match = dayCells.find(
    ({ range }) => days >= range.min && days <= range.max
  );
  if (match) return match.cell;

  // Fallback: highest min <= days, else shortest tier
  const under = dayCells
    .filter(({ range }) => days >= range.min)
    .sort((a, b) => b.range.min - a.range.min)[0];
  if (under) return under.cell;

  return dayCells.sort((a, b) => a.range.min - b.range.min)[0].cell;
}

function isWeekendStay(from: string, to: string, days: number): boolean {
  if (days < 2 || days > 3) return false;
  const a = new Date(`${from}T12:00:00`);
  const b = new Date(`${to}T12:00:00`);
  const start = a.getDay(); // 0 Sun … 5 Fri 6 Sat
  const end = b.getDay();
  // Fri–Sun, Sat–Sun, Fri–Sat
  if (start === 5 && (end === 6 || end === 0)) return true;
  if (start === 6 && end === 0) return true;
  return false;
}

function primaryRow(pricing: PricingRow[]): PricingRow | null {
  if (!pricing.length) return null;
  // Prefer a row that has day-based periods
  const withDays = pricing.find((row) =>
    row.prices.some((p) => parseDayRange(p.period))
  );
  return withDays ?? pricing[0];
}

export function formatCzk(amount: number): string {
  return (
    new Intl.NumberFormat("cs-CZ", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount)) + " Kč"
  );
}

export function estimateRental(
  product: Product | null | undefined,
  dateFrom: string,
  dateTo: string
): RentalEstimate | null {
  const days = rentalDays(dateFrom, dateTo);
  if (!product || days == null) return null;

  const row = primaryRow(product.pricing);
  if (!row) {
    return {
      days,
      periodLabel: "",
      dailyPrice: null,
      total: null,
      priceLabel: "Cena na dotaz",
      note: product.pricingNote,
    };
  }

  const weekendCell = row.prices.find((p) => isWeekendPeriod(p.period));
  if (
    weekendCell &&
    isWeekendStay(dateFrom, dateTo, days)
  ) {
    const flat = parseAmount(weekendCell.price);
    return {
      days,
      periodLabel: weekendCell.period,
      dailyPrice: null,
      total: flat,
      priceLabel: flat != null ? formatCzk(flat) : weekendCell.price,
      note: product.pricingNote ?? "Víkendový balíček, bez DPH.",
    };
  }

  const cell = pickDayCell(row.prices, days);
  if (!cell) {
    const hourOnly = row.prices.every((p) => isHourPeriod(p.period));
    return {
      days,
      periodLabel: "",
      dailyPrice: null,
      total: null,
      priceLabel: hourOnly ? "Cena dle hodin" : "Cena na dotaz",
      note: product.pricingNote,
    };
  }

  const amount = parseAmount(cell.price);
  const perDay = isPerDay(cell.price, cell.period);
  const total =
    amount == null ? null : perDay ? amount * days : amount;

  return {
    days,
    periodLabel: cell.period,
    dailyPrice: perDay ? amount : null,
    total,
    priceLabel:
      total != null
        ? formatCzk(total)
        : cell.price,
    note:
      product.pricingNote ??
      (perDay
        ? `Orientační cena: ${days} ${days === 1 ? "den" : "dny/dní"} × denní sazba (${cell.period}), bez DPH.`
        : "Orientační cena bez DPH."),
  };
}
