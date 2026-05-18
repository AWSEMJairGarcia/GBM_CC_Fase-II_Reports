// Metrics Module — sprint, epic, EVM, and summary calculations

export const SPRINT_CONFIG = [
  { id: 'sprint-0', name: 'Sprint 0 - Discovery', startDate: '2026-05-05', endDate: '2026-05-16', label: 'sprint-0' },
  { id: 'sprint-1', name: 'Sprint 1 - Accesos', startDate: '2026-05-19', endDate: '2026-06-06', label: 'sprint-1' },
  { id: 'sprint-2', name: 'Sprint 2 - Refactor', startDate: '2026-06-09', endDate: '2026-06-20', label: 'sprint-2' },
  { id: 'sprint-3', name: 'Sprint 3 - Entity', startDate: '2026-06-23', endDate: '2026-07-04', label: 'sprint-3' },
  { id: 'sprint-4', name: 'Sprint 4 - Workspace', startDate: '2026-07-07', endDate: '2026-07-18', label: 'sprint-4' },
  { id: 'sprint-5', name: 'Sprint 5 - Routing', startDate: '2026-07-21', endDate: '2026-08-01', label: 'sprint-5' },
  { id: 'sprint-6', name: 'Sprint 6 - WhatsApp', startDate: '2026-08-04', endDate: '2026-08-15', label: 'sprint-6' },
  { id: 'sprint-7', name: 'Sprint 7 - Campaigns', startDate: '2026-08-18', endDate: '2026-08-29', label: 'sprint-7' },
  { id: 'sprint-8', name: 'Sprint 8 - CSAT+ACW', startDate: '2026-09-01', endDate: '2026-09-12', label: 'sprint-8' },
  { id: 'sprint-9', name: 'Sprint 9 - Routing II', startDate: '2026-09-15', endDate: '2026-09-26', label: 'sprint-9' },
  { id: 'sprint-10', name: 'Sprint 10 - Workspace II', startDate: '2026-09-29', endDate: '2026-10-10', label: 'sprint-10' },
  { id: 'sprint-11', name: 'Sprint 11 - Integration', startDate: '2026-10-13', endDate: '2026-10-24', label: 'sprint-11' },
  { id: 'sprint-12', name: 'Sprint 12 - Ajustes Ops', startDate: '2026-10-27', endDate: '2026-11-07', label: 'sprint-12' },
  { id: 'sprint-13', name: 'Sprint 13 - UAT', startDate: '2026-11-10', endDate: '2026-11-21', label: 'sprint-13' },
  { id: 'sprint-14', name: 'Sprint 14 - Go-Live', startDate: '2026-11-24', endDate: '2026-11-27', label: 'sprint-14' }
];

export const EPIC_CONFIG = [
  { key: 'AC-662', name: 'Discovery & Governance', order: 0 },
  { key: 'AC-443', name: 'Unified Customer Entity', order: 1 },
  { key: 'AC-444', name: 'Intelligent Routing', order: 2 },
  { key: 'AC-445', name: 'Multicanal Outbound Campaigns', order: 3 },
  { key: 'AC-446', name: 'CSAT/NPS Surveys', order: 4 },
  { key: 'AC-447', name: 'Workspace Optimization', order: 5 },
  { key: 'AC-448', name: 'Refactor Lambdas + Chatbot', order: 6 },
  { key: 'AC-449', name: 'Ajustes Operativos', order: 7 }
];

function getStatusCategoryKey(issue) {
  return issue.fields?.status?.statusCategory?.key || '';
}

function getStatusName(issue) {
  return issue.fields?.status?.name || '';
}

function getLabels(issue) {
  return issue.fields?.labels || [];
}

function getParentKey(issue) {
  return issue.fields?.parent?.key || '';
}

function isBlocked(issue) {
  const labels = getLabels(issue);
  const statusName = getStatusName(issue).toLowerCase();
  return labels.includes('blocker') || statusName.includes('block');
}

function isSprintPast(sprint) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(sprint.endDate + 'T23:59:59');
  return today > endDate;
}

function getSprintRAG(percentage, sprint) {
  if (!isSprintPast(sprint)) {
    // Future/active sprints: only green or amber
    if (percentage >= 90) return 'green';
    if (percentage >= 50) return 'amber';
    return 'amber';
  }
  // Past sprints: full RAG
  if (percentage >= 90) return 'green';
  if (percentage >= 50) return 'amber';
  return 'red';
}

function getEpicRAG(percentage) {
  if (percentage >= 90) return 'green';
  if (percentage >= 50) return 'amber';
  return 'red';
}

function calculateSprintMetrics(issues) {
  return SPRINT_CONFIG.map(sprint => {
    const sprintIssues = issues.filter(issue => getLabels(issue).includes(sprint.label));
    const totalIssues = sprintIssues.length;
    const doneIssues = sprintIssues.filter(i => getStatusCategoryKey(i) === 'done').length;
    const blockedIssues = sprintIssues.filter(i => isBlocked(i)).length;
    const inProgressIssues = sprintIssues.filter(i => getStatusCategoryKey(i) === 'indeterminate').length;
    const percentage = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

    return {
      ...sprint,
      totalIssues,
      doneIssues,
      inProgressIssues,
      blockedIssues,
      percentage,
      ragStatus: getSprintRAG(percentage, sprint)
    };
  });
}

function calculateEpicMetrics(issues) {
  return EPIC_CONFIG.map(epic => {
    const children = issues.filter(issue => getParentKey(issue) === epic.key);
    const totalChildren = children.length;
    const doneChildren = children.filter(i => getStatusCategoryKey(i) === 'done').length;
    const percentage = totalChildren > 0 ? Math.round((doneChildren / totalChildren) * 100) : 0;

    return {
      ...epic,
      totalChildren,
      doneChildren,
      percentage,
      ragStatus: getEpicRAG(percentage)
    };
  });
}

function calculateEVMMetrics(issues, sprintMetrics) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Determine current sprint index based on today's date
  let currentSprintIndex = -1;
  for (let i = 0; i < SPRINT_CONFIG.length; i++) {
    const start = new Date(SPRINT_CONFIG[i].startDate);
    const end = new Date(SPRINT_CONFIG[i].endDate + 'T23:59:59');
    if (today >= start && today <= end) {
      currentSprintIndex = i;
      break;
    }
  }

  // If today is before all sprints, index is 0; if after all, index is last
  if (currentSprintIndex === -1) {
    const firstStart = new Date(SPRINT_CONFIG[0].startDate);
    if (today < firstStart) {
      currentSprintIndex = 0;
    } else {
      currentSprintIndex = SPRINT_CONFIG.length - 1;
    }
  }

  // Sprints planned to date = sprints whose endDate <= today
  const sprintsPlannedToDate = SPRINT_CONFIG.filter(s => {
    const end = new Date(s.endDate + 'T23:59:59');
    return today > end;
  }).length || 1;

  // Sprints completed = sprints with 100% done
  const sprintsCompleted = sprintMetrics.filter(s => s.percentage === 100).length;

  const spi = sprintsPlannedToDate > 0
    ? Math.round((sprintsCompleted / sprintsPlannedToDate) * 100) / 100
    : 1;

  // Schedule variance in days: negative = behind, positive = ahead
  const currentSprint = SPRINT_CONFIG[currentSprintIndex];
  const plannedEnd = new Date(currentSprint.endDate);
  const diffMs = plannedEnd.getTime() - today.getTime();
  const scheduleVariance = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Overall progress
  const totalIssues = issues.length;
  const doneIssues = issues.filter(i => getStatusCategoryKey(i) === 'done').length;
  const overallProgress = totalIssues > 0 ? Math.round((doneIssues / totalIssues) * 100) : 0;

  // Blocker count
  const blockerCount = issues.filter(i => isBlocked(i)).length;

  // Overall RAG based on variance and blockers
  let ragOverall = 'green';
  if (scheduleVariance < -5 || blockerCount > 5) {
    ragOverall = 'red';
  } else if (scheduleVariance < 0 || blockerCount >= 3) {
    ragOverall = 'amber';
  }

  return {
    spi,
    scheduleVariance,
    overallProgress,
    ragOverall,
    currentSprintIndex,
    sprintsPlannedToDate,
    sprintsCompleted
  };
}

function calculateSummaryStats(issues) {
  const totalIssues = issues.length;
  const doneIssues = issues.filter(i => getStatusCategoryKey(i) === 'done').length;
  const inProgressIssues = issues.filter(i => getStatusCategoryKey(i) === 'indeterminate').length;
  const todoIssues = issues.filter(i => getStatusCategoryKey(i) === 'new').length;
  const blockedIssues = issues.filter(i => isBlocked(i)).length;

  return { totalIssues, doneIssues, inProgressIssues, todoIssues, blockedIssues };
}

export function calculateMetrics(issues) {
  if (!Array.isArray(issues)) issues = [];

  const sprintMetrics = calculateSprintMetrics(issues);
  const epicMetrics = calculateEpicMetrics(issues);
  const evmMetrics = calculateEVMMetrics(issues, sprintMetrics);
  const summary = calculateSummaryStats(issues);

  return {
    sprints: sprintMetrics,
    epics: epicMetrics,
    evm: evmMetrics,
    summary
  };
}
