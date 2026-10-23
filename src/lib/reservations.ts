export type ReservationStatus = "active" | "cancelled" | "returned";
export type ReservationSource = "web" | "manual";

export type Reservation = {
  id: string;
  machineKey: string;
  machineLabel: string;
  customerName: string;
  phone: string;
  dateFrom: string;
  dateTo: string;
  status: ReservationStatus;
  source: ReservationSource;
  note: string;
  createdAt: string;
};

export function todayISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function machineKey(categorySlug: string, productSlug: string): string {
  return `${categorySlug}/${productSlug}`;
}

/** Inclusive overlap of two YYYY-MM-DD ranges */
export function rangesOverlap(
  aFrom: string,
  aTo: string,
  bFrom: string,
  bTo: string
): boolean {
  return aFrom <= bTo && bFrom <= aTo;
}

/** Active booking that still blocks the calendar (not ended before today). */
export function isBlocking(r: Reservation, today = todayISO()): boolean {
  if (r.status !== "active") return false;
  return r.dateTo >= today;
}

export function blockingForMachine(
  list: Reservation[],
  key: string,
  today = todayISO()
): Reservation[] {
  return list.filter((r) => r.machineKey === key && isBlocking(r, today));
}

export function isDateBooked(
  list: Reservation[],
  key: string,
  date: string,
  today = todayISO()
): boolean {
  return blockingForMachine(list, key, today).some(
    (r) => date >= r.dateFrom && date <= r.dateTo
  );
}

export function rangeIsAvailable(
  list: Reservation[],
  key: string,
  from: string,
  to: string,
  today = todayISO(),
  ignoreId?: string
): boolean {
  if (!from || !to || to < from) return false;
  return !blockingForMachine(list, key, today).some(
    (r) => r.id !== ignoreId && rangesOverlap(from, to, r.dateFrom, r.dateTo)
  );
}

export function eachDay(from: string, to: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${from}T12:00:00`);
  const end = new Date(`${to}T12:00:00`);
  while (cur <= end) {
    out.push(todayISO(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}
