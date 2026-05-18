/**
 * Epics Component — Compact table of 8 epics with progress bars and RAG
 * Ordered: Epic 0 first, then 1-7. Purple accent color.
 */

import { animateBar, staggerList } from '../animations.js';

function ragDot(status) {
  const colors = { green: 'var(--accent-green)', amber: 'var(--accent-orange)', red: 'var(--accent-red)' };
  const color = colors[status] || colors.amber;
  return `<span class="rag-dot" style="background:${color};" title="${status}"></span>`;
}

export function renderEpics(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `<h3 class="section-title">Epic Progress</h3>`;

  const table = document.createElement('table');
  table.className = 'epics-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Epic</th>
        <th>Done/Total</th>
        <th>Progreso</th>
        <th>RAG</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');
  const epics = data.metrics.epics;

  epics.forEach((epic) => {
    const row = document.createElement('tr');
    row.className = 'epic-row';
    row.innerHTML = `
      <td class="epic-name">Epic ${epic.order}: ${epic.name}</td>
      <td class="epic-ratio">${epic.doneChildren}/${epic.totalChildren}</td>
      <td class="epic-progress">
        <div class="progress-bar">
          <div class="progress-fill purple" data-width="${epic.percentage}"></div>
        </div>
      </td>
      <td class="epic-rag">${ragDot(epic.ragStatus)}</td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);

  // Animate bars
  const bars = wrapper.querySelectorAll('.progress-fill');
  bars.forEach((bar) => {
    const width = parseInt(bar.dataset.width, 10) || 0;
    animateBar(bar, width);
  });

  // Stagger rows
  const rows = wrapper.querySelectorAll('.epic-row');
  staggerList(rows, 50);
}
