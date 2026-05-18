// Delivery View — integrates all delivery components
import { renderSprintTable } from '../components/sprint-table.js';
import { renderGantt } from '../components/gantt.js';
import { renderColumns } from '../components/columns.js';
import { renderBurndown } from '../components/burndown.js';
import { renderVelocity } from '../components/velocity.js';
import { renderCumulative } from '../components/cumulative.js';
import { renderEpics } from '../components/epics.js';
import { renderDonut } from '../components/donut.js';

export function renderDeliveryView(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  // Sprint Progress Table
  const sprintSection = document.createElement('section');
  renderSprintTable(sprintSection, data);
  container.appendChild(sprintSection);

  // Gantt Chart
  const ganttSection = document.createElement('section');
  renderGantt(ganttSection, data);
  container.appendChild(ganttSection);

  // 3 Columns (Done | Progress | Blocked)
  const columnsSection = document.createElement('section');
  renderColumns(columnsSection, data);
  container.appendChild(columnsSection);

  // Charts Grid (Burndown + Velocity)
  const chartsGrid1 = document.createElement('div');
  chartsGrid1.className = 'charts-grid';
  const burndownDiv = document.createElement('div');
  const velocityDiv = document.createElement('div');
  renderBurndown(burndownDiv, data);
  renderVelocity(velocityDiv, data);
  chartsGrid1.appendChild(burndownDiv);
  chartsGrid1.appendChild(velocityDiv);
  container.appendChild(chartsGrid1);

  // Charts Grid (Cumulative + Donut)
  const chartsGrid2 = document.createElement('div');
  chartsGrid2.className = 'charts-grid';
  const cumulativeDiv = document.createElement('div');
  const donutDiv = document.createElement('div');
  renderCumulative(cumulativeDiv, data);
  renderDonut(donutDiv, data);
  chartsGrid2.appendChild(cumulativeDiv);
  chartsGrid2.appendChild(donutDiv);
  container.appendChild(chartsGrid2);

  // Epic Progress
  const epicSection = document.createElement('section');
  renderEpics(epicSection, data);
  container.appendChild(epicSection);
}
