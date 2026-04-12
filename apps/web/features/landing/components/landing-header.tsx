"use client";

import Link from "next/link";
import { cn } from "@multica/ui/lib/utils";
import { useAuthStore } from "@multica/core/auth";
import { useLocale } from "../i18n";
import { GitHubMark, githubUrl, headerButtonClassName } from "./shared";

export function LandingHeader({
  variant = "dark",
}: {
  variant?: "dark" | "light";
}) {
  const { t } = useLocale();
  const user = useAuthStore((s) => s.user);

  return (
    <header
      className={cn(
        "inset-x-0 top-0 z-30",
        variant === "dark"
          ? "absolute bg-transparent"
          : "border-b border-[#0a0d12]/8 bg-white",
      )}
    >
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.18em]",
              variant === "dark"
                ? "border-white/18 bg-white/10 text-white"
                : "border-[#0a0d12]/10 bg-[#0a0d12]/4 text-[#0a0d12]",
            )}
          >
            H
          </span>
          <span
            className={cn(
              "text-[18px] font-semibold tracking-[0.08em] sm:text-[20px]",
              variant === "dark" ? "text-white/92" : "text-[#0a0d12]",
            )}
          >
            Harness
          </span>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noreferrer"
            className={headerButtonClassName("ghost", variant)}
          >
            <GitHubMark className="size-3.5" />
            {t.header.github}
          </Link>
          <Link
            href={user ? "/issues" : "/login"}
            className={headerButtonClassName("solid", variant)}
          >
            {user ? t.header.dashboard : t.header.login}
          </Link>
        </div>
      </div>
    </header>
  );
}
