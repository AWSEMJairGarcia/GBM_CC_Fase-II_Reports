// App Entry Point — SPA Router and Initialization
import { DataService } from './data-service.js';
import { renderDeliveryView } from './views/delivery.js';
import { renderExecutiveView } from './views/executive.js';
import { renderComplianceView } from './views/compliance.js';
import { renderHeader } from './components/header.js';

const VIEWS = {
  delivery: renderDeliveryView,
  executive: renderExecutiveView,
  compliance: renderComplianceView
};

let currentView = 'delivery';
let appData = null;

function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      if (view === currentView) return;

      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentView = view;
      localStorage.setItem('dashboard-view', view);
      renderCurrentView();
    });
  });

  // Restore last view from localStorage
  const savedView = localStorage.getItem('dashboard-view');
  if (savedView && VIEWS[savedView]) {
    currentView = savedView;
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === currentView);
    });
  }
}

function renderCurrentView() {
  const container = document.getElementById('view-container');
  if (!container || !appData) return;

  container.innerHTML = '';
  const renderFn = VIEWS[currentView];
  if (renderFn) {
    renderFn(container, appData);
  }
}

function updateLastUpdated(mode) {
  const el = document.getElementById('last-updated');
  if (!el) return;

  const now = new Date();
  const timeStr = now.toLocaleString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const modeLabel = mode === 'live' ? '🟢 Live' : '🔵 Static';
  el.innerHTML = `<span>${modeLabel}</span><br><span>${timeStr}</span>`;
}

async function init() {
  initNavigation();

  try {
    const dataService = new DataService();
    appData = await dataService.getData();

    updateLastUpdated(dataService.getMode());
    renderHeader(document.getElementById('stats-grid'), appData);
    renderCurrentView();

    // Auto-refresh listener
    dataService.onRefresh((newData) => {
      appData = newData;
      updateLastUpdated(dataService.getMode());
      renderHeader(document.getElementById('stats-grid'), appData);
      renderCurrentView();
    });
  } catch (error) {
    console.error('Failed to initialize dashboard:', error);
    const container = document.getElementById('view-container');
    if (container) {
      container.innerHTML = `<div class="card"><p class="text-red">Error loading data: ${error.message}</p></div>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
