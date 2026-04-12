import type { Metadata } from "next";
import { HarnessLanding } from "@/features/landing/components/harness-landing";

export const metadata: Metadata = {
  title: {
    absolute: "Harness — Executive Control for Human + Agent Delivery",
  },
  description:
    "Harness gives engineering, product, and operations teams a disciplined operating layer for planning work, routing execution, and governing agent-assisted delivery.",
  openGraph: {
    title: "Harness — Executive Control for Human + Agent Delivery",
    description:
      "A business-grade operating system for accountable delivery across people and agents.",
    url: "/",
  },
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return <HarnessLanding />;
}
