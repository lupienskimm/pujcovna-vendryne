import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="container-pv grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{site.name}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {site.tagline}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Otevírací doba
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li>{site.hours.weekdays}</li>
            <li>{site.hours.saturday}</li>
            <li>{site.hours.sunday}</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
            Informace
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/85">
            <li>IČO: {site.ico}, DIČ: {site.dic}</li>
            <li>
              TEL:{" "}
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:underline">
                {site.phone}
              </a>
            </li>
            <li>
              EMAIL:{" "}
              <a href={`mailto:${site.email}`} className="hover:underline">
                {site.email}
              </a>
              ,{" "}
              <a href={`mailto:${site.emailServis}`} className="hover:underline">
                {site.emailServis}
              </a>
            </li>
            <li>ADRESA: {site.address}</li>
          </ul>
          <div className="mt-4 flex gap-3 text-sm">
            <Link href="/pujcovna" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15">
              Půjčovna
            </Link>
            <Link href="/kontakt" className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15">
              Kontakt
            </Link>
            <a
              href={site.facebook}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/10 px-3 py-1.5 hover:bg-white/15"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-pv flex h-12 items-center justify-between text-xs text-white/45">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>Tel: {site.phoneDisplay}</a>
        </div>
      </div>
    </footer>
  );
}
