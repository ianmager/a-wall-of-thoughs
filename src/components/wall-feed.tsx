"use client";

import { GraffitiWall } from "@/components/graffiti-wall";
import { useWallMessages } from "@/components/wall-messages-provider";
import { WallPlacementOverlay } from "@/components/wall-placement-overlay";
import { formatWallTime } from "@/lib/format-wall-time";

type WallFeedProps = {
  canDelete: boolean;
  messagesError: string | null;
};

export function WallFeed({ canDelete, messagesError }: WallFeedProps) {
  const { messages } = useWallMessages();

  if (messagesError) {
    return (
      <p
        className="rounded-sm border-2 border-red-800/35 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
        role="alert"
      >
        Could not load messages ({messagesError}). If you just cloned the repo, run the SQL
        migration in Supabase.
      </p>
    );
  }

  return (
    <GraffitiWall
      messages={messages}
      canDelete={canDelete}
      formatTime={formatWallTime}
      overlay={<WallPlacementOverlay />}
    />
  );
}
