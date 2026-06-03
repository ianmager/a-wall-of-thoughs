"use client";

import { TagComposerPreview } from "@/components/tag-composer-preview";
import {
  TAG_COLOR_CLASSES,
  TAG_COLOR_KEYS,
  TAG_COLOR_SWATCH,
  TAG_FONT_SIZE_MAX,
  TAG_FONT_SIZE_MIN,
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
  const sizeClass = fontSizeToClass(fontSize);

  return (
    <div className="flex flex-col gap-4">
      <TagComposerPreview
        text={previewText}
        sizeClass={sizeClass}
        colorClass={TAG_COLOR_CLASSES[colorKey]}
        rotateDeg={rotateDeg}
        maxWidthRem={maxWidthRem}
        disabled={disabled}
        onRotateChange={onRotateChange}
        onMaxWidthChange={onMaxWidthChange}
      />

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
    </div>
  );
}
