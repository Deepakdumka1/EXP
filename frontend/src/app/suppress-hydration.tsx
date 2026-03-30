"use client";

if (typeof window !== "undefined") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
    if (msg.includes("A tree hydrated") || msg.includes("Hydration")) return;
    orig.apply(console, args);
  };
}

export function SuppressHydrationWarning() {
  return null;
}
