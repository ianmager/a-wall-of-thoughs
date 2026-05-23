"use server";

import { revalidatePath } from "next/cache";

import { isAdminUser } from "@/lib/admin";
import type { WallMessage } from "@/lib/wall-message";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type PostMessageState = {
  error?: string;
  success?: boolean;
  message?: WallMessage;
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

  const { data, error } = await supabase
    .from("messages")
    .insert({
      body,
      user_id: user.id,
    })
    .select("id, body, created_at")
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, message: data as WallMessage };
}

export type DeleteMessageState = {
  error?: string;
  success?: boolean;
};

export async function deleteMessage(
  _prevState: DeleteMessageState,
  formData: FormData,
): Promise<DeleteMessageState> {
  const id = String(formData.get("id") ?? "").trim();
  if (!id || !UUID_RE.test(id)) {
    return { error: "Invalid message." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be signed in." };
  }
  if (!isAdminUser(user)) {
    return { error: "Not allowed." };
  }

  let adminClient;
  try {
    adminClient = createServiceRoleClient();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Configuration error.";
    return { error: msg };
  }

  const now = new Date().toISOString();
  const { data, error } = await adminClient
    .from("messages")
    .update({ deleted_at: now })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id");

  if (error) {
    return { error: error.message };
  }
  if (!data?.length) {
    return { error: "Message not found or already removed." };
  }

  revalidatePath("/");
  return { success: true };
}
