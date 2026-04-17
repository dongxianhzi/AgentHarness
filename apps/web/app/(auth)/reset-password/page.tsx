"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResetPasswordPage } from "@multica/views/auth";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  return <ResetPasswordPage token={token} onSuccess={() => router.push("/login-password")} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
