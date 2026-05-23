"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { WallMessage } from "@/lib/wall-message";

type WallMessagesContextValue = {
  messages: WallMessage[];
  appendMessage: (message: WallMessage) => void;
};

const WallMessagesContext = createContext<WallMessagesContextValue | null>(null);

type WallMessagesProviderProps = {
  initialMessages: WallMessage[];
  children: ReactNode;
};

export function WallMessagesProvider({
  initialMessages,
  children,
}: WallMessagesProviderProps) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const appendMessage = useCallback((message: WallMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  const value = useMemo(
    () => ({ messages, appendMessage }),
    [messages, appendMessage],
  );

  return (
    <WallMessagesContext.Provider value={value}>{children}</WallMessagesContext.Provider>
  );
}

export function useWallMessages() {
  const ctx = useContext(WallMessagesContext);
  if (!ctx) {
    throw new Error("useWallMessages must be used within WallMessagesProvider");
  }
  return ctx;
}
