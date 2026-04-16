"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import type { Agent } from "@multica/core/types";
import { Button } from "@multica/ui/components/ui/button";
import { useTranslation } from "@multica/core";

export function InstructionsTab({
  agent,
  onSave,
}: {
  agent: Agent;
  onSave: (instructions: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(agent.instructions ?? "");
  const [saving, setSaving] = useState(false);
  const isDirty = value !== (agent.instructions ?? "");

  // Sync when switching between agents.
  useEffect(() => {
    setValue(agent.instructions ?? "");
  }, [agent.id, agent.instructions]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(value);
    } catch {
      // toast handled by parent
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">{t("agents.instructions", "Agent Instructions")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("agents.instructionsDescription", "Define this agent's identity and working style. These instructions are injected into the agent's context for every task.")}
        </p>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t("agents.instructionsPlaceholder", `Define this agent's role, expertise, and working style.

Example:
You are a frontend engineer specializing in React and TypeScript.

## Working Style
- Write small, focused PRs — one commit per logical change
- Prefer composition over inheritance
- Always add unit tests for new components

## Constraints
- Do not modify shared/ types without explicit approval
- Follow the existing component patterns in features/`)}
        className="w-full min-h-[300px] rounded-md border bg-transparent px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {value.length > 0 ? `${value.length} ${t("agents.characters", "characters")}` : t("agents.noInstructions", "No instructions set")}
        </span>
        <Button
          size="xs"
          onClick={handleSave}
          disabled={!isDirty || saving}
        >
          {saving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          {t("common.save", "Save")}
        </Button>
      </div>
    </div>
   );
}
