import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { RentalForm } from "@/components/RentalForm";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Půjčit stroj",
  description: `Poptávka půjčení stavební techniky u ${site.name}. Termín, stroj a kontakt — ozveme se zpět.`,
};

type Props = {
  searchParams: Promise<{ stroj?: string }>;
};

export default async function PujcitPage({ searchParams }: Props) {
  const { stroj } = await searchParams;

  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <Breadcrumbs
          items={[
            { href: "/", label: "Úvod" },
            { label: "Půjčit" },
          ]}
        />
        <div className="mx-auto mt-4 max-w-3xl">
          <h1 className="page-heading text-3xl font-bold tracking-tight md:text-4xl">
            Půjčit stroj
          </h1>

          <div className="surface-panel mt-8 p-6 md:p-8">
            <RentalForm defaultMachine={stroj ?? ""} />
          </div>

          <p className="page-meta mt-6 text-sm">
            Nebo volejte{" "}
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="font-semibold text-brand hover:underline"
              data-track="tel-pujcit"
            >
              {site.phone}
            </a>{" "}
            · {site.hours.weekdays}, {site.hours.saturday}
          </p>
        </div>
      </div>
    </div>
  );
}
