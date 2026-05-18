/**
 * Sprint Table Component — 15 sprints with animated bars and RAG indicators
 * Displays progress, percentage, and done/total for each sprint.
 */

import { animateBar, staggerList } from '../animations.js';

function ragDot(status) {
  const colors = { green: 'var(--accent-green)', amber: 'var(--accent-orange)', red: 'var(--accent-red)' };
  const color = colors[status] || colors.amber;
  return `<span class="rag-dot" style="background:${color};" title="${status}"></span>`;
}

function formatDates(startDate, endDate) {
  const fmt = (d) => {
    const date = new Date(d + 'T00:00:00');
    return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };
  return `${fmt(startDate)} – ${fmt(endDate)}`;
}

export function renderSprintTable(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const sprints = data.metrics.sprints;

  const wrapper = document.createElement('div');
  wrapper.className = 'card sprint-table-wrapper';
  wrapper.innerHTML = `<h3 class="section-title">Sprint Progress</h3>`;

  const table = document.createElement('table');
  table.className = 'sprint-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Sprint</th>
        <th>Fechas</th>
        <th>Progreso</th>
        <th>%</th>
        <th>Done/Total</th>
      </tr>
    </thead>
  `;

  const tbody = document.createElement('tbody');

  sprints.forEach((sprint) => {
    const row = document.createElement('tr');
    row.className = 'sprint-row';

    const fillClass = sprint.percentage >= 90 ? '' :
      sprint.percentage >= 50 ? 'orange' : 'red';

    row.innerHTML = `
      <td class="sprint-name">${ragDot(sprint.ragStatus)} ${sprint.name}</td>
      <td class="sprint-dates text-secondary">${formatDates(sprint.startDate, sprint.endDate)}</td>
      <td class="sprint-progress">
        <div class="progress-bar">
          <div class="progress-fill ${fillClass}" data-width="${sprint.percentage}"></div>
        </div>
      </td>
      <td class="sprint-pct">${sprint.percentage}%</td>
      <td class="sprint-ratio">${sprint.doneIssues}/${sprint.totalIssues}</td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  container.appendChild(wrapper);

  // Animate bars after DOM insertion
  const bars = wrapper.querySelectorAll('.progress-fill');
  bars.forEach((bar) => {
    const width = parseInt(bar.dataset.width, 10) || 0;
    animateBar(bar, width);
  });

  // Stagger row animations
  const rows = wrapper.querySelectorAll('.sprint-row');
  staggerList(rows, 50);
}
