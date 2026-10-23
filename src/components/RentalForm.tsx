"use client";

import { useMemo, useState } from "react";
import { categories } from "@/data/site";
import { estimateRental } from "@/lib/rentalEstimate";

type Props = {
  defaultMachine?: string;
  className?: string;
};

const machines = categories.flatMap((c) =>
  c.products.map((p) => ({
    value: `${c.name} — ${p.name}`,
    label: `${p.name} (${c.name})`,
    product: p,
  }))
);

export function RentalForm({ defaultMachine = "", className = "" }: Props) {
  const initialMachine = machines.some((m) => m.value === defaultMachine)
    ? defaultMachine
    : defaultMachine || "";

  const [machine, setMachine] = useState(initialMachine);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const selected = useMemo(
    () => machines.find((m) => m.value === machine) ?? null,
    [machine]
  );

  const estimate = useMemo(
    () => estimateRental(selected?.product, dateFrom, dateTo),
    [selected, dateFrom, dateTo]
  );

  return (
    <form
      className={`rental-form ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
      }}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="rental-field sm:col-span-2">
          <span>Jméno a příjmení</span>
          <input name="name" type="text" autoComplete="name" required />
        </label>
        <label className="rental-field">
          <span>Telefon</span>
          <input name="phone" type="tel" autoComplete="tel" required />
        </label>
        <label className="rental-field">
          <span>E-mail</span>
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="rental-field sm:col-span-2">
          <span>Stroj / zařízení</span>
          <select
            name="machine"
            value={machine}
            onChange={(e) => setMachine(e.target.value)}
            required
          >
            <option value="">Vyberte stroj</option>
            {machine && !machines.some((m) => m.value === machine) ? (
              <option value={machine}>{machine}</option>
            ) : null}
            {machines.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>
        <label className="rental-field">
          <span>Od</span>
          <input
            name="dateFrom"
            type="date"
            required
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label className="rental-field">
          <span>Do</span>
          <input
            name="dateTo"
            type="date"
            required
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        <label className="rental-field sm:col-span-2">
          <span>Zpráva</span>
          <textarea
            name="message"
            rows={4}
            placeholder="Termín vyzvednutí, doprava, dotazy…"
          />
        </label>
      </div>

      <div className="rental-submit-row mt-6">
        <button type="submit" className="btn btn-primary" disabled>
          Odeslat poptávku
        </button>
        {estimate ? (
          <div className="rental-price-aside" aria-live="polite">
            <p className="rental-price-label">
              {estimate.days}{" "}
              {estimate.days === 1
                ? "den"
                : estimate.days < 5
                  ? "dny"
                  : "dní"}
              {estimate.periodLabel ? ` · ${estimate.periodLabel}` : ""}
            </p>
            <p className="rental-price-value">{estimate.priceLabel}</p>
            {estimate.dailyPrice != null && estimate.total != null ? (
              <p className="rental-price-note">
                {estimate.days} × denní sazba · bez DPH
              </p>
            ) : estimate.note ? (
              <p className="rental-price-note">bez DPH · orientační</p>
            ) : null}
          </div>
        ) : (
          <p className="rental-price-hint">
            Vyberte stroj a termín — zobrazí se orientační cena.
          </p>
        )}
      </div>
    </form>
  );
}
