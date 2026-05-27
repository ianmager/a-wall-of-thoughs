/**
 * Shared definitions for user-chosen tag style: color palette, range limits,
 * and server-side form parsing.
 */

export const TAG_COLOR_KEYS = [
  "fuchsia",
  "cyan",
  "lime",
  "amber",
  "rose",
  "violet",
  "sky",
  "orange",
  "emerald",
  "pink",
  "yellow",
  "white",
] as const;

export type TagColorKey = (typeof TAG_COLOR_KEYS)[number];

export const TAG_POS_MIN = 0;
export const TAG_POS_MAX = 100;
export const TAG_ROTATE_MIN = -180;
export const TAG_ROTATE_MAX = 180;
export const TAG_FONT_SIZE_MIN = 1;
export const TAG_FONT_SIZE_MAX = 4;
export const TAG_MAX_WIDTH_REM_MIN = 6;
export const TAG_MAX_WIDTH_REM_MAX = 36;

/** Tailwind class for each font-size step. Index = font_size - 1. */
export const TAG_FONT_SIZE_CLASSES = [
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
] as const;

export function fontSizeToClass(size: number): string {
  const clamped = Math.min(
    Math.max(Math.round(size), TAG_FONT_SIZE_MIN),
    TAG_FONT_SIZE_MAX,
  );
  return TAG_FONT_SIZE_CLASSES[clamped - 1]!;
}

const TAG_COLOR_KEY_SET = new Set<string>(TAG_COLOR_KEYS);

export function isTagColorKey(value: unknown): value is TagColorKey {
  return typeof value === "string" && TAG_COLOR_KEY_SET.has(value);
}

/** Tailwind classes for each spray color (text color + drop shadow + glow). */
export const TAG_COLOR_CLASSES: Record<TagColorKey, string> = {
  fuchsia:
    "text-fuchsia-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(217,70,239,0.35)]",
  cyan: "text-cyan-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(8,145,178,0.3)]",
  lime: "text-lime-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(132,204,22,0.3)]",
  amber:
    "text-amber-400 [text-shadow:2px_3px_0_rgba(28,25,23,0.5),0_0_12px_rgba(251,191,36,0.35)]",
  rose: "text-rose-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(244,63,94,0.3)]",
  violet:
    "text-violet-600 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(124,58,237,0.3)]",
  sky: "text-sky-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(14,165,233,0.3)]",
  orange:
    "text-orange-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(249,115,22,0.3)]",
  emerald:
    "text-emerald-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(16,185,129,0.3)]",
  pink: "text-pink-500 [text-shadow:2px_3px_0_rgba(28,25,23,0.45),0_0_12px_rgba(236,72,153,0.3)]",
  yellow:
    "text-yellow-300 [text-shadow:2px_3px_0_rgba(28,25,23,0.55),0_0_12px_rgba(253,224,71,0.35)]",
  white:
    "text-white [text-shadow:2px_3px_0_rgba(28,25,23,0.55),0_0_14px_rgba(255,255,255,0.25)]",
};

/** A small CSS color sample used by composer swatches (no Tailwind needed). */
export const TAG_COLOR_SWATCH: Record<TagColorKey, string> = {
  fuchsia: "#c026d3",
  cyan: "#0891b2",
  lime: "#84cc16",
  amber: "#fbbf24",
  rose: "#f43f5e",
  violet: "#7c3aed",
  sky: "#0ea5e9",
  orange: "#f97316",
  emerald: "#10b981",
  pink: "#ec4899",
  yellow: "#fde047",
  white: "#ffffff",
};

export type TagStyleInput = {
  pos_x: number;
  pos_y: number;
  rotate_deg: number;
  color_key: TagColorKey;
  font_size: number;
  max_width_rem: number;
};

export type ParseTagStyleResult =
  | { ok: true; value: TagStyleInput }
  | { ok: false; error: string };

function parseNumber(raw: FormDataEntryValue | null): number | null {
  if (raw === null) return null;
  const n = Number(String(raw));
  return Number.isFinite(n) ? n : null;
}

function inRange(n: number, min: number, max: number): boolean {
  return n >= min && n <= max;
}

export function parseTagStyleFromFormData(
  formData: FormData,
): ParseTagStyleResult {
  const placementSet = formData.get("placement_set");
  if (placementSet !== "1") {
    return { ok: false, error: "Click the wall to place your tag before posting." };
  }

  const pos_x = parseNumber(formData.get("pos_x"));
  const pos_y = parseNumber(formData.get("pos_y"));
  const rotate_deg = parseNumber(formData.get("rotate_deg"));
  const colorRaw = formData.get("color_key");
  const color_key = typeof colorRaw === "string" ? colorRaw : null;
  const font_size = parseNumber(formData.get("font_size"));
  const max_width_rem = parseNumber(formData.get("max_width_rem"));

  if (
    pos_x === null ||
    pos_y === null ||
    rotate_deg === null ||
    color_key === null ||
    font_size === null ||
    max_width_rem === null
  ) {
    return { ok: false, error: "Pick a spot, angle, color, size, and box for your tag." };
  }
  if (!inRange(pos_x, TAG_POS_MIN, TAG_POS_MAX) || !inRange(pos_y, TAG_POS_MIN, TAG_POS_MAX)) {
    return { ok: false, error: "Tag position is out of range." };
  }
  if (!inRange(rotate_deg, TAG_ROTATE_MIN, TAG_ROTATE_MAX)) {
    return { ok: false, error: "Tag rotation is out of range." };
  }
  if (!isTagColorKey(color_key)) {
    return { ok: false, error: "Unknown tag color." };
  }
  if (!inRange(font_size, TAG_FONT_SIZE_MIN, TAG_FONT_SIZE_MAX)) {
    return { ok: false, error: "Tag size is out of range." };
  }
  if (!inRange(max_width_rem, TAG_MAX_WIDTH_REM_MIN, TAG_MAX_WIDTH_REM_MAX)) {
    return { ok: false, error: "Tag width is out of range." };
  }

  return {
    ok: true,
    value: {
      pos_x,
      pos_y,
      rotate_deg,
      color_key,
      font_size: Math.round(font_size),
      max_width_rem: Math.round(max_width_rem),
    },
  };
}
