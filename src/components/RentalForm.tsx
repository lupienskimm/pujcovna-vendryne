"use client";

import { categories } from "@/data/site";

type Props = {
  defaultMachine?: string;
  className?: string;
};

export function RentalForm({ defaultMachine = "", className = "" }: Props) {
  const machines = categories.flatMap((c) =>
    c.products.map((p) => ({
      value: `${c.name} — ${p.name}`,
      label: `${p.name} (${c.name})`,
    }))
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
            defaultValue={
              machines.some((m) => m.value === defaultMachine)
                ? defaultMachine
                : ""
            }
            required
          >
            <option value="">Vyberte stroj</option>
            {defaultMachine &&
            !machines.some((m) => m.value === defaultMachine) ? (
              <option value={defaultMachine}>{defaultMachine}</option>
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
          <input name="dateFrom" type="date" required />
        </label>
        <label className="rental-field">
          <span>Do</span>
          <input name="dateTo" type="date" required />
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

      <button type="submit" className="btn btn-primary mt-6" disabled>
        Odeslat poptávku
      </button>
    </form>
  );
}
