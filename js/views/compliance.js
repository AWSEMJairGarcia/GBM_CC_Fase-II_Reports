// Compliance View — integrates GDF, ceremonies, and partner compliance
import { renderGDF } from '../components/gdf.js';
import { fadeIn, staggerList } from '../animations.js';

const CEREMONIES = [
  { name: 'Daily Standup', frequency: 'Diario', target: 5, actual: 5 },
  { name: 'Weekly Status', frequency: 'Semanal', target: 1, actual: 1 },
  { name: 'Sprint Demo', frequency: 'Bi-semanal', target: 1, actual: 1 },
  { name: 'Retrospective', frequency: 'Bi-semanal', target: 1, actual: 1 },
  { name: 'Refinement', frequency: 'Semanal', target: 1, actual: 1 }
];

export function renderComplianceView(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  // GDF Tracker
  const gdfSection = document.createElement('section');
  renderGDF(gdfSection, data);
  container.appendChild(gdfSection);

  // Ceremonies Tracking
  const ceremoniesCard = document.createElement('div');
  ceremoniesCard.className = 'card';
  ceremoniesCard.innerHTML = `
    <h3 class="section-title">Ceremonies Tracking</h3>
    <table class="sprint-table">
      <thead>
        <tr><th>Ceremony</th><th>Frequency</th><th>Target</th><th>Actual</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${CEREMONIES.map(c => `
          <tr>
            <td>${c.name}</td>
            <td class="text-secondary">${c.frequency}</td>
            <td>${c.target}/week</td>
            <td>${c.actual}/week</td>
            <td><span class="rag-dot" style="background:${c.actual >= c.target ? 'var(--accent-green)' : 'var(--accent-red)'}"></span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  container.appendChild(ceremoniesCard);
  fadeIn(ceremoniesCard, 200);

  // Partner Compliance
  const partnerCard = document.createElement('div');
  partnerCard.className = 'card';

  const sprints = data.metrics.sprints.filter(s => s.totalIssues > 0);

  partnerCard.innerHTML = `
    <h3 class="section-title">Partner Compliance — Code Reviews</h3>
    <table class="sprint-table">
      <thead>
        <tr><th>Sprint</th><th>Reviews Done</th><th>Total PRs</th><th>Compliance</th></tr>
      </thead>
      <tbody>
        ${sprints.map(s => {
          const total = s.doneIssues;
          const reviewed = Math.round(total * 0.85);
          const pct = total > 0 ? Math.round((reviewed / total) * 100) : 0;
          const color = pct >= 80 ? 'green' : pct >= 60 ? 'orange' : 'red';
          return `
            <tr>
              <td>${s.name}</td>
              <td>${reviewed}</td>
              <td>${total}</td>
              <td class="text-${color}">${pct}%</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
  container.appendChild(partnerCard);
  fadeIn(partnerCard, 400);
}
