/**
 * Charts Module — ApexCharts global theme and configuration
 * Dark theme with animations enabled for all chart types.
 */

export const CHART_THEME = {
  chart: {
    background: '#141414',
    foreColor: '#e0e0e0',
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 1000,
      animateGradually: { enabled: true, delay: 150 }
    },
    toolbar: { show: false }
  },
  grid: {
    borderColor: '#222',
    strokeDashArray: 3
  },
  tooltip: {
    theme: 'dark',
    style: { fontSize: '12px' }
  },
  colors: ['#22c55e', '#FF9900', '#448AFF', '#B388FF', '#ef4444', '#18FFFF']
};

/**
 * Merge user options with the global dark theme.
 * @param {object} options - ApexCharts options to merge
 * @returns {object} Merged options with theme applied
 */
export function withTheme(options) {
  return {
    ...options,
    chart: {
      ...CHART_THEME.chart,
      ...(options.chart || {})
    },
    grid: {
      ...CHART_THEME.grid,
      ...(options.grid || {})
    },
    tooltip: {
      ...CHART_THEME.tooltip,
      ...(options.tooltip || {})
    }
  };
}
