"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type Crumb = { href?: string; label: string };

const HIST_KEY = "pv-nav-stack";

function syncStack(pathname: string): string | undefined {
  let stack: string[] = [];
  try {
    stack = JSON.parse(sessionStorage.getItem(HIST_KEY) || "[]");
    if (!Array.isArray(stack)) stack = [];
  } catch {
    stack = [];
  }

  const last = stack[stack.length - 1];
  if (last === pathname) {
    // same
  } else if (stack[stack.length - 2] === pathname) {
    stack.pop();
  } else {
    stack.push(pathname);
  }

  sessionStorage.setItem(HIST_KEY, JSON.stringify(stack.slice(-40)));
  return stack[stack.length - 2];
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showHome, setShowHome] = useState(true);

  useEffect(() => {
    const prev = syncStack(pathname);
    setShowHome(Boolean(prev && prev !== "/"));
  }, [pathname]);

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/");
  };

  const mobileItems =
    items.length > 2 ? [items[items.length - 2], items[items.length - 1]] : items;

  return (
    <nav className="page-nav" aria-label="Navigace stránky">
      <div className="page-nav-actions">
        {showHome ? (
          <Link href="/" className="page-nav-btn">
            Domů
          </Link>
        ) : null}
        <button type="button" className="page-nav-btn" onClick={goBack}>
          Zpět
        </button>
      </div>

      <ol className="page-nav-crumbs page-nav-crumbs--desktop">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="page-nav-crumb">
              {i > 0 ? (
                <span className="page-nav-sep" aria-hidden>
                  /
                </span>
              ) : null}
              {item.href && !last ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span className={last ? "is-current" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <ol className="page-nav-crumbs page-nav-crumbs--mobile" aria-label="Umístění">
        {mobileItems.map((item, i) => {
          const last = i === mobileItems.length - 1;
          const absIndex = items.length - mobileItems.length + i;
          return (
            <li key={`m-${item.label}-${i}`} className="page-nav-crumb">
              {i > 0 ? (
                <span className="page-nav-sep" aria-hidden>
                  /
                </span>
              ) : absIndex > 0 ? (
                <span className="page-nav-sep" aria-hidden>
                  …
                </span>
              ) : null}
              {item.href && !last ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span className={last ? "is-current" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
