import type { ReactNode } from "react";

import { WallPostCard } from "@/components/wall-post-card";
import { getWallCanvasMinHeightPx } from "@/lib/wall-post-style";
import type { WallMessage } from "@/lib/wall-message";

const PLACEMENT_MIN_HEIGHT_PX = 480;

type Props = {
  messages: WallMessage[];
  canDelete: boolean;
  formatTime: (iso: string) => string;
  overlay?: ReactNode;
};

export function GraffitiWall({ messages, canDelete, formatTime, overlay }: Props) {
  const count = messages.length;
  const computed = getWallCanvasMinHeightPx(messages);
  const minHeight = overlay
    ? Math.max(computed, PLACEMENT_MIN_HEIGHT_PX)
    : computed;

  return (
    <ul
      className="wall-canvas relative mx-auto w-full max-w-6xl list-none px-2 pb-8"
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
