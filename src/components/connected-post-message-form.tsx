"use client";

import { PostMessageForm } from "@/components/post-message-form";
import { useWallMessages } from "@/components/wall-messages-provider";

export function ConnectedPostMessageForm() {
  const { appendMessage } = useWallMessages();
  return <PostMessageForm onPostSuccess={appendMessage} />;
}
