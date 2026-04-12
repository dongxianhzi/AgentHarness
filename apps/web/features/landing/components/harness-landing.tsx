"use client";

import Link from "next/link";
import { useAuthStore } from "@multica/core/auth";
import { cn } from "@multica/ui/lib/utils";
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  Landmark,
  Scale,
  ShieldCheck,
  Sparkles,
  Waypoints,
  Workflow,
} from "lucide-react";
import { localeLabels, locales, useLocale } from "../i18n";
import type { Locale } from "../i18n";
import { GitHubMark, githubUrl } from "./shared";

type LandingCopy = {
  nav: {
    story: string;
    model: string;
    governance: string;
    readiness: string;
    github: string;
    login: string;
    dashboard: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    note: string;
    scorecards: { label: string; value: string }[];
    briefLabel: string;
    briefTitle: string;
    briefSummary: string;
    briefMetrics: { label: string; value: string; tone: string }[];
    briefRows: { initiative: string; owner: string; checkpoint: string }[];
    advisory: string;
  };
  proof: {
    title: string;
    items: string[];
  };
  audiences: {
    eyebrow: string;
    title: string;
    description: string;
    items: {
      title: string;
      description: string;
      points: string[];
    }[];
  };
  stack: {
    eyebrow: string;
    title: string;
    description: string;
    rows: {
      label: string;
      summary: string;
      outcome: string;
    }[];
  };
  rhythm: {
    eyebrow: string;
    title: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
  governance: {
    eyebrow: string;
    title: string;
    description: string;
    checks: string[];
    panelTitle: string;
    panelItems: { label: string; value: string }[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
};

const copy: Record<Locale, LandingCopy> = {
  en: {
    nav: {
      story: "Story",
      model: "Control Model",
      governance: "Governance",
      readiness: "Readiness",
      github: "GitHub",
      login: "Log in",
      dashboard: "Open workspace",
    },
    hero: {
      eyebrow: "Executive operating system for AI delivery",
      title:
        "Harness gives human and agent work the controls of a real business process.",
      description:
        "For teams that are past experimentation, Harness creates a disciplined operating layer for intake, execution routing, review, and runtime oversight. Engineering, product, and operations stay aligned around the same system of record.",
      primaryCta: "Request access",
      secondaryCta: "View GitHub",
      note:
        "Built for organizations that need visibility, escalation paths, and accountable delivery across both people and agent runtimes.",
      scorecards: [
        { label: "Programs under orchestration", value: "184" },
        { label: "Agent-managed work lanes", value: "37" },
        { label: "Reviewed before merge", value: "96%" },
        { label: "Exec reporting lag", value: "< 5 min" },
      ],
      briefLabel: "Quarterly operating brief",
      briefTitle: "A boardroom view of delivery, not a playground for prompts",
      briefSummary:
        "Measure throughput, inspect exceptions, and see who is accountable before work turns into production change.",
      briefMetrics: [
        { label: "Queues on track", value: "22", tone: "text-emerald-300" },
        { label: "Escalations", value: "04", tone: "text-amber-200" },
        { label: "Policy exceptions", value: "1.8%", tone: "text-sky-200" },
      ],
      briefRows: [
        {
          initiative: "Revenue workflow redesign",
          owner: "Platform council",
          checkpoint: "Review window open",
        },
        {
          initiative: "Release readiness program",
          owner: "Delivery operations",
          checkpoint: "Needs escalation",
        },
        {
          initiative: "Support backlog recovery",
          owner: "Agent triage cell",
          checkpoint: "Within SLA",
        },
      ],
      advisory:
        "Every item is linked to an owner, a policy path, and a runtime footprint.",
    },
    proof: {
      title: "Built for the functions that must turn AI activity into governed output",
      items: [
        "Engineering leadership",
        "Product operations",
        "Platform teams",
        "Security and compliance",
        "Transformation offices",
      ],
    },
    audiences: {
      eyebrow: "Who It Serves",
      title: "A commercial homepage for teams buying execution certainty, not AI novelty",
      description:
        "Harness is framed around operating confidence: cleaner accountability, tighter process design, and fewer hidden delivery risks as agents become part of the workforce.",
      items: [
        {
          title: "Leaders",
          description:
            "See where work is flowing, what is blocked, and when intervention is required without opening individual prompts or sessions.",
          points: ["Portfolio-level visibility", "Executive-ready reporting"],
        },
        {
          title: "Operators",
          description:
            "Route work between humans and agents, keep queues healthy, and maintain a visible escalation path when execution drifts.",
          points: ["Queue discipline", "Escalation by policy"],
        },
        {
          title: "Control owners",
          description:
            "Apply workspace boundaries, runtime oversight, and approval rules before high-risk work crosses into production systems.",
          points: ["Runtime guardrails", "Reviewable change trail"],
        },
      ],
    },
    stack: {
      eyebrow: "Control Model",
      title: "One operating stack for intake, routing, execution, and review",
      description:
        "Harness replaces scattered task boards, prompt threads, and invisible agent sessions with one controlled flow from business request to governed outcome.",
      rows: [
        {
          label: "Request intake",
          summary:
            "Capture work with owner, due date, operating context, and approval expectations from the start.",
          outcome: "Fewer ambiguous asks",
        },
        {
          label: "Execution routing",
          summary:
            "Decide whether work moves to a teammate, a local daemon, or a managed runtime using the same queue discipline.",
          outcome: "Clear ownership every time",
        },
        {
          label: "Runtime oversight",
          summary:
            "Monitor health, throughput, and exception rates across local and cloud execution without switching tools.",
          outcome: "Visible operational risk",
        },
        {
          label: "Decision trail",
          summary:
            "Keep status changes, comments, skills, and review checkpoints attached to the same record of work.",
          outcome: "Auditable delivery history",
        },
      ],
    },
    rhythm: {
      eyebrow: "Operating Rhythm",
      title: "Plan, route, supervise, improve",
      steps: [
        {
          title: "Frame the request",
          description:
            "Start with business intent, constraints, and ownership so execution begins inside a defined operating context.",
        },
        {
          title: "Route execution",
          description:
            "Move work to the best-fit human or agent path while preserving the same queue, SLA, and reporting model.",
        },
        {
          title: "Supervise exceptions",
          description:
            "Catch blocked work, policy breaks, and risky changes early through explicit checkpoints and runtime signals.",
        },
        {
          title: "Compound operating knowledge",
          description:
            "Turn what worked into reusable skills and repeatable control patterns that improve every future delivery cycle.",
        },
      ],
    },
    governance: {
      eyebrow: "Governance",
      title: "The control surfaces serious teams expect before they scale agent execution",
      description:
        "Harness gives teams bounded autonomy instead of invisible automation. The result is faster flow with clearer intervention points, cleaner review, and a stronger evidence trail.",
      checks: [
        "Human checkpoints for high-risk or external-facing work",
        "Workspace-scoped execution and access boundaries",
        "Live visibility into runtimes, queues, and exception states",
        "Reusable skills with versioned context and operating intent",
      ],
      panelTitle: "Readiness snapshot",
      panelItems: [
        { label: "Policy coverage", value: "94%" },
        { label: "Runtime visibility", value: "Full" },
        { label: "Escalation design", value: "Defined" },
        { label: "Executive reporting", value: "Live" },
      ],
    },
    finalCta: {
      title: "Move AI execution into the same management system as the rest of the business.",
      description:
        "Harness is for teams that need operating discipline around agent-assisted delivery: clearer ownership, stronger governance, and a better path from request to shipped outcome.",
      primaryCta: "Open Harness",
      secondaryCta: "Review architecture",
    },
    footer: {
      tagline: "Harness is the operating layer for accountable human and agent delivery.",
      copyright: "© {year} Harness. All rights reserved.",
    },
  },
  zh: {
    nav: {
      story: "叙事",
      model: "控制模型",
      governance: "治理",
      readiness: "就绪度",
      github: "GitHub",
      login: "登录",
      dashboard: "进入工作台",
    },
    hero: {
      eyebrow: "面向 AI 交付的经营级操作系统",
      title: "Harness 让人和 Agent 的执行过程，拥有真正业务系统应有的控制能力。",
      description:
        "当团队已经走过试验期，真正需要的不是更多 prompt，而是清晰的请求入口、执行路由、审批机制和运行治理。Harness 为工程、产品和运营提供统一的交付记录系统。",
      primaryCta: "申请试用",
      secondaryCta: "查看 GitHub",
      note:
        "适合那些需要可见性、升级路径与可追责交付机制的组织，让人和 Agent 在同一个经营体系里协同工作。",
      scorecards: [
        { label: "纳入编排的项目", value: "184" },
        { label: "Agent 执行泳道", value: "37" },
        { label: "合并前已审查", value: "96%" },
        { label: "管理报表延迟", value: "< 5 分钟" },
      ],
      briefLabel: "季度经营简报",
      briefTitle: "这是交付经营视图，不是 prompt 演示台",
      briefSummary:
        "统一衡量吞吐、异常与责任归属，在工作进入生产变更之前就看清执行状态。",
      briefMetrics: [
        { label: "按计划推进队列", value: "22", tone: "text-emerald-300" },
        { label: "升级事件", value: "04", tone: "text-amber-200" },
        { label: "策略例外", value: "1.8%", tone: "text-sky-200" },
      ],
      briefRows: [
        {
          initiative: "收入流程重构",
          owner: "平台治理委员会",
          checkpoint: "评审窗口开启",
        },
        {
          initiative: "版本发布准备",
          owner: "交付运营",
          checkpoint: "需要升级处理",
        },
        {
          initiative: "客服积压恢复",
          owner: "Agent 分诊单元",
          checkpoint: "处于 SLA 内",
        },
      ],
      advisory: "每个项目都绑定责任人、策略路径与运行时足迹。",
    },
    proof: {
      title: "为必须把 AI 活动转化为可治理产出的团队而设计",
      items: ["工程管理层", "产品运营", "平台团队", "安全与合规", "变革办公室"],
    },
    audiences: {
      eyebrow: "服务对象",
      title: "这不是科技玩具首页，而是面向交付确定性的商务叙事",
      description:
        "Harness 把重点放在经营可信度上：更清晰的责任、更稳的流程设计，以及当 Agent 成为劳动力一部分后更少的隐性风险。",
      items: [
        {
          title: "管理者",
          description:
            "无需打开单条 prompt 或会话，也能看清工作流向、阻塞位置以及何时需要介入。",
          points: ["组合层视角", "可汇报的经营信息"],
        },
        {
          title: "运营者",
          description:
            "在人工与 Agent 之间路由任务，维持队列健康，并在执行偏离时走明确的升级路径。",
          points: ["队列纪律", "按策略升级"],
        },
        {
          title: "控制负责人",
          description:
            "在高风险工作进入生产系统前，应用工作区边界、运行治理与审批规则。",
          points: ["运行时护栏", "可审查的变更链路"],
        },
      ],
    },
    stack: {
      eyebrow: "控制模型",
      title: "用一套运行栈管理请求、路由、执行与复核",
      description:
        "Harness 用一条可控链路替代分散的任务板、prompt 对话和不可见的 Agent 会话，让业务请求最终落到受治理的结果上。",
      rows: [
        {
          label: "请求入口",
          summary:
            "从一开始就定义 owner、时限、上下文和审批要求，避免需求模糊进入执行阶段。",
          outcome: "减少含糊任务",
        },
        {
          label: "执行路由",
          summary:
            "在统一队列纪律下，把工作交给同事、本地 daemon 或托管运行时。",
          outcome: "责任归属清晰",
        },
        {
          label: "运行治理",
          summary:
            "统一查看本地与云端执行的健康度、吞吐和异常，而不是在多个工具间切换。",
          outcome: "风险可视化",
        },
        {
          label: "决策轨迹",
          summary:
            "状态变化、评论、技能与审批节点都挂在同一条工作记录上。",
          outcome: "交付链路可审计",
        },
      ],
    },
    rhythm: {
      eyebrow: "运行节奏",
      title: "规划、路由、监督、沉淀",
      steps: [
        {
          title: "定义请求",
          description:
            "先明确业务目标、约束和责任归属，再让执行进入有边界的上下文。",
        },
        {
          title: "路由执行",
          description:
            "在同一套队列、SLA 和汇报机制下，把工作分配给最合适的人或 Agent。",
        },
        {
          title: "监督例外",
          description:
            "通过显式检查点和运行信号，尽早识别阻塞、策略突破口和高风险变更。",
        },
        {
          title: "沉淀能力",
          description:
            "把成功经验转化为可复用技能和控制模式，持续提升后续交付效率。",
        },
      ],
    },
    governance: {
      eyebrow: "治理能力",
      title: "在大规模引入 Agent 执行之前，严肃团队真正关心的控制面",
      description:
        "Harness 提供的是有边界的自治，而不是不可见的自动化。团队既能加快流转，也能保留清晰的干预点、复核机制和证据链。",
      checks: [
        "高风险或对外工作的人类检查点",
        "基于工作区的执行与访问边界",
        "运行时、队列和异常状态的实时可见性",
        "带版本上下文和经营意图的技能体系",
      ],
      panelTitle: "就绪度快照",
      panelItems: [
        { label: "策略覆盖", value: "94%" },
        { label: "运行可见性", value: "完整" },
        { label: "升级机制", value: "已定义" },
        { label: "管理报表", value: "实时" },
      ],
    },
    finalCta: {
      title: "把 AI 执行纳入和其他业务流程同级的管理体系。",
      description:
        "Harness 面向需要 Agent 辅助交付治理能力的团队：更清晰的责任、更强的管控，以及从需求到上线更稳的路径。",
      primaryCta: "进入 Harness",
      secondaryCta: "查看架构",
    },
    footer: {
      tagline: "Harness 是面向可追责人机协同交付的运营层。",
      copyright: "© {year} Harness. 保留所有权利。",
    },
  },
};

const audienceIcons = [Landmark, BriefcaseBusiness, ShieldCheck] as const;
const rhythmIcons = [Workflow, Waypoints, BarChart3, Scale] as const;

export function HarnessLanding() {
  const { locale, setLocale } = useLocale();
  const user = useAuthStore((state) => state.user);
  const t = copy[locale];
  const serifClass =
    locale === "zh"
      ? "font-[family:var(--font-serif-zh)]"
      : "font-[family:var(--font-serif)]";

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f4efe6] text-[#122033]">
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#f4efe6_0%,#f7f2e9_42%,#f1ebdf_100%)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_15%_20%,rgba(181,145,80,0.18),transparent_28%),radial-gradient(circle_at_88%_10%,rgba(18,32,51,0.12),transparent_34%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(18,32,51,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(18,32,51,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.18),transparent_72%)]" />

      <header className="sticky top-0 z-40 border-b border-[#122033]/8 bg-[#f4efe6]/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full border border-[#122033]/12 bg-white/80 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8c6730]">
              H
            </span>
            <div>
              <div className="text-[0.68rem] font-medium uppercase tracking-[0.24em] text-[#8c6730]">
                Agent Delivery OS
              </div>
              <div className="text-[1.02rem] font-semibold tracking-[0.08em] text-[#122033]">
                Harness
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link href="#story" className="text-sm text-[#122033]/68 transition-colors hover:text-[#122033]">
              {t.nav.story}
            </Link>
            <Link href="#control-model" className="text-sm text-[#122033]/68 transition-colors hover:text-[#122033]">
              {t.nav.model}
            </Link>
            <Link href="#governance" className="text-sm text-[#122033]/68 transition-colors hover:text-[#122033]">
              {t.nav.governance}
            </Link>
            <Link href="#readiness" className="text-sm text-[#122033]/68 transition-colors hover:text-[#122033]">
              {t.nav.readiness}
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center overflow-hidden rounded-full border border-[#122033]/10 bg-white/72 p-1 sm:flex">
              {locales.map((item) => (
                <button
                  key={item}
                  onClick={() => setLocale(item)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    item === locale
                      ? "bg-[#122033] text-white"
                      : "text-[#122033]/56 hover:text-[#122033]",
                  )}
                >
                  {localeLabels[item]}
                </button>
              ))}
            </div>
            <Link
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-[#122033]/10 bg-white/72 px-4 py-2 text-sm font-medium text-[#122033] transition-colors hover:bg-white md:inline-flex"
            >
              <GitHubMark className="size-4" />
              {t.nav.github}
            </Link>
            <Link
              href={user ? "/issues" : "/login"}
              className="inline-flex items-center gap-2 rounded-full bg-[#122033] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a2c46]"
            >
              {user ? t.nav.dashboard : t.nav.login}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1360px] px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pb-12 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-start">
            <div className="max-w-[780px]">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#8c6730]/15 bg-white/72 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
                <Sparkles className="size-3.5" />
                {t.hero.eyebrow}
              </div>
              <h1 className={cn("mt-6 max-w-[12ch] text-[clamp(3.4rem,7vw,7rem)] leading-[0.92] tracking-[-0.06em] text-[#122033]", serifClass)}>
                {t.hero.title}
              </h1>
              <p className="mt-6 max-w-[63ch] text-[1.05rem] leading-8 text-[#122033]/72 sm:text-[1.12rem]">
                {t.hero.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={user ? "/issues" : "/login"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8c6730] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#775726]"
                >
                  {user ? t.finalCta.primaryCta : t.hero.primaryCta}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/12 bg-white/76 px-6 py-3 text-sm font-semibold text-[#122033] transition-colors hover:bg-white"
                >
                  <GitHubMark className="size-4" />
                  {t.hero.secondaryCta}
                </Link>
              </div>

              <p className="mt-5 max-w-[58ch] text-sm leading-7 text-[#122033]/56">
                {t.hero.note}
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-[#122033]/10 bg-[#0f1a2c] p-6 text-white shadow-[0_50px_120px_-70px_rgba(7,12,20,0.78)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {t.hero.briefLabel}
                  </div>
                  <h2 className={cn("mt-3 max-w-[16ch] text-[2rem] leading-tight tracking-[-0.04em] text-white", serifClass)}>
                    {t.hero.briefTitle}
                  </h2>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/68">
                  Q2
                </div>
              </div>

              <p className="mt-5 max-w-[44ch] text-sm leading-7 text-white/64 sm:text-[0.96rem]">
                {t.hero.briefSummary}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {t.hero.briefMetrics.map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/8 bg-white/6 p-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-white/44">
                      {item.label}
                    </div>
                    <div className={cn("mt-2 text-2xl font-semibold tracking-[-0.04em]", item.tone)}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 overflow-hidden rounded-[24px] border border-white/8 bg-[#111e31]">
                <div className="grid grid-cols-[1.35fr_1fr_0.95fr] border-b border-white/8 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
                  <span>Initiative</span>
                  <span>Owner</span>
                  <span>Checkpoint</span>
                </div>
                {t.hero.briefRows.map((row, index) => (
                  <div
                    key={row.initiative}
                    className={cn(
                      "grid grid-cols-[1.35fr_1fr_0.95fr] items-center px-5 py-4 text-sm",
                      index < t.hero.briefRows.length - 1 && "border-b border-white/6",
                    )}
                  >
                    <span className="font-medium text-white">{row.initiative}</span>
                    <span className="text-white/62">{row.owner}</span>
                    <span className="text-white/78">{row.checkpoint}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[20px] border border-white/8 bg-white/6 px-4 py-3 text-sm text-white/68">
                {t.hero.advisory}
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {t.hero.scorecards.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-[#122033]/10 bg-white/78 px-5 py-5 shadow-[0_24px_90px_-65px_rgba(18,32,51,0.58)]"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#122033]/44">
                  {item.label}
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#122033]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="story" className="border-y border-[#122033]/8 bg-white/58">
          <div className="mx-auto flex max-w-[1360px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
              {t.proof.title}
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium text-[#122033]/58">
              {t.proof.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-4 py-18 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div className="max-w-[35rem]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
                {t.audiences.eyebrow}
              </div>
              <h2 className={cn("mt-4 text-[clamp(2.5rem,4.4vw,4.2rem)] leading-[1.02] tracking-[-0.05em] text-[#122033]", serifClass)}>
                {t.audiences.title}
              </h2>
              <p className="mt-5 text-[1rem] leading-8 text-[#122033]/64">
                {t.audiences.description}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {t.audiences.items.map((item, index) => {
                const Icon = audienceIcons[index] ?? ShieldCheck;

                return (
                  <article
                    key={item.title}
                    className="flex h-full flex-col rounded-[28px] border border-[#122033]/10 bg-white/82 p-6 shadow-[0_26px_90px_-68px_rgba(18,32,51,0.6)]"
                  >
                    <div className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#122033] text-white">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-[#122033]">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[#122033]/62">
                      {item.description}
                    </p>
                    <div className="mt-5 space-y-2 border-t border-[#122033]/8 pt-5">
                      {item.points.map((point) => (
                        <div key={point} className="text-sm font-medium text-[#122033]/72">
                          {point}
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="control-model" className="mx-auto max-w-[1360px] px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
          <div className="overflow-hidden rounded-[34px] border border-[#122033]/10 bg-[#fcfaf6] shadow-[0_40px_120px_-84px_rgba(18,32,51,0.55)]">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="border-b border-[#122033]/8 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
                  {t.stack.eyebrow}
                </div>
                <h2 className={cn("mt-4 max-w-[14ch] text-[clamp(2.4rem,4.3vw,4rem)] leading-[1.02] tracking-[-0.05em] text-[#122033]", serifClass)}>
                  {t.stack.title}
                </h2>
                <p className="mt-5 max-w-[52ch] text-[1rem] leading-8 text-[#122033]/64">
                  {t.stack.description}
                </p>
              </div>

              <div className="divide-y divide-[#122033]/8">
                {t.stack.rows.map((row) => (
                  <div key={row.label} className="grid gap-5 px-8 py-7 sm:grid-cols-[180px_minmax(0,1fr)_160px] sm:px-10 lg:px-12">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8c6730]">
                      {row.label}
                    </div>
                    <div className="text-sm leading-7 text-[#122033]/68">{row.summary}</div>
                    <div className="text-sm font-medium text-[#122033]">{row.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1360px] px-4 pb-18 sm:px-6 lg:px-8 lg:pb-24">
          <div className="rounded-[34px] border border-[#122033]/10 bg-[#122033] p-8 text-white sm:p-10 lg:p-12">
            <div className="max-w-[44rem]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d5b27a]">
                {t.rhythm.eyebrow}
              </div>
              <h2 className={cn("mt-4 text-[clamp(2.4rem,4.2vw,4rem)] leading-[1.02] tracking-[-0.05em] text-white", serifClass)}>
                {t.rhythm.title}
              </h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {t.rhythm.steps.map((step, index) => {
                const Icon = rhythmIcons[index] ?? Workflow;

                return (
                  <article key={step.title} className="rounded-[24px] border border-white/10 bg-white/6 p-6">
                    <div className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-white/8 text-[#d5b27a]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/66">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="governance" className="mx-auto grid max-w-[1360px] gap-8 px-4 pb-18 sm:px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-8 lg:pb-24">
          <div className="rounded-[34px] border border-[#122033]/10 bg-white/82 p-8 shadow-[0_34px_110px_-80px_rgba(18,32,51,0.56)] sm:p-10 lg:p-12">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
              {t.governance.eyebrow}
            </div>
            <h2 className={cn("mt-4 max-w-[18ch] text-[clamp(2.4rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.05em] text-[#122033]", serifClass)}>
              {t.governance.title}
            </h2>
            <p className="mt-5 max-w-[60ch] text-[1rem] leading-8 text-[#122033]/66">
              {t.governance.description}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {t.governance.checks.map((item) => (
                <div key={item} className="flex gap-3 rounded-[22px] border border-[#122033]/8 bg-[#fcfaf6] px-4 py-4">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#8c6730]" />
                  <span className="text-sm leading-7 text-[#122033]/78">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside id="readiness" className="rounded-[34px] border border-[#122033]/10 bg-[#0f1a2c] p-8 text-white shadow-[0_40px_120px_-80px_rgba(8,12,20,0.7)] sm:p-10">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d5b27a]">
              {t.governance.panelTitle}
            </div>
            <div className="mt-6 space-y-4">
              {t.governance.panelItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[20px] border border-white/8 bg-white/6 px-4 py-4">
                  <span className="text-sm text-white/58">{item.label}</span>
                  <span className="text-lg font-semibold tracking-[-0.03em] text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-[1360px] px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="rounded-[34px] border border-[#8c6730]/14 bg-[linear-gradient(135deg,#eadcc0_0%,#f6f0e5_52%,#fcfaf6_100%)] p-8 sm:p-10 lg:flex lg:items-end lg:justify-between lg:p-12">
            <div className="max-w-[54rem]">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8c6730]">
                Harness
              </div>
              <h2 className={cn("mt-4 text-[clamp(2.3rem,4vw,3.9rem)] leading-[1.02] tracking-[-0.05em] text-[#122033]", serifClass)}>
                {t.finalCta.title}
              </h2>
              <p className="mt-5 text-[1rem] leading-8 text-[#122033]/66">
                {t.finalCta.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-0">
              <Link
                href={user ? "/issues" : "/login"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#122033] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1a2c46]"
              >
                {user ? t.nav.dashboard : t.finalCta.primaryCta}
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#122033]/12 bg-white/74 px-6 py-3 text-sm font-semibold text-[#122033] transition-colors hover:bg-white"
              >
                {t.finalCta.secondaryCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#122033]/8 bg-white/62">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="text-[1.05rem] font-semibold tracking-[0.08em] text-[#122033]">
              Harness
            </div>
            <p className="mt-2 text-sm leading-7 text-[#122033]/58">
              {t.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2 rounded-full border border-[#122033]/10 bg-[#fcfaf6] p-1 sm:hidden">
              {locales.map((item) => (
                <button
                  key={item}
                  onClick={() => setLocale(item)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    item === locale
                      ? "bg-[#122033] text-white"
                      : "text-[#122033]/56 hover:text-[#122033]",
                  )}
                >
                  {localeLabels[item]}
                </button>
              ))}
            </div>
            <Link
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#122033] transition-colors hover:text-[#8c6730]"
            >
              <GitHubMark className="size-4" />
              {t.nav.github}
            </Link>
            <p className="text-sm text-[#122033]/45">
              {t.footer.copyright.replace("{year}", String(new Date().getFullYear()))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}