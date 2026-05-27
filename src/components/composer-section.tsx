"use client";

import { ConnectedPostMessageForm } from "@/components/connected-post-message-form";
import { useWallMessages } from "@/components/wall-messages-provider";

/**
 * Renders the "Add a tag" composer only once the user has clicked the wall.
 * Before that, signed-in users see nothing here so the wall stays uncluttered.
 */
export function ComposerSection() {
  const { draft, resetDraft } = useWallMessages();

  if (!draft.hasPlaced) {
    return null;
  }

  return (
    <div className="rounded-sm border border-stone-900/20 bg-stone-950/5 p-4 sm:p-5">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl lowercase tracking-wide text-stone-950">
            Add a tag
          </h2>
          <button
            type="button"
            onClick={resetDraft}
            className="text-xs font-bold uppercase tracking-wider text-stone-700 transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            Cancel
          </button>
        </div>
        <ConnectedPostMessageForm />
      </div>
    </div>
  );
}
