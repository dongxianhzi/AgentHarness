"use client";

import { Send } from "lucide-react";
import { useChatStore } from "@multica/core/chat";
import { useTranslation } from "@multica/core";

export function ChatFab() {
  const { t } = useTranslation();
  const isOpen = useChatStore((s) => s.isOpen);
  const toggle = useChatStore((s) => s.toggle);

  if (isOpen) return null;

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Send className="size-3.5" />
      {t("chat.askHarness", "Ask Harness")}
    </button>
  );
}
