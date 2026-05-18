// Data Service — dual-mode (live/static) with auto-refresh
import { calculateMetrics } from './metrics.js';

const CONFIG = {
  mode: 'static',
  proxyUrl: 'https://jira-proxy.gbm-cc.workers.dev',
  jiraUrl: 'https://gbmprojects.atlassian.net',
  refreshInterval: 300000,
  fallbackFile: 'data.json'
};

/**
 * Filters issues where the numeric part of the key >= 443.
 * Key format: "AC-XXX"
 */
export function filterIssues(issues) {
  if (!Array.isArray(issues)) return [];
  return issues.filter(issue => {
    const match = issue.key && issue.key.match(/^AC-(\d+)$/);
    if (!match) return false;
    return parseInt(match[1], 10) >= 443;
  });
}

export class DataService {
  constructor() {
    const savedMode = localStorage.getItem('dashboard-mode');
    if (savedMode === 'live' || savedMode === 'static') {
      CONFIG.mode = savedMode;
    }
    this._refreshCallbacks = [];
    this._intervalId = null;
  }

  getMode() {
    return CONFIG.mode;
  }

  onRefresh(callback) {
    if (typeof callback === 'function') {
      this._refreshCallbacks.push(callback);
    }
    if (CONFIG.mode === 'live' && !this._intervalId) {
      this.startAutoRefresh();
    }
  }

  startAutoRefresh() {
    if (this._intervalId) return;
    this._intervalId = setInterval(async () => {
      try {
        const data = await this.getData();
        this._refreshCallbacks.forEach(cb => cb(data));
      } catch (err) {
        console.warn('[DataService] Auto-refresh failed:', err.message);
      }
    }, CONFIG.refreshInterval);
  }

  stopAutoRefresh() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }

  async getData() {
    let issues;

    if (CONFIG.mode === 'live') {
      try {
        issues = await this.fetchLiveData();
      } catch (err) {
        console.warn('[DataService] Live mode failed, falling back to static:', err.message);
        CONFIG.mode = 'static';
        issues = await this.fetchStaticData();
      }
    } else {
      issues = await this.fetchStaticData();
    }

    const filtered = filterIssues(issues);
    const metrics = calculateMetrics(filtered);

    return { issues: filtered, metrics };
  }

  async fetchStaticData() {
    // Try fetch first (works on HTTP servers like GitHub Pages)
    // Falls back to importing JS module (works on file:// protocol)
    try {
      const response = await fetch(CONFIG.fallbackFile);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!data.issues || !Array.isArray(data.issues)) {
        throw new Error(`${CONFIG.fallbackFile} is missing a valid "issues" array`);
      }
      return data.issues;
    } catch (fetchErr) {
      // Fallback for file:// protocol — try importing as JS module
      console.warn(`[DataService] fetch failed (${fetchErr.message}), trying module import...`);
      try {
        const module = await import('../data.js');
        if (module.default && Array.isArray(module.default.issues)) {
          return module.default.issues;
        }
        throw new Error('data.js module missing issues array');
      } catch (importErr) {
        throw new Error(`Cannot load data: fetch failed (${fetchErr.message}) and module import failed (${importErr.message}). Use a local server or generate data.js.`);
      }
    }
  }

  async fetchLiveData() {
    const email = localStorage.getItem('jira-email');
    const token = localStorage.getItem('jira-token');

    if (!email || !token) {
      throw new Error('Jira credentials not configured in localStorage (jira-email, jira-token)');
    }

    const jql = 'project = AC AND key >= AC-443 ORDER BY key ASC';
    const fields = 'key,summary,status,labels,parent,assignee,created,updated,resolutiondate';
    const maxResults = 200;

    const jiraApiUrl = `${CONFIG.jiraUrl}/rest/api/3/search?jql=${encodeURIComponent(jql)}&fields=${fields}&maxResults=${maxResults}`;
    const proxyRequestUrl = `${CONFIG.proxyUrl}?url=${encodeURIComponent(jiraApiUrl)}`;

    const authHeader = 'Basic ' + btoa(email + ':' + token);

    let response;
    try {
      response = await fetch(proxyRequestUrl, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      throw new Error(`CORS Proxy unreachable: ${err.message}`);
    }

    if (!response.ok) {
      throw new Error(`Jira API error: HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.issues || !Array.isArray(data.issues)) {
      throw new Error('Jira response missing "issues" array');
    }

    return data.issues;
  }
}
