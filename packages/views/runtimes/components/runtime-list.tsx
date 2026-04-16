import { Server, ArrowUpCircle, ChevronDown, Check, Play, Square } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import type { AgentRuntime, MemberWithUser } from "@multica/core/types";
import { useWorkspaceId } from "@multica/core/hooks";
import { useTranslation } from "@multica/core";
import { memberListOptions } from "@multica/core/workspace/queries";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@multica/ui/components/ui/dropdown-menu";
import { ActorAvatar } from "../../common/actor-avatar";
import { ProviderLogo } from "./provider-logo";

type RuntimeFilter = "mine" | "all";

function RuntimeListItem({
  runtime,
  isSelected,
  ownerMember,
  hasUpdate,
  onClick,
  t,
}: {
  runtime: AgentRuntime;
  isSelected: boolean;
  ownerMember: MemberWithUser | null;
  hasUpdate: boolean;
  onClick: () => void;
  t: (key: string, fallback: string) => string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${isSelected ? "bg-accent" : "hover:bg-accent/50"
        }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        <ProviderLogo provider={runtime.provider} className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{runtime.name}</div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          {ownerMember ? (
            <>
              <ActorAvatar
                actorType="member"
                actorId={ownerMember.user_id}
                size={14}
              />
              <span className="truncate">{ownerMember.name}</span>
            </>
          ) : (
            <span className="truncate">{runtime.runtime_mode}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {hasUpdate && (
          <span title={t("runtimes.updateAvailable", "Update available")}>
            <ArrowUpCircle className="h-3.5 w-3.5 text-info" />
          </span>
        )}
        <div
          className={`h-2 w-2 rounded-full ${runtime.status === "online" ? "bg-success" : "bg-muted-foreground/40"
            }`}
        />
      </div>
    </button>
  );
}

export function RuntimeList({
  runtimes,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
  ownerFilter,
  onOwnerFilterChange,
  updatableIds,
}: {
  runtimes: AgentRuntime[];
  selectedId: string;
  onSelect: (id: string) => void;
  filter: RuntimeFilter;
  onFilterChange: (filter: RuntimeFilter) => void;
  ownerFilter: string | null;
  onOwnerFilterChange: (ownerId: string | null) => void;
  updatableIds?: Set<string>;
}) {
  const { t } = useTranslation();
  const wsId = useWorkspaceId();
  const { data: members = [] } = useQuery(memberListOptions(wsId));
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isStartingMultica, setIsStartingMultica] = useState(false);
  const [isStoppingMultica, setIsStoppingMultica] = useState(false);
  const [daemonStatus, setDaemonStatus] = useState<"running" | "stopped" | "unknown">("unknown");

  // Get token from localStorage (matches what auth store uses)
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Read token from localStorage - this is what the auth store uses
    const storedToken = localStorage.getItem("multica_token");
    setToken(storedToken);
  }, []);

  // Fetch daemon status on mount and periodically
  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      try {
        const statusResponse = await fetch("/api/multica/cli", {
          method: "POST",
          headers,
          body: JSON.stringify({ command: "daemon status" }),
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          const output = statusData.output as { status?: string } | undefined;
          setDaemonStatus(output?.status === "running" ? "running" : "stopped");
        } else {
          setDaemonStatus("stopped");
        }
      } catch {
        setDaemonStatus("stopped");
      }
    };

    fetchStatus();
    // Poll every 10 seconds
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleStopMultica = async () => {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      setIsStoppingMultica(true);

      // Call daemon stop
      const stopResponse = await fetch("/api/multica/cli", {
        method: "POST",
        headers,
        body: JSON.stringify({ command: "daemon stop" }),
      });

      if (!stopResponse.ok) {
        const errorData = await stopResponse.json();
        throw new Error(errorData.error || "Failed to stop daemon");
      }

      // Update status immediately after successful stop
      setDaemonStatus("stopped");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Failed to stop Multica:", error);
      alert("Failed to stop Multica: " + message);
    } finally {
      setIsStoppingMultica(false);
    }
  };

  const handleStartMultica = async () => {
    try {
      // Use existing token from localStorage to authenticate with the API
      // The "login" command will auto-create a PAT and configure multica CLI
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // First call login to auto-create PAT and configure multica
      const loginResponse = await fetch("/api/multica/cli", {
        method: "POST",
        headers,
        body: JSON.stringify({ command: "login" }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.error || "Login failed");
      }

      setIsStartingMultica(true);

      // Call daemon start (ignore error if already running)
      const daemonStartResponse = await fetch("/api/multica/cli", {
        method: "POST",
        headers,
        body: JSON.stringify({ command: "daemon start" }),
      });

      if (!daemonStartResponse.ok) {
        const errorData = await daemonStartResponse.json();
        // If daemon is already running, that's okay - we'll check status below
        if (!errorData.error?.includes("already running")) {
          throw new Error(errorData.error || "Failed to start daemon");
        }
      }

      // Poll for daemon status
      let isRunning = false;
      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
        const statusResponse = await fetch("/api/multica/cli", {
          method: "POST",
          headers,
          body: JSON.stringify({ command: "daemon status" }),
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          // Response is { status: "success", output: { status: "running", ... } }
          const output = statusData.output as { status?: string } | undefined;
          if (output?.status === "running") {
            isRunning = true;
            setDaemonStatus("running");
            break;
          }
        } else {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || "Failed to check daemon status");
        }
      }

      if (!isRunning) {
        throw new Error("Daemon failed to start");
      }

      // Refresh runtimes list - relies on WS event
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Failed to start Multica:", error);
      alert("Failed to start Multica: " + message);
    } finally {
      setIsLoggingIn(false);
      setIsStartingMultica(false);
    }
  };

  const getOwnerMember = (ownerId: string | null) => {
    if (!ownerId) return null;
    return members.find((m) => m.user_id === ownerId) ?? null;
  };

  // Get unique owners from runtimes for filter dropdown
  const uniqueOwners = filter === "all"
    ? Array.from(new Set(runtimes.map((r) => r.owner_id).filter(Boolean) as string[]))
      .map((id) => members.find((m) => m.user_id === id))
      .filter(Boolean) as MemberWithUser[]
    : [];

  // Count runtimes per owner
  const ownerCounts = new Map<string, number>();
  for (const r of runtimes) {
    if (r.owner_id) ownerCounts.set(r.owner_id, (ownerCounts.get(r.owner_id) ?? 0) + 1);
  }

  // Apply client-side owner filter when in "all" mode
  const filteredRuntimes = filter === "all" && ownerFilter
    ? runtimes.filter((r) => r.owner_id === ownerFilter)
    : runtimes;

  const selectedOwner = ownerFilter ? getOwnerMember(ownerFilter) : null;

  return (
    <div className="overflow-y-auto h-full border-r">
      <div className="flex h-12 items-center justify-between border-b px-4">
        <h1 className="text-sm font-semibold">{t("runtimes.title", "Runtimes")}</h1>
        <span className="text-xs text-muted-foreground">
          {filteredRuntimes.filter((r) => r.status === "online").length}/
          {filteredRuntimes.length} {t("runtimes.online", "online")}
        </span>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Scope toggle */}
          <div className="flex items-center gap-0.5 rounded-md bg-muted p-0.5">
            <button
              onClick={() => { onFilterChange("mine"); onOwnerFilterChange(null); }}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${filter === "mine"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t("runtimes.filterMine", "Mine")}
            </button>
            <button
              onClick={() => { onFilterChange("all"); onOwnerFilterChange(null); }}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${filter === "all"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {t("runtimes.filterAll", "All")}
            </button>
          </div>

          {/* Owner dropdown (only in All mode with multiple owners) */}
          {filter === "all" && uniqueOwners.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent" />
                }
              >
                {selectedOwner ? (
                  <>
                    <ActorAvatar actorType="member" actorId={selectedOwner.user_id} size={16} />
                    <span className="max-w-20 truncate">{selectedOwner.name}</span>
                  </>
                ) : (
                  <span>{t("runtimes.ownerPlaceholder", "Owner")}</span>
                )}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onOwnerFilterChange(null)}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs">{t("runtimes.allOwners", "All owners")}</span>
                  {!ownerFilter && <Check className="h-3.5 w-3.5 text-foreground" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {uniqueOwners.map((m) => (
                  <DropdownMenuItem
                    key={m.user_id}
                    onClick={() => onOwnerFilterChange(ownerFilter === m.user_id ? null : m.user_id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <ActorAvatar actorType="member" actorId={m.user_id} size={18} />
                      <span className="text-xs truncate">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{ownerCounts.get(m.user_id) ?? 0}</span>
                    </div>
                    {ownerFilter === m.user_id && <Check className="h-3.5 w-3.5 shrink-0 text-foreground" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Start/Stop Multica Button */}
        <div className="flex items-center gap-2">
          {daemonStatus === "running" ? (
            <button
              onClick={handleStopMultica}
              disabled={isStoppingMultica}
              className="flex items-center gap-2 rounded-md bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              {isStoppingMultica ? (
                <>
                  <Square className="h-3 w-3 animate-spin" />
                  <span>{t("runtimes.stopping", "Stopping...")}</span>
                </>
              ) : (
                <>
                  <Square className="h-3 w-3" />
                  <span>{t("runtimes.stop", "Stop")}</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleStartMultica}
              disabled={isStartingMultica || isLoggingIn || daemonStatus === "unknown"}
              className="flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isStartingMultica ? (
                <>
                  <Play className="h-3 w-3 animate-spin" />
                  <span>{t("runtimes.starting", "Starting...")}</span>
                </>
              ) : isLoggingIn ? (
                <>
                  <Play className="h-3 w-3 animate-spin" />
                  <span>{t("runtimes.loggingIn", "Logging in...")}</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>{t("runtimes.start", "Start")}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {filteredRuntimes.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12">
          <Server className="h-8 w-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">
            {filter === "mine" 
              ? t("runtimes.noOwned", "No runtimes owned by you") 
              : ownerFilter 
                ? t("runtimes.noForOwner", "No runtimes for this owner") 
                : t("runtimes.noRegistered", "No runtimes registered")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground text-center">
            {t("runtimes.emptyHint", "Run harness daemon start to register a local runtime.")}
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {filteredRuntimes.map((runtime) => (
            <RuntimeListItem
              key={runtime.id}
              runtime={runtime}
              isSelected={runtime.id === selectedId}
              ownerMember={getOwnerMember(runtime.owner_id)}
              hasUpdate={updatableIds?.has(runtime.id) ?? false}
              onClick={() => onSelect(runtime.id)}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
