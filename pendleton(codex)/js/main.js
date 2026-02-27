/**
 * PENDLETON COMPANIES - MAIN JS
 * Handles: navbar, dark mode, i18n, scroll effects, reveal animations
 */

'use strict';

/* ============================================================
   1. TRANSLATIONS (i18n)
   ============================================================ */
const translations = {
  en: {
    nav_home:'Home',nav_about:'About',nav_portfolio:'Portfolio',nav_careers:'Careers',nav_portal:'Portal',
    sub_mission:'Mission',sub_story:'Story',sub_advantage:'Advantage',sub_companies:'Companies',sub_leadership:'Leadership',
    sub_benefits:'Benefits',sub_development:'Development',sub_portfolio_overview:'Overview',sub_portfolio_realestate:'Real Estate',sub_positions:'Open Positions',sub_careers_overview:'Overview',
    stat_aum:'Assets Under Management',stat_states:'States',stat_units:'Units Managed',stat_years:'Years of Excellence',
    home_cta_portfolio:'View Portfolio',home_cta_about:'Our Story',
    hero_title:'Pendleton Companies',hero_scroll:'Scroll',hero_subtitle:'REAL ESTATE • BUILT DIFFERENTLY',
    re_tab_overview:'Overview',re_tab_holdings:'Holdings',re_tab_pm:'Property Management',re_tab_construction:'Construction',re_tab_lending:'Lending',
    footer_copy:'© 2024 Pendleton Companies. All rights reserved.',footer_privacy:'Privacy Policy',footer_terms:'Terms of Service',
  },
  es: {
    nav_home:'Inicio',nav_about:'Acerca de',nav_portfolio:'Portafolio',nav_careers:'Carreras',nav_portal:'Portal',
    sub_mission:'Misión',sub_story:'Historia',sub_advantage:'Ventaja',sub_companies:'Empresas',sub_leadership:'Liderazgo',
    sub_benefits:'Beneficios',sub_development:'Desarrollo',sub_portfolio_overview:'Resumen',sub_portfolio_realestate:'Bienes Raíces',sub_positions:'Posiciones Abiertas',sub_careers_overview:'Resumen',
    stat_aum:'Activos Bajo Gestión',stat_states:'Estados',stat_units:'Unidades Administradas',stat_years:'Años de Excelencia',
    home_cta_portfolio:'Ver Portafolio',home_cta_about:'Nuestra Historia',
    hero_title:'Pendleton Companies',hero_scroll:'Desplazar',hero_subtitle:'BIENES RAÍCES • CONSTRUIDOS DIFERENTE',
    re_tab_overview:'Resumen',re_tab_holdings:'Propiedades',re_tab_pm:'Gestión de Propiedades',re_tab_construction:'Construcción',re_tab_lending:'Préstamos',
    footer_copy:'© 2024 Pendleton Companies. Todos los derechos reservados.',footer_privacy:'Privacidad',footer_terms:'Términos',
  },
  fr: {
    nav_home:'Accueil',nav_about:'À propos',nav_portfolio:'Portefeuille',nav_careers:'Carrières',nav_portal:'Portail',
    sub_mission:'Mission',sub_story:'Histoire',sub_advantage:'Avantage',sub_companies:'Entreprises',sub_leadership:'Direction',
    sub_benefits:'Avantages',sub_development:'Développement',sub_portfolio_overview:'Aperçu',sub_portfolio_realestate:'Immobilier',sub_positions:'Postes ouverts',sub_careers_overview:'Aperçu',
    stat_aum:'Actifs Sous Gestion',stat_states:'États',stat_units:'Unités Gérées',stat_years:"Années d'Excellence",
    home_cta_portfolio:'Voir le Portefeuille',home_cta_about:'Notre Histoire',
    hero_title:'Pendleton Companies',hero_scroll:'Défiler',hero_subtitle:'IMMOBILIER • CONSTRUIT DIFFÉREMMENT',
    re_tab_overview:'Aperçu',re_tab_holdings:'Propriétés',re_tab_pm:'Gestion Immobilière',re_tab_construction:'Construction',re_tab_lending:'Prêts',
    footer_copy:'© 2024 Pendleton Companies. Tous droits réservés.',footer_privacy:'Confidentialité',footer_terms:'Conditions',
  },
  de: {
    nav_home:'Startseite',nav_about:'Über uns',nav_portfolio:'Portfolio',nav_careers:'Karriere',nav_portal:'Portal',
    sub_mission:'Mission',sub_story:'Geschichte',sub_advantage:'Vorteil',sub_companies:'Unternehmen',sub_leadership:'Führung',
    sub_benefits:'Leistungen',sub_development:'Entwicklung',sub_portfolio_overview:'Überblick',sub_portfolio_realestate:'Immobilien',sub_positions:'Offene Stellen',sub_careers_overview:'Überblick',
    stat_aum:'Verwaltete Vermögenswerte',stat_states:'Bundesstaaten',stat_units:'Verwaltete Einheiten',stat_years:'Jahre Exzellenz',
    home_cta_portfolio:'Portfolio Ansehen',home_cta_about:'Unsere Geschichte',
    hero_title:'Pendleton Companies',hero_scroll:'Scrollen',hero_subtitle:'IMMOBILIEN • ANDERS GEBAUT',
    re_tab_overview:'Überblick',re_tab_holdings:'Bestände',re_tab_pm:'Hausverwaltung',re_tab_construction:'Bau',re_tab_lending:'Kreditvergabe',
    footer_copy:'© 2024 Pendleton Companies. Alle Rechte vorbehalten.',footer_privacy:'Datenschutz',footer_terms:'Nutzungsbedingungen',
  },
  zh: {
    nav_home:'主页',nav_about:'关于我们',nav_portfolio:'项目组合',nav_careers:'职业机会',nav_portal:'门户',
    sub_mission:'使命',sub_story:'故事',sub_advantage:'优势',sub_companies:'公司',sub_leadership:'领导层',
    sub_benefits:'福利',sub_development:'发展',sub_portfolio_overview:'概览',sub_portfolio_realestate:'房地产',sub_positions:'招聘职位',sub_careers_overview:'概览',
    stat_aum:'资产管理规模',stat_states:'州',stat_units:'管理单位',stat_years:'卓越年数',
    home_cta_portfolio:'查看投资组合',home_cta_about:'我们的故事',
    hero_title:'Pendleton Companies',hero_scroll:'滚动',hero_subtitle:'房地产 • 独特构建',
    re_tab_overview:'概览',re_tab_holdings:'持有物业',re_tab_pm:'物业管理',re_tab_construction:'建设',re_tab_lending:'贷款',
    footer_copy:'© 2024 Pendleton Companies. 保留所有权利。',footer_privacy:'隐私政策',footer_terms:'服务条款',
  },
};

const I18n = {
  currentLang: 'en',
  detect() {
    const stored = localStorage.getItem('pc_lang');
    if (stored && translations[stored]) return stored;
    const short = (navigator.language || 'en').split('-')[0].toLowerCase();
    return translations[short] ? short : 'en';
  },
  init() {
    this.currentLang = this.detect();
    this.applyTranslations();
    this.attachLangSwitcher();
  },
  t(key) { return (translations[this.currentLang] || translations.en)[key] || key; },
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { el.placeholder = this.t(key); }
      else { el.textContent = this.t(key); }
    });
    document.documentElement.lang = this.currentLang;
  },
  setLang(lang) {
    if (!translations[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('pc_lang', lang);
    this.applyTranslations();
  },
  attachLangSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (!switcher) return;
    switcher.value = this.currentLang;
    switcher.addEventListener('change', e => this.setLang(e.target.value));
  },
};

/* ============================================================
   2. THEME
   ============================================================ */
const Theme = {
  init() {
    const stored = localStorage.getItem('pc_theme');
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('pc_theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.toggle());
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pc_theme', next);
  },
};

/* ============================================================
   3. NAVBAR
   ============================================================ */
const Navbar = {
  init() {
    this.el = document.querySelector('.navbar');
    if (!this.el) return;
    this.hamburger = this.el.querySelector('.navbar__hamburger');
    this.mobileNav = this.el.querySelector('.navbar__nav');
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    this.onScroll();
    this.hamburger?.addEventListener('click', () => this.toggleMobile());
    this.mobileNav?.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => this.closeMobile());
    });
    this.setActiveLink();
  },
  onScroll() {
    this.el.classList.toggle('nav-active', window.scrollY > 20);
  },
  toggleMobile() {
    const open = this.hamburger.classList.toggle('open');
    this.mobileNav.classList.toggle('mobile-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  },
  closeMobile() {
    this.hamburger?.classList.remove('open');
    this.mobileNav?.classList.remove('mobile-open');
    document.body.style.overflow = '';
  },
  setActiveLink() {
    const path = window.location.pathname;
    this.el?.querySelectorAll('.navbar__link').forEach(link => {
      const href = link.getAttribute('href') || '';
      // Extract the section folder (e.g., "about", "portfolio", "careers", "portal")
      const match = href.match(/pages\/([^/]+)/);
      if (match) {
        const section = match[1]; // e.g., "about", "portfolio", "careers"
        if (path.includes('/pages/' + section + '/') || path.includes('/pages/' + section + '.')) {
          link.classList.add('active');
        }
      }
    });
  },
};

/* ============================================================
   4. SUBNAV
   ============================================================ */
function initSubnav() {
  const path = window.location.pathname;
  document.querySelectorAll('.subnav__link').forEach(link => {
    const href = (link.getAttribute('href') || '').replace(/^\/|\.html$/g, '').split('/').pop();
    if (href && path.includes(href)) link.classList.add('active');
  });
}

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ============================================================
   6. COUNTER ANIMATION
   ============================================================ */
function formatCounterValue(counterEl, value) {
  const prefix = counterEl.dataset.prefix || '';
  const suffix = counterEl.dataset.suffix || '';
  const decimals = Number(counterEl.dataset.decimals || 0);

  let numericPart = '';
  if (decimals > 0) {
    numericPart = Number(value).toFixed(decimals);
  } else {
    numericPart = Math.round(Number(value)).toLocaleString('en-US');
  }

  return `${prefix}${numericPart}${suffix}`;
}

function animateCounterValue(counterEl, duration = 1600) {
  if (!counterEl || counterEl.dataset.countAnimated === 'true') return;

  const target = Number(counterEl.dataset.count || 0);
  if (!Number.isFinite(target)) return;

  counterEl.dataset.countAnimated = 'true';
  const start = performance.now();

  const tick = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    counterEl.textContent = formatCounterValue(counterEl, current);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counterEl.textContent = formatCounterValue(counterEl, target);
    }
  };

  requestAnimationFrame(tick);
}

function animateCounters() {
  // Generic count-up for non-home counters (home is handled by initHomeStatsAnimation)
  const counters = Array.from(document.querySelectorAll('[data-count]')).filter(
    counter => !counter.closest('.home-stats__item--animate')
  );
  if (!counters.length) return;

  counters.forEach(counter => {
    counter.dataset.countAnimated = 'false';
    counter.textContent = formatCounterValue(counter, 0);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounterValue(entry.target, 1500);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  counters.forEach(counter => observer.observe(counter));
}

/* ============================================================
   7. TABS
   ============================================================ */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(tabsEl => {
    const tabs = tabsEl.querySelectorAll('[data-tab]');
    const panels = tabsEl.querySelectorAll('[data-tab-panel]');
    function activate(tabEl) {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      panels.forEach(p => p.classList.remove('active'));
      tabEl.classList.add('active');
      tabEl.setAttribute('aria-selected','true');
      const panel = tabsEl.querySelector(`[data-tab-panel="${tabEl.dataset.tab}"]`);
      if (panel) panel.classList.add('active');
    }
    tabs.forEach(tab => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(tab);} });
    });
    if (tabs[0]) activate(tabs[0]);
  });
}

/* ============================================================
   8. MODAL
   ============================================================ */
const Modal = {
  init() {
    document.querySelectorAll('[data-modal-target]').forEach(t => {
      t.addEventListener('click', () => this.open(t.dataset.modalTarget));
    });
    document.querySelectorAll('[data-modal-close]').forEach(b => {
      b.addEventListener('click', () => this.closeAll());
    });
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', e => { if(e.target===backdrop) this.closeAll(); });
    });
    document.addEventListener('keydown', e => { if(e.key==='Escape') this.closeAll(); });
  },
  open(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  },
  closeAll() {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
    document.body.style.overflow = '';
  },
};

/* ============================================================
   9. LAZY IMAGES
   ============================================================ */
function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
      obs.unobserve(img);
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
}

/* ============================================================
   10. HOME STATS STAGGER ANIMATION
   ============================================================ */
function initHomeStatsAnimation() {
  const items = Array.from(document.querySelectorAll('.home-stats__item--animate'));
  if (!items.length) return;

  items.forEach(item => {
    const counter = item.querySelector('[data-count]');
    if (!counter) return;

    counter.dataset.countAnimated = 'false';
    counter.textContent = formatCounterValue(counter, 0);

    const startCount = () => animateCounterValue(counter, 1800);

    // Start counting when each stat begins fading in.
    item.addEventListener('animationstart', startCount, { once: true });

    // Fallback in case animation events are unavailable/suppressed
    const styles = window.getComputedStyle(item);
    const delayMs = (parseFloat(styles.animationDelay) || 0) * 1000;
    window.setTimeout(startCount, delayMs + 20);
  });
}

/* ============================================================
   11. FOOTER CONTACT FORM
   ============================================================ */
function ensureFooterContactModal() {
  if (document.getElementById('contact-modal')) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.id = 'contact-modal';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-labelledby', 'contact-modal-title');

  backdrop.innerHTML = `
    <div class="modal modal--contact">
      <div class="modal__header">
        <div>
          <h3 class="modal__title" id="contact-modal-title">Contact Pendleton Companies</h3>
          <p class="contact-form__subtitle">Send us a message and our team will follow up shortly.</p>
        </div>
        <button class="modal__close" type="button" aria-label="Close contact form" data-modal-close>&times;</button>
      </div>
      <div class="modal__body">
        <form id="footer-contact-form" class="contact-form" novalidate>
          <div class="contact-form__grid">
            <div class="contact-form__field">
              <label for="contact-name">Full Name</label>
              <input id="contact-name" name="name" type="text" required>
            </div>
            <div class="contact-form__field">
              <label for="contact-email">Email Address</label>
              <input id="contact-email" name="email" type="email" required>
            </div>
          </div>
          <div class="contact-form__grid">
            <div class="contact-form__field">
              <label for="contact-company">Company</label>
              <input id="contact-company" name="company" type="text">
            </div>
            <div class="contact-form__field">
              <label for="contact-phone">Phone</label>
              <input id="contact-phone" name="phone" type="tel">
            </div>
          </div>
          <div class="contact-form__field">
            <label for="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="5" required></textarea>
          </div>
          <div id="contact-form-status" class="contact-form__status" aria-live="polite"></div>
          <div class="modal__footer contact-form__footer">
            <button type="button" class="btn btn--outline" data-modal-close>Cancel</button>
            <button type="submit" class="btn btn--primary">Send Message</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
}

function initFooterContactForm() {
  const footerLinks = Array.from(document.querySelectorAll('.footer a[href^="mailto:"]')).filter(link => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    return href.includes('mailto:info@pendletoncompanies.com');
  });

  if (!footerLinks.length) return;

  ensureFooterContactModal();

  footerLinks.forEach(link => {
    link.setAttribute('href', '#contact');
    link.addEventListener('click', event => {
      event.preventDefault();
      Modal.open('contact-modal');
    });
  });

  const form = document.getElementById('footer-contact-form');
  const status = document.getElementById('contact-form-status');
  if (!form || !status) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const name = form.querySelector('#contact-name')?.value.trim();
    const email = form.querySelector('#contact-email')?.value.trim();
    const message = form.querySelector('#contact-message')?.value.trim();

    if (!name || !email || !message) {
      status.className = 'contact-form__status contact-form__status--error';
      status.textContent = 'Please complete name, email, and message.';
      return;
    }

    status.className = 'contact-form__status contact-form__status--success';
    status.textContent = 'Message sent. Our team will contact you shortly.';
    form.reset();
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  I18n.init();
  Navbar.init();
  initSubnav();
  initReveal();
  animateCounters();
  initTabs();
  initFooterContactForm();
  Modal.init();
  initLazyImages();
  initHomeStatsAnimation();
});
