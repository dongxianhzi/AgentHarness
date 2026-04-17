"use client";

import { Suspense } from "react";
import { ForgotPasswordPage } from "@multica/views/auth";

function ForgotPasswordPageContent() {
  return <ForgotPasswordPage />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPageContent />
    </Suspense>
  );
}
