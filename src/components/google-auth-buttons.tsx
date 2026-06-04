"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const chromeBtn =
  "inline-flex w-fit skew-x-[-2deg] items-center justify-center border-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_rgba(28,25,23,0.25)] transition-[transform,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setPending(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={pending}
      className={`${chromeBtn} border-red-900/40 bg-red-600 text-white hover:bg-red-700 active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_rgba(127,29,29,0.35)] focus-visible:outline-red-900`}
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}

export function SignInWithGoogleButton() {
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setPending(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
    setPending(false);
    if (error) {
      console.error(error.message);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void signInWithGoogle()}
      disabled={pending}
      className={`${chromeBtn} border-emerald-900/35 bg-emerald-600 text-white hover:bg-emerald-700 active:translate-x-px active:translate-y-px active:shadow-[2px_2px_0_rgba(6,78,59,0.35)] focus-visible:outline-emerald-900`}
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}
