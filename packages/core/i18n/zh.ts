export const zh = {
  board: {
    statuses: {
      backlog: "积压",
      todo: "待办",
      in_progress: "进行中",
      in_review: "审核中",
      done: "完成",
      blocked: "阻塞",
      cancelled: "取消",
    },
    hideColumn: "隐藏列",
    addIssue: "添加问题",
    noIssues: "无问题",
    hiddenColumns: "隐藏的列",
    showColumn: "显示列",
  },
  modal: {
    createIssue: {
      title: "新建问题",
      newSubIssue: "新建子问题",
      newIssue: "新建问题",
      collapse: "折叠",
      expand: "展开",
      close: "关闭",
      titlePlaceholder: "问题标题",
      descriptionPlaceholder: "添加描述...",
      creating: "创建中...",
      createIssue: "创建问题",
      issueCreated: "问题已创建",
      viewIssue: "查看问题",
      failedToCreate: "创建问题失败",
    },
  },
  dashboard: {
    issues: {
      title: "问题",
    },
  },
  issues: {
    emptyState: {
      title: "还没有问题",
      subtitle: "创建一个问题开始使用。",
    },
    errors: {
      moveFailed: "移动问题失败",
    },
  },
  common: {
    workspace: "工作区",
    status: "状态",
    priority: "优先级",
    assignee: "指派人",
    creator: "创建人",
    project: "项目",
  },
} as const;
