/**
 * Deterministic graffiti tag styling and scatter placement (stable SSR / hydration).
 */

const SPRAY_COLORS: ReadonlyArray<string> = [
  "text-fuchsia-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(217,70,239,0.35)]",
  "text-cyan-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(8,145,178,0.3)]",
  "text-lime-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(132,204,22,0.3)]",
  "text-amber-400 [text-shadow:2px_3px_0_rgba(28,25,23,0.5),0_0_12px_rgba(251,191,36,0.35)]",
  "text-rose-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(244,63,94,0.3)]",
  "text-violet-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(124,58,237,0.3)]",
  "text-sky-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(14,165,233,0.3)]",
  "text-orange-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(249,115,22,0.3)]",
  "text-emerald-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(16,185,129,0.3)]",
  "text-pink-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(236,72,153,0.3)]",
  "text-yellow-300 [text-shadow:2px_3px_0_rgba(28,25,23,0.55),0_0_12px_rgba(253,224,71,0.35)]",
  "text-white [text-shadow:2px_3px_0_rgba(28,25,23,0.55),0_0_14px_rgba(255,255,255,0.25)]",
];

const SIZE_CLASSES = ["text-xl", "text-2xl", "text-3xl", "text-4xl"] as const;

export function hashStringToUint(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getPostTagTextClass(id: string): string {
  const h = hashStringToUint(id);
  const color = SPRAY_COLORS[h % SPRAY_COLORS.length]!;
  const size = SIZE_CLASSES[h % SIZE_CLASSES.length]!;
  return `font-display ${size} leading-tight tracking-wide ${color}`;
}

/** Deterministic tilt; neutralized via CSS when prefers-reduced-motion */
export function getPostRotationDeg(id: string): number {
  const h = hashStringToUint(`${id}:rotate`);
  const t = (h % 1000) / 1000;
  return -8 + t * 16;
}

export type PostScatterPlacement = {
  leftPercent: number;
  topPercent: number;
  rotateDeg: number;
  zIndex: number;
  maxWidthRem: number;
};

export function getPostScatterPlacement(
  id: string,
  index: number,
  count: number,
): PostScatterPlacement {
  const h = hashStringToUint(id);
  const hPos = hashStringToUint(`${id}:scatter`);

  const leftPercent = 6 + (hPos % 7400) / 100;
  const band = count <= 1 ? 0.4 : index / Math.max(count - 1, 1);
  const jitter = ((h % 1000) / 1000 - 0.5) * 14;
  const topPercent = Math.min(90, Math.max(4, band * 78 + 8 + jitter));

  return {
    leftPercent,
    topPercent,
    rotateDeg: getPostRotationDeg(id),
    zIndex: index + 1,
    maxWidthRem: 9 + (h % 9),
  };
}

/** Min height for the scatter canvas so tags have room to spread */
export function getWallCanvasMinHeightPx(messageCount: number): number {
  if (messageCount === 0) return 0;
  return Math.max(420, 160 + messageCount * 130);
}
