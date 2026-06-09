"use client";

import { useMemo } from "react";

import { GraffitiWall, PLACEMENT_MIN_HEIGHT_PX } from "@/components/graffiti-wall";
import { WallMessagesError } from "@/components/wall-messages-error";
import { useWallMessages } from "@/components/wall-messages-provider";
import { WallPlacementOverlay } from "@/components/wall-placement-overlay";
import { formatWallTime } from "@/lib/format-wall-time";
import { getWallCanvasMinHeightPx } from "@/lib/wall-post-style";

type WallFeedProps = {
  canDelete: boolean;
  messagesError: string | null;
};

const wallOverlay = <WallPlacementOverlay />;

export function WallFeed({ canDelete, messagesError }: WallFeedProps) {
  const { messages } = useWallMessages();

  const minHeightPx = useMemo(() => {
    const computed = getWallCanvasMinHeightPx(messages);
    return Math.max(computed, PLACEMENT_MIN_HEIGHT_PX);
  }, [messages]);

  if (messagesError) {
    return <WallMessagesError message={messagesError} />;
  }

  return (
    <GraffitiWall
      messages={messages}
      canDelete={canDelete}
      formatTime={formatWallTime}
      minHeightPx={minHeightPx}
      overlay={wallOverlay}
    />
  );
}
