/**
 * Columns Component — 3-column layout (Completadas | En Progreso | Bloqueadas)
 * Sorted by resolution date, assignee, and days blocked respectively.
 */

import { staggerList } from '../animations.js';

function getStatusCategoryKey(issue) {
  return issue.fields?.status?.statusCategory?.key || '';
}

function getStatusName(issue) {
  return issue.fields?.status?.name || '';
}

function getLabels(issue) {
  return issue.fields?.labels || [];
}

function isBlocked(issue) {
  const labels = getLabels(issue);
  const statusName = getStatusName(issue).toLowerCase();
  return labels.includes('blocker') || statusName.includes('block');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

function daysBlocked(issue) {
  const updated = issue.fields?.updated;
  if (!updated) return 0;
  const diff = Date.now() - new Date(updated).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function renderColumn(title, color, items, renderItem) {
  const col = document.createElement('div');
  col.className = 'card column-card';
  col.style.borderTop = `4px solid var(--accent-${color})`;

  const header = document.createElement('h4');
  header.className = `column-title text-${color}`;
  header.textContent = `${title} (${items.length})`;
  col.appendChild(header);

  const list = document.createElement('ul');
  list.className = 'column-list';

  items.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'column-item';
    li.innerHTML = renderItem(item);
    list.appendChild(li);
  });

  col.appendChild(list);
  return col;
}

export function renderColumns(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const issues = data.issues || [];

  // Left: Completadas — statusCategory 'done', sorted by resolutiondate desc
  const done = issues
    .filter((i) => getStatusCategoryKey(i) === 'done')
    .sort((a, b) => {
      const dateA = a.fields?.resolutiondate || a.fields?.updated || '';
      const dateB = b.fields?.resolutiondate || b.fields?.updated || '';
      return new Date(dateB) - new Date(dateA);
    })
    .slice(0, 20);

  // Center: En Progreso — statusCategory 'indeterminate'
  const inProgress = issues
    .filter((i) => getStatusCategoryKey(i) === 'indeterminate')
    .slice(0, 20);

  // Right: Bloqueadas — label 'blocker' or status containing 'Block'
  const blocked = issues.filter((i) => isBlocked(i));

  const grid = document.createElement('div');
  grid.className = 'columns-layout';

  // Left column
  const leftCol = renderColumn('Completadas', 'green', done, (issue) => `
    <span class="item-key">${issue.key}</span>
    <span class="item-summary">${issue.fields?.summary || ''}</span>
    <span class="item-meta text-secondary">${formatDate(issue.fields?.resolutiondate || issue.fields?.updated)}</span>
  `);

  // Center column
  const centerCol = renderColumn('En Progreso', 'orange', inProgress, (issue) => `
    <span class="item-key">${issue.key}</span>
    <span class="item-summary">${issue.fields?.summary || ''}</span>
    <span class="item-meta text-secondary">${issue.fields?.assignee?.displayName || 'Sin asignar'}</span>
  `);

  // Right column
  let rightCol;
  if (blocked.length === 0) {
    rightCol = document.createElement('div');
    rightCol.className = 'card column-card';
    rightCol.style.borderTop = '4px solid var(--accent-red)';
    rightCol.innerHTML = `
      <h4 class="column-title text-red">Bloqueadas (0)</h4>
      <div class="empty-state">
        <span class="empty-indicator"></span>
        <span>Sin bloqueos activos</span>
      </div>
    `;
  } else {
    rightCol = renderColumn('Bloqueadas', 'red', blocked, (issue) => `
      <span class="item-key">${issue.key}</span>
      <span class="item-summary">${issue.fields?.summary || ''}</span>
      <span class="item-meta text-secondary">${issue.fields?.assignee?.displayName || 'Sin asignar'} · ${daysBlocked(issue)}d</span>
    `);
  }

  grid.appendChild(leftCol);
  grid.appendChild(centerCol);
  grid.appendChild(rightCol);
  container.appendChild(grid);

  // Stagger items in each column
  const allItems = container.querySelectorAll('.column-item');
  staggerList(allItems, 50);
}
