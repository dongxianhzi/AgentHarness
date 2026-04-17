"use client";

import { Suspense, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@multica/core/auth";
import { ForceChangePasswordPage } from "@multica/views/auth";
import { api } from "@multica/core/api";

function ForceChangePasswordPageContent() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/issues");
  };

  return <ForceChangePasswordPage onSuccess={handleSuccess} />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForceChangePasswordPageContent />
    </Suspense>
  );
}
