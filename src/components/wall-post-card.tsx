import { DeleteMessageForm } from "@/components/delete-message-form";
import { getPostRotationDeg, getPostTagClasses } from "@/lib/wall-post-style";

type Props = {
  id: string;
  body: string;
  createdLabel: string;
  canDelete?: boolean;
};

export function WallPostCard({ id, body, createdLabel, canDelete = false }: Props) {
  const { card, meta } = getPostTagClasses(id);
  const rotate = getPostRotationDeg(id);

  return (
    <li
      data-wall-post
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`flex flex-col rounded-sm px-3 py-2.5 ${card}`}
    >
      <div className="min-h-0 flex-1">
        <p className="whitespace-pre-wrap break-words text-sm font-medium leading-snug">{body}</p>
        <p className={`mt-2 text-xs font-semibold uppercase tracking-wide ${meta}`}>{createdLabel}</p>
      </div>
      {canDelete ? <DeleteMessageForm messageId={id} /> : null}
    </li>
  );
}
