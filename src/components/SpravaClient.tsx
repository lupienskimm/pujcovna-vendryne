"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { categories } from "@/data/site";
import {
  isBlocking,
  machineKey as makeKey,
  todayISO,
  type Reservation,
} from "@/lib/reservations";

const machines = categories.flatMap((c) =>
  c.products.map((p) => ({
    key: makeKey(c.slug, p.slug),
    label: `${p.name} (${c.name})`,
  }))
);

export function SpravaClient() {
  const [list, setList] = useState<Reservation[]>([]);
  const [today, setToday] = useState(todayISO());
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    machineKey: machines[0]?.key ?? "",
    customerName: "",
    phone: "",
    dateFrom: todayISO(),
    dateTo: todayISO(),
    note: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/reservations");
    const data = (await res.json()) as {
      reservations: Reservation[];
      today: string;
    };
    setList(data.reservations ?? []);
    if (data.today) setToday(data.today);
  }, []);

  useEffect(() => {
    load().catch(() => setError("Nepodařilo se načíst rezervace."));
  }, [load]);

  const active = useMemo(
    () => list.filter((r) => isBlocking(r, today)),
    [list, today]
  );
  const history = useMemo(
    () => list.filter((r) => !isBlocking(r, today)),
    [list, today]
  );

  async function addReservation(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const machine = machines.find((m) => m.key === form.machineKey);
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        machineLabel: machine?.label ?? form.machineKey,
        source: "manual",
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "Uložení selhalo.");
      return;
    }
    setForm((f) => ({
      ...f,
      customerName: "",
      phone: "",
      note: "",
      dateFrom: today,
      dateTo: today,
    }));
    await load();
  }

  async function setStatus(id: string, status: Reservation["status"]) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/reservations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        dateTo: status === "returned" ? today : undefined,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Změna selhala.");
      return;
    }
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Opravdu smazat rezervaci?")) return;
    setBusy(true);
    const res = await fetch("/api/reservations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Smazání selhalo.");
      return;
    }
    await load();
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="rounded-[var(--radius-md)] bg-white px-4 py-3 text-sm font-semibold text-brand">
          {error}
        </p>
      ) : null}

      <section className="surface-panel p-6 md:p-8">
        <h2 className="text-lg font-semibold text-ink">Přidat rezervaci</h2>
        <p className="mt-1 text-sm text-muted">
          Pro telefonické / osobní půjčení mimo web. Dnes: {today}.
        </p>
        <form
          onSubmit={addReservation}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <label className="rental-field sm:col-span-2">
            <span>Stroj</span>
            <select
              value={form.machineKey}
              onChange={(e) =>
                setForm((f) => ({ ...f, machineKey: e.target.value }))
              }
              required
            >
              {machines.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          <label className="rental-field">
            <span>Jméno</span>
            <input
              value={form.customerName}
              onChange={(e) =>
                setForm((f) => ({ ...f, customerName: e.target.value }))
              }
            />
          </label>
          <label className="rental-field">
            <span>Telefon</span>
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </label>
          <label className="rental-field">
            <span>Od</span>
            <input
              type="date"
              value={form.dateFrom}
              min={today}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateFrom: e.target.value }))
              }
              required
            />
          </label>
          <label className="rental-field">
            <span>Do</span>
            <input
              type="date"
              value={form.dateTo}
              min={form.dateFrom || today}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateTo: e.target.value }))
              }
              required
            />
          </label>
          <label className="rental-field sm:col-span-2">
            <span>Poznámka</span>
            <input
              value={form.note}
              onChange={(e) =>
                setForm((f) => ({ ...f, note: e.target.value }))
              }
            />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              Uložit rezervaci
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="page-heading text-xl font-semibold">
          Aktivní půjčení ({active.length})
        </h2>
        <div className="mt-4 space-y-3">
          {active.length === 0 ? (
            <p className="page-meta text-sm">Žádné aktivní rezervace.</p>
          ) : (
            active.map((r) => (
              <article key={r.id} className="surface-panel p-4 md:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">{r.machineLabel}</p>
                    <p className="mt-1 text-sm text-muted">
                      {r.dateFrom} → {r.dateTo}
                      {r.customerName ? ` · ${r.customerName}` : ""}
                      {r.phone ? ` · ${r.phone}` : ""}
                      {` · ${r.source === "manual" ? "ruční" : "web"}`}
                    </p>
                    {r.note ? (
                      <p className="mt-1 text-sm text-muted">{r.note}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-dark"
                      disabled={busy}
                      onClick={() => setStatus(r.id, "returned")}
                    >
                      Vráceno dnes
                    </button>
                    <button
                      type="button"
                      className="btn border border-line bg-white text-ink"
                      disabled={busy}
                      onClick={() => setStatus(r.id, "cancelled")}
                    >
                      Zrušit
                    </button>
                    <button
                      type="button"
                      className="btn border border-line bg-white text-ink"
                      disabled={busy}
                      onClick={() => remove(r.id)}
                    >
                      Smazat
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="page-heading text-xl font-semibold">
          Historie ({history.length})
        </h2>
        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <p className="page-meta text-sm">Zatím prázdná.</p>
          ) : (
            history.slice(0, 40).map((r) => (
              <article key={r.id} className="surface-panel p-4 opacity-90">
                <p className="font-semibold text-ink">{r.machineLabel}</p>
                <p className="mt-1 text-sm text-muted">
                  {r.dateFrom} → {r.dateTo} · {r.status}
                  {r.customerName ? ` · ${r.customerName}` : ""}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
