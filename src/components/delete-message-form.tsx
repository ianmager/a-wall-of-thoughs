"use client";

import { useActionState, useEffect } from "react";

import { deleteMessage, type DeleteMessageState } from "@/app/actions";
import { useWallMessages } from "@/components/wall-messages-provider";

const initialState: DeleteMessageState = {};

type Props = {
  messageId: string;
};

export function DeleteMessageForm({ messageId }: Props) {
  const { removeMessage } = useWallMessages();
  const [state, formAction, pending] = useActionState(deleteMessage, initialState);

  useEffect(() => {
    if (state?.success) {
      removeMessage(messageId);
    }
  }, [state?.success, messageId, removeMessage]);

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      <input type="hidden" name="id" value={messageId} />
      <button
        type="submit"
        disabled={pending}
        className="skew-x-[-2deg] rounded-sm border-2 border-red-800/50 bg-red-100/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-950 shadow-[2px_2px_0_rgba(127,29,29,0.2)] transition-[transform,opacity] hover:bg-red-200/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:opacity-50 active:translate-x-px active:translate-y-px"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state?.error ? (
        <p className="max-w-full text-right text-xs font-medium text-red-950" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
