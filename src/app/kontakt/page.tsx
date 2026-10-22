import { site } from "@/data/site";

export const metadata = {
  title: "Kontakt",
};

export default function KontaktPage() {
  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <h1 className="page-heading text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Kontakt
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="rounded-[20px] border border-line bg-white p-6 md:p-8">
            <h2 className="text-lg font-semibold text-ink">Kontaktní údaje:</h2>
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

            <div className="mt-8 rounded-[16px] bg-surface p-5">
              <h3 className="font-semibold text-ink">Otevírací doba</h3>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                <li>{site.hours.weekdays},</li>
                <li>{site.hours.saturday},</li>
                <li>{site.hours.sunday}</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[22px] bg-brand p-2 shadow-[0_12px_40px_rgba(229,50,45,0.18)] md:p-2.5">
            <div className="overflow-hidden rounded-[16px] border-[3px] border-white bg-white">
              <iframe
                title={site.address}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&z=15&output=embed`}
                className="h-full min-h-[420px] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
