/**
 * PENDLETON COMPANIES - CAREERS PAGE JS
 * Data-driven Open Positions list (template + JSON data source)
 */
'use strict';

const JOBS_DATA_URL = '../../data/jobs.json';
let jobsDB = [];

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeJob(raw = {}) {
  const title = raw.title || 'Untitled Position';
  return {
    id: raw.id || slugify(title),
    slug: raw.slug || slugify(title),
    title,
    dept: raw.dept || raw.field || 'General',
    field: raw.field || 'General',
    location: raw.location || 'Remote',
    type: raw.type || 'Full-Time',
    posted: raw.posted || '',
    summary: raw.summary || raw.desc || '',
  };
}

function getGlobalJobsData() {
  if (window.PENDLETON_JOBS_DATA && Array.isArray(window.PENDLETON_JOBS_DATA.positions)) {
    return window.PENDLETON_JOBS_DATA.positions;
  }
  return null;
}

async function loadJobs() {
  const globalData = getGlobalJobsData();
  if (globalData) return globalData.map(normalizeJob);

  const response = await fetch(JOBS_DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load jobs data (${response.status})`);
  const data = await response.json();
  return (data.positions || []).map(normalizeJob);
}

function setStatus(message) {
  const countEl = document.getElementById('positions-count');
  if (countEl) countEl.textContent = message;
}

function fillSelectOptions(selectEl, values, allLabel) {
  if (!selectEl) return;
  selectEl.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = '';
  allOption.textContent = allLabel;
  selectEl.appendChild(allOption);

  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    selectEl.appendChild(option);
  });
}

function hydrateFilters() {
  const locationFilter = document.getElementById('pos-filter-location');
  const fieldFilter = document.getElementById('pos-filter-field');

  const locations = Array.from(new Set(jobsDB.map(job => job.location))).sort();
  const fields = Array.from(new Set(jobsDB.map(job => job.field))).sort();

  fillSelectOptions(locationFilter, locations, 'All Locations');
  fillSelectOptions(fieldFilter, fields, 'All Fields');
}

function buildJobCard(job) {
  const postedDate = job.posted
    ? new Date(job.posted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const safeTitle = escapeHtml(job.title);
  const safeLocation = escapeHtml(job.location);
  const safeDept = escapeHtml(job.dept);
  const safeType = escapeHtml(job.type);
  const safeSummary = escapeHtml(job.summary);
  const safePosted = escapeHtml(postedDate);

  return `
    <article class="position-card position-card--linked">
      <div class="position-card__info">
        <h3 class="position-card__title">${safeTitle}</h3>
        <div class="position-card__meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${safeLocation}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
            ${safeDept}
          </span>
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${safeType}
          </span>
          ${postedDate ? `<span>Posted: ${safePosted}</span>` : ''}
        </div>
        ${job.summary ? `<p style="color:var(--clr-text-muted);margin-top:var(--sp-3);line-height:1.65">${safeSummary}</p>` : ''}
      </div>
      <div class="position-card__actions">
        <a href="../../pages/careers/job.html?slug=${encodeURIComponent(job.slug)}" class="btn btn--primary btn--sm">View Full Job Description</a>
      </div>
    </article>
  `;
}

function renderPositions(data) {
  const list = document.getElementById('positions-list');
  const countEl = document.getElementById('positions-count');
  if (!list) return;

  if (countEl) {
    countEl.textContent = `${data.length} Open Position${data.length !== 1 ? 's' : ''}`;
  }

  if (!data.length) {
    list.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">No positions match your criteria. Please try different filters.</p>';
    return;
  }

  list.innerHTML = data.map(buildJobCard).join('');
}

function applyFilters() {
  const location = document.getElementById('pos-filter-location')?.value || '';
  const field = document.getElementById('pos-filter-field')?.value || '';

  const filtered = jobsDB.filter(job => {
    const locationMatch = !location || job.location === location;
    const fieldMatch = !field || job.field === field;
    return locationMatch && fieldMatch;
  });

  renderPositions(filtered);
}

async function initPositionsPage() {
  setStatus('Loading positions...');

  try {
    jobsDB = await loadJobs();

    if (!jobsDB.length) {
      setStatus('No positions available');
      const list = document.getElementById('positions-list');
      if (list) list.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">No open positions are available right now.</p>';
      return;
    }

    hydrateFilters();
    renderPositions(jobsDB);

    document.getElementById('pos-filter-location')?.addEventListener('change', applyFilters);
    document.getElementById('pos-filter-field')?.addEventListener('change', applyFilters);
  } catch (error) {
    console.error(error);
    setStatus('Unable to load positions');
    const list = document.getElementById('positions-list');
    if (list) {
      list.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">We were unable to load open positions. Please refresh and try again.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', initPositionsPage);
