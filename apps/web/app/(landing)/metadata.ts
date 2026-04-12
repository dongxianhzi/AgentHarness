import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import type { Locale } from "@/features/landing/i18n";

type LandingPageKey = "home" | "homepage" | "about" | "changelog";

type MetadataCopy = {
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  url: string;
};

const metadataCopy: Record<Locale, Record<LandingPageKey, MetadataCopy>> = {
  en: {
    home: {
      title: "Harness — Executive Control for Human + Agent Delivery",
      description:
        "Harness gives engineering, product, and operations teams a disciplined operating layer for planning work, routing execution, and governing agent-assisted delivery.",
      openGraphTitle: "Harness — Executive Control for Human + Agent Delivery",
      openGraphDescription:
        "A business-grade operating system for accountable delivery across people and agents.",
      url: "/",
    },
    homepage: {
      title: "Harness Homepage",
      description:
        "Harness gives engineering, product, and operations teams a disciplined operating layer for planning work, routing execution, and governing agent-assisted delivery.",
      openGraphTitle: "Harness — Executive Control for Human + Agent Delivery",
      openGraphDescription:
        "A business-grade operating system for accountable delivery across people and agents.",
      url: "/homepage",
    },
    about: {
      title: "About Harness",
      description:
        "Learn about Harness — the business operating layer for accountable work across human teams and AI agents.",
      openGraphTitle: "About Harness",
      openGraphDescription:
        "Why Harness is building a more accountable operating layer for AI-native delivery.",
      url: "/about",
    },
    changelog: {
      title: "Changelog | Harness",
      description:
        "See what's new in Harness — latest features, improvements, and fixes.",
      openGraphTitle: "Changelog | Harness",
      openGraphDescription: "Latest updates and releases from Harness.",
      url: "/changelog",
    },
  },
  zh: {
    home: {
      title: "Harness - 人机协同交付控制台",
      description:
        "Harness 为工程、产品与运营团队提供统一运营层，用于规划工作、路由执行，并治理 AI Agent 参与的交付流程。",
      openGraphTitle: "Harness - 人机协同交付控制台",
      openGraphDescription: "一个面向人类与 Agent 可追责协作的业务级交付系统。",
      url: "/",
    },
    homepage: {
      title: "Harness 首页",
      description:
        "Harness 为工程、产品与运营团队提供统一运营层，用于规划工作、路由执行，并治理 AI Agent 参与的交付流程。",
      openGraphTitle: "Harness - 人机协同交付控制台",
      openGraphDescription: "一个面向人类与 Agent 可追责协作的业务级交付系统。",
      url: "/homepage",
    },
    about: {
      title: "关于 Harness",
      description:
        "了解 Harness 如何为人类团队与 AI Agent 构建可追责、可治理的交付运营层。",
      openGraphTitle: "关于 Harness",
      openGraphDescription: "为什么 Harness 要构建一套面向 AI 原生交付的可追责运营层。",
      url: "/about",
    },
    changelog: {
      title: "更新日志 | Harness",
      description: "查看 Harness 的最新功能、改进与修复。",
      openGraphTitle: "更新日志 | Harness",
      openGraphDescription: "Harness 的最新产品发布与更新。",
      url: "/changelog",
    },
  },
};

export async function getLandingLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const stored = cookieStore.get("harness-locale")?.value;
  if (stored === "en" || stored === "zh") {
    return stored;
  }

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") ?? "";
  if (acceptLang.includes("zh")) {
    return "zh";
  }

  return "en";
}

export async function buildLandingMetadata(
  page: LandingPageKey,
): Promise<Metadata> {
  const locale = await getLandingLocale();
  const copy = metadataCopy[locale][page];

  return {
    title: copy.title,
    description: copy.description,
    openGraph: {
      title: copy.openGraphTitle,
      description: copy.openGraphDescription,
      url: copy.url,
    },
    alternates: {
      canonical: copy.url,
    },
  };
}

export function buildLandingJsonLd(locale: Locale) {
  const description =
    locale === "zh"
      ? "用于规划工作、路由执行，并治理人类团队与 AI Agent 协同交付的业务级运营系统。"
      : "Business-grade operating system for planning work, routing execution, and governing delivery across human teams and AI agents.";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Harness",
        url: "https://openagent.run",
        sameAs: ["https://github.com/EeroEternal/AgentHarness"],
      },
      {
        "@type": "SoftwareApplication",
        name: "Harness",
        applicationCategory: "ProjectManagement",
        operatingSystem: "Web",
        description,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };
}