"use client";

import { useEffect, useMemo, useState } from "react";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { categories } from "@/data/site";
import { estimateRental } from "@/lib/rentalEstimate";
import {
  machineKey as makeKey,
  rangeIsAvailable,
  type Reservation,
  todayISO,
} from "@/lib/reservations";

type Props = {
  defaultMachine?: string;
  className?: string;
};

const machines = categories.flatMap((c) =>
  c.products.map((p) => ({
    value: `${c.name} — ${p.name}`,
    label: `${p.name} (${c.name})`,
    key: makeKey(c.slug, p.slug),
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
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [today, setToday] = useState(todayISO());
  const [conflict, setConflict] = useState(false);

  const selected = useMemo(
    () => machines.find((m) => m.value === machine) ?? null,
    [machine]
  );

  const estimate = useMemo(
    () => estimateRental(selected?.product, dateFrom, dateTo),
    [selected, dateFrom, dateTo]
  );

  useEffect(() => {
    if (!selected?.key) {
      setReservations([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/reservations?machineKey=${encodeURIComponent(selected.key)}`)
      .then((r) => r.json())
      .then((data: { reservations?: Reservation[]; today?: string }) => {
        if (cancelled) return;
        setReservations(data.reservations ?? []);
        if (data.today) setToday(data.today);
      })
      .catch(() => {
        if (!cancelled) setReservations([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selected?.key]);

  useEffect(() => {
    if (!selected?.key || !dateFrom || !dateTo) {
      setConflict(false);
      return;
    }
    setConflict(
      !rangeIsAvailable(reservations, selected.key, dateFrom, dateTo, today)
    );
  }, [selected?.key, dateFrom, dateTo, reservations, today]);

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
            onChange={(e) => {
              setMachine(e.target.value);
              setDateFrom("");
              setDateTo("");
            }}
            required
          >
            <option value="">Vyberte stroj</option>
            {machine && !machines.some((m) => m.value === machine) ? (
              <option value={machine}>{machine}</option>
            ) : null}
            {machines.map((m) => (
              <option key={m.key} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        {selected ? (
          <div className="sm:col-span-2">
            <AvailabilityCalendar
              machineKey={selected.key}
              reservations={reservations}
              today={today}
              dateFrom={dateFrom}
              dateTo={dateTo}
              onPick={(from, to) => {
                setDateFrom(from);
                setDateTo(to);
              }}
            />
          </div>
        ) : null}

        <label className="rental-field">
          <span>Od</span>
          <input
            name="dateFrom"
            type="date"
            required
            min={today}
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
            min={dateFrom || today}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>
        {conflict ? (
          <p className="sm:col-span-2 text-sm font-semibold text-brand">
            Zvolený termín koliduje s rezervací. Vyberte jiné datum.
          </p>
        ) : null}
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
        <div className="rental-price-aside" aria-live="polite">
          {estimate ? (
            <>
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
              <p className="rental-price-note">
                {estimate.dailyPrice != null && estimate.total != null
                  ? `${estimate.days} × denní sazba · bez DPH`
                  : "bez DPH · orientační"}
              </p>
            </>
          ) : (
            <>
              <p className="rental-price-label">Orientační cena</p>
              <p className="rental-price-value rental-price-placeholder">—</p>
              <p className="rental-price-hint">
                Vyberte stroj a termín, zobrazí se orientační cena.
              </p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
