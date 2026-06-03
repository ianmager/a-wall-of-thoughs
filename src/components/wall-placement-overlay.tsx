"use client";

import { useCallback, useRef, type PointerEvent } from "react";

import { TagDraftBox } from "@/components/tag-draft-box";
import { useTagDraft } from "@/components/wall-messages-provider";
import { pointerToWallPercent } from "@/lib/tag-placement";
import { TAG_COLOR_CLASSES, fontSizeToClass } from "@/lib/tag-style";

export function WallPlacementOverlay() {
  const { draft, setPlacement, setRotateDeg, setMaxWidthRem } = useTagDraft();
  const surfaceRef = useRef<HTMLDivElement>(null);

  const updateFromPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const el = surfaceRef.current;
      if (!el) return;
      const next = pointerToWallPercent(
        el.getBoundingClientRect(),
        event.clientX,
        event.clientY,
      );
      if (!next) return;
      setPlacement(next.x, next.y);
    },
    [setPlacement],
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      updateFromPointer(event);
    },
    [updateFromPointer],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      updateFromPointer(event);
    },
    [updateFromPointer],
  );

  const sizeClass = fontSizeToClass(draft.fontSize);

  return (
    <>
      <div
        ref={surfaceRef}
        role="button"
        tabIndex={0}
        aria-label="Click the wall to place your tag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="cursor-spray-can absolute inset-0 z-0 touch-none select-none"
      />
      {draft.hasPlaced ? (
        <div
          className="pointer-events-none absolute z-[600]"
          style={{
            left: `${draft.posX}%`,
            top: `${draft.posY}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <TagDraftBox
            text={draft.body}
            sizeClass={sizeClass}
            colorClass={TAG_COLOR_CLASSES[draft.colorKey]}
            rotateDeg={draft.rotateDeg}
            maxWidthRem={draft.maxWidthRem}
            chromeMode="always"
            onRotateChange={setRotateDeg}
            onMaxWidthChange={setMaxWidthRem}
          />
        </div>
      ) : null}
    </>
  );
}
