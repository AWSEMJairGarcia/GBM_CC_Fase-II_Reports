// Executive View — integrates RAG, KPIs, milestones, and risks
import { renderRAGSummary } from '../components/rag.js';
import { renderRisks } from '../components/risks.js';
import { countUp, fadeIn } from '../animations.js';
import { SPRINT_CONFIG } from '../metrics.js';

export function renderExecutiveView(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const evm = data.metrics.evm;

  // RAG Summary
  const ragSection = document.createElement('section');
  renderRAGSummary(ragSection, data);
  container.appendChild(ragSection);

  // KPI Cards
  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'stats-grid';

  const kpis = [
    { label: 'SPI', value: evm.spi, color: 'orange', suffix: '', decimals: true },
    { label: 'Schedule Variance', value: Math.abs(evm.scheduleVariance), color: evm.scheduleVariance >= 0 ? 'green' : 'red', suffix: ' days' },
    { label: 'Overall Progress', value: evm.overallProgress, color: 'blue', suffix: '%' },
    { label: 'Sprints Completed', value: evm.sprintsCompleted, color: 'purple', suffix: `/${SPRINT_CONFIG.length}` }
  ];

  kpis.forEach((kpi, index) => {
    const card = document.createElement('div');
    card.className = 'card stat-card';
    card.style.borderTop = `4px solid var(--accent-${kpi.color})`;
    card.innerHTML = `
      <span class="stat-label">${kpi.label}</span>
      <span class="stat-value text-${kpi.color}" data-target="${kpi.value}">0</span>
    `;
    kpiGrid.appendChild(card);
    fadeIn(card, index * 100);

    const valueEl = card.querySelector('.stat-value');
    if (kpi.decimals) {
      setTimeout(() => { valueEl.textContent = kpi.value; }, index * 100 + 200);
    } else {
      setTimeout(() => countUp(valueEl, kpi.value), index * 100 + 200);
    }
  });

  container.appendChild(kpiGrid);

  // Milestone Tracker
  const milestoneSection = document.createElement('section');
  const milestoneCard = document.createElement('div');
  milestoneCard.className = 'card';

  const completedSprints = data.metrics.sprints.filter(s => s.percentage === 100).length;
  const totalSprints = SPRINT_CONFIG.length;
  const milestonePercent = Math.round((completedSprints / totalSprints) * 100);

  // Find next milestone (next incomplete sprint)
  const nextSprint = data.metrics.sprints.find(s => s.percentage < 100);

  milestoneCard.innerHTML = `
    <h3 class="section-title">Milestone Progress</h3>
    <div class="milestone-info">
      <div class="milestone-stat">
        <span class="stat-value text-orange">${milestonePercent}%</span>
        <span class="stat-label">Project Completion</span>
      </div>
      <div class="milestone-next">
        <span class="text-secondary">Next Milestone:</span>
        <span>${nextSprint ? nextSprint.name : 'Project Complete'}</span>
        <span class="text-secondary">${nextSprint ? nextSprint.startDate + ' → ' + nextSprint.endDate : ''}</span>
      </div>
    </div>
    <div class="progress-bar" style="height:12px;">
      <div class="progress-fill orange" data-width="${milestonePercent}"></div>
    </div>
  `;

  milestoneSection.appendChild(milestoneCard);
  container.appendChild(milestoneSection);
  fadeIn(milestoneCard, 400);

  // Animate milestone bar
  setTimeout(() => {
    const bar = milestoneCard.querySelector('.progress-fill');
    if (bar) bar.style.width = `${milestonePercent}%`;
  }, 500);

  // Risks & Scope Changes
  const risksSection = document.createElement('section');
  renderRisks(risksSection, data);
  container.appendChild(risksSection);
}
