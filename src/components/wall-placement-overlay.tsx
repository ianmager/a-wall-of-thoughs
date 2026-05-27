"use client";

import { useCallback, useRef, type PointerEvent } from "react";

import { useWallMessages } from "@/components/wall-messages-provider";
import { pointerToWallPercent } from "@/lib/tag-placement";
import { TAG_COLOR_CLASSES, fontSizeToClass } from "@/lib/tag-style";

export function WallPlacementOverlay() {
  const { draft, setPlacement } = useWallMessages();
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

  const previewLabel = draft.body.trim() || "your tag";
  const sizeClass = fontSizeToClass(draft.fontSize);

  return (
    <>
      {/* Click-capture surface sits behind post cards so delete buttons
          (which opt back into pointer events) receive their own clicks. */}
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
        <span
          aria-hidden
          className="pointer-events-none absolute z-[600] origin-center"
          style={{
            left: `${draft.posX}%`,
            top: `${draft.posY}%`,
            maxWidth: `${draft.maxWidthRem}rem`,
            transform: `translate(-50%, -50%) rotate(${draft.rotateDeg}deg)`,
          }}
        >
          <span
            className={`font-display ${sizeClass} leading-tight tracking-wide drop-shadow-sm ${TAG_COLOR_CLASSES[draft.colorKey]}`}
            style={{
              display: "inline-block",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {previewLabel}
          </span>
        </span>
      ) : null}
    </>
  );
}
