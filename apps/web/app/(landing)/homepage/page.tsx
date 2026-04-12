import type { Metadata } from "next";
import { HarnessLanding } from "@/features/landing/components/harness-landing";
import { buildLandingMetadata } from "../metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata("homepage");
}

export default function HomepagePage() {
  return <HarnessLanding />;
}
