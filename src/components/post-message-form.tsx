"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { postMessage, type PostMessageState } from "@/app/actions";

const MAX_LENGTH = 500;
const initialState: PostMessageState = {};

const fieldClass =
  "w-full resize-y rounded-sm border-2 border-stone-900/35 bg-stone-100/90 px-3 py-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-600/55 shadow-[inset_2px_2px_0_rgba(255,255,255,0.35)] focus-visible:border-stone-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:opacity-50";

const submitClass =
  "skew-x-[-2deg] rounded-sm border-2 border-stone-900/45 bg-stone-950 px-6 py-2.5 text-sm font-bold uppercase tracking-wider text-amber-50 shadow-[4px_4px_0_rgba(28,25,23,0.3)] transition-[transform,box-shadow] hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:opacity-50 active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_rgba(28,25,23,0.25)]";

export function PostMessageForm() {
  const [state, formAction, pending] = useActionState(postMessage, initialState);
  const [body, setBody] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      setBody("");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <label htmlFor="wall-body" className="sr-only">
        Message
      </label>
      <textarea
        id="wall-body"
        name="body"
        rows={3}
        maxLength={MAX_LENGTH}
        required
        disabled={pending}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something on the wall…"
        className={fieldClass}
      />
      <div className="flex items-center justify-between gap-2">
        <button type="submit" disabled={pending} className={submitClass}>
          {pending ? "Posting…" : "Post"}
        </button>
        <p
          className="text-xs font-semibold tabular-nums text-stone-800/70"
          aria-live="polite"
        >
          {body.length} / {MAX_LENGTH}
        </p>
      </div>
      {state?.error ? (
        <p
          className="rounded-sm border-2 border-red-800/35 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
