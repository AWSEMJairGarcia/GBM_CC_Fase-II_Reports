/**
 * Header Component — 4 stat cards with animated counters
 * Displays: Completados, En Progreso, Por Hacer, Total
 */

import { countUp, fadeIn } from '../animations.js';

export function renderHeader(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const stats = [
    { label: 'Completados', value: data.metrics.summary.doneIssues, color: 'green' },
    { label: 'En Progreso', value: data.metrics.summary.inProgressIssues, color: 'orange' },
    { label: 'Por Hacer', value: data.metrics.summary.todoIssues, color: 'blue' },
    { label: 'Total', value: data.metrics.summary.totalIssues, color: 'purple' }
  ];

  stats.forEach((stat, index) => {
    const card = document.createElement('div');
    card.className = 'card stat-card';
    card.style.borderTop = `4px solid var(--accent-${stat.color})`;
    card.innerHTML = `
      <span class="stat-label">${stat.label}</span>
      <span class="stat-value text-${stat.color}" data-target="${stat.value}">0</span>
    `;
    container.appendChild(card);
    fadeIn(card, index * 100);

    const valueEl = card.querySelector('.stat-value');
    setTimeout(() => countUp(valueEl, stat.value), index * 100 + 200);
  });
}
