/**
 * Cumulative Flow Component — Stacked area chart (Done / In Progress / To Do)
 * Shows cumulative values across sprints with opacity 0.7.
 */

import { withTheme } from '../charts.js';

export function renderCumulative(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `<h3 class="section-title">Cumulative Flow</h3>`;

  const chartEl = document.createElement('div');
  chartEl.id = 'cumulative-chart';
  wrapper.appendChild(chartEl);
  container.appendChild(wrapper);

  const sprints = data.metrics.sprints.filter((s) => s.totalIssues > 0);
  const categories = sprints.map((s) => s.name.replace('Sprint ', 'S'));

  // Calculate cumulative values
  let cumDone = 0;
  let cumProgress = 0;
  let cumTodo = 0;

  const doneData = [];
  const progressData = [];
  const todoData = [];

  sprints.forEach((sprint) => {
    cumDone += sprint.doneIssues;
    cumProgress += sprint.inProgressIssues;
    const todoCount = sprint.totalIssues - sprint.doneIssues - sprint.inProgressIssues;
    cumTodo += Math.max(0, todoCount);

    doneData.push(cumDone);
    progressData.push(cumProgress);
    todoData.push(cumTodo);
  });

  const options = withTheme({
    chart: {
      type: 'area',
      height: 320,
      stacked: true,
      background: '#141414',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1500
      }
    },
    series: [
      { name: 'Done', data: doneData },
      { name: 'In Progress', data: progressData },
      { name: 'To Do', data: todoData }
    ],
    xaxis: {
      categories,
      labels: { style: { colors: '#e0e0e0', fontSize: '11px' } }
    },
    yaxis: {
      title: { text: 'Issues (acumulado)', style: { color: '#888' } },
      labels: { style: { colors: '#e0e0e0' } }
    },
    colors: ['#22c55e', '#FF9900', '#448AFF'],
    fill: {
      type: 'solid',
      opacity: 0.7
    },
    stroke: {
      width: 2,
      curve: 'smooth'
    },
    legend: {
      labels: { colors: '#e0e0e0' }
    },
    dataLabels: { enabled: false }
  });

  // eslint-disable-next-line no-undef
  const chart = new ApexCharts(chartEl, options);
  chart.render();
}
