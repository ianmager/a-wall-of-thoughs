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

import { TAG_COLOR_KEYS, type TagColorKey } from "@/lib/tag-style";
import type { WallMessage } from "@/lib/wall-message";

const DEFAULT_POS_X = 50;
const DEFAULT_POS_Y = 50;
const DEFAULT_ROTATE = 0;
const DEFAULT_COLOR: TagColorKey = TAG_COLOR_KEYS[0];
const DEFAULT_FONT_SIZE = 2;
const DEFAULT_MAX_WIDTH_REM = 14;

export type TagDraft = {
  body: string;
  posX: number;
  posY: number;
  rotateDeg: number;
  colorKey: TagColorKey;
  fontSize: number;
  maxWidthRem: number;
  hasPlaced: boolean;
};

const INITIAL_DRAFT: TagDraft = {
  body: "",
  posX: DEFAULT_POS_X,
  posY: DEFAULT_POS_Y,
  rotateDeg: DEFAULT_ROTATE,
  colorKey: DEFAULT_COLOR,
  fontSize: DEFAULT_FONT_SIZE,
  maxWidthRem: DEFAULT_MAX_WIDTH_REM,
  hasPlaced: false,
};

type WallMessagesContextValue = {
  messages: WallMessage[];
  appendMessage: (message: WallMessage) => void;
};

type TagDraftContextValue = {
  draft: TagDraft;
  setBody: (text: string) => void;
  setPlacement: (x: number, y: number) => void;
  setRotateDeg: (deg: number) => void;
  setColorKey: (key: TagColorKey) => void;
  setFontSize: (size: number) => void;
  setMaxWidthRem: (rem: number) => void;
  resetDraft: () => void;
};

const WallMessagesContext = createContext<WallMessagesContextValue | null>(null);
const TagDraftContext = createContext<TagDraftContextValue | null>(null);

type WallMessagesProviderProps = {
  initialMessages: WallMessage[];
  children: ReactNode;
};

export function WallMessagesProvider({
  initialMessages,
  children,
}: WallMessagesProviderProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState<TagDraft>(INITIAL_DRAFT);

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

  const setBody = useCallback((text: string) => {
    setDraft((prev) => ({ ...prev, body: text }));
  }, []);

  const setPlacement = useCallback((x: number, y: number) => {
    setDraft((prev) => ({ ...prev, posX: x, posY: y, hasPlaced: true }));
  }, []);

  const setRotateDeg = useCallback((deg: number) => {
    setDraft((prev) => ({ ...prev, rotateDeg: deg }));
  }, []);

  const setColorKey = useCallback((key: TagColorKey) => {
    setDraft((prev) => ({ ...prev, colorKey: key }));
  }, []);

  const setFontSize = useCallback((size: number) => {
    setDraft((prev) => ({ ...prev, fontSize: size }));
  }, []);

  const setMaxWidthRem = useCallback((rem: number) => {
    setDraft((prev) => ({ ...prev, maxWidthRem: rem }));
  }, []);

  const resetDraft = useCallback(() => {
    setDraft(INITIAL_DRAFT);
  }, []);

  const messagesValue = useMemo(
    () => ({ messages, appendMessage }),
    [messages, appendMessage],
  );

  const draftValue = useMemo(
    () => ({
      draft,
      setBody,
      setPlacement,
      setRotateDeg,
      setColorKey,
      setFontSize,
      setMaxWidthRem,
      resetDraft,
    }),
    [
      draft,
      setBody,
      setPlacement,
      setRotateDeg,
      setColorKey,
      setFontSize,
      setMaxWidthRem,
      resetDraft,
    ],
  );

  return (
    <WallMessagesContext.Provider value={messagesValue}>
      <TagDraftContext.Provider value={draftValue}>{children}</TagDraftContext.Provider>
    </WallMessagesContext.Provider>
  );
}

export function useWallMessages() {
  const ctx = useContext(WallMessagesContext);
  if (!ctx) {
    throw new Error("useWallMessages must be used within WallMessagesProvider");
  }
  return ctx;
}

export function useTagDraft() {
  const ctx = useContext(TagDraftContext);
  if (!ctx) {
    throw new Error("useTagDraft must be used within WallMessagesProvider");
  }
  return ctx;
}
