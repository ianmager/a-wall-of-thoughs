"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import {
  TAG_MAX_WIDTH_REM_MAX,
  TAG_MAX_WIDTH_REM_MIN,
  TAG_ROTATE_MAX,
  TAG_ROTATE_MIN,
} from "@/lib/tag-style";
import {
  clampWidthRem,
  pointerAngleDeg,
  projectDeltaOntoLocalX,
  pxToRem,
} from "@/lib/tag-transform-drag";

type DragMode = "rotate" | "resize-e" | "resize-w" | null;

type ResizeStart = {
  clientX: number;
  clientY: number;
  startWidthRem: number;
};

export type TagDraftBoxChrome = "always" | "controlled";

export type TagDraftBoxProps = {
  text: string;
  sizeClass: string;
  colorClass: string;
  rotateDeg: number;
  maxWidthRem: number;
  disabled?: boolean;
  /**
   * "always" keeps selection chrome visible (used on the wall ghost).
   * "controlled" defers to `chromeVisible` (used by composer stage hover).
   */
  chromeMode?: TagDraftBoxChrome;
  chromeVisible?: boolean;
  onRotateChange: (deg: number) => void;
  onMaxWidthChange: (rem: number) => void;
};

/**
 * Rotated tag preview with PowerPoint-style chrome:
 * dashed selection outline, rotate handle, and L/R resize handles.
 *
 * The outer wrapper is `pointer-events-none` so the rendered text never
 * blocks clicks underneath (e.g. the wall placement surface). Handles opt
 * back in with `pointer-events-auto`.
 */
export function TagDraftBox({
  text,
  sizeClass,
  colorClass,
  rotateDeg,
  maxWidthRem,
  disabled = false,
  chromeMode = "controlled",
  chromeVisible = false,
  onRotateChange,
  onMaxWidthChange,
}: TagDraftBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef<ResizeStart | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);

  const previewLabel = text.trim() || "your tag";
  const showChrome =
    !disabled &&
    (chromeMode === "always" || chromeVisible || dragMode !== null);

  useEffect(() => {
    if (!dragMode) return;
    const prev = document.body.style.cursor;
    document.body.style.cursor =
      dragMode === "rotate" ? "grabbing" : "ew-resize";
    return () => {
      document.body.style.cursor = prev;
    };
  }, [dragMode]);

  const handleRotatePointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      setDragMode("rotate");
    },
    [disabled],
  );

  const handleRotatePointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      onRotateChange(pointerAngleDeg(cx, cy, event.clientX, event.clientY));
    },
    [onRotateChange],
  );

  const handleRotatePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDragMode(null);
    },
    [],
  );

  const handleResizePointerDown = useCallback(
    (side: "e" | "w") =>
      (event: PointerEvent<HTMLButtonElement>) => {
        if (disabled) return;
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        resizeStartRef.current = {
          clientX: event.clientX,
          clientY: event.clientY,
          startWidthRem: maxWidthRem,
        };
        setDragMode(side === "e" ? "resize-e" : "resize-w");
      },
    [disabled, maxWidthRem],
  );

  const handleResizePointerMove = useCallback(
    (side: "e" | "w") =>
      (event: PointerEvent<HTMLButtonElement>) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
        const start = resizeStartRef.current;
        if (!start) return;
        const dx = event.clientX - start.clientX;
        const dy = event.clientY - start.clientY;
        const localDx = projectDeltaOntoLocalX(dx, dy, rotateDeg);
        // The box grows symmetrically from its center; multiply by 2 so the
        // dragged edge tracks the cursor.
        const directionalDelta = side === "e" ? localDx : -localDx;
        const nextWidth = start.startWidthRem + pxToRem(directionalDelta) * 2;
        onMaxWidthChange(clampWidthRem(nextWidth));
      },
    [onMaxWidthChange, rotateDeg],
  );

  const handleResizePointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      resizeStartRef.current = null;
      setDragMode(null);
    },
    [],
  );

  const handleRotateKey = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      const step = event.shiftKey ? 15 : 5;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault();
        onRotateChange(Math.max(TAG_ROTATE_MIN, rotateDeg - step));
      } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault();
        onRotateChange(Math.min(TAG_ROTATE_MAX, rotateDeg + step));
      } else if (event.key === "Home") {
        event.preventDefault();
        onRotateChange(0);
      }
    },
    [disabled, onRotateChange, rotateDeg],
  );

  const handleResizeKey = useCallback(
    (side: "e" | "w") =>
      (event: KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const step = event.shiftKey ? 4 : 1;
        const grow =
          (side === "e" && event.key === "ArrowRight") ||
          (side === "w" && event.key === "ArrowLeft");
        const shrink =
          (side === "e" && event.key === "ArrowLeft") ||
          (side === "w" && event.key === "ArrowRight");
        if (grow) {
          event.preventDefault();
          onMaxWidthChange(clampWidthRem(maxWidthRem + step));
        } else if (shrink) {
          event.preventDefault();
          onMaxWidthChange(clampWidthRem(maxWidthRem - step));
        }
      },
    [disabled, maxWidthRem, onMaxWidthChange],
  );

  // Hit-area buttons are larger than the visible dot so they're easy to grab.
  const handleHitClass =
    "absolute z-20 grid h-7 w-7 place-items-center touch-none bg-transparent border-0 p-0 transition-opacity";
  const visibleClass = showChrome
    ? "pointer-events-auto opacity-100"
    : "pointer-events-none opacity-0";
  const dotClass =
    "block h-3 w-3 rounded-full border border-stone-900 bg-stone-50 shadow-[1px_1px_0_rgba(28,25,23,0.45)]";
  const rotateDotClass =
    "block h-3.5 w-3.5 rounded-full border border-stone-900 bg-stone-50 shadow-[1px_1px_0_rgba(28,25,23,0.45)]";

  return (
    <div
      ref={boxRef}
      className="pointer-events-none relative inline-block"
      style={{
        transform: `rotate(${rotateDeg}deg)`,
        transformOrigin: "center center",
      }}
    >
      <div
        className={`${sizeClass} font-display leading-tight tracking-wide drop-shadow-sm ${colorClass}`}
        style={{
          display: "inline-block",
          maxWidth: `${maxWidthRem}rem`,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {previewLabel}
      </div>

      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border border-dashed border-stone-900/70 transition-opacity ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 -translate-y-full bg-stone-900/70 transition-opacity ${
          showChrome ? "opacity-100" : "opacity-0"
        }`}
      />

      <button
        type="button"
        disabled={disabled}
        aria-label="Rotate tag"
        role="slider"
        aria-valuemin={TAG_ROTATE_MIN}
        aria-valuemax={TAG_ROTATE_MAX}
        aria-valuenow={Math.round(rotateDeg)}
        aria-valuetext={`${Math.round(rotateDeg)} degrees`}
        onPointerDown={handleRotatePointerDown}
        onPointerMove={handleRotatePointerMove}
        onPointerUp={handleRotatePointerUp}
        onPointerCancel={handleRotatePointerUp}
        onKeyDown={handleRotateKey}
        className={`${handleHitClass} ${visibleClass} left-1/2 top-0 -translate-x-1/2 -translate-y-[1.6rem] cursor-grab active:cursor-grabbing`}
      >
        <span aria-hidden className={rotateDotClass} />
      </button>

      <button
        type="button"
        disabled={disabled}
        aria-label="Resize tag from left edge"
        role="slider"
        aria-valuemin={TAG_MAX_WIDTH_REM_MIN}
        aria-valuemax={TAG_MAX_WIDTH_REM_MAX}
        aria-valuenow={Math.round(maxWidthRem)}
        aria-valuetext={`${Math.round(maxWidthRem)} rem wide`}
        onPointerDown={handleResizePointerDown("w")}
        onPointerMove={handleResizePointerMove("w")}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
        onKeyDown={handleResizeKey("w")}
        className={`${handleHitClass} ${visibleClass} left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize`}
      >
        <span aria-hidden className={dotClass} />
      </button>

      <button
        type="button"
        disabled={disabled}
        aria-label="Resize tag from right edge"
        role="slider"
        aria-valuemin={TAG_MAX_WIDTH_REM_MIN}
        aria-valuemax={TAG_MAX_WIDTH_REM_MAX}
        aria-valuenow={Math.round(maxWidthRem)}
        aria-valuetext={`${Math.round(maxWidthRem)} rem wide`}
        onPointerDown={handleResizePointerDown("e")}
        onPointerMove={handleResizePointerMove("e")}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
        onKeyDown={handleResizeKey("e")}
        className={`${handleHitClass} ${visibleClass} right-0 top-1/2 translate-x-1/2 -translate-y-1/2 cursor-ew-resize`}
      >
        <span aria-hidden className={dotClass} />
      </button>
    </div>
  );
}
