/**
 * PENDLETON COMPANIES - PROPERTY DETAIL PAGE JS
 * Generic template renderer from properties data by slug
 */
'use strict';

const PROPERTIES_DATA_URL = '../../data/properties.json';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function parseValueMillions(rawValue) {
  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) return rawValue;
  if (typeof rawValue !== 'string') return 0;
  const parsed = parseFloat(rawValue.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeProperty(raw = {}) {
  const name = raw.name || 'Untitled Property';
  const valueM = parseValueMillions(raw.valueM ?? raw.value ?? 0);

  return {
    id: raw.id || slugify(name),
    slug: raw.slug || slugify(name),
    name,
    location: raw.location || 'United States',
    state: raw.state || '',
    type: raw.type || raw.product_type || 'Property',
    projectType: raw.projectType || raw.project_type || 'Development',
    units: parseNumber(raw.units),
    sqft: parseNumber(raw.sqft),
    valueM,
    status: raw.status || 'Active',
    year: parseNumber(raw.year),
    image: raw.image || raw.img || '',
    summary: raw.summary || 'Property summary is currently being updated.',
    description: Array.isArray(raw.description) ? raw.description : [],
    highlights: Array.isArray(raw.highlights) ? raw.highlights : []
  };
}

function getGlobalPropertiesData() {
  if (window.PENDLETON_PROPERTIES_DATA && Array.isArray(window.PENDLETON_PROPERTIES_DATA.properties)) {
    return window.PENDLETON_PROPERTIES_DATA.properties;
  }
  return null;
}

async function loadProperties() {
  const globalData = getGlobalPropertiesData();
  if (globalData) return globalData.map(normalizeProperty);

  const response = await fetch(PROPERTIES_DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to load properties data (${response.status})`);

  const data = await response.json();
  return (data.properties || []).map(normalizeProperty);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
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

function setDescription(items) {
  const container = document.getElementById('property-description');
  if (!container) return;

  container.innerHTML = '';
  const values = items && items.length ? items : ['Property description is currently being updated.'];
  values.forEach(text => {
    const p = document.createElement('p');
    p.textContent = text;
    container.appendChild(p);
  });
}

function formatValueMillions(valueM) {
  return `$${valueM.toFixed(0)}M`;
}

function setImage(property) {
  const img = document.getElementById('property-image');
  const placeholder = document.getElementById('property-image-placeholder');
  const initial = document.getElementById('property-image-initial');

  if (!img || !placeholder || !initial) return;

  initial.textContent = (property.name || 'P').trim().charAt(0).toUpperCase() || 'P';

  const rawImage = String(property.image || '').trim();
  const isSafeUrl = rawImage && !/^(?:javascript|data|vbscript):/i.test(rawImage);

  if (isSafeUrl) {
    img.onerror = () => {
      img.hidden = true;
      placeholder.hidden = false;
    };
    img.src = rawImage;
    img.alt = property.name;
    img.hidden = false;
    placeholder.hidden = true;
    return;
  }

  img.hidden = true;
  placeholder.hidden = false;
}

function renderNotFound(message) {
  setText('property-name', 'Property Not Found');
  setText('property-type', 'Real Estate Asset');
  setText('property-meta', 'Pendleton Companies');
  setText('property-summary', message);

  setText('property-value', 'N/A');
  setText('property-units', 'N/A');
  setText('property-sqft', 'N/A');
  setText('property-status', 'Unavailable');
  setText('property-year', 'N/A');
  setText('property-location', 'N/A');

  setDescription([message]);
  setList('property-highlights', [], 'No highlights available.');

  const img = document.getElementById('property-image');
  const placeholder = document.getElementById('property-image-placeholder');
  const initial = document.getElementById('property-image-initial');
  if (img) img.hidden = true;
  if (placeholder) placeholder.hidden = false;
  if (initial) initial.textContent = 'P';

  document.title = 'Property Not Found | Portfolio | Pendleton Companies';
}

function renderProperty(property) {
  setText('property-name', property.name);
  setText('property-type', property.type);
  setText('property-meta', `${property.location} · ${property.projectType}`);
  setText('property-summary', property.summary);

  setText('property-value', formatValueMillions(property.valueM));
  setText('property-units', property.units ? property.units.toLocaleString() : 'N/A');
  setText('property-sqft', property.sqft ? `${(property.sqft / 1000).toFixed(0)}K SF` : 'N/A');
  setText('property-status', property.status || 'Active');
  setText('property-year', property.year || 'N/A');
  setText('property-location', property.location);

  setDescription(property.description);
  setList('property-highlights', property.highlights, 'No highlights available.');
  setImage(property);

  const pageTitle = `${property.name} | Real Estate | Pendleton Companies`;
  document.title = pageTitle;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', `${property.name} in ${property.location}. ${property.summary}`);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', pageTitle);
  }
}

async function initPropertyPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    renderNotFound('This property link is missing a slug. Please return to Real Estate and select a property.');
    return;
  }

  try {
    const properties = await loadProperties();
    const property = properties.find(item => item.slug === slug);

    if (!property) {
      renderNotFound('The requested property could not be found. It may have been archived or renamed.');
      return;
    }

    renderProperty(property);
  } catch (error) {
    console.error(error);
    renderNotFound('We could not load this property right now. Please refresh and try again.');
  }
}

document.addEventListener('DOMContentLoaded', initPropertyPage);
