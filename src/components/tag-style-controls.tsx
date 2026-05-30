"use client";

import { useId } from "react";

import {
  TAG_COLOR_CLASSES,
  TAG_COLOR_KEYS,
  TAG_COLOR_SWATCH,
  TAG_FONT_SIZE_MAX,
  TAG_FONT_SIZE_MIN,
  TAG_MAX_WIDTH_REM_MAX,
  TAG_MAX_WIDTH_REM_MIN,
  TAG_ROTATE_MAX,
  TAG_ROTATE_MIN,
  fontSizeToClass,
  type TagColorKey,
} from "@/lib/tag-style";

const SWATCH_RING_SELECTED = "ring-2 ring-stone-950 ring-offset-2 ring-offset-stone-200";
const SIZE_LABELS = ["S", "M", "L", "XL"] as const;
const rowLabelClass = "text-xs font-semibold uppercase tracking-wider text-stone-700";

type TagStyleControlsProps = {
  rotateDeg: number;
  colorKey: TagColorKey;
  fontSize: number;
  maxWidthRem: number;
  previewText: string;
  disabled?: boolean;
  onRotateChange: (deg: number) => void;
  onColorChange: (key: TagColorKey) => void;
  onFontSizeChange: (size: number) => void;
  onMaxWidthChange: (rem: number) => void;
};

export function TagStyleControls({
  rotateDeg,
  colorKey,
  fontSize,
  maxWidthRem,
  previewText,
  disabled = false,
  onRotateChange,
  onColorChange,
  onFontSizeChange,
  onMaxWidthChange,
}: TagStyleControlsProps) {
  const widthInputId = useId();
  const rotateInputId = useId();
  const previewLabel = previewText.trim() || "your tag";
  const sizeClass = fontSizeToClass(fontSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex min-h-28 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-stone-900/20 bg-stone-200/40 p-4">
        <span
          aria-hidden
          className={`font-display ${sizeClass} leading-tight tracking-wide drop-shadow-sm ${TAG_COLOR_CLASSES[colorKey]}`}
          style={{
            display: "inline-block",
            maxWidth: `${maxWidthRem}rem`,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            transform: `rotate(${rotateDeg}deg)`,
          }}
        >
          {previewLabel}
        </span>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={rowLabelClass}>Color</legend>
        <div className="flex flex-wrap gap-2">
          {TAG_COLOR_KEYS.map((key) => {
            const selected = key === colorKey;
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                aria-label={key}
                title={key}
                onClick={() => onColorChange(key)}
                className={`h-7 w-7 rounded-full border border-stone-900/55 shadow-[1px_1px_0_rgba(28,25,23,0.35)] transition-transform hover:scale-110 disabled:opacity-50 ${
                  selected ? SWATCH_RING_SELECTED : ""
                }`}
                style={{ backgroundColor: TAG_COLOR_SWATCH[key] }}
              />
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className={rowLabelClass}>Size</legend>
        <div className="flex gap-1.5">
          {Array.from({ length: TAG_FONT_SIZE_MAX - TAG_FONT_SIZE_MIN + 1 }, (_, i) => {
            const value = TAG_FONT_SIZE_MIN + i;
            const selected = value === fontSize;
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => onFontSizeChange(value)}
                className={`h-9 flex-1 rounded-md border-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${
                  selected
                    ? "border-stone-950 bg-stone-950 text-amber-50"
                    : "border-stone-900/40 bg-stone-100/90 text-stone-900 hover:bg-stone-200/90"
                }`}
              >
                {SIZE_LABELS[i]}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={widthInputId} className={rowLabelClass}>
            Width
          </label>
          <span className="font-mono text-[11px] tabular-nums text-stone-600">
            {Math.round(maxWidthRem)} rem
          </span>
        </div>
        <input
          id={widthInputId}
          type="range"
          min={TAG_MAX_WIDTH_REM_MIN}
          max={TAG_MAX_WIDTH_REM_MAX}
          step={1}
          value={maxWidthRem}
          disabled={disabled}
          onChange={(e) => onMaxWidthChange(Number(e.target.value))}
          className="w-full accent-stone-900 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={rotateInputId} className={rowLabelClass}>
            Angle
          </label>
          <span className="font-mono text-[11px] tabular-nums text-stone-600">
            {Math.round(rotateDeg)}&deg;
          </span>
        </div>
        <input
          id={rotateInputId}
          type="range"
          min={TAG_ROTATE_MIN}
          max={TAG_ROTATE_MAX}
          step={1}
          value={rotateDeg}
          disabled={disabled}
          onChange={(e) => onRotateChange(Number(e.target.value))}
          className="w-full accent-stone-900 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
