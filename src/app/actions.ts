"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type PostMessageState = {
  error?: string;
  success?: boolean;
};

export async function postMessage(
  _prevState: PostMessageState,
  formData: FormData,
): Promise<PostMessageState> {
  const raw = String(formData.get("body") ?? "");
  const body = raw.trim();
  if (!body) {
    return { error: "Message cannot be empty." };
  }
  if (body.length > 500) {
    return { error: "Message is too long (max 500 characters)." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in to post." };
  }

  const { error } = await supabase.from("messages").insert({
    body,
    user_id: user.id,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
