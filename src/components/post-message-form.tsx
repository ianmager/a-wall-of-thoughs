"use client";

import { useActionState, useEffect, useRef } from "react";

import { postMessage, type PostMessageState } from "@/app/actions";

const initialState: PostMessageState = {};

export function PostMessageForm() {
  const [state, formAction, pending] = useActionState(postMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <label htmlFor="wall-body" className="sr-only">
        Message
      </label>
      <textarea
        id="wall-body"
        name="body"
        rows={3}
        maxLength={500}
        required
        disabled={pending}
        placeholder="Write something on the wall…"
        className="w-full resize-y rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 focus:border-foreground/40 focus:outline-none disabled:opacity-50"
      />
      <div className="flex items-center justify-between gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md border border-foreground/20 bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Posting…" : "Post"}
        </button>
      </div>
      {state?.error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
