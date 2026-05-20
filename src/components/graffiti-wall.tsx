import { WallPostCard } from "@/components/wall-post-card";
import { getWallCanvasMinHeightPx } from "@/lib/wall-post-style";

export type GraffitiWallMessage = {
  id: string;
  body: string;
  created_at: string;
};

type Props = {
  messages: GraffitiWallMessage[];
  canDelete: boolean;
  formatTime: (iso: string) => string;
};

export function GraffitiWall({ messages, canDelete, formatTime }: Props) {
  const count = messages.length;
  const minHeight = getWallCanvasMinHeightPx(count);

  return (
    <ul
      className="wall-canvas relative mx-auto w-full max-w-6xl list-none px-2 pb-8"
      style={{ minHeight: minHeight > 0 ? `${minHeight}px` : undefined }}
      aria-label="Message wall"
    >
      {messages.map((m, index) => (
        <WallPostCard
          key={m.id}
          id={m.id}
          body={m.body}
          createdLabel={formatTime(m.created_at)}
          canDelete={canDelete}
          index={index}
          messageCount={count}
        />
      ))}
    </ul>
  );
}
