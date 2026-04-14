export const en = {
  board: {
    statuses: {
      backlog: "Backlog",
      todo: "To Do",
      in_progress: "In Progress",
      in_review: "In Review",
      done: "Done",
      blocked: "Blocked",
      cancelled: "Cancelled",
    },
    hideColumn: "Hide column",
    addIssue: "Add issue",
    noIssues: "No issues",
    hiddenColumns: "Hidden columns",
    showColumn: "Show column",
  },
  modal: {
    createIssue: {
      title: "New Issue",
      newSubIssue: "New sub-issue",
      newIssue: "New issue",
      collapse: "Collapse",
      expand: "Expand",
      close: "Close",
      titlePlaceholder: "Issue title",
      descriptionPlaceholder: "Add description...",
      creating: "Creating...",
      createIssue: "Create Issue",
      issueCreated: "Issue created",
      viewIssue: "View issue",
      failedToCreate: "Failed to create issue",
    },
  },
  dashboard: {
    issues: {
      title: "Issues",
    },
  },
  issues: {
    emptyState: {
      title: "No issues yet",
      subtitle: "Create an issue to get started.",
    },
    errors: {
      moveFailed: "Failed to move issue",
    },
  },
  common: {
    workspace: "Workspace",
    status: "Status",
    priority: "Priority",
    assignee: "Assignee",
    creator: "Creator",
    project: "Project",
  },
} as const;
