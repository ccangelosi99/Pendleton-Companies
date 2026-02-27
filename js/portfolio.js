/**
 * PENDLETON COMPANIES - PORTFOLIO PAGE JS
 * Filters, Charts, Map, Properties
 */
'use strict';

const PORTFOLIO_ALLOCATION_DATA = [
  { label: 'Real Estate', value: 55, color: '#4bacc6', link: 'real-estate.html' },
  { label: 'Equities', value: 20, color: '#ffbb52', link: 'stocks.html' },
  { label: 'Fixed Income', value: 15, color: '#3a8fa8', link: 'bonds.html' },
  { label: 'Private Credit', value: 10, color: '#7cc8dc', link: 'private-credit.html' },
];

function resizeCanvasForDpr(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function drawDoughnutChart(canvas, data, options = {}) {
  if (!canvas || !data?.length) return;

  const width = options.width || canvas.clientWidth || canvas.offsetWidth || 300;
  const height = options.height || canvas.clientHeight || canvas.offsetHeight || 300;
  const ctx = resizeCanvasForDpr(canvas, width, height);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (!total) return;

  const cx = width / 2;
  const cy = height / 2;
  const outerR = options.outerRadius || (Math.min(width, height) * 0.39);
  const innerR = options.innerRadius || (outerR * 0.56);
  const highlight = (options.highlight || '').toLowerCase();

  ctx.clearRect(0, 0, width, height);
  let startAngle = -Math.PI / 2;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * Math.PI * 2;
    const midAngle = startAngle + sliceAngle / 2;
    const isHighlighted = !!highlight && item.label.toLowerCase() === highlight;
    const radius = isHighlighted ? outerR + 6 : outerR;
    const offset = isHighlighted ? 4 : 0;
    const ox = Math.cos(midAngle) * offset;
    const oy = Math.sin(midAngle) * offset;

    ctx.beginPath();
    ctx.arc(cx + ox, cy + oy, radius, startAngle, startAngle + sliceAngle);
    ctx.arc(cx + ox, cy + oy, innerR, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    if (options.showSliceValues) {
      const labelRadius = (radius + innerR) / 2;
      const lx = cx + ox + Math.cos(midAngle) * labelRadius;
      const ly = cy + oy + Math.sin(midAngle) * labelRadius;
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px Montserrat, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.value}%`, lx, ly);
    }

    startAngle += sliceAngle;
  });

  if (options.centerTitle) {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-text').trim() || '#1B2B3A';
    ctx.font = '700 22px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.centerTitle, cx, cy - 6);
  }

  if (options.centerSubtitle) {
    ctx.fillStyle = '#9B9590';
    ctx.font = '11px Montserrat, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.centerSubtitle, cx, cy + 14);
  }
}

/* ============================================================
   DOUGHNUT CHART FOR PORTFOLIO OVERVIEW
   ============================================================ */
function initAllocationChart() {
  const canvas = document.getElementById('chart-allocation');
  if (!canvas) return;

  const data = PORTFOLIO_ALLOCATION_DATA;
  const size = 300;
  const ctx = resizeCanvasForDpr(canvas, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = 120;
  const innerR = 68;
  const total = data.reduce((s, d) => s + d.value, 0);
  let hoveredIndex = -1;

  function getSliceAtPoint(mx, my) {
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < innerR || dist > outerR + 15) return -1;

    let angle = Math.atan2(dy, dx);
    if (angle < -Math.PI / 2) angle += Math.PI * 2;

    let startAngle = -Math.PI / 2;
    for (let i = 0; i < data.length; i += 1) {
      const sliceAngle = (data[i].value / total) * Math.PI * 2;
      if (angle >= startAngle && angle < startAngle + sliceAngle) return i;
      startAngle += sliceAngle;
    }
    return -1;
  }

  function draw() {
    ctx.clearRect(0, 0, size, size);
    let startAngle = -Math.PI / 2;

    data.forEach((d, i) => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      const isHovered = i === hoveredIndex;
      const grow = isHovered ? 10 : 0;
      const midAngle = startAngle + sliceAngle / 2;
      const offsetX = isHovered ? Math.cos(midAngle) * 6 : 0;
      const offsetY = isHovered ? Math.sin(midAngle) * 6 : 0;

      ctx.beginPath();
      ctx.arc(cx + offsetX, cy + offsetY, outerR + grow, startAngle, startAngle + sliceAngle);
      ctx.arc(cx + offsetX, cy + offsetY, innerR, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();

      const labelR = (outerR + grow + innerR) / 2;
      const lx = cx + offsetX + Math.cos(midAngle) * labelR;
      const ly = cy + offsetY + Math.sin(midAngle) * labelR;
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${isHovered ? '16' : '13'}px Montserrat, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${d.value}%`, lx, ly);

      startAngle += sliceAngle;
    });

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-text').trim() || '#1B2B3A';
    ctx.font = 'bold 24px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$1.2B+', cx, cy - 8);
    ctx.font = '11px Montserrat, sans-serif';
    ctx.fillStyle = '#9B9590';
    ctx.fillText('Total AUM', cx, cy + 12);
  }

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const idx = getSliceAtPoint(mx, my);
    if (idx !== hoveredIndex) {
      hoveredIndex = idx;
      canvas.style.cursor = idx >= 0 ? 'pointer' : 'default';
      draw();
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hoveredIndex = -1;
    canvas.style.cursor = 'default';
    draw();
  });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const idx = getSliceAtPoint(mx, my);
    if (idx >= 0) {
      const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
      window.location.href = basePath + data[idx].link;
    }
  });

  draw();
}

/* ============================================================
   OVERVIEW TAB DOUGHNUTS
   ============================================================ */
function initOverviewDoughnuts() {
  document.querySelectorAll('.overview-doughnut-canvas').forEach(canvas => {
    const centerTitle = canvas.dataset.centerTitle || '$1.2B+';
    const centerSubtitle = canvas.dataset.centerSubtitle || 'Total AUM';
    const highlight = canvas.dataset.highlight || '';
    const size = Math.min(280, canvas.parentElement?.clientWidth || 280);

    drawDoughnutChart(canvas, PORTFOLIO_ALLOCATION_DATA, {
      centerTitle,
      centerSubtitle,
      highlight,
      showSliceValues: true,
      width: size,
      height: size,
    });
  });
}

/* ============================================================
   PROPERTIES DATA
   ============================================================ */
const PROPERTIES_DATA_URL = '../../data/properties.json';
let propertiesDB = [];
let filteredProperties = [];

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

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(url) {
  const value = String(url || '').trim();
  if (!value) return '';
  if (/^(?:javascript|data|vbscript):/i.test(value)) return '';
  return value;
}

function normalizeProperty(raw = {}) {
  const name = raw.name || 'Untitled Property';
  const type = raw.type || raw.product_type || 'Property';
  const projectType = raw.projectType || raw.project_type || 'Development';
  const valueM = parseValueMillions(raw.valueM ?? raw.value ?? 0);

  return {
    id: raw.id || slugify(name),
    slug: raw.slug || slugify(name),
    name,
    location: raw.location || 'United States',
    state: raw.state || '',
    type,
    projectType,
    units: parseNumber(raw.units),
    sqft: parseNumber(raw.sqft),
    valueM,
    valueLabel: `$${valueM.toFixed(0)}M`,
    summary: raw.summary || '',
    image: raw.image || raw.img || '',
    status: raw.status || '',
    year: parseNumber(raw.year),
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

/* ============================================================
   FILTER LOGIC
   ============================================================ */
function applyFilters() {
  if (!propertiesDB.length && !document.getElementById('properties-grid')) return;

  const location  = document.getElementById('filter-location')?.value  || '';
  const prodType  = document.getElementById('filter-type')?.value      || '';
  const projType  = document.getElementById('filter-project')?.value   || '';

  filteredProperties = propertiesDB.filter(p => {
    const matchLoc  = !location || p.state === location;
    const matchProd = !prodType || p.type === prodType;
    const matchProj = !projType || p.projectType === projType;
    return matchLoc && matchProd && matchProj;
  });

  renderProperties();
  updateMetrics();
  updateCharts();
}

/* ============================================================
   RENDER PROPERTIES
   ============================================================ */
function renderProperties() {
  const grid = document.getElementById('properties-grid');
  const countEl = document.getElementById('properties-count');
  if (!grid) return;

  if (countEl) countEl.textContent = `${filteredProperties.length} Propert${filteredProperties.length !== 1 ? 'ies' : 'y'}`;

  if (!filteredProperties.length) {
    grid.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">No properties match your selected filters.</p>';
    return;
  }

  grid.innerHTML = filteredProperties.map(property => {
    const name = escapeHtml(property.name);
    const type = escapeHtml(property.type);
    const location = escapeHtml(property.location);
    const projectType = escapeHtml(property.projectType);
    const valueLabel = escapeHtml(property.valueLabel);
    const safeImage = sanitizeUrl(property.image);
    const imageAlt = name || 'Property image';
    const initial = escapeHtml(String(property.name || 'P').trim().charAt(0).toUpperCase() || 'P');
    const unitsBadge = property.units ? `<span class="card__badge">${property.units.toLocaleString()} Units</span>` : '';
    const sqftBadge = property.sqft ? `<span class="card__badge">${(property.sqft / 1000).toFixed(0)}K SF</span>` : '';

    return `
    <article class="card card--property reveal">
      ${safeImage ? `<img class="card__image" src="${escapeHtml(safeImage)}" alt="${imageAlt}" loading="lazy" decoding="async">` : `<div style="height:170px;background:linear-gradient(135deg,#1B2B3A 0%,#2C4A63 100%);display:flex;align-items:center;justify-content:center;"><span style="font-family:var(--font-display);font-size:3rem;color:rgba(75,172,198,0.3)">${initial}</span></div>`}
      <div class="card__body">
        <div class="card__label">${type}</div>
        <h3 class="card__title">${name}</h3>
        <p class="card__text" style="font-size:0.875rem;color:var(--clr-text-muted);">${location}</p>
        <div class="card__meta">
          <span class="card__badge">${projectType}</span>
          ${unitsBadge}
          ${sqftBadge}
        </div>
      </div>
      <div class="card__footer">
        <span style="font-family:var(--font-display);font-weight:700;color:var(--clr-accent);">${valueLabel}</span>
        <a href="../../pages/portfolio/property.html?slug=${encodeURIComponent(property.slug)}" class="btn btn--ghost btn--sm">View Details</a>
      </div>
    </article>
    `;
  }).join('');

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
}

/* ============================================================
   METRICS
   ============================================================ */
function updateMetrics() {
  const totalValue = filteredProperties.reduce((sum, p) => sum + parseValueMillions(p.valueM), 0);
  const totalUnits = filteredProperties.filter(p => p.units).reduce((s, p) => s + p.units, 0);
  const totalSqft  = filteredProperties.filter(p => p.sqft).reduce((s, p) => s + p.sqft, 0);
  const states     = new Set(filteredProperties.map(p => p.state)).size;

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  set('metric-properties', filteredProperties.length);
  set('metric-value', '$' + totalValue.toFixed(0) + 'M');
  set('metric-units', totalUnits.toLocaleString());
  set('metric-sqft', (totalSqft / 1000000).toFixed(2) + 'M SF');
  set('metric-states', states);
}

async function initRealEstateProperties() {
  const grid = document.getElementById('properties-grid');
  if (!grid) return;

  grid.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">Loading properties...</p>';

  try {
    propertiesDB = await loadProperties();
    filteredProperties = [...propertiesDB];

    ['filter-location', 'filter-type', 'filter-project'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', applyFilters);
    });
    document.querySelector('.js-apply-filters')?.addEventListener('click', applyFilters);

    applyFilters();
  } catch (error) {
    console.error(error);
    filteredProperties = [];
    const countEl = document.getElementById('properties-count');
    if (countEl) countEl.textContent = 'Unable to load properties';
    grid.innerHTML = '<p style="color:var(--clr-text-muted);text-align:center;padding:var(--sp-12)">Unable to load properties right now. Please refresh and try again.</p>';
    updateMetrics();
    updateCharts();
  }
}

/* ============================================================
   CHARTS
   ============================================================ */
function updateCharts() {
  drawTypeChart();
  drawProjectTypeChart();
}

function drawTypeChart() {
  const canvas = document.getElementById('chart-type');
  if (!canvas) return;

  const typeCounts = {};
  filteredProperties.forEach(p => { typeCounts[p.type] = (typeCounts[p.type] || 0) + 1; });

  const labels = Object.keys(typeCounts);
  const values = Object.values(typeCounts);
  if (!labels.length) {
    const ctx = canvas.getContext('2d');
    const W = canvas.clientWidth || canvas.offsetWidth || 420;
    const H = canvas.clientHeight || canvas.offsetHeight || 320;
    resizeCanvasForDpr(canvas, W, H);
    ctx.clearRect(0, 0, W, H);
    return;
  }

  const colors = ['#4bacc6','#2C4A63','#4A7C94','#ffbb52','#3a8fa8','#1B2B3A','#6B9CB8','#8B7355'];
  const W = canvas.clientWidth || canvas.offsetWidth || 420;
  const H = canvas.clientHeight || canvas.offsetHeight || 320;
  const legendHeight = Math.max(72, Math.ceil(labels.length / 2) * 20 + 12);
  const chartHeight = H - legendHeight;
  const chartData = labels.map((label, i) => ({ label, value: values[i], color: colors[i % colors.length] }));

  drawDoughnutChart(canvas, chartData, {
    centerTitle: `${filteredProperties.length}`,
    centerSubtitle: 'Assets',
    showSliceValues: true,
    width: W,
    height: chartHeight,
  });

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const legendTop = chartHeight + 10;
  const colWidth = W / 2;
  labels.forEach((label, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 14 + col * colWidth;
    const y = legendTop + row * 20;
    const color = chartData[i].color;

    ctx.fillStyle = color;
    ctx.fillRect(x, y, 12, 12);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-text').trim() || '#1B2B3A';
    ctx.font = '11px Montserrat, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${label} (${typeCounts[label]})`, x + 18, y + 7);
  });
}

function drawProjectTypeChart() {
  const canvas = document.getElementById('chart-project');
  if (!canvas) return;

  const W = canvas.clientWidth || canvas.offsetWidth || 420;
  const H = canvas.clientHeight || canvas.offsetHeight || 320;
  const ctx = resizeCanvasForDpr(canvas, W, H);
  ctx.clearRect(0, 0, W, H);

  const typeCounts = {};
  filteredProperties.forEach(p => { typeCounts[p.projectType] = (typeCounts[p.projectType] || 0) + 1; });

  const labels = Object.keys(typeCounts);
  const values = Object.values(typeCounts);
  if (!labels.length) return;

  const max = Math.max(...values);
  const barColors = ['#4bacc6', '#2C4A63', '#4A7C94', '#ffbb52'];
  const barW = Math.max(42, ((W - 96) / labels.length) - 16);
  const barBaseY = H - 50;

  ctx.strokeStyle = 'rgba(155,149,144,0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = 24 + i * ((barBaseY - 30) / 4);
    ctx.beginPath();
    ctx.moveTo(28, y);
    ctx.lineTo(W - 24, y);
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const barH = (values[i] / max) * (barBaseY - 30);
    const x = 40 + i * (barW + 16);

    ctx.fillStyle = barColors[i % barColors.length];
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(x, barBaseY - barH, barW, barH, 4);
      ctx.fill();
    } else {
      ctx.fillRect(x, barBaseY - barH, barW, barH);
    }

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--clr-text').trim() || '#1B2B3A';
    ctx.font = 'bold 14px Playfair Display, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(values[i], x + barW / 2, barBaseY - barH - 10);

    ctx.font = '10px Montserrat, sans-serif';
    ctx.fillText(label, x + barW / 2, barBaseY + 14);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initAllocationChart();
  initOverviewDoughnuts();
  initRealEstateProperties();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initAllocationChart();
      initOverviewDoughnuts();
      if (filteredProperties.length) updateCharts();
    }, 200);
  });
});
