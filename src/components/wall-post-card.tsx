import type { CSSProperties } from "react";

import { DeleteMessageForm } from "@/components/delete-message-form";
import {
  getPostScatterPlacement,
  getPostTagTextClass,
  type PostScatterPlacement,
} from "@/lib/wall-post-style";

type Props = {
  id: string;
  body: string;
  createdLabel: string;
  canDelete?: boolean;
  index: number;
  messageCount: number;
};

export function WallPostCard({
  id,
  body,
  createdLabel,
  canDelete = false,
  index,
  messageCount,
}: Props) {
  const placement = getPostScatterPlacement(id, index, messageCount);
  const textClass = getPostTagTextClass(id);
  const { rotateDeg } = placement;

  return (
    <li
      data-wall-post
      className="absolute max-w-[min(92vw,20rem)] transition-[z-index]"
      style={positionStyle(placement)}
    >
      <div
        data-wall-post-tag
        className="relative inline-flex max-w-full origin-top-left items-end gap-2 rounded-sm border-2 border-transparent p-1 transition-[border-color,background-color]"
        style={{ transform: `rotate(${rotateDeg}deg)` }}
      >
        <div className="min-w-0">
          <p className={`whitespace-pre-wrap break-words ${textClass}`}>{body}</p>
          <p className="sr-only">{createdLabel}</p>
        </div>
        {canDelete ? (
          <div
            data-wall-post-delete
            className="relative z-10 shrink-0 self-start"
            style={counterRotateStyle(rotateDeg)}
          >
            <DeleteMessageForm messageId={id} />
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
