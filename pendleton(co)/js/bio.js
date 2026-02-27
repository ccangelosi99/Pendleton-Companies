/**
 * PENDLETON COMPANIES - BIO DETAIL PAGE JS
 * Generic template renderer from bios.json by slug
 */
'use strict';

const BIOS_DATA_URL = '../../data/bios.json';

function normalizeLeader(raw = {}) {
  return {
    id: raw.id || '',
    slug: raw.slug || '',
    name: raw.name || 'Leadership Profile',
    title: raw.title || 'Leadership Team',
    division: raw.division || 'Pendleton Companies',
    location: raw.location || '',
    email: raw.email || '',
    phone: raw.phone || '',
    image: raw.image || '',
    summary: raw.summary || 'Profile details are currently being updated.',
    bio: Array.isArray(raw.bio) ? raw.bio : [],
    expertise: Array.isArray(raw.expertise) ? raw.expertise : []
  };
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setMetaRow(leader) {
  const meta = document.getElementById('bio-meta');
  if (!meta) return;

  const parts = [leader.title, leader.division, leader.location].filter(Boolean);
  meta.textContent = parts.join(' · ');
}

function setList(id, items, fallbackText) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = '';

  const values = items && items.length ? items : [fallbackText];
  values.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}

function setBioParagraphs(items) {
  const container = document.getElementById('bio-paragraphs');
  if (!container) return;

  container.innerHTML = '';
  const paragraphs = items && items.length ? items : ['Biography details are currently being updated.'];

  paragraphs.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
  });
}

function setImage(leader) {
  const img = document.getElementById('bio-image');
  const placeholder = document.getElementById('bio-image-placeholder');
  const initial = document.getElementById('bio-image-initial');

  if (!img || !placeholder || !initial) return;

  const firstChar = (leader.name || 'P').trim().charAt(0).toUpperCase() || 'P';
  initial.textContent = firstChar;

  if (leader.image) {
    img.onerror = () => {
      img.hidden = true;
      placeholder.hidden = false;
    };
    img.src = leader.image;
    img.alt = leader.name;
    img.hidden = false;
    placeholder.hidden = true;
    return;
  }

  img.hidden = true;
  placeholder.hidden = false;
}

function setContact(leader) {
  const emailLink = document.getElementById('bio-email');
  const phoneLink = document.getElementById('bio-phone');

  if (emailLink) {
    if (leader.email) {
      emailLink.textContent = leader.email;
      emailLink.href = `mailto:${leader.email}`;
    } else {
      emailLink.textContent = 'Not available';
      emailLink.removeAttribute('href');
    }
  }

  if (phoneLink) {
    if (leader.phone) {
      phoneLink.textContent = leader.phone;
      phoneLink.href = `tel:${leader.phone.replace(/[^\d+]/g, '')}`;
    } else {
      phoneLink.textContent = 'Not available';
      phoneLink.removeAttribute('href');
    }
  }
}

function renderNotFound(message) {
  setText('bio-name', 'Profile Not Found');
  setText('bio-title', 'Leadership Team');
  setText('bio-meta', 'Pendleton Companies');
  setText('bio-summary', message);

  setBioParagraphs([message]);
  setList('bio-expertise', [], 'No areas of expertise available.');

  const emailLink = document.getElementById('bio-email');
  const phoneLink = document.getElementById('bio-phone');
  if (emailLink) {
    emailLink.textContent = 'portal@pendletoncompanies.com';
    emailLink.href = 'mailto:portal@pendletoncompanies.com';
  }
  if (phoneLink) {
    phoneLink.textContent = 'Support Desk';
    phoneLink.removeAttribute('href');
  }

  const img = document.getElementById('bio-image');
  const placeholder = document.getElementById('bio-image-placeholder');
  const initial = document.getElementById('bio-image-initial');
  if (img) img.hidden = true;
  if (placeholder) placeholder.hidden = false;
  if (initial) initial.textContent = 'P';

  document.title = 'Profile Not Found | Leadership | Pendleton Companies';
}

function renderLeader(leader) {
  setText('bio-name', leader.name);
  setText('bio-title', leader.title);
  setMetaRow(leader);
  setText('bio-summary', leader.summary);

  setImage(leader);
  setContact(leader);
  setBioParagraphs(leader.bio);
  setList('bio-expertise', leader.expertise, 'No areas of expertise available.');

  const pageTitle = `${leader.name} | Leadership | Pendleton Companies`;
  document.title = pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `${leader.name}, ${leader.title} at Pendleton Companies. ${leader.summary}`);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', pageTitle);
  }
}

function getGlobalBiosData() {
  if (window.PENDLETON_BIOS_DATA && Array.isArray(window.PENDLETON_BIOS_DATA.leaders)) {
    return window.PENDLETON_BIOS_DATA.leaders;
  }
  return null;
}

async function loadBios() {
  const globalData = getGlobalBiosData();
  if (globalData) return globalData.map(normalizeLeader);

  const response = await fetch(BIOS_DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load bios data (${response.status})`);

  const data = await response.json();
  return (data.leaders || []).map(normalizeLeader);
}

async function initBioPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    renderNotFound('This profile link is missing a slug. Please return to Leadership and select a profile.');
    return;
  }

  try {
    const bios = await loadBios();
    const leader = bios.find(item => item.slug === slug);

    if (!leader) {
      renderNotFound('The requested profile could not be found. Please return to Leadership and try another profile.');
      return;
    }

    renderLeader(leader);
  } catch (error) {
    console.error(error);
    renderNotFound('We could not load this profile right now. Please refresh and try again.');
  }
}

document.addEventListener('DOMContentLoaded', initBioPage);
