"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@multica/core/auth";
import { setLoggedInCookie } from "@/features/auth/auth-cookie";
import { PasswordLoginPage } from "@multica/views/auth";

function PasswordLoginPageContent() {
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
    <PasswordLoginPage
      onSuccess={() => router.push(nextUrl)}
      onForceChangePassword={() => router.push("/change-password")}
      lastWorkspaceId={lastWorkspaceId}
      onTokenObtained={setLoggedInCookie}
    />
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PasswordLoginPageContent />
    </Suspense>
  );
}
