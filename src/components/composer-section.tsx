"use client";

import dynamic from "next/dynamic";

import { useTagDraft } from "@/components/wall-messages-provider";

const PostMessageForm = dynamic(
  () => import("@/components/post-message-form").then((m) => m.PostMessageForm),
  { ssr: false },
);

/**
 * Renders the "Add a tag" composer only once the user has clicked the wall.
 * Before that, signed-in users see nothing here so the wall stays uncluttered.
 */
export function ComposerSection() {
  const { draft, resetDraft } = useTagDraft();

  if (!draft.hasPlaced) {
    return null;
  }

  return (
    <div className="rounded-md border border-stone-900/20 bg-stone-100/40 p-4 shadow-[0_1px_0_rgba(255,255,255,0.3)_inset] sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="font-display text-2xl lowercase tracking-wide text-stone-950">
              Add your tag
            </h2>
            <p className="text-xs font-medium text-stone-600">
              Write it, style it, then post it to the wall.
            </p>
          </div>
          <button
            type="button"
            onClick={resetDraft}
            aria-label="Cancel adding a tag"
            className="-mr-1 -mt-1 rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider text-stone-600 transition-colors hover:bg-stone-900/10 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            Cancel
          </button>
        </div>
        <PostMessageForm />
      </div>
    </div>
  );
}
