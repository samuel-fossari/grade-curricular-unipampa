/**
 * @file mobile-nav.js
 * @description Navegação mobile (top bar + drawer) e resumo colapsável da grade.
 *
 * - Drawer lateral em viewports ≤768px
 * - Botão “Resumo da grade” na `.page-strip` (todas as larguras)
 *
 * API exposta: `initMobileNav`, `closeMobileDrawer`, `ensureGradeStripToggle`
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Estado do drawer
   * ========================================================================== */

  const MQ = window.matchMedia('(max-width: 768px)');
  let menuBtn = null;
  let overlay = null;
  let drawer = null;
  let closeBtn = null;
  let lastFocus = null;

  /** @returns {boolean} */
  function isMobile() {
    return MQ.matches;
  }

  /* ==========================================================================
   * Top bar mobile (hambúrguer + marca)
   * ========================================================================== */

  function ensureTopBar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    menuBtn = document.getElementById('mobile-menu-btn');
    const brand = sidebar.querySelector('.sb-brand');
    let top = sidebar.querySelector('.sidebar-mobile-top');

    if (!top && brand) {
      top = document.createElement('div');
      top.className = 'sidebar-mobile-top';
      menuBtn = document.createElement('button');
      menuBtn.type = 'button';
      menuBtn.id = 'mobile-menu-btn';
      menuBtn.className = 'mobile-menu-btn';
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-controls', 'mobile-drawer');
      menuBtn.setAttribute('aria-label', 'Abrir menu de navegação');
      menuBtn.textContent = '☰';
      top.appendChild(menuBtn);
      top.appendChild(brand);
      sidebar.insertBefore(top, sidebar.firstChild);
    } else if (!menuBtn) {
      menuBtn = document.getElementById('mobile-menu-btn');
    }
  }

  /* ==========================================================================
   * Drawer: montagem e controle
   * ========================================================================== */

  /** Replica links da sidebar no corpo do drawer, com separador antes da seção meta. */
  function buildDrawerBody() {
    const body = drawer.querySelector('.mobile-drawer-body');
    if (!body) return;
    body.innerHTML = '';

    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    const items = sidebar.querySelectorAll('.sb-scroll .sb-item');
    let metaStarted = false;
    let horariosSepDone = false;

    items.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const isMeta = !!link.closest('.sb-nav--meta');

      if (!horariosSepDone && href.includes('horarios.html')) {
        horariosSepDone = true;
        const sep = document.createElement('div');
        sep.className = 'mobile-drawer-sep';
        sep.setAttribute('role', 'separator');
        body.appendChild(sep);
      }

      if (isMeta && !metaStarted) {
        metaStarted = true;
        const sep = document.createElement('div');
        sep.className = 'mobile-drawer-sep';
        sep.setAttribute('role', 'separator');
        body.appendChild(sep);
      }

      const a = document.createElement('a');
      a.className = 'mobile-drawer-item';
      if (link.classList.contains('active')) a.classList.add('active');
      a.href = href;
      a.title = link.getAttribute('title') || '';
      const icon = link.querySelector('.ti');
      if (icon) {
        const ic = icon.cloneNode(true);
        ic.setAttribute('aria-hidden', 'true');
        a.appendChild(ic);
      }
      const text = link.querySelector('.sb-text');
      const label = document.createElement('span');
      label.className = 'mobile-drawer-item__label';
      label.textContent = text
        ? text.textContent
        : link.textContent.replace(/\s+/g, ' ').trim();
      a.appendChild(label);
      body.appendChild(a);
    });
  }

  function ensureDrawer() {
    overlay = document.getElementById('mobile-overlay');
    drawer = document.getElementById('mobile-drawer');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'mobile-overlay';
      overlay.className = 'mobile-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      document.body.appendChild(overlay);
    }

    if (!drawer) {
      drawer = document.createElement('nav');
      drawer.id = 'mobile-drawer';
      drawer.className = 'mobile-drawer';
      drawer.setAttribute('aria-label', 'Navegação principal');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.innerHTML = `
        <div class="mobile-drawer-head">
          <span class="mobile-drawer-title">Menu</span>
          <button type="button" class="mobile-drawer-close" aria-label="Fechar menu">×</button>
        </div>
        <div class="mobile-drawer-body"></div>
      `;
      document.body.appendChild(drawer);
    }

    closeBtn = drawer.querySelector('.mobile-drawer-close');
    buildDrawerBody();
  }

  function openDrawer() {
    if (!isMobile() || !drawer || !overlay || !menuBtn) return;
    buildDrawerBody();
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    overlay.removeAttribute('aria-hidden');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Fechar menu de navegação');
    document.body.classList.add('mobile-drawer-open');
    const first = drawer.querySelector('.mobile-drawer-close, .mobile-drawer-item');
    if (first && typeof first.focus === 'function') first.focus();
  }

  /** @returns {boolean} Verdadeiro se o drawer estava aberto. */
  function closeDrawer() {
    if (!drawer || !overlay || !menuBtn) return false;
    const wasOpen = drawer.classList.contains('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu de navegação');
    document.body.classList.remove('mobile-drawer-open');
    if (wasOpen && lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
    return wasOpen;
  }

  function wireEvents() {
    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) closeDrawer();
      else openDrawer();
    });

    overlay?.addEventListener('click', closeDrawer);
    closeBtn?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer?.classList.contains('open')) {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      }
    });

    MQ.addEventListener('change', (ev) => {
      if (!ev.matches) closeDrawer();
      else scheduleLegendToggle();
    });
  }

  /* ==========================================================================
   * Resumo colapsável da grade (`.page-strip`)
   * ========================================================================== */

  const LEGEND_KEY = 'grade_unipampa_legenda_v1';

  /** Desfaz wrapper colapsável e restaura filhos diretos na strip. */
  function unwrapLegendCollapsible(strip) {
    const inner = strip.querySelector('#legend-collapsible');
    if (!inner) return;
    while (inner.firstChild) {
      strip.insertBefore(inner.firstChild, inner);
    }
    inner.remove();
    strip.querySelector('.legend-toggle-btn')?.remove();
    strip.classList.remove('page-strip--collapsible');
    delete strip.dataset.legendInit;
  }

  /** Monta botão “Resumo da grade” (idempotente; só em páginas com `#grid`). */
  function ensureLegendToggle() {
    if (!document.getElementById('grid')) return;
    const strip = document.querySelector('.page-strip');
    if (!strip) return;

    const existingBtn = strip.querySelector('.legend-toggle-btn');
    if (strip.dataset.legendInit && existingBtn) return;

    if (strip.dataset.legendInit && !existingBtn) {
      unwrapLegendCollapsible(strip);
    }

    if (strip.dataset.legendInit) return;
    strip.dataset.legendInit = '1';
    strip.classList.add('page-strip--collapsible');

    const stored = localStorage.getItem(LEGEND_KEY);
    const savedOpen =
      stored !== null ? stored !== 'closed' : isMobile();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'legend-toggle-btn';
    btn.setAttribute('aria-expanded', String(savedOpen));
    btn.setAttribute('aria-controls', 'legend-collapsible');
    btn.innerHTML =
      '<i class="ti ti-layout-dashboard" aria-hidden="true"></i>' +
      '<span>Resumo da grade</span>' +
      '<span class="legend-toggle-arrow" aria-hidden="true">▾</span>';

    const inner = document.createElement('div');
    inner.id = 'legend-collapsible';
    inner.className = 'legend-collapsible';
    if (savedOpen) inner.classList.add('open');

    while (strip.firstChild) inner.appendChild(strip.firstChild);

    strip.appendChild(btn);
    strip.appendChild(inner);

    btn.addEventListener('click', () => {
      const isOpen = inner.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
      localStorage.setItem(LEGEND_KEY, isOpen ? 'open' : 'closed');
    });
  }

  /** Abre ou fecha o painel “Resumo da grade” (usado pelo tour e por outros fluxos). */
  function setGradeStripOpen(open) {
    scheduleLegendToggle();
    const inner = document.getElementById('legend-collapsible');
    const btn = document.querySelector('.legend-toggle-btn');
    if (!inner || !btn) return false;

    if (open) {
      inner.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      localStorage.setItem(LEGEND_KEY, 'open');
    } else {
      inner.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      localStorage.setItem(LEGEND_KEY, 'closed');
    }
    return true;
  }

  function scheduleLegendToggle() {
    ensureLegendToggle();
    if (!document.querySelector('.page-strip')?.dataset.legendInit && document.getElementById('grid')) {
      requestAnimationFrame(() => ensureLegendToggle());
    }
  }

  /* ==========================================================================
   * Bootstrap
   * ========================================================================== */

  function initMobileNav() {
    ensureTopBar();
    ensureDrawer();
    wireEvents();
  }

  window.initMobileNav = initMobileNav;
  window.closeMobileDrawer = closeDrawer;
  window.ensureGradeStripToggle = scheduleLegendToggle;
  window.ensureMobileLegendToggle = scheduleLegendToggle;
  window.setGradeStripOpen = setGradeStripOpen;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }

  window.addEventListener('load', scheduleLegendToggle);
  window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) scheduleLegendToggle();
  });
})();
