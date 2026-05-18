// RAG indicators with classification logic
import { fadeIn } from '../animations.js';

export function getRAGColor(status) {
  const map = { green: 'var(--accent-green)', amber: 'var(--accent-orange)', red: 'var(--accent-red)' };
  return map[status] || map.amber;
}

export function renderRAGSummary(container, data) {
  if (!container || !data) return;

  const evm = data.metrics.evm;
  const wrapper = document.createElement('div');
  wrapper.className = 'card rag-card';
  wrapper.style.borderLeft = `4px solid ${getRAGColor(evm.ragOverall)}`;

  const statusText = { green: 'On Track', amber: 'At Risk', red: 'Off Track' };

  wrapper.innerHTML = `
    <div class="rag-header">
      <span class="rag-indicator" style="background:${getRAGColor(evm.ragOverall)};"></span>
      <h3>Project Status: ${statusText[evm.ragOverall] || 'Unknown'}</h3>
    </div>
    <div class="rag-details">
      <span>Schedule Variance: ${evm.scheduleVariance > 0 ? '+' : ''}${evm.scheduleVariance} days</span>
      <span>SPI: ${evm.spi}</span>
      <span>Progress: ${evm.overallProgress}%</span>
    </div>
  `;

  container.appendChild(wrapper);
  fadeIn(wrapper);
}
