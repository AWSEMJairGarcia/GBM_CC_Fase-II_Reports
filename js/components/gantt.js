/**
 * Gantt Component — ApexCharts rangeBar for sprint timeline
 * Color-coded by progress, highlights active sprint, shows today line.
 */

import { withTheme } from '../charts.js';

function getBarColor(percentage) {
  if (percentage >= 90) return '#22c55e';
  if (percentage >= 50) return '#FF9900';
  return '#ef4444';
}

function isActiveSprint(sprint) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(sprint.startDate + 'T00:00:00');
  const end = new Date(sprint.endDate + 'T23:59:59');
  return today >= start && today <= end;
}

export function renderGantt(container, data) {
  if (!container || !data) return;
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'card';
  wrapper.innerHTML = `<h3 class="section-title">Gantt de Sprints</h3>`;

  const chartEl = document.createElement('div');
  chartEl.id = 'gantt-chart';
  wrapper.appendChild(chartEl);
  container.appendChild(wrapper);

  const sprints = data.metrics.sprints;

  const seriesData = sprints.map((sprint) => ({
    x: sprint.name,
    y: [
      new Date(sprint.startDate + 'T00:00:00').getTime(),
      new Date(sprint.endDate + 'T23:59:59').getTime()
    ],
    fillColor: getBarColor(sprint.percentage),
    strokeColor: isActiveSprint(sprint) ? '#FF9900' : 'transparent',
    goals: isActiveSprint(sprint) ? [{ name: 'Active', value: 0, strokeColor: '#FF9900' }] : []
  }));

  const today = new Date().getTime();

  const options = withTheme({
    chart: {
      type: 'rangeBar',
      height: 420,
      background: '#141414'
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '60%',
        borderRadius: 4
      }
    },
    series: [{
      name: 'Sprint',
      data: seriesData
    }],
    xaxis: {
      type: 'datetime',
      labels: {
        style: { colors: '#e0e0e0', fontSize: '11px' },
        datetimeFormatter: { month: 'MMM', day: 'dd MMM' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#e0e0e0', fontSize: '11px' }
      }
    },
    annotations: {
      xaxis: [{
        x: today,
        borderColor: '#FF9900',
        strokeDashArray: 0,
        label: {
          text: 'Hoy',
          style: {
            color: '#0a0a0a',
            background: '#FF9900',
            fontSize: '11px'
          }
        }
      }]
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM yyyy' }
    },
    colors: ['#22c55e']
  });

  // eslint-disable-next-line no-undef
  const chart = new ApexCharts(chartEl, options);
  chart.render();
}
