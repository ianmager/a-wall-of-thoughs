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

  return (
    <li
      data-wall-post
      className="absolute max-w-[min(92vw,20rem)]"
      style={scatterStyle(placement)}
    >
      <p className={`whitespace-pre-wrap break-words ${textClass}`}>{body}</p>
      <p className="sr-only">{createdLabel}</p>
      {canDelete ? (
        <div className="mt-2 rounded-sm bg-stone-950/10 p-1 backdrop-blur-[2px]">
          <DeleteMessageForm messageId={id} />
        </div>
      ) : null}
    </li>
  );
}

function scatterStyle(p: PostScatterPlacement): CSSProperties {
  return {
    left: `${p.leftPercent}%`,
    top: `${p.topPercent}%`,
    zIndex: p.zIndex,
    maxWidth: `${p.maxWidthRem}rem`,
    transform: `rotate(${p.rotateDeg}deg)`,
  };
}
