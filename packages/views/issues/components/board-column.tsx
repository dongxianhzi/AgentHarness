// packages/views/issues/components/board-column.tsx
"use client";

import { useMemo, type ReactNode } from "react";
import { EyeOff, MoreHorizontal, Plus } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@multica/ui/components/ui/tooltip";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Issue, IssueStatus } from "@multica/core/types";
import { Button } from "@multica/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@multica/ui/components/ui/dropdown-menu";
import { STATUS_CONFIG } from "@multica/core/issues/config";
import { useModalStore } from "@multica/core/modals";
import { useViewStoreApi } from "@multica/core/issues/stores/view-store-context";
import { StatusIcon } from "./status-icon";
import { DraggableBoardCard } from "./board-card";
import type { ChildProgress } from "./list-row";

// 定义翻译函数类型
type TranslateFn = (key: string, fallback: string) => string;

export function BoardColumn({
  status,
  issueIds,
  issueMap,
  childProgressMap,
  totalCount,
  footer,
  t = (_, fallback) => fallback, // 默认 fallback
}: {
  status: IssueStatus;
  issueIds: string[];
  issueMap: Map<string, Issue>;
  childProgressMap?: Map<string, ChildProgress>;
  totalCount?: number;
  footer?: ReactNode;
  t?: TranslateFn;
}) {
  const cfg = STATUS_CONFIG[status];
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const viewStoreApi = useViewStoreApi();

  // Resolve IDs to Issue objects, preserving parent-provided order
  const resolvedIssues = useMemo(
    () =>
      issueIds.flatMap((id) => {
        const issue = issueMap.get(id);
        return issue ? [issue] : [];
      }),
    [issueIds, issueMap],
  );

  // 辅助函数：获取状态的翻译 Label
  const getStatusLabel = () => {
    // 映射关系：将 config 中的 key (通常是下划线) 映射到字典中的 key (驼峰)
    // 注意：这取决于 apps/web/features/landing/i18n/*.ts 中 board.statuses 的具体 key
    const keyMap: Record<string, string> = {
      'backlog': 'backlog',
      'todo': 'todo',
      'in_progress': 'inProgress',
      'in_review': 'inReview',
      'done': 'done',
      'blocked': 'blocked',
      'cancelled': 'cancelled',
    };
    
    const dictKey = keyMap[status];
    
    if (dictKey) {
      // 尝试从 board.statuses.{dictKey} 获取翻译
      // 如果翻译不存在，fallback 到 config 中的原始 label (cfg.label)
      return t(`board.statuses.${dictKey}`, cfg.label);
    }
    
    // 如果没有映射，直接返回 config 中的 label
    return cfg.label;
  };

  return (
    <div className={`flex w-[280px] shrink-0 flex-col rounded-xl ${cfg.columnBg} p-2`}>
      <div className="mb-2 flex items-center justify-between px-1.5">
        {/* Left: status badge + count */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}>
            <StatusIcon status={status} className="h-3 w-3" inheritColor />
            {/* 使用翻译后的标签 */}
            {getStatusLabel()}
          </span>
          <span className="text-xs text-muted-foreground">
            {totalCount ?? issueIds.length}
          </span>
        </div>

        {/* Right: add + menu */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="rounded-full text-muted-foreground">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => viewStoreApi.getState().hideStatus(status)}>
                <EyeOff className="size-3.5" />
                {t('board.hideColumn', 'Hide column')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-muted-foreground"
                  onClick={() => useModalStore.getState().open("create-issue", { status })}
                >
                  <Plus className="size-3.5" />
                </Button>
              }
            />
            <TooltipContent>{t('board.addIssue', 'Add issue')}</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[200px] flex-1 space-y-2 overflow-y-auto rounded-lg p-1 transition-colors ${
          isOver ? "bg-accent/60" : ""
        }`}
      >
        <SortableContext items={issueIds} strategy={verticalListSortingStrategy}>
          {resolvedIssues.map((issue) => (
            <DraggableBoardCard key={issue.id} issue={issue} childProgress={childProgressMap?.get(issue.id)} t={t} />
          ))}
        </SortableContext>
        {issueIds.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            {t('board.noIssues', 'No issues')}
          </p>
        )}
        {footer}
      </div>
    </div>
  );
}