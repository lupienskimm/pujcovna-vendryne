import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LazyMap } from "@/components/LazyMap";
import { RentalForm } from "@/components/RentalForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `Kontakt ${site.name}: ${site.phone}, ${site.address}. ${site.hours.weekdays}, ${site.hours.saturday}.`,
};

export default function KontaktPage() {
  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <Breadcrumbs
          items={[
            { href: "/", label: "Úvod" },
            { label: "Kontakt" },
          ]}
        />
        <h1 className="page-heading mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Kontakt
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="surface-panel p-6 md:p-8">
            <h2 className="text-lg font-semibold text-ink">Kontaktní údaje</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-muted">IČO</dt>
                <dd className="font-medium text-ink">{site.ico}</dd>
              </div>
              <div>
                <dt className="text-muted">TEL</dt>
                <dd>
                  <a
                    href={`tel:${site.phone.replace(/\s/g, "")}`}
                    className="font-medium text-brand hover:underline"
                    data-track="tel-kontakt"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">EMAIL</dt>
                <dd className="font-medium text-ink">
                  <a href={`mailto:${site.email}`} className="hover:underline">
                    {site.email}
                  </a>
                  ,{" "}
                  <a href={`mailto:${site.emailServis}`} className="hover:underline">
                    {site.emailServis}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">OTEVÍRACÍ DOBA</dt>
                <dd className="font-medium text-ink">
                  {site.hours.weekdays}, {site.hours.saturday}, {site.hours.sunday}
                </dd>
              </div>
              <div>
                <dt className="text-muted">ADRESA</dt>
                <dd className="font-medium text-ink">{site.address}</dd>
              </div>
            </dl>
          </div>

          <div className="map-frame bg-brand p-2 md:p-2.5">
            <div className="map-frame-inner overflow-hidden border-[3px] border-white bg-white">
              <LazyMap minHeight={420} />
            </div>
          </div>
        </div>

        <div className="surface-panel mt-12 p-6 md:p-8">
          <h2 className="text-lg font-semibold text-ink">Poptávka půjčení</h2>
          <p className="mt-2 text-sm text-muted">
            Stejný formulář jako na stránce Půjčit — zatím bez odesílání.
          </p>
          <div className="mt-6">
            <RentalForm />
          </div>
        </div>
      </div>
    </div>
  );
}
