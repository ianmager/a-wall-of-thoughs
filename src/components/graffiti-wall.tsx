import type { ReactNode } from "react";

import { WallPostCard } from "@/components/wall-post-card";
import { getWallCanvasMinHeightPx } from "@/lib/wall-post-style";
import type { WallMessage } from "@/lib/wall-message";

export const PLACEMENT_MIN_HEIGHT_PX = 480;

type Props = {
  messages: WallMessage[];
  canDelete: boolean;
  formatTime: (iso: string) => string;
  overlay?: ReactNode;
  /** Precomputed canvas height (avoids duplicate work in client parents). */
  minHeightPx?: number;
};

export function GraffitiWall({
  messages,
  canDelete,
  formatTime,
  overlay,
  minHeightPx: minHeightPxProp,
}: Props) {
  const count = messages.length;
  const minHeight = minHeightPxProp ?? computeMinHeight(messages, Boolean(overlay));

  return (
    <ul
      className="wall-canvas relative w-full list-none pb-8"
      style={{ minHeight: minHeight > 0 ? `${minHeight}px` : undefined }}
      aria-label="Message wall"
    >
      {messages.map((m, index) => (
        <WallPostCard
          key={m.id}
          message={m}
          createdLabel={formatTime(m.created_at)}
          canDelete={canDelete}
          index={index}
          messageCount={count}
        />
      ))}
      {overlay ? (
        <li role="presentation" className="contents">
          {overlay}
        </li>
      ) : null}
    </ul>
  );
}

function computeMinHeight(messages: WallMessage[], hasOverlay: boolean): number {
  const computed = getWallCanvasMinHeightPx(messages);
  return hasOverlay ? Math.max(computed, PLACEMENT_MIN_HEIGHT_PX) : computed;
}
