import type { Metadata } from "next";
import { ChangelogPageClient } from "@/features/landing/components/changelog-page-client";
import { buildLandingMetadata } from "../metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata("changelog");
}

export default function ChangelogPage() {
  return <ChangelogPageClient />;
}
