"use client";

import { useState } from "react";
import {
  Cloud,
  Monitor,
  FileText,
  BookOpenText,
  ListTodo,
  Trash2,
  AlertCircle,
  MoreHorizontal,
  Settings,
} from "lucide-react";
import type { Agent, RuntimeDevice } from "@multica/core/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@multica/ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@multica/ui/components/ui/dropdown-menu";
import { Button } from "@multica/ui/components/ui/button";
import { ActorAvatar } from "../../common/actor-avatar";
import { statusConfig } from "../config";
import { InstructionsTab } from "./tabs/instructions-tab";
import { SkillsTab } from "./tabs/skills-tab";
import { TasksTab } from "./tabs/tasks-tab";
import { SettingsTab } from "./tabs/settings-tab";
import { useTranslation } from "@multica/core";

function getRuntimeDevice(agent: Agent, runtimes: RuntimeDevice[]): RuntimeDevice | undefined {
  return runtimes.find((runtime) => runtime.id === agent.runtime_id);
}

type DetailTab = "instructions" | "skills" | "tasks" | "settings";

const detailTabs: { id: DetailTab; labelKey: string; defaultLabel: string; icon: typeof FileText }[] = [
  { id: "instructions", labelKey: "agents.instructions", defaultLabel: "Instructions", icon: FileText },
  { id: "skills", labelKey: "common.skills", defaultLabel: "Skills", icon: BookOpenText },
  { id: "tasks", labelKey: "common.tasks", defaultLabel: "Tasks", icon: ListTodo },
  { id: "settings", labelKey: "common.settings", defaultLabel: "Settings", icon: Settings },
];

export function AgentDetail({
  agent,
  runtimes,
  onUpdate,
  onArchive,
  onRestore,
}: {
  agent: Agent;
  runtimes: RuntimeDevice[];
  onUpdate: (id: string, data: Partial<Agent>) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const st = statusConfig[agent.status];
  const runtimeDevice = getRuntimeDevice(agent, runtimes);
  const [activeTab, setActiveTab] = useState<DetailTab>("instructions");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const isArchived = !!agent.archived_at;

  return (
    <div className="flex h-full flex-col">
      {/* Archive Banner */}
      {isArchived && (
        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1">{t("agents.archivedBanner", "This agent is archived. It cannot be assigned or mentioned.")}</span>
          <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => onRestore(agent.id)}>
            {t("common.restore", "Restore")}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <ActorAvatar actorType="agent" actorId={agent.id} size={28} className={`rounded-md ${isArchived ? "opacity-50" : ""}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className={`text-sm font-semibold truncate ${isArchived ? "text-muted-foreground" : ""}`}>{agent.name}</h2>
            {isArchived ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                {t("common.archive", "Archived")}
              </span>
            ) : (
              <span className={`flex items-center gap-1.5 text-xs ${st.color}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                {t(st.labelKey, st.defaultLabel)}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
              {agent.runtime_mode === "cloud" ? (
                <Cloud className="h-3 w-3" />
              ) : (
                <Monitor className="h-3 w-3" />
              )}
              {runtimeDevice?.name ?? (agent.runtime_mode === "cloud" ? t("common.cloud", "Cloud") : t("common.local", "Local"))}
            </span>
          </div>
        </div>
        {!isArchived && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" />
              }
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setConfirmArchive(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("common.archiveAgent", "Archive Agent")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b px-6">
        {detailTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {t(tab.labelKey, tab.defaultLabel)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "instructions" && (
          <InstructionsTab
            agent={agent}
            onSave={(instructions) => onUpdate(agent.id, { instructions })}
          />
        )}
        {activeTab === "skills" && (
          <SkillsTab agent={agent} />
        )}
        {activeTab === "tasks" && <TasksTab agent={agent} />}
        {activeTab === "settings" && (
          <SettingsTab
            agent={agent}
            runtimes={runtimes}
            onSave={(updates) => onUpdate(agent.id, updates)}
          />
        )}
      </div>

       {/* Archive Confirmation */}
      {confirmArchive && (
        <Dialog open onOpenChange={(v) => { if (!v) setConfirmArchive(false); }}>
          <DialogContent className="max-w-sm" showCloseButton={false}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <DialogHeader className="flex-1 gap-1">
                <DialogTitle className="text-sm font-semibold">{t("agents.archiveAgentTitle", "Archive agent?")}</DialogTitle>
                <DialogDescription className="text-xs">
                  &quot;{agent.name}&quot; {t("agents.archiveAgentDescription", "will be archived. It won't be assignable or mentionable, but all history is preserved. You can restore it later.")}
                </DialogDescription>
              </DialogHeader>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setConfirmArchive(false)}>
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmArchive(false);
                  onArchive(agent.id);
                }}
              >
                {t("common.archive", "Archive")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
