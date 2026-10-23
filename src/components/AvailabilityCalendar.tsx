"use client";

import { useMemo, useState } from "react";
import {
  isDateBooked,
  todayISO,
  type Reservation,
} from "@/lib/reservations";

type Props = {
  machineKey: string;
  reservations: Reservation[];
  today?: string;
  dateFrom: string;
  dateTo: string;
  onPick: (from: string, to: string) => void;
};

const WEEKDAYS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

function monthLabel(y: number, m: number): string {
  return new Date(y, m, 1).toLocaleDateString("cs-CZ", {
    month: "long",
    year: "numeric",
  });
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate();
}

/** Monday-first index 0..6 */
function startOffset(y: number, m: number): number {
  const d = new Date(y, m, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

function iso(y: number, m: number, day: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function AvailabilityCalendar({
  machineKey,
  reservations,
  today = todayISO(),
  dateFrom,
  dateTo,
  onPick,
}: Props) {
  const base = new Date(`${today}T12:00:00`);
  const [cursor, setCursor] = useState({
    y: base.getFullYear(),
    m: base.getMonth(),
  });
  const [draftFrom, setDraftFrom] = useState<string | null>(null);

  const cells = useMemo(() => {
    const { y, m } = cursor;
    const total = daysInMonth(y, m);
    const offset = startOffset(y, m);
    const items: ({ day: number; date: string } | null)[] = [];
    for (let i = 0; i < offset; i++) items.push(null);
    for (let d = 1; d <= total; d++) {
      items.push({ day: d, date: iso(y, m, d) });
    }
    return items;
  }, [cursor]);

  function handleDay(date: string) {
    if (date < today) return;
    if (isDateBooked(reservations, machineKey, date, today)) return;

    if (!draftFrom || (dateFrom && dateTo)) {
      setDraftFrom(date);
      onPick(date, "");
      return;
    }

    if (date < draftFrom) {
      setDraftFrom(date);
      onPick(date, "");
      return;
    }

    // Ensure no booked day inside range
    let d = draftFrom;
    while (d <= date) {
      if (isDateBooked(reservations, machineKey, d, today)) {
        setDraftFrom(date);
        onPick(date, "");
        return;
      }
      const next = new Date(`${d}T12:00:00`);
      next.setDate(next.getDate() + 1);
      d = todayISO(next);
    }

    onPick(draftFrom, date);
    setDraftFrom(null);
  }

  const selectingFrom = draftFrom || dateFrom;

  return (
    <div className="avail-cal">
      <div className="avail-cal-head">
        <button
          type="button"
          className="avail-cal-nav"
          aria-label="Předchozí měsíc"
          onClick={() =>
            setCursor((c) => {
              const d = new Date(c.y, c.m - 1, 1);
              return { y: d.getFullYear(), m: d.getMonth() };
            })
          }
        >
          ←
        </button>
        <p className="avail-cal-title">{monthLabel(cursor.y, cursor.m)}</p>
        <button
          type="button"
          className="avail-cal-nav"
          aria-label="Další měsíc"
          onClick={() =>
            setCursor((c) => {
              const d = new Date(c.y, c.m + 1, 1);
              return { y: d.getFullYear(), m: d.getMonth() };
            })
          }
        >
          →
        </button>
      </div>

      <div className="avail-cal-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="avail-cal-dow">
            {w}
          </span>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <span key={`e-${i}`} />;
          const booked = isDateBooked(
            reservations,
            machineKey,
            cell.date,
            today
          );
          const past = cell.date < today;
          const inRange =
            dateFrom &&
            dateTo &&
            cell.date >= dateFrom &&
            cell.date <= dateTo;
          const isStart = cell.date === selectingFrom;
          const isEnd = dateTo && cell.date === dateTo;

          let cls = "avail-cal-day";
          if (past) cls += " is-past";
          else if (booked) cls += " is-busy";
          else cls += " is-free";
          if (inRange) cls += " is-range";
          if (isStart || isEnd) cls += " is-edge";

          return (
            <button
              key={cell.date}
              type="button"
              className={cls}
              disabled={past || booked}
              onClick={() => handleDay(cell.date)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="avail-cal-legend">
        <span>
          <i className="avail-dot is-free" /> volno
        </span>
        <span>
          <i className="avail-dot is-busy" /> obsazeno
        </span>
        <span>
          <i className="avail-dot is-range" /> výběr
        </span>
      </div>
      <p className="avail-cal-hint">
        Klikněte na začátek a konec půjčení. Dnes: {today}.
      </p>
    </div>
  );
}
