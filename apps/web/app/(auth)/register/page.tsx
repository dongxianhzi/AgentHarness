"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@multica/core/auth";
import { setLoggedInCookie } from "@/features/auth/auth-cookie";
import { RegisterPage } from "@multica/views/auth";

function RegisterPageContent() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const searchParams = useSearchParams();

  const nextUrl = searchParams.get("next") || "/issues";

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(nextUrl);
    }
  }, [isLoading, user, router, nextUrl]);

  const lastWorkspaceId =
    typeof window !== "undefined"
      ? localStorage.getItem("multica_workspace_id")
      : null;

  return (
    <RegisterPage
      onSuccess={() => router.push(nextUrl)}
      lastWorkspaceId={lastWorkspaceId}
      onTokenObtained={setLoggedInCookie}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
