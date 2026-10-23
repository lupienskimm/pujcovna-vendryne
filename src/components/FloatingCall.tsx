"use client";

import { site } from "@/data/site";

export function FloatingCall() {
  return (
    <a
      href={`tel:${site.phone.replace(/\s/g, "")}`}
      className="floating-call md:hidden"
      data-track="tel-float"
      aria-label={`Zavolat ${site.phoneDisplay}`}
    >
      <span aria-hidden>☎</span>
      <span>Zavolat</span>
    </a>
  );
}
