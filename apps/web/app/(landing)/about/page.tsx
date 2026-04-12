import type { Metadata } from "next";
import { AboutPageClient } from "@/features/landing/components/about-page-client";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Harness — the business operating layer for accountable work across human teams and AI agents.",
  openGraph: {
    title: "About Harness",
    description:
      "Why Harness is building a more accountable operating layer for AI-native delivery.",
    url: "/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
