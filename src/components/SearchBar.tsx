"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) {
      router.push("/pujcovna");
      return;
    }
    router.push(`/pujcovna?q=${encodeURIComponent(query)}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`search-bar flex flex-col gap-3 sm:flex-row sm:items-center ${className}`}
      role="search"
    >
      <label className="flex min-w-0 flex-1 flex-col gap-1 px-2">
        <span className="text-xs font-medium text-muted">Vyhledávání</span>
        <input
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Hledat …"
          className="w-full border-0 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
        />
      </label>
      <button type="submit" className="btn btn-dark search-bar-submit shrink-0 sm:!min-w-32">
        Hledat
      </button>
    </form>
  );
}
