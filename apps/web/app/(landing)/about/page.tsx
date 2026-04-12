import type { Metadata } from "next";
import { AboutPageClient } from "@/features/landing/components/about-page-client";
import { buildLandingMetadata } from "../metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildLandingMetadata("about");
}

export default function AboutPage() {
  return <AboutPageClient />;
}
