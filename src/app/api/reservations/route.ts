import { NextRequest, NextResponse } from "next/server";
import {
  rangeIsAvailable,
  type Reservation,
  todayISO,
} from "@/lib/reservations";
import { readReservations, writeReservations } from "@/lib/reservationStore";

function newId(): string {
  return `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function GET(req: NextRequest) {
  const machineKey = req.nextUrl.searchParams.get("machineKey") || undefined;
  const all = await readReservations();
  const list = machineKey
    ? all.filter((r) => r.machineKey === machineKey)
    : all;
  return NextResponse.json({ reservations: list, today: todayISO() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Reservation>;

  if (
    !body.machineKey ||
    !body.machineLabel ||
    !body.dateFrom ||
    !body.dateTo
  ) {
    return NextResponse.json({ error: "Chybí povinná pole." }, { status: 400 });
  }
  if (body.dateTo < body.dateFrom) {
    return NextResponse.json(
      { error: "Datum Do musí být stejné nebo pozdější než Od." },
      { status: 400 }
    );
  }

  const list = await readReservations();
  if (
    !rangeIsAvailable(list, body.machineKey, body.dateFrom, body.dateTo)
  ) {
    return NextResponse.json(
      { error: "V tomto termínu je stroj už rezervovaný." },
      { status: 409 }
    );
  }

  const item: Reservation = {
    id: newId(),
    machineKey: body.machineKey,
    machineLabel: body.machineLabel,
    customerName: (body.customerName || "").trim(),
    phone: (body.phone || "").trim(),
    dateFrom: body.dateFrom,
    dateTo: body.dateTo,
    status: "active",
    source: body.source === "web" ? "web" : "manual",
    note: (body.note || "").trim(),
    createdAt: new Date().toISOString(),
  };

  list.unshift(item);
  await writeReservations(list);
  return NextResponse.json({ reservation: item });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as {
    id?: string;
    status?: Reservation["status"];
    dateTo?: string;
  };

  if (!body.id || !body.status) {
    return NextResponse.json(
      { error: "Chybí id nebo status." },
      { status: 400 }
    );
  }

  const list = await readReservations();
  const idx = list.findIndex((r) => r.id === body.id);
  if (idx < 0) {
    return NextResponse.json({ error: "Rezervace nenalezena." }, { status: 404 });
  }

  const current = list[idx];
  list[idx] = {
    ...current,
    status: body.status,
    dateTo:
      body.status === "returned" && body.dateTo
        ? body.dateTo
        : body.status === "returned"
          ? todayISO()
          : current.dateTo,
  };

  await writeReservations(list);
  return NextResponse.json({ reservation: list[idx] });
}

export async function DELETE(req: NextRequest) {
  const body = (await req.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Chybí id." }, { status: 400 });
  }

  const list = await readReservations();
  const next = list.filter((r) => r.id !== body.id);
  if (next.length === list.length) {
    return NextResponse.json({ error: "Rezervace nenalezena." }, { status: 404 });
  }
  await writeReservations(next);
  return NextResponse.json({ ok: true });
}
