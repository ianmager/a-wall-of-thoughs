import { memo, type CSSProperties } from "react";

import { DeleteMessageForm } from "@/components/delete-message-form";
import type { WallMessage } from "@/lib/wall-message";
import {
  resolvePostPlacement,
  resolvePostTextClass,
  type PostScatterPlacement,
} from "@/lib/wall-post-style";

type Props = {
  message: WallMessage;
  createdLabel: string;
  canDelete?: boolean;
  index: number;
  messageCount: number;
};

function WallPostCardInner({
  message,
  createdLabel,
  canDelete = false,
  index,
  messageCount,
}: Props) {
  const placement = resolvePostPlacement(message, index, messageCount);
  const textClass = resolvePostTextClass(message);
  const { rotateDeg } = placement;

  return (
    <li
      data-wall-post
      className="pointer-events-none absolute transition-[z-index]"
      style={positionStyle(placement)}
    >
      <div
        data-wall-post-tag
        className="relative inline-flex max-w-full origin-top-left items-end gap-2 rounded-sm border-2 border-transparent p-1 transition-[border-color,background-color]"
        style={{ transform: `rotate(${rotateDeg}deg)` }}
      >
        <div className="min-w-0" style={{ maxWidth: `${placement.maxWidthRem}rem` }}>
          <p className={`whitespace-pre-wrap break-words ${textClass}`}>{message.body}</p>
          <p className="sr-only">{createdLabel}</p>
        </div>
        {canDelete ? (
          <div
            data-wall-post-delete
            className="pointer-events-auto relative z-10 shrink-0 self-start"
            style={counterRotateStyle(rotateDeg)}
          >
            <DeleteMessageForm messageId={message.id} />
          </div>
        ) : null}
      </div>
    </li>
  );
}

function positionStyle(p: PostScatterPlacement): CSSProperties {
  return {
    left: `${p.leftPercent}%`,
    top: `${p.topPercent}%`,
    zIndex: p.zIndex,
    maxWidth: `${p.maxWidthRem}rem`,
  };
}

/** Keep the delete control level on screen while the tag text stays tilted. */
function counterRotateStyle(rotateDeg: number): CSSProperties {
  return {
    transform: `rotate(${-rotateDeg}deg)`,
    transformOrigin: "top left",
  };
}

export const WallPostCard = memo(WallPostCardInner);
