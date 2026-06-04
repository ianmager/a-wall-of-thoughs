/**
 * Deterministic graffiti tag styling and scatter placement (stable SSR / hydration),
 * plus resolvers that prefer user-chosen style when present.
 */

import {
  TAG_COLOR_CLASSES,
  TAG_COLOR_KEYS,
  TAG_FONT_SIZE_CLASSES,
  fontSizeToClass,
  isTagColorKey,
  type TagColorKey,
} from "@/lib/tag-style";
import type { WallMessage } from "@/lib/wall-message";

function hashStringToUint(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hashColorKey(id: string): TagColorKey {
  const h = hashStringToUint(id);
  return TAG_COLOR_KEYS[h % TAG_COLOR_KEYS.length]!;
}

function hashSizeClass(id: string): string {
  const h = hashStringToUint(id);
  return TAG_FONT_SIZE_CLASSES[h % TAG_FONT_SIZE_CLASSES.length]!;
}

function hashMaxWidthRem(id: string): number {
  const h = hashStringToUint(id);
  return 9 + (h % 9);
}

/** Deterministic tilt; neutralized via CSS when prefers-reduced-motion */
function getPostRotationDeg(id: string): number {
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
    maxWidthRem: hashMaxWidthRem(id),
  };
}

function hasUserTagStyle(message: WallMessage): boolean {
  return (
    message.pos_x !== null &&
    message.pos_y !== null &&
    message.rotate_deg !== null &&
    message.color_key !== null
  );
}

/** Stored placement when present; otherwise the deterministic scatter. */
export function resolvePostPlacement(
  message: WallMessage,
  index: number,
  count: number,
): PostScatterPlacement {
  const fallback = getPostScatterPlacement(message.id, index, count);
  if (!hasUserTagStyle(message)) return fallback;
  return {
    leftPercent: message.pos_x as number,
    topPercent: message.pos_y as number,
    rotateDeg: message.rotate_deg as number,
    zIndex: fallback.zIndex,
    maxWidthRem:
      message.max_width_rem !== null ? message.max_width_rem : fallback.maxWidthRem,
  };
}

/** Tailwind classes for tag text: stored size + color when present, else hash. */
export function resolvePostTextClass(message: WallMessage): string {
  const size =
    message.font_size !== null ? fontSizeToClass(message.font_size) : hashSizeClass(message.id);
  const key = isTagColorKey(message.color_key)
    ? message.color_key
    : hashColorKey(message.id);
  return `font-display ${size} leading-tight tracking-wide ${TAG_COLOR_CLASSES[key]}`;
}

/**
 * Min height for the scatter canvas so tags have room to spread. Considers
 * user-placed tags so a tag near `pos_y=95` does not get cut off.
 */
export function getWallCanvasMinHeightPx(messages: ReadonlyArray<WallMessage>): number {
  if (messages.length === 0) return 0;
  const base = Math.max(420, 160 + messages.length * 130);
  let maxPosY = 0;
  for (const m of messages) {
    if (m.pos_y !== null && m.pos_y > maxPosY) maxPosY = m.pos_y;
  }
  if (maxPosY === 0) return base;
  const needed = Math.round((maxPosY / 100) * base + 120);
  return Math.max(base, needed);
}
