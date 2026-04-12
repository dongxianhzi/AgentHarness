"use client";

import { DashboardLayout } from "@multica/views/layout";
import { SearchCommand, SearchTrigger } from "@multica/views/search";
import { ChatFab, ChatWindow } from "@multica/views/chat";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      loadingIndicator={
        <div
          aria-hidden="true"
          className="size-6 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
        />
      }
      searchSlot={<SearchTrigger />}
      extra={<><SearchCommand /><ChatWindow /><ChatFab /></>}
    >
      {children}
    </DashboardLayout>
  );
}
