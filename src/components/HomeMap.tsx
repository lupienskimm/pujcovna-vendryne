import { site } from "@/data/site";

/** Server-only map — iframe stays behind details so it won't contend with LCP. */
export function HomeMap() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&z=15&output=embed`;

  return (
    <section className="py-16 md:py-20">
      <div className="container-pv">
        <h2 className="section-title">{site.mapTitle}</h2>
        <div className="map-frame mx-auto mt-8 max-w-4xl bg-brand p-2 md:p-2.5">
          <div className="map-frame-inner overflow-hidden border-[3px] border-white bg-white">
            <details className="group">
              <summary
                className="flex cursor-pointer list-none items-center justify-center bg-surface text-sm font-semibold text-ink"
                style={{ minHeight: 360 }}
              >
                Zobrazit mapu
              </summary>
              <iframe
                title={site.address}
                src={mapSrc}
                className="h-full w-full border-0"
                style={{ minHeight: 360 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </details>
          </div>
        </div>
        <p className="page-meta mt-4 text-center text-sm">{site.address}</p>
        <p className="page-meta mt-1 text-center text-sm">
          {site.hours.weekdays} · {site.hours.saturday}
        </p>
      </div>
    </section>
  );
}
