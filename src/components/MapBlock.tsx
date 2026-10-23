import { LazyMap } from "@/components/LazyMap";
import { site } from "@/data/site";

export function MapBlock({ className = "" }: { className?: string }) {
  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="container-pv">
        <h2 className="section-title">{site.mapTitle}</h2>
        <div className="map-frame mx-auto mt-8 max-w-4xl bg-brand p-2 md:p-2.5">
          <div className="map-frame-inner overflow-hidden border-[3px] border-white bg-white">
            <LazyMap minHeight={360} />
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
