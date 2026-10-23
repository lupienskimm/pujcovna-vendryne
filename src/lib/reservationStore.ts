import { promises as fs } from "fs";
import path from "path";
import type { Reservation } from "@/lib/reservations";
import seed from "@/data/reservations.json";

const SEED = seed as Reservation[];

function storePath(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "pv-reservations.json");
  }
  return path.join(process.cwd(), "src", "data", "reservations.json");
}

async function ensureFile(): Promise<string> {
  const file = storePath();
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(SEED, null, 2), "utf8");
  }
  return file;
}

export async function readReservations(): Promise<Reservation[]> {
  const file = await ensureFile();
  const raw = await fs.readFile(file, "utf8");
  try {
    const parsed = JSON.parse(raw) as Reservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function writeReservations(list: Reservation[]): Promise<void> {
  const file = await ensureFile();
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
}
