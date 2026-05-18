/**
 * Velocity Component — Bar chart showing done vs committed per sprint
 * Includes horizontal average velocity line.
 */

import { withTheme } from '../charts.js';

export function renderVelocity(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `<h3 class="section-title">Velocity</h3>`;

  const chartEl = document.createElement('div');
  chartEl.id = 'velocity-chart';
  wrapper.appendChild(chartEl);
  container.appendChild(wrapper);

  const sprints = data.metrics.sprints.filter((s) => s.totalIssues > 0);
  const categories = sprints.map((s) => s.name.replace('Sprint ', 'S'));
  const doneValues = sprints.map((s) => s.doneIssues);
  const committedValues = sprints.map((s) => s.totalIssues);

  // Average velocity (done issues)
  const avgVelocity = doneValues.length > 0
    ? Math.round(doneValues.reduce((a, b) => a + b, 0) / doneValues.length)
    : 0;

  const options = withTheme({
    chart: {
      type: 'bar',
      height: 320,
      background: '#141414',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000
      }
    },
    series: [
      { name: 'Completados', data: doneValues },
      { name: 'Comprometidos', data: committedValues }
    ],
    xaxis: {
      categories,
      labels: { style: { colors: '#e0e0e0', fontSize: '11px' } }
    },
    yaxis: {
      title: { text: 'Issues', style: { color: '#888' } },
      labels: { style: { colors: '#e0e0e0' } }
    },
    colors: ['#22c55e', '#B388FF'],
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    annotations: {
      yaxis: [{
        y: avgVelocity,
        borderColor: '#448AFF',
        strokeDashArray: 4,
        label: {
          text: `Promedio: ${avgVelocity}`,
          style: {
            color: '#0a0a0a',
            background: '#448AFF',
            fontSize: '11px'
          }
        }
      }]
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
