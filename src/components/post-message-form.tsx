"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { postMessage, type PostMessageState } from "@/app/actions";
import { TagStyleControls } from "@/components/tag-style-controls";
import { useTagDraft, useWallMessages } from "@/components/wall-messages-provider";

const MAX_LENGTH = 500;
const initialState: PostMessageState = {};

const fieldClass =
  "w-full resize-y rounded-sm border-2 border-stone-900/35 bg-stone-100/90 px-3 py-2.5 text-sm font-medium text-stone-900 placeholder:text-stone-600/55 shadow-[inset_2px_2px_0_rgba(255,255,255,0.35)] focus-visible:border-stone-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:opacity-50";

const actionChipClass =
  "skew-x-[-2deg] inline-flex items-center justify-center rounded-sm border-2 px-6 py-2.5 text-sm font-bold tracking-wider shadow-[4px_4px_0_rgba(28,25,23,0.3)]";

const submitClass = `${actionChipClass} border-stone-900/45 bg-stone-950 uppercase text-amber-50 transition-[transform,box-shadow] hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900 disabled:opacity-50 active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_rgba(28,25,23,0.25)]`;

const taggedClass = `${actionChipClass} border-emerald-800/45 bg-emerald-100/95 font-display lowercase text-emerald-950`;

export function PostMessageForm() {
  const { appendMessage } = useWallMessages();
  const {
    draft,
    setBody,
    setRotateDeg,
    setColorKey,
    setFontSize,
    setMaxWidthRem,
    resetDraft,
  } = useTagDraft();
  const [state, formAction, pending] = useActionState(postMessage, initialState);
  const [showTagged, setShowTagged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success && state.message) {
      formRef.current?.reset();
      setShowTagged(true);
      appendMessage(state.message);
      resetDraft();
    }
    if (state?.error) {
      setShowTagged(false);
    }
  }, [state, appendMessage, resetDraft]);

  const trimmedBody = draft.body.trim();
  const canSubmit = !pending && trimmedBody.length > 0 && draft.hasPlaced;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <label
            htmlFor="wall-body"
            className="text-xs font-semibold uppercase tracking-wider text-stone-700"
          >
            Your message
          </label>
          <span
            className="text-[11px] font-semibold tabular-nums text-stone-600"
            aria-live="polite"
          >
            {draft.body.length} / {MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="wall-body"
          name="body"
          rows={3}
          maxLength={MAX_LENGTH}
          required
          disabled={pending}
          value={draft.body}
          onChange={(e) => {
            setBody(e.target.value);
            setShowTagged(false);
          }}
          placeholder="Write something on the wall…"
          className={fieldClass}
        />
      </div>

      <TagStyleControls
        rotateDeg={draft.rotateDeg}
        colorKey={draft.colorKey}
        fontSize={draft.fontSize}
        maxWidthRem={draft.maxWidthRem}
        previewText={draft.body}
        disabled={pending}
        onRotateChange={(deg) => {
          setRotateDeg(deg);
          setShowTagged(false);
        }}
        onColorChange={(key) => {
          setColorKey(key);
          setShowTagged(false);
        }}
        onFontSizeChange={(size) => {
          setFontSize(size);
          setShowTagged(false);
        }}
        onMaxWidthChange={(rem) => {
          setMaxWidthRem(rem);
          setShowTagged(false);
        }}
      />

      <input type="hidden" name="pos_x" value={draft.posX} />
      <input type="hidden" name="pos_y" value={draft.posY} />
      <input type="hidden" name="rotate_deg" value={draft.rotateDeg} />
      <input type="hidden" name="color_key" value={draft.colorKey} />
      <input type="hidden" name="font_size" value={draft.fontSize} />
      <input type="hidden" name="max_width_rem" value={draft.maxWidthRem} />
      <input type="hidden" name="placement_set" value={draft.hasPlaced ? "1" : ""} />

      {state?.error ? (
        <p
          className="rounded-sm border-2 border-red-800/35 bg-red-100/90 px-3 py-2 text-sm font-medium text-red-950"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-dashed border-stone-900/20 pt-4">
        <p className="text-xs font-medium text-stone-600">
          Tap the wall again to move your tag.
        </p>
        <div className="flex items-center gap-2">
          {showTagged ? (
            <span className={taggedClass} role="status" aria-live="polite">
              Tagged!
            </span>
          ) : null}
          <button
            type="submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            className={submitClass}
          >
            {pending ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
