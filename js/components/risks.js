// Scope changes and risk register
import { staggerList } from '../animations.js';

export function renderRisks(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const issues = data.issues || [];

  // Scope Changes — issues with label 'change-request'
  const scopeChanges = issues.filter(i => (i.fields?.labels || []).includes('change-request'));

  // Risk Register — blocked issues sorted by days blocked
  const blocked = issues.filter(i => {
    const labels = i.fields?.labels || [];
    const status = (i.fields?.status?.name || '').toLowerCase();
    return labels.includes('blocker') || status.includes('block');
  }).map(i => {
    const updated = i.fields?.updated;
    const daysBlocked = updated ? Math.floor((Date.now() - new Date(updated).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    return { ...i, daysBlocked };
  }).sort((a, b) => b.daysBlocked - a.daysBlocked);

  const wrapper = document.createElement('div');
  wrapper.className = 'card';

  wrapper.innerHTML = `
    <h3 class="section-title">Scope Changes & Risks</h3>
    <div class="risks-section">
      <h4 class="text-orange">Change Requests (${scopeChanges.length})</h4>
      <ul class="risk-list">
        ${scopeChanges.length === 0 ? '<li class="text-secondary">No change requests</li>' :
          scopeChanges.map(i => `
            <li class="risk-item">
              <span class="item-key">${i.key}</span>
              <span class="item-summary">${i.fields?.summary || ''}</span>
              <span class="item-meta text-secondary">${i.fields?.status?.name || ''}</span>
            </li>
          `).join('')}
      </ul>
    </div>
    <div class="risks-section">
      <h4 class="text-red">Active Risks (${blocked.length})</h4>
      <ul class="risk-list">
        ${blocked.length === 0 ? '<li class="text-secondary">No active risks</li>' :
          blocked.map(i => {
            const impact = i.daysBlocked > 5 ? 'red' : i.daysBlocked > 2 ? 'orange' : 'green';
            return `
              <li class="risk-item">
                <span class="risk-severity text-${impact}">●</span>
                <span class="item-key">${i.key}</span>
                <span class="item-summary">${i.fields?.summary || ''}</span>
                <span class="item-meta text-secondary">${i.daysBlocked}d blocked</span>
              </li>
            `;
          }).join('')}
      </ul>
    </div>
  `;

  container.appendChild(wrapper);
  staggerList(wrapper.querySelectorAll('.risk-item'), 50);
}
