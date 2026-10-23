import type { Metadata } from "next";
import { SpravaClient } from "@/components/SpravaClient";

export const metadata: Metadata = {
  title: "Správa rezervací",
  robots: { index: false, follow: false },
};

export default function SpravaPage() {
  return (
    <div className="pb-16 pt-10 md:pb-20 md:pt-12">
      <div className="container-pv">
        <h1 className="page-heading text-3xl font-bold tracking-tight md:text-4xl">
          Správa rezervací
        </h1>
        <p className="page-meta mt-3 max-w-2xl text-sm leading-relaxed">
          Přehled půjčených strojů, ruční rezervace a předčasné vrácení. Po
          skončení termínu se stroj uvolní automaticky podle dnešního data.
        </p>
        <div className="mt-8">
          <SpravaClient />
        </div>
      </div>
    </div>
  );
}
