// State
let allLeads = [];
let currentLeadForOutreach = null;
let currentCampaign = 'Caprae M&A / Growth Acceleration';
let activeView = 'table'; // 'table' | 'card'

// DOM Elements
const leadsTableBody = document.getElementById('leadsTableBody');
const leadsCardsContainer = document.getElementById('leadsCardsContainer');
const leadsTableContainer = document.getElementById('leadsTableContainer');
const resultsCount = document.getElementById('resultsCount');
const totalLeadsCount = document.getElementById('totalLeadsCount');
const highScoreCount = document.getElementById('highScoreCount');
const healthStatusText = document.getElementById('healthStatusText');
const memoryMetric = document.getElementById('memoryMetric');

const searchInput = document.getElementById('searchInput');
const industryFilter = document.getElementById('industryFilter');
const scoreFilter = document.getElementById('scoreFilter');
const statusFilter = document.getElementById('statusFilter');

const tableViewBtn = document.getElementById('tableViewBtn');
const cardViewBtn = document.getElementById('cardViewBtn');

const scrapeForm = document.getElementById('scrapeForm');
const targetUrlInput = document.getElementById('targetUrlInput');
const scrapeSubmitBtn = document.getElementById('scrapeSubmitBtn');
const pipelineProgress = document.getElementById('pipelineProgress');

// Modals
const outreachModal = document.getElementById('outreachModal');
const closeOutreachModal = document.getElementById('closeOutreachModal');
const cancelOutreachBtn = document.getElementById('cancelOutreachBtn');
const deepLeadModal = document.getElementById('deepLeadModal');
const closeDeepModal = document.getElementById('closeDeepModal');
const archModal = document.getElementById('archModal');
const openArchModalBtn = document.getElementById('openArchModalBtn');
const closeArchModal = document.getElementById('closeArchModal');
const closeArchModalBtn = document.getElementById('closeArchModalBtn');

const weightsModal = document.getElementById('weightsModal');
const openWeightsModalBtn = document.getElementById('openWeightsModalBtn');
const closeWeightsModal = document.getElementById('closeWeightsModal');
const resetWeightsBtn = document.getElementById('resetWeightsBtn');
const saveWeightsBtn = document.getElementById('saveWeightsBtn');

const batchModal = document.getElementById('batchModal');
const openBatchModalBtn = document.getElementById('openBatchModalBtn');
const closeBatchModal = document.getElementById('closeBatchModal');
const cancelBatchBtn = document.getElementById('cancelBatchBtn');
const startBatchBtn = document.getElementById('startBatchBtn');
const batchDomainsInput = document.getElementById('batchDomainsInput');

// Export Dropdown
const exportMainBtn = document.getElementById('exportMainBtn');
const exportMenu = document.getElementById('exportMenu');

const syncCrmBtn = document.getElementById('syncCrmBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  fetchLeads();
  fetchHealth();
  fetchWeights();
  setupEventListeners();
});

// Setup Listeners
function setupEventListeners() {
  // Filters (with debounce for search input)
  let searchDebounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(renderLeads, 150);
  });
  industryFilter.addEventListener('change', renderLeads);
  scoreFilter.addEventListener('change', renderLeads);
  statusFilter.addEventListener('change', renderLeads);

  // View Switcher
  tableViewBtn.addEventListener('click', () => switchView('table'));
  cardViewBtn.addEventListener('click', () => switchView('card'));

  // Preset Pills
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      targetUrlInput.value = btn.dataset.url;
      scrapeForm.dispatchEvent(new Event('submit'));
    });
  });

  // Scrape Form Submit
  scrapeForm.addEventListener('submit', handleScrapeSubmit);

  // Modal Controls
  closeOutreachModal.addEventListener('click', () => outreachModal.style.display = 'none');
  cancelOutreachBtn.addEventListener('click', () => outreachModal.style.display = 'none');
  closeDeepModal.addEventListener('click', () => deepLeadModal.style.display = 'none');
  
  openArchModalBtn.addEventListener('click', () => archModal.style.display = 'flex');
  closeArchModal.addEventListener('click', () => archModal.style.display = 'none');
  closeArchModalBtn.addEventListener('click', () => archModal.style.display = 'none');

  openWeightsModalBtn.addEventListener('click', () => weightsModal.style.display = 'flex');
  closeWeightsModal.addEventListener('click', () => weightsModal.style.display = 'none');

  openBatchModalBtn.addEventListener('click', () => batchModal.style.display = 'flex');
  closeBatchModal.addEventListener('click', () => batchModal.style.display = 'none');
  cancelBatchBtn.addEventListener('click', () => batchModal.style.display = 'none');
  startBatchBtn.addEventListener('click', handleBatchScrape);

  // Close modals when clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target === outreachModal) outreachModal.style.display = 'none';
    if (e.target === deepLeadModal) deepLeadModal.style.display = 'none';
    if (e.target === archModal) archModal.style.display = 'none';
    if (e.target === weightsModal) weightsModal.style.display = 'none';
    if (e.target === batchModal) batchModal.style.display = 'none';
    if (!e.target.closest('.export-dropdown-wrapper')) {
      exportMenu.style.display = 'none';
    }
  });

  // Export Dropdown
  exportMainBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    exportMenu.style.display = exportMenu.style.display === 'none' ? 'flex' : 'none';
  });

  document.querySelectorAll('.export-item').forEach(item => {
    item.addEventListener('click', () => {
      const format = item.dataset.format;
      window.location.href = `/api/export/csv?format=${format}`;
      showToast(`Exporting ${item.textContent}...`);
      exportMenu.style.display = 'none';
    });
  });

  // Sliders for Weights
  setupWeightSliders();

  // Campaign Selector Chips in Outreach Modal
  document.querySelectorAll('.campaign-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.campaign-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentCampaign = chip.dataset.campaign;
      generateOutreachContent(currentLeadForOutreach);
    });
  });

  // Tabs in Outreach Modal
  document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.style.display = 'block';
    });
  });

  // Copy Buttons
  setupCopyButton('copySubjectBtn', 'emailSubjectInput', 'Subject line copied!');
  setupCopyButton('copyBodyBtn', 'emailBodyInput', 'Email body copied!');
  setupCopyButton('copyLinkedinBtn', 'linkedinBodyInput', 'LinkedIn pitch copied!');
  setupCopyButton('copyFollowupSubjectBtn', 'followupSubjectInput', 'Follow-up subject copied!');
  setupCopyButton('copyFollowupBodyBtn', 'followupBodyInput', 'Follow-up body copied!');

  // Outreach Dispatch Simulation
  document.getElementById('sendOutreachSimBtn').addEventListener('click', () => {
    if (currentLeadForOutreach) {
      currentLeadForOutreach.status = 'Outreach Generated';
      renderLeads();
      outreachModal.style.display = 'none';
      showToast(`Outreach sequence queued for ${currentLeadForOutreach.name}`);
    }
  });

  // CRM Webhook Sync Simulation
  syncCrmBtn.addEventListener('click', handleCrmSync);
}

// Fetch Leads from Backend
async function fetchLeads() {
  try {
    const res = await fetch('/api/leads');
    const data = await res.json();
    allLeads = data.leads || [];
    updateMetrics();
    renderLeads();
  } catch (err) {
    console.error('Error fetching leads:', err);
    showToast('Failed to load initial leads data', 'error');
  }
}

// Fetch System Health
async function fetchHealth() {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    if (data.status === 'healthy') {
      healthStatusText.textContent = `API Connected (Uptime: ${data.uptimeSeconds}s)`;
      memoryMetric.textContent = `Memory: ${data.memoryUsageMB}MB | Cache: ${data.cacheEntries}`;
    }
  } catch (e) {
    healthStatusText.textContent = 'API Offline';
  }
}

// Fetch Weights
async function fetchWeights() {
  try {
    const res = await fetch('/api/scoring/weights');
    const w = await res.json();
    document.getElementById('techWeightSlider').value = w.techWeight;
    document.getElementById('techWeightVal').textContent = w.techWeight + '%';
    document.getElementById('verticalWeightSlider').value = w.verticalWeight;
    document.getElementById('verticalWeightVal').textContent = w.verticalWeight + '%';
    document.getElementById('growthWeightSlider').value = w.growthWeight;
    document.getElementById('growthWeightVal').textContent = w.growthWeight + '%';
    document.getElementById('sizeWeightSlider').value = w.sizeWeight;
    document.getElementById('sizeWeightVal').textContent = w.sizeWeight + '%';
  } catch (e) {}
}

function setupWeightSliders() {
  const sliders = [
    { id: 'techWeightSlider', valId: 'techWeightVal' },
    { id: 'verticalWeightSlider', valId: 'verticalWeightVal' },
    { id: 'growthWeightSlider', valId: 'growthWeightVal' },
    { id: 'sizeWeightSlider', valId: 'sizeWeightVal' }
  ];

  sliders.forEach(s => {
    const slider = document.getElementById(s.id);
    const val = document.getElementById(s.valId);
    slider.addEventListener('input', () => {
      val.textContent = slider.value + '%';
    });
  });

  saveWeightsBtn.addEventListener('click', async () => {
    const newWeights = {
      techWeight: parseInt(document.getElementById('techWeightSlider').value, 10),
      verticalWeight: parseInt(document.getElementById('verticalWeightSlider').value, 10),
      growthWeight: parseInt(document.getElementById('growthWeightSlider').value, 10),
      sizeWeight: parseInt(document.getElementById('sizeWeightSlider').value, 10)
    };

    try {
      const res = await fetch('/api/scoring/weights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWeights)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        weightsModal.style.display = 'none';
        fetchLeads();
      }
    } catch (e) {
      showToast('Failed to update weights', 'error');
    }
  });

  resetWeightsBtn.addEventListener('click', () => {
    ['techWeightSlider', 'verticalWeightSlider', 'growthWeightSlider', 'sizeWeightSlider'].forEach(id => {
      document.getElementById(id).value = 25;
    });
    ['techWeightVal', 'verticalWeightVal', 'growthWeightVal', 'sizeWeightVal'].forEach(id => {
      document.getElementById(id).textContent = '25%';
    });
  });
}

// Update Top Metrics
function updateMetrics() {
  totalLeadsCount.textContent = allLeads.length;
  const highScores = allLeads.filter(l => l.score >= 90).length;
  highScoreCount.textContent = highScores;
}

// Switch Table vs Card View
function switchView(view) {
  activeView = view;
  if (view === 'table') {
    tableViewBtn.classList.add('active');
    cardViewBtn.classList.remove('active');
    leadsTableContainer.style.display = 'block';
    leadsCardsContainer.style.display = 'none';
  } else {
    cardViewBtn.classList.add('active');
    tableViewBtn.classList.remove('active');
    leadsTableContainer.style.display = 'none';
    leadsCardsContainer.style.display = 'grid';
  }
  renderLeads();
}

// Render Leads based on Filters & Search
function renderLeads() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const selectedIndustry = industryFilter.value;
  const minScore = parseInt(scoreFilter.value, 10);
  const selectedStatus = statusFilter.value;

  const filtered = allLeads.filter(lead => {
    const matchesSearch = !searchTerm || 
      (lead.name && lead.name.toLowerCase().includes(searchTerm)) ||
      (lead.domain && lead.domain.toLowerCase().includes(searchTerm)) ||
      (lead.industry && lead.industry.toLowerCase().includes(searchTerm)) ||
      (lead.techStack && lead.techStack.some(t => t.toLowerCase().includes(searchTerm))) ||
      (lead.decisionMaker && lead.decisionMaker.name.toLowerCase().includes(searchTerm));

    const matchesIndustry = selectedIndustry === 'All' || (lead.industry && lead.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));
    const matchesScore = !minScore || lead.score >= minScore;
    const matchesStatus = selectedStatus === 'All' || lead.status === selectedStatus;

    return matchesSearch && matchesIndustry && matchesScore && matchesStatus;
  });

  resultsCount.textContent = `Showing ${filtered.length} Lead${filtered.length === 1 ? '' : 's'}`;

  if (activeView === 'table') {
    renderTableView(filtered);
  } else {
    renderCardView(filtered);
  }
}

// Render Table Rows
function renderTableView(leads) {
  if (!leads.length) {
    leadsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">No matching leads found. Try adjusting your search filters or extract a new domain.</td></tr>`;
    return;
  }

  leadsTableBody.innerHTML = leads.map(lead => {
    const scoreClass = lead.score >= 90 ? 'high' : lead.score >= 80 ? 'mid' : 'low';
    const statusClass = (lead.status || 'new').toLowerCase().replace(/\s+/g, '-');
    const techBadges = (lead.techStack || []).slice(0, 3).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');
    const techCountMore = (lead.techStack && lead.techStack.length > 3) ? `<span class="tech-tag">+${lead.techStack.length - 3}</span>` : '';

    return `
      <tr>
        <td>
          <div class="company-cell">
            <div class="company-avatar">${escapeHtml(lead.name ? lead.name.charAt(0) : 'C')}</div>
            <div class="company-meta">
              <span class="company-name">${escapeHtml(lead.name || lead.domain)}</span>
              <a href="${escapeHtml(lead.website || 'https://' + lead.domain)}" target="_blank" class="company-domain">${escapeHtml(lead.domain)} ↗</a>
            </div>
          </div>
        </td>
        <td>
          <span class="score-badge ${scoreClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            ${lead.score}/100
          </span>
        </td>
        <td>
          <div style="display: flex; flex-direction: column;">
            <span style="font-weight: 600; color: var(--text-primary); font-size: 0.82rem;">${escapeHtml(lead.industry || 'B2B Tech')}</span>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(lead.arrRange || '$2M - $5M')} • ${lead.employees || 25} team</span>
          </div>
        </td>
        <td>
          <div class="tech-pills-list">
            ${techBadges}
            ${techCountMore}
          </div>
        </td>
        <td>
          <div class="dm-cell">
            <span class="dm-name">${escapeHtml(lead.decisionMaker ? lead.decisionMaker.name : 'Key Decision Maker')}</span>
            <span class="dm-email" title="${escapeHtml(lead.decisionMaker ? lead.decisionMaker.emailStatus : 'Verified')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              ${escapeHtml(lead.decisionMaker ? lead.decisionMaker.email : 'contact@' + lead.domain)}
            </span>
          </div>
        </td>
        <td>
          <span class="status-tag status-${statusClass}">${escapeHtml(lead.status || 'New')}</span>
        </td>
        <td>
          <div class="action-btn-group">
            <button class="btn-outreach-trigger" onclick="openOutreachModalForLead('${lead.id}')">
              ✨ AI Outreach
            </button>
            <button class="btn-icon" title="Enrich Lead" onclick="enrichLeadAction('${lead.id}')">
              ⚡
            </button>
            <button class="btn-icon" title="View Full Intelligence" onclick="openDeepLeadModal('${lead.id}')">
              👁️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Card Grid View
function renderCardView(leads) {
  if (!leads.length) {
    leadsCardsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">No matching leads found.</div>`;
    return;
  }

  leadsCardsContainer.innerHTML = leads.map(lead => {
    const scoreClass = lead.score >= 90 ? 'high' : lead.score >= 80 ? 'mid' : 'low';
    const techBadges = (lead.techStack || []).slice(0, 4).map(t => `<span class="tech-tag">${escapeHtml(t)}</span>`).join('');

    return `
      <div class="lead-card">
        <div class="lead-card-header">
          <div class="company-cell">
            <div class="company-avatar">${escapeHtml(lead.name ? lead.name.charAt(0) : 'C')}</div>
            <div class="company-meta">
              <span class="company-name">${escapeHtml(lead.name || lead.domain)}</span>
              <span class="company-domain">${escapeHtml(lead.domain)}</span>
            </div>
          </div>
          <span class="score-badge ${scoreClass}">${lead.score}/100</span>
        </div>

        <div class="lead-card-body">
          <div class="card-info-row">
            <span>Industry / Vertical:</span>
            <strong style="color: var(--text-primary);">${escapeHtml(lead.industry || 'B2B Tech')}</strong>
          </div>
          <div class="card-info-row">
            <span>Est. Revenue & Size:</span>
            <span>${escapeHtml(lead.arrRange || '$2M-$5M')} • ${lead.employees || 25} emp (${escapeHtml(lead.growthRate || '+20%')})</span>
          </div>
          <div class="card-info-row">
            <span>Decision Maker:</span>
            <span>${escapeHtml(lead.decisionMaker ? lead.decisionMaker.name : 'Executive')} (${escapeHtml(lead.decisionMaker ? lead.decisionMaker.title.split('&')[0] : 'Leader')})</span>
          </div>
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-bottom: 6px;">DETECTED TECH STACK:</div>
            <div class="tech-pills-list">${techBadges}</div>
          </div>
        </div>

        <div class="lead-card-footer">
          <button class="btn-icon" title="View Full Intelligence" onclick="openDeepLeadModal('${lead.id}')">
            👁️ Details
          </button>
          <button class="btn-outreach-trigger" onclick="openOutreachModalForLead('${lead.id}')">
            ✨ Generate AI Outreach
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Scrape Single Domain
async function handleScrapeSubmit(e) {
  e.preventDefault();
  const url = targetUrlInput.value.trim();
  if (!url) return;

  pipelineProgress.style.display = 'flex';
  scrapeSubmitBtn.disabled = true;
  resetProgressSteps();

  animateProgressStep('step1');

  try {
    setTimeout(() => animateProgressStep('step2'), 400);
    setTimeout(() => animateProgressStep('step3'), 800);
    setTimeout(() => animateProgressStep('step4'), 1200);

    const res = await fetch('/api/scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    if (res.ok && data.lead) {
      setTimeout(() => {
        completeAllProgressSteps();
        showToast(data.message || `Successfully scraped & enriched ${data.lead.name}`);
        targetUrlInput.value = '';
        fetchLeads();
        fetchHealth();
        setTimeout(() => {
          pipelineProgress.style.display = 'none';
          scrapeSubmitBtn.disabled = false;
        }, 1000);
      }, 1400);
    } else {
      throw new Error(data.error || 'Scraping failed');
    }
  } catch (err) {
    console.error(err);
    pipelineProgress.style.display = 'none';
    scrapeSubmitBtn.disabled = false;
    showToast(err.message || 'Scraping request failed', 'error');
  }
}

// Batch Scrape Handler
async function handleBatchScrape() {
  const rawText = batchDomainsInput.value.trim();
  if (!rawText) {
    showToast('Please enter at least one domain for batch processing', 'error');
    return;
  }

  const urls = rawText.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
  if (!urls.length) return;

  startBatchBtn.disabled = true;
  startBatchBtn.textContent = 'Processing Batch...';

  try {
    const res = await fetch('/api/scrape/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls })
    });

    const data = await res.json();
    if (res.ok) {
      showToast(data.message || `Processed ${data.processedCount} domains`);
      batchModal.style.display = 'none';
      batchDomainsInput.value = '';
      fetchLeads();
      fetchHealth();
    } else {
      throw new Error(data.error || 'Batch processing failed');
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    startBatchBtn.disabled = false;
    startBatchBtn.textContent = 'Start Batch Extraction';
  }
}

function resetProgressSteps() {
  ['step1', 'step2', 'step3', 'step4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'step-item';
  });
}

function animateProgressStep(stepId) {
  const el = document.getElementById(stepId);
  if (el) el.className = 'step-item step-active';
}

function completeAllProgressSteps() {
  ['step1', 'step2', 'step3', 'step4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'step-item step-done';
  });
}

// AI Outreach Generation Modal
window.openOutreachModalForLead = function(leadId) {
  const lead = allLeads.find(l => l.id === leadId);
  if (!lead) return;

  currentLeadForOutreach = lead;
  document.getElementById('outreachModalTitle').textContent = `AI Outreach Engine: ${lead.name}`;
  document.getElementById('outreachModalSubtitle').textContent = `Tailoring messaging for ${lead.decisionMaker ? lead.decisionMaker.name : 'Founder'} (${lead.decisionMaker ? lead.decisionMaker.title : 'Executive'})`;

  generateOutreachContent(lead);
  outreachModal.style.display = 'flex';
};

async function generateOutreachContent(lead) {
  if (!lead) return;

  try {
    const res = await fetch('/api/generate-outreach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leadData: lead,
        campaignType: currentCampaign
      })
    });

    const data = await res.json();
    if (data.outreach) {
      document.getElementById('emailSubjectInput').value = data.outreach.coldEmail.subject;
      document.getElementById('emailBodyInput').value = data.outreach.coldEmail.body;
      document.getElementById('linkedinBodyInput').value = data.outreach.inmailPitch;
      document.getElementById('followupSubjectInput').value = data.outreach.followUp.subject;
      document.getElementById('followupBodyInput').value = data.outreach.followUp.body;
    }
  } catch (err) {
    console.error('Error generating outreach:', err);
    showToast('Failed to generate dynamic outreach', 'error');
  }
}

// Deep Lead Modal
window.openDeepLeadModal = function(leadId) {
  const lead = allLeads.find(l => l.id === leadId);
  if (!lead) return;

  document.getElementById('deepModalTitle').textContent = `${lead.name} — Full Account Intelligence`;
  
  const content = `
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(7, 9, 14, 0.6); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 10px;">
        <div>
          <h4 style="font-size: 1.1rem; color: var(--text-primary);">${escapeHtml(lead.name)}</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(lead.domain)} • ${escapeHtml(lead.industry || 'B2B Tech')}</span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase;">Caprae AI Fit Score</span>
          <div style="font-size: 1.4rem; font-weight: 800; color: #34d399;">${lead.score}/100</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
        <div style="background: rgba(7, 9, 14, 0.4); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 4px;">ICP FIT BREAKDOWN</div>
          <div style="font-size: 0.85rem;"><strong>ICP Fit:</strong> ${lead.scoreBreakdown ? lead.scoreBreakdown.icpFit : 94}%</div>
          <div style="font-size: 0.85rem;"><strong>Growth Signal:</strong> ${lead.scoreBreakdown ? lead.scoreBreakdown.growthSignal : 88}%</div>
          <div style="font-size: 0.85rem;"><strong>M&A Potential:</strong> ${lead.scoreBreakdown ? lead.scoreBreakdown.maPotential : 92}%</div>
        </div>

        <div style="background: rgba(7, 9, 14, 0.4); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 4px;">VERIFIED CONTACT PERSONA</div>
          <div style="font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${escapeHtml(lead.decisionMaker ? lead.decisionMaker.name : 'N/A')}</div>
          <div style="font-size: 0.78rem; color: var(--text-secondary);">${escapeHtml(lead.decisionMaker ? lead.decisionMaker.title : 'Executive')}</div>
          <div style="font-size: 0.78rem; color: var(--accent-cyan); font-family: var(--font-mono); margin-top: 4px;">${escapeHtml(lead.decisionMaker ? lead.decisionMaker.email : 'N/A')}</div>
        </div>
      </div>

      <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.25); padding: 14px; border-radius: var(--radius-md);">
        <div style="font-size: 0.74rem; color: var(--accent-purple); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">CAPRAE STRATEGIC RATIONALE</div>
        <p style="font-size: 0.84rem; color: var(--text-primary); line-height: 1.5;">${escapeHtml(lead.aiInsights || 'Identified as a high-synergy target with exceptional tech foundations ready for post-acquisition automated outbound scaling.')}</p>
      </div>

      <div>
        <div style="font-size: 0.74rem; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase;">COMPLETE DETECTED STACK:</div>
        <div class="tech-pills-list">
          ${(lead.techStack || []).map(t => `<span class="tech-tag" style="padding: 4px 8px; font-size: 0.75rem;">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  document.getElementById('deepModalContent').innerHTML = content;
  deepLeadModal.style.display = 'flex';
};

// Enrich Lead Action
window.enrichLeadAction = async function(leadId) {
  try {
    const res = await fetch(`/api/enrich/${leadId}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message || 'Lead verified with DNS & deep stack enrichment.');
      fetchLeads();
    }
  } catch (err) {
    showToast('Failed to enrich lead', 'error');
  }
};

// CRM Webhook Sync
async function handleCrmSync() {
  try {
    const res = await fetch('/api/sync/crm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crmPlatform: 'HubSpot & Salesforce' })
    });
    const data = await res.json();
    if (res.ok) {
      showToast(data.message);
    }
  } catch (e) {
    showToast('CRM Webhook sync failed', 'error');
  }
}

// Copy Helper
function setupCopyButton(btnId, inputId, successMsg) {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    input.select();
    navigator.clipboard.writeText(input.value);
    btn.textContent = 'Copied!';
    btn.style.background = 'var(--accent-emerald)';
    btn.style.color = '#07090e';
    showToast(successMsg);
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.style.background = '';
      btn.style.color = '';
    }, 2000);
  });
}

// Toast Helper
function showToast(msg, type = 'success') {
  toastMessage.textContent = msg;
  toast.className = 'toast-notification show';
  setTimeout(() => {
    toast.className = 'toast-notification';
  }, 3500);
}

// HTML Escaping Helper
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
