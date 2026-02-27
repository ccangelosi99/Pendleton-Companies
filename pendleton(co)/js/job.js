/**
 * PENDLETON COMPANIES - JOB DETAIL PAGE JS
 * Generic template renderer from jobs.json by slug
 */
'use strict';

const JOBS_DATA_URL = '../../data/jobs.json';

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
    summary: raw.summary || raw.desc || 'Details for this role are currently being updated.',
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    qualifications: Array.isArray(raw.qualifications) ? raw.qualifications : (Array.isArray(raw.requirements) ? raw.requirements : []),
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
  };
}

function setList(listId, items, fallbackText) {
  const list = document.getElementById(listId);
  if (!list) return;

  if (!items || !items.length) {
    list.innerHTML = `<li>${fallbackText}</li>`;
    return;
  }

  list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function renderNotFound(message) {
  const title = document.getElementById('job-title');
  const meta = document.getElementById('job-meta');
  const summary = document.getElementById('job-summary');

  if (title) title.textContent = 'Job Not Found';
  if (meta) meta.textContent = '';
  if (summary) summary.textContent = message;

  setList('job-responsibilities', [], 'No responsibilities available.');
  setList('job-qualifications', [], 'No qualifications available.');
  setList('job-benefits', [], 'No benefits details available.');

  const applyLink = document.getElementById('job-apply-link');
  if (applyLink) {
    applyLink.classList.add('btn--outline');
    applyLink.classList.remove('btn--primary');
    applyLink.textContent = 'Back to Open Positions';
    applyLink.href = '../../pages/careers/positions.html';
  }
}

function formatPostedDate(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderJob(job) {
  const title = document.getElementById('job-title');
  const meta = document.getElementById('job-meta');
  const summary = document.getElementById('job-summary');
  const applyLink = document.getElementById('job-apply-link');

  if (title) title.textContent = job.title;

  const metaParts = [job.dept, job.location, job.type];
  const posted = formatPostedDate(job.posted);
  if (posted) metaParts.push(`Posted ${posted}`);
  if (meta) meta.textContent = metaParts.join(' · ');

  if (summary) summary.textContent = job.summary;

  setList('job-responsibilities', job.responsibilities, 'Responsibilities will be shared during interview stages.');
  setList('job-qualifications', job.qualifications, 'Qualifications will be reviewed with qualified applicants.');
  setList('job-benefits', job.benefits, 'Benefits vary by role and location.');

  if (applyLink) {
    const role = encodeURIComponent(job.title);
    const slug = encodeURIComponent(job.slug);
    applyLink.href = `../../pages/careers/application.html?slug=${slug}&role=${role}`;
  }

  document.title = `${job.title} | Careers | Pendleton Companies`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `${job.title} at Pendleton Companies. ${job.summary}`);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', `${job.title} | Careers | Pendleton Companies`);
  }
}

async function initJobPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    renderNotFound('This job link is missing a slug. Please return to Open Positions and select a role.');
    return;
  }

  try {
    let data = null;
    if (window.PENDLETON_JOBS_DATA && Array.isArray(window.PENDLETON_JOBS_DATA.positions)) {
      data = window.PENDLETON_JOBS_DATA;
    } else {
      const response = await fetch(JOBS_DATA_URL, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Failed to load jobs data (${response.status})`);
      data = await response.json();
    }

    const jobs = (data.positions || []).map(normalizeJob);
    const job = jobs.find(item => item.slug === slug);

    if (!job) {
      renderNotFound('The requested role could not be found. It may have been filled or removed.');
      return;
    }

    renderJob(job);
  } catch (error) {
    console.error(error);
    renderNotFound('We could not load this job right now. Please try again shortly.');
  }
}

document.addEventListener('DOMContentLoaded', initJobPage);
