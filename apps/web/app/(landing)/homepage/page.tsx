import type { Metadata } from "next";
import { HarnessLanding } from "@/features/landing/components/harness-landing";

export const metadata: Metadata = {
  title: "Harness Homepage",
  description:
    "Harness gives engineering, product, and operations teams a disciplined operating layer for planning work, routing execution, and governing agent-assisted delivery.",
  openGraph: {
    title: "Harness — Executive Control for Human + Agent Delivery",
    description:
      "A business-grade operating system for accountable delivery across people and agents.",
    url: "/homepage",
  },
  alternates: {
    canonical: "/homepage",
  },
};

export default function HomepagePage() {
  return <HarnessLanding />;
}
