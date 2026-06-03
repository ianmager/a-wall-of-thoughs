"use client";

import { useState } from "react";

import { TagDraftBox } from "@/components/tag-draft-box";

type TagComposerPreviewProps = {
  text: string;
  sizeClass: string;
  colorClass: string;
  rotateDeg: number;
  maxWidthRem: number;
  disabled?: boolean;
  onRotateChange: (deg: number) => void;
  onMaxWidthChange: (rem: number) => void;
};

export function TagComposerPreview({
  text,
  sizeClass,
  colorClass,
  rotateDeg,
  maxWidthRem,
  disabled = false,
  onRotateChange,
  onMaxWidthChange,
}: TagComposerPreviewProps) {
  const [hover, setHover] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative flex min-h-44 select-none items-center justify-center rounded-md border-2 border-dashed border-stone-900/20 bg-stone-200/40 p-8"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <TagDraftBox
          text={text}
          sizeClass={sizeClass}
          colorClass={colorClass}
          rotateDeg={rotateDeg}
          maxWidthRem={maxWidthRem}
          disabled={disabled}
          chromeMode="controlled"
          chromeVisible={hover}
          onRotateChange={onRotateChange}
          onMaxWidthChange={onMaxWidthChange}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-stone-600">
        <span>Drag the handles to rotate and resize.</span>
        <span className="font-mono tabular-nums">
          {Math.round(maxWidthRem)} rem &middot; {Math.round(rotateDeg)}&deg;
        </span>
      </div>
    </div>
  );
}
