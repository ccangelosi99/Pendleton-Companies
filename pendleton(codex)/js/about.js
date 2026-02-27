/**
 * PENDLETON COMPANIES - ABOUT PAGE JS
 * Timeline, Advantage Steps
 */
'use strict';

/* ============================================================
   TIMELINE
   ============================================================ */
function initTimeline() {
  const events = document.querySelectorAll('.story-timeline__event');
  if (!events.length) return;

  const imgs = document.querySelectorAll('.story-hero__img');
  const detail = document.getElementById('story-detail');
  let autoPlayTimer = null;
  let autoPlayEnabled = true;
  let currentIndex = 0;

  const data = {
    '1985': {
      title: 'Company Founded',
      text: 'Pendleton Companies was established with a single-minded focus on delivering exceptional real estate value. Starting with a small portfolio in the Southeast, the company laid the foundation for what would become a vertically integrated real estate powerhouse.'
    },
    '1992': {
      title: 'Expansion into Lending',
      text: 'Recognizing the strategic advantage of controlling the capital stack, Pendleton Lending was launched, enabling the company to offer competitive financing to its own projects and select third-party clients.'
    },
    '2001': {
      title: 'Pendleton Construction Established',
      text: 'By bringing construction in-house, Pendleton achieved unprecedented quality control and cost efficiency. Pendleton Construction quickly became one of the most sought-after contractors in the region.'
    },
    '2008': {
      title: 'Navigating the Financial Crisis',
      text: 'While many competitors struggled, Pendleton\'s disciplined underwriting and vertically integrated model allowed the company not only to survive the 2008 financial crisis but to strategically acquire distressed assets at significant value.'
    },
    '2015': {
      title: 'National Footprint Achieved',
      text: 'Crossing into 20+ states, Pendleton reached a milestone national presence with over $1B in assets under management, cementing its reputation as a trusted partner for institutional investors.'
    },
    '2020': {
      title: 'Pendleton Management Launches',
      text: 'Pendleton Management was formalized to provide best-in-class property and asset management services, completing the full vertical integration stack from acquisition to disposition.'
    },
    '2024': {
      title: 'Continued Growth & Innovation',
      text: 'Today, Pendleton Companies continues its mission of operational excellence and value creation, expanding into new markets while deepening expertise in existing ones.'
    },
  };

  const yearKeys = Array.from(events).map(e => e.dataset.year);

  function activate(index, isManual) {
    if (isManual) {
      autoPlayEnabled = false;
      clearTimeout(autoPlayTimer);
    }

    currentIndex = index;
    const event = events[index];
    const year = event.dataset.year;
    const d = data[year];

    // Update active states
    events.forEach(e => e.classList.remove('active'));
    event.classList.add('active');

    // Reset progress bar animation by removing and re-adding the active class
    const progressBar = event.querySelector('.story-timeline__progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // Force reflow
      progressBar.style.animation = '';
    }

    // Update hero images
    imgs.forEach(img => img.classList.remove('active'));
    const targetImg = document.querySelector(`.story-hero__img[data-year="${year}"]`);
    if (targetImg) targetImg.classList.add('active');

    // Update detail
    if (detail && d) {
      detail.querySelector('.story-detail__year').textContent = year;
      detail.querySelector('.story-detail__title').textContent = d.title;
      detail.querySelector('.story-detail__text').textContent = d.text;
    }

    // Schedule next if auto-play
    if (autoPlayEnabled) {
      clearTimeout(autoPlayTimer);
      autoPlayTimer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % events.length;
        activate(nextIndex, false);
      }, 8000);
    }
  }

  events.forEach((ev, i) => {
    ev.addEventListener('click', () => activate(i, true));
    ev.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i, true); }
    });
  });

  // Start auto-play with first item
  activate(0, false);
}

/* ============================================================
   ADVANTAGE STEPS
   ============================================================ */
function initAdvantage() {
  const steps = document.querySelectorAll('.advantage__step');
  if (!steps.length) return;

  const detail = document.getElementById('advantage-detail');
  let autoPlayTimer = null;
  let autoPlayEnabled = true;
  let currentIndex = 0;

  const data = {
    '1': { label: 'Phase 01', title: 'Market Research & Opportunity Identification', text: 'Pendleton\'s proprietary market intelligence platform aggregates data from over 200 sources, enabling our acquisitions team to identify high-conviction opportunities before they reach the open market. Our analysts assess supply-demand dynamics, economic drivers, and demographic trends to pinpoint markets poised for growth.' },
    '2': { label: 'Phase 02', title: 'Site Acquisition & Due Diligence', text: 'Our acquisitions team brings decades of transactional experience to every deal. With established broker relationships across 25+ states, Pendleton gains early access to off-market opportunities. Our rigorous due diligence process covers environmental, title, zoning, and financial analysis.' },
    '3': { label: 'Phase 03', title: 'In-House Financing via Pendleton Lending', text: 'Pendleton Lending eliminates dependence on third-party capital sources, providing certainty of close and optimized loan structures. With construction loans, bridge facilities, and permanent financing available in-house, we move at market speed while maintaining disciplined underwriting standards.' },
    '4': { label: 'Phase 04', title: 'Design, Engineering & Permitting', text: 'Pendleton works with leading architects and engineers from initial concept through final permit approvals. Our deep relationships with municipal authorities across our markets streamline the entitlement process, reducing timeline risk and carrying costs.' },
    '5': { label: 'Phase 05', title: 'Construction by Pendleton Construction', text: 'With Pendleton Construction as our in-house general contractor, we eliminate the markup paid to third-party GCs while achieving unmatched quality control. Our superintendents and project managers work exclusively on Pendleton projects, ensuring every dollar of construction budget is maximized.' },
    '6': { label: 'Phase 06', title: 'Lease-Up & Stabilization', text: 'Our integrated leasing teams leverage proprietary technology and deep local market knowledge to achieve aggressive lease-up timelines. Coordinated marketing, professional photography, virtual tours, and competitive pricing strategies ensure properties reach stabilization ahead of schedule.' },
    '7': { label: 'Phase 07', title: 'Asset & Property Management', text: 'Pendleton Management\'s vertically integrated platform delivers best-in-class operational performance. Our in-house maintenance teams, technology stack, and professional property managers maintain high occupancy rates, control operating expenses, and maximize net operating income.' },
    '8': { label: 'Phase 08', title: 'Disposition & Exit Strategy', text: 'Pendleton\'s institutional relationships with buyers — REITs, private equity funds, family offices, and 1031 exchange buyers — enable optimized exit timing and pricing. Our track record of delivering stabilized, well-managed assets commands premium valuations at disposition.' },
  };

  function activate(index, isManual) {
    if (isManual) {
      autoPlayEnabled = false;
      clearTimeout(autoPlayTimer);
    }

    currentIndex = index;
    const step = steps[index];
    const stepNum = step.dataset.step;
    const d = data[stepNum];

    // Update active states
    steps.forEach(s => s.classList.remove('active'));
    step.classList.add('active');

    // Reset progress bar animation
    const progressBar = step.querySelector('.story-timeline__progress-bar');
    if (progressBar) {
      progressBar.style.animation = 'none';
      progressBar.offsetHeight; // Force reflow
      progressBar.style.animation = '';
    }

    // Update detail
    if (detail && d) {
      detail.querySelector('.advantage-v2__detail-label').textContent = d.label;
      detail.querySelector('.advantage-v2__detail-title').textContent = d.title;
      detail.querySelector('.advantage-v2__detail-text').textContent = d.text;
    }

    // Schedule next if auto-play
    if (autoPlayEnabled) {
      clearTimeout(autoPlayTimer);
      autoPlayTimer = setTimeout(() => {
        const nextIndex = (currentIndex + 1) % steps.length;
        activate(nextIndex, false);
      }, 8000);
    }
  }

  steps.forEach((step, i) => {
    step.addEventListener('click', () => activate(i, true));
    step.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(i, true); }
    });
  });

  // Start auto-play with first item
  activate(0, false);
}

document.addEventListener('DOMContentLoaded', () => {
  initTimeline();
  initAdvantage();
});
