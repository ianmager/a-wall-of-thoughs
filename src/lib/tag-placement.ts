import { TAG_POS_MAX, TAG_POS_MIN } from "@/lib/tag-style";

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

function roundTo(n: number, decimals: number): number {
  const m = 10 ** decimals;
  return Math.round(n * m) / m;
}

export type WallPercent = { x: number; y: number };

/**
 * Convert a pointer location to wall coordinates as percentages of the
 * element's bounding box, clamped to the valid range and rounded to one
 * decimal so the value round-trips cleanly through Postgres `real`.
 */
export function pointerToWallPercent(
  rect: DOMRect,
  clientX: number,
  clientY: number,
): WallPercent | null {
  if (rect.width === 0 || rect.height === 0) return null;
  const x = clamp(((clientX - rect.left) / rect.width) * 100, TAG_POS_MIN, TAG_POS_MAX);
  const y = clamp(((clientY - rect.top) / rect.height) * 100, TAG_POS_MIN, TAG_POS_MAX);
  return { x: roundTo(x, 1), y: roundTo(y, 1) };
}
