/**
 * Burndown Component — Line chart with ideal (dashed) and real (solid) lines
 * Dropdown to select sprint, stroke animation enabled, dark theme.
 */

import { withTheme } from '../charts.js';

function getStatusCategoryKey(issue) {
  return issue.fields?.status?.statusCategory?.key || '';
}

function getLabels(issue) {
  return issue.fields?.labels || [];
}

function calculateBurndown(issues, sprint) {
  const sprintIssues = issues.filter((i) => getLabels(i).includes(sprint.label));
  const total = sprintIssues.length;
  if (total === 0) return { ideal: [], real: [], categories: [] };

  const start = new Date(sprint.startDate + 'T00:00:00');
  const end = new Date(sprint.endDate + 'T23:59:59');
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const categories = [];
  const ideal = [];
  const real = [];

  for (let d = 0; d < days; d++) {
    const currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + d);
    categories.push(currentDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }));

    // Ideal: straight line from total to 0
    ideal.push(Math.round(total - (total * d / (days - 1))));

    // Real: count issues not yet resolved by this date
    const remaining = sprintIssues.filter((issue) => {
      const resDate = issue.fields?.resolutiondate || issue.fields?.updated;
      if (getStatusCategoryKey(issue) !== 'done') return true;
      if (!resDate) return true;
      return new Date(resDate) > currentDate;
    }).length;
    real.push(remaining);
  }

  return { ideal, real, categories };
}

export function renderBurndown(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';

  const header = document.createElement('div');
  header.className = 'chart-header';
  header.innerHTML = `<h3 class="section-title">Burndown Chart</h3>`;

  // Sprint selector dropdown
  const select = document.createElement('select');
  select.className = 'chart-select';
  const sprints = data.metrics.sprints;

  sprints.forEach((sprint, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = sprint.name;
    if (sprint.totalIssues > 0 && sprint.percentage < 100) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  // Default to first sprint with issues if none selected
  if (!select.querySelector('[selected]') && sprints.length > 0) {
    select.selectedIndex = 0;
  }

  header.appendChild(select);
  wrapper.appendChild(header);

  const chartEl = document.createElement('div');
  chartEl.id = 'burndown-chart';
  wrapper.appendChild(chartEl);
  container.appendChild(wrapper);

  let chart = null;

  function renderChart(sprintIndex) {
    const sprint = sprints[sprintIndex];
    const { ideal, real, categories } = calculateBurndown(data.issues || [], sprint);

    const options = withTheme({
      chart: {
        type: 'line',
        height: 320,
        background: '#141414',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 1500
        }
      },
      series: [
        { name: 'Ideal', data: ideal },
        { name: 'Real', data: real }
      ],
      xaxis: {
        categories,
        labels: { style: { colors: '#e0e0e0', fontSize: '11px' } }
      },
      yaxis: {
        title: { text: 'Issues Pendientes', style: { color: '#888' } },
        labels: { style: { colors: '#e0e0e0' } }
      },
      stroke: {
        width: [2, 3],
        dashArray: [5, 0],
        curve: 'smooth'
      },
      colors: ['#888', '#FF9900'],
      legend: {
        labels: { colors: '#e0e0e0' }
      }
    });

    if (chart) {
      chart.updateOptions(options);
    } else {
      // eslint-disable-next-line no-undef
      chart = new ApexCharts(chartEl, options);
      chart.render();
    }
  }

  // Initial render
  renderChart(parseInt(select.value, 10));

  // Update on selection change
  select.addEventListener('change', () => {
    renderChart(parseInt(select.value, 10));
  });
}
