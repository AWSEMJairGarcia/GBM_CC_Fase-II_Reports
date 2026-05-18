// GDF30 checklist and DQI categories
import { staggerList } from '../animations.js';

const GDF30_ACTIVITIES = [
  'Kickoff Meeting', 'Stakeholder Mapping', 'Communication Plan',
  'Risk Assessment', 'Governance Model', 'Delivery Plan',
  'Quality Criteria', 'Escalation Path', 'Status Reporting',
  'Change Management', 'Knowledge Transfer Plan'
];

const DQI_CATEGORIES = [
  'Technical Expertise', 'Project Management', 'Ability to Deliver Results',
  'Communication', 'Availability', 'Ability to Deliver Securely', 'Customer Obsession'
];

export function renderGDF(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `
    <h3 class="section-title">GDF30 Adoption</h3>
    <div class="gdf-checklist">
      ${GDF30_ACTIVITIES.map(activity => `
        <div class="gdf-item">
          <span class="gdf-check">✓</span>
          <span>${activity}</span>
        </div>
      `).join('')}
    </div>
    <h3 class="section-title" style="margin-top:1.5rem;">DQI Categories</h3>
    <div class="dqi-grid">
      ${DQI_CATEGORIES.map(cat => `
        <div class="dqi-item card">
          <span class="dqi-label">${cat}</span>
          <div class="progress-bar"><div class="progress-fill orange" style="width:0%" data-width="85"></div></div>
        </div>
      `).join('')}
    </div>
  `;

  container.appendChild(wrapper);

  // Animate DQI bars
  setTimeout(() => {
    wrapper.querySelectorAll('.dqi-item .progress-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
  }, 300);

  staggerList(wrapper.querySelectorAll('.gdf-item'), 50);
}
