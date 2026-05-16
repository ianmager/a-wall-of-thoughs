/**
 * Deterministic “tag” styling per message id (stable SSR / hydration).
 */

const TAG_PALETTE: ReadonlyArray<{ card: string; meta: string }> = [
  {
    card: "border-2 border-stone-900/25 bg-amber-100 text-stone-900 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-amber-950/70",
  },
  {
    card: "border-2 border-stone-900/25 bg-sky-100 text-sky-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-sky-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-lime-100 text-lime-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-lime-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-rose-100 text-rose-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-rose-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-violet-100 text-violet-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-violet-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-teal-100 text-teal-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-teal-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-orange-100 text-orange-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-orange-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-fuchsia-100 text-fuchsia-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-fuchsia-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-cyan-100 text-cyan-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-cyan-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-emerald-100 text-emerald-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-emerald-950/65",
  },
  {
    card: "border-2 border-stone-900/25 bg-yellow-100 text-yellow-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-yellow-950/70",
  },
  {
    card: "border-2 border-stone-900/25 bg-indigo-100 text-indigo-950 shadow-[4px_5px_0_rgba(28,25,23,0.2)]",
    meta: "text-indigo-950/65",
  },
];

export function hashStringToUint(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getPostTagClasses(id: string): { card: string; meta: string } {
  const h = hashStringToUint(id);
  const idx = h % TAG_PALETTE.length;
  return TAG_PALETTE[idx]!;
}

/** Small deterministic tilt; neutralized via CSS when prefers-reduced-motion */
export function getPostRotationDeg(id: string): number {
  const h = hashStringToUint(`${id}:rotate`);
  const t = (h % 1000) / 1000;
  return -2.5 + t * 5;
}
