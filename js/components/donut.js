/**
 * Donut Component — ApexCharts donut chart showing status distribution
 * 3 segments: Done (green), In Progress (orange), To Do (blue)
 * Total in center, radial expansion animation, dark theme.
 */

import { withTheme } from '../charts.js';

export function renderDonut(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `<h3 class="section-title">Distribución de Status</h3>`;

  const chartEl = document.createElement('div');
  chartEl.id = 'donut-chart';
  wrapper.appendChild(chartEl);
  container.appendChild(wrapper);

  const { doneIssues, inProgressIssues, todoIssues, totalIssues } = data.metrics.summary;

  const options = withTheme({
    chart: {
      type: 'donut',
      height: 320,
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: { enabled: true, delay: 200 }
      }
    },
    series: [doneIssues, inProgressIssues, todoIssues],
    labels: ['Done', 'In Progress', 'To Do'],
    colors: ['#22c55e', '#FF9900', '#448AFF'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: { show: true, color: '#e0e0e0' },
            value: { show: true, color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 700 },
            total: {
              show: true,
              label: 'Total',
              color: '#888',
              fontSize: '0.875rem',
              formatter: () => totalIssues
            }
          }
        },
        expandOnClick: true
      }
    },
    stroke: {
      width: 2,
      colors: ['#141414']
    },
    legend: {
      position: 'bottom',
      labels: { colors: '#e0e0e0' }
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: '12px', colors: ['#e0e0e0'] },
      dropShadow: { enabled: false }
    }
  });

  // eslint-disable-next-line no-undef
  const chart = new ApexCharts(chartEl, options);
  chart.render();
}
