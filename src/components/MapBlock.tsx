import { site } from "@/data/site";

export function MapBlock({ className = "" }: { className?: string }) {
  return (
    <section className={`py-16 md:py-20 ${className}`}>
      <div className="container-pv">
        <h2 className="text-center text-2xl font-bold uppercase tracking-tight text-ink md:text-3xl">
          {site.mapTitle}
        </h2>
        <div className="mx-auto mt-8 max-w-4xl rounded-[22px] bg-brand p-2 shadow-[0_12px_40px_rgba(229,50,45,0.18)] md:p-2.5">
          <div className="overflow-hidden rounded-[16px] border-[3px] border-white bg-white">
            <iframe
              title={site.address}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(site.address)}&z=15&output=embed`}
              className="h-[360px] w-full border-0 md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-muted">{site.address}</p>
      </div>
    </section>
  );
}
