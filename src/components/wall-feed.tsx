"use client";

import { GraffitiWall } from "@/components/graffiti-wall";
import { useWallMessages } from "@/components/wall-messages-provider";
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

  if (messages.length === 0) {
    return (
      <p className="font-display text-lg lowercase tracking-wide text-stone-800/75">
        No messages yet — hit the wall first.
      </p>
    );
  }

  return (
    <GraffitiWall
      messages={messages}
      canDelete={canDelete}
      formatTime={formatWallTime}
    />
  );
}
