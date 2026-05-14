"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Props = {
  isSignedIn: boolean;
};

export function GoogleAuthButtons({ isSignedIn }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signInWithGoogle() {
    setPending(true);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    setPending(false);
    if (error) {
      console.error(error.message);
    }
  }

  async function signOut() {
    setPending(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setPending(false);
    router.refresh();
  }

  if (isSignedIn) {
    return (
      <button
        type="button"
        onClick={() => void signOut()}
        disabled={pending}
        className="inline-flex w-fit items-center justify-center rounded-md border border-foreground/20 bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 disabled:opacity-50"
      >
        {pending ? "Signing out…" : "Sign out"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void signInWithGoogle()}
      disabled={pending}
      className="inline-flex w-fit items-center justify-center rounded-md border border-foreground/20 bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90 disabled:opacity-50"
    >
      {pending ? "Redirecting…" : "Sign in with Google"}
    </button>
  );
}
