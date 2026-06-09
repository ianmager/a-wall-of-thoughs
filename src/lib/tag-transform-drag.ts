/**
 * Pure math helpers for PowerPoint-style rotate + resize drag interactions
 * on the composer preview. Kept framework-free so they're easy to test.
 */

import {
  TAG_MAX_WIDTH_REM_MAX,
  TAG_MAX_WIDTH_REM_MIN,
  TAG_ROTATE_MAX,
  TAG_ROTATE_MIN,
} from "@/lib/tag-style";

const DEFAULT_ROOT_FONT_SIZE_PX = 16;

function clamp(n: number, min: number, max: number): number {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * Angle (degrees) from a box center to a pointer location, normalised so that
 * "straight up" reads as 0deg. Result is clamped to the allowed rotate range.
 */
export function pointerAngleDeg(
  centerX: number,
  centerY: number,
  clientX: number,
  clientY: number,
): number {
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  // atan2 returns 0 along +X; we want 0 along -Y (up). Adding 90deg shifts it.
  const raw = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  // Normalise to (-180, 180]
  let deg = raw;
  while (deg > 180) deg -= 360;
  while (deg <= -180) deg += 360;
  return clamp(deg, TAG_ROTATE_MIN, TAG_ROTATE_MAX);
}

/**
 * Project a screen-space pointer delta onto the box's local horizontal axis
 * after a rotation. Lets the resize handle feel right when the tag is tilted.
 */
export function projectDeltaOntoLocalX(
  deltaX: number,
  deltaY: number,
  rotateDeg: number,
): number {
  const rad = (rotateDeg * Math.PI) / 180;
  return deltaX * Math.cos(rad) + deltaY * Math.sin(rad);
}

/** Read the document root font size once (e.g. at drag start). */
export function getRootFontSizePx(): number {
  if (typeof window === "undefined") return DEFAULT_ROOT_FONT_SIZE_PX;
  return (
    parseFloat(getComputedStyle(document.documentElement).fontSize) ||
    DEFAULT_ROOT_FONT_SIZE_PX
  );
}

/** Convert a CSS pixel value to rem using the document root font size. */
export function pxToRem(px: number, rootFontSizePx?: number): number {
  const base = rootFontSizePx ?? getRootFontSizePx();
  return px / base;
}

/** Clamp a desired width (in rem) to the allowed tag bounding-box range. */
export function clampWidthRem(widthRem: number): number {
  return clamp(widthRem, TAG_MAX_WIDTH_REM_MIN, TAG_MAX_WIDTH_REM_MAX);
}
