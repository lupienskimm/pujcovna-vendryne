"use client";

import { useEffect, useState } from "react";
import { CardStyleDock } from "@/components/CardStyleDock";

export function DeferredCardStyleDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb: IdleRequestCallback) =>
      window.setTimeout(cb, 1200));
    const id = ric(() => setShow(true));
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number);
      else window.clearTimeout(id as number);
    };
  }, []);

  if (!show) return null;
  return <CardStyleDock />;
}
