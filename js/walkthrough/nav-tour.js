/**
 * Tour de navegação contextual (tooltips com destaque nos elementos da interface).
 * Inspirado em tours "just-in-time" (ex.: Product Fruits / FLOWN).
 */
(function (root) {
  'use strict';

  const storage = root.GRADE_WALKTHROUGH_STORAGE;
  if (!storage) return;

  const WAIT_MS = 80;
  const MAX_WAIT_ATTEMPTS = 40;

  /** @type {{ id: string, selector: string, title: string, body: string, page?: string }[]} */
  const STEPS = [
    {
      id: 'sidebar',
      selector: '#sidebar',
      title: 'Menu lateral',
      body: 'Navegue entre a tela inicial, seu curso, horários, FAQ e acessibilidade. Com conta, aparece também o Perfil.',
    },
    {
      id: 'progress',
      selector: '#headerProgressBar, .course-progress-row',
      title: 'Progresso na grade',
      body: 'A barra e os números mostram quantas disciplinas você já concluiu e quantas estão disponíveis ou bloqueadas.',
      page: 'grade',
    },
    {
      id: 'search',
      selector: '#gradeToolbar, #gradeSearch',
      title: 'Busca e filtros',
      body: 'Encontre disciplinas por nome ou código e filtre por status. Use "Disponíveis agora" para ver o que já pode cursar.',
      page: 'grade',
    },
    {
      id: 'disc-card',
      selector: '.disc-card .disc-menu-trigger, .disc-card',
      title: 'Cartões da grade',
      body: 'Abra o menu (⋯) para marcar a disciplina como em andamento ou concluída, ou para ver detalhes e ementa.',
      page: 'grade',
    },
    {
      id: 'horarios',
      selector: 'a.sb-item[href*="horarios.html"]',
      title: 'Horários do semestre',
      body: 'Monte sua agenda semanal com as disciplinas em andamento. Anote horário, sala e professor.',
    },
    {
      id: 'faq',
      selector: 'a.sb-item[href*="faq.html"]',
      title: 'Dúvidas frequentes',
      body: 'Consulte o glossário (CCOG, CCCG, integralização) e orientações sobre backup e exportações.',
    },
  ];

  let stepIndex = 0;
  let active = false;
  let shell = null;
  let resizeTimer = null;

  function pageKind() {
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('/cursos/')) return 'grade';
    if (path.includes('horarios')) return 'horarios';
    return 'other';
  }

  function stepsForPage() {
    const kind = pageKind();
    return STEPS.filter((s) => !s.page || s.page === kind);
  }

  function buildShell() {
    return (
      `<div id="walkthroughNavTour" class="wt-tour" role="dialog" aria-modal="true" aria-labelledby="wt-tour-title" hidden>` +
      `<div class="wt-tour__overlay" aria-hidden="true"></div>` +
      `<div class="wt-tour__spotlight" aria-hidden="true"></div>` +
      `<div class="wt-tour__card">` +
      `<p class="wt-tour__step" id="wt-tour-step-label"></p>` +
      `<h2 class="wt-tour__title" id="wt-tour-title"></h2>` +
      `<p class="wt-tour__body" id="wt-tour-body"></p>` +
      `<div class="wt-tour__actions">` +
      `<button type="button" class="a11y-btn wt-tour__skip" data-wt-tour-skip>Pular tour</button>` +
      `<div class="wt-tour__nav">` +
      `<button type="button" class="a11y-btn wt-tour__prev" data-wt-tour-prev>Anterior</button>` +
      `<button type="button" class="a11y-btn a11y-btn--primary wt-tour__next" data-wt-tour-next>Próximo</button>` +
      `</div>` +
      `</div>` +
      `</div>` +
      `</div>`
    );
  }

  function waitForSelector(selector, attempt = 0) {
    const el = document.querySelector(selector);
    if (el) return Promise.resolve(el);
    if (attempt >= MAX_WAIT_ATTEMPTS) return Promise.resolve(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(waitForSelector(selector, attempt + 1));
      }, WAIT_MS);
    });
  }

  function positionSpotlight(target, spotlight, card) {
    if (!target || !spotlight || !card) return;
    const rect = target.getBoundingClientRect();
    const pad = 8;
    const top = Math.max(8, rect.top - pad);
    const left = Math.max(8, rect.left - pad);
    const width = rect.width + pad * 2;
    const height = rect.height + pad * 2;

    spotlight.style.top = `${top}px`;
    spotlight.style.left = `${left}px`;
    spotlight.style.width = `${width}px`;
    spotlight.style.height = `${height}px`;

    const cardRect = card.getBoundingClientRect();
    const gap = 12;
    let cardTop = top + height + gap;
    if (cardTop + cardRect.height > window.innerHeight - 12) {
      cardTop = Math.max(12, top - cardRect.height - gap);
    }
    let cardLeft = left;
    if (cardLeft + cardRect.width > window.innerWidth - 12) {
      cardLeft = window.innerWidth - cardRect.width - 12;
    }
    card.style.top = `${cardTop}px`;
    card.style.left = `${Math.max(12, cardLeft)}px`;
  }

  async function showStep(i) {
    const steps = stepsForPage();
    if (!steps.length) {
      finish();
      return;
    }
    stepIndex = Math.max(0, Math.min(steps.length - 1, i));
    const step = steps[stepIndex];
    const target = await waitForSelector(step.selector);

    if (!shell) return;
    const title = shell.querySelector('#wt-tour-title');
    const body = shell.querySelector('#wt-tour-body');
    const label = shell.querySelector('#wt-tour-step-label');
    const prevBtn = shell.querySelector('[data-wt-tour-prev]');
    const nextBtn = shell.querySelector('[data-wt-tour-next]');
    const spotlight = shell.querySelector('.wt-tour__spotlight');
    const card = shell.querySelector('.wt-tour__card');

    if (title) title.textContent = step.title;
    if (body) body.textContent = step.body;
    if (label) label.textContent = `Passo ${stepIndex + 1} de ${steps.length}`;
    if (prevBtn) prevBtn.hidden = stepIndex === 0;
    if (nextBtn) nextBtn.textContent = stepIndex === steps.length - 1 ? 'Concluir' : 'Próximo';

    if (target) {
      target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      await new Promise((r) => setTimeout(r, 200));
      if (card) card.style.transform = '';
      positionSpotlight(target, spotlight, card);
      spotlight.hidden = false;
    } else {
      spotlight.hidden = true;
      if (card) {
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-50%, -50%)';
      }
    }
  }

  function finish() {
    if (!shell) return;
    shell.hidden = true;
    document.body.classList.remove('wt-tour-open');
    active = false;
    storage.setNavTourDone(true);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize, true);
  }

  function next() {
    const steps = stepsForPage();
    if (stepIndex >= steps.length - 1) {
      finish();
      return;
    }
    showStep(stepIndex + 1);
  }

  function prev() {
    if (stepIndex <= 0) return;
    showStep(stepIndex - 1);
  }

  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => showStep(stepIndex), 120);
  }

  function bindEvents(el) {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-wt-tour-skip]')) finish();
      else if (e.target.closest('[data-wt-tour-next]')) next();
      else if (e.target.closest('[data-wt-tour-prev]')) prev();
    });

    document.addEventListener('keydown', (e) => {
      if (!active) return;
      if (e.key === 'Escape') finish();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });
  }

  async function open() {
    if (active) return;
    if (!document.getElementById('sidebar')) return;

    if (!shell) {
      document.body.insertAdjacentHTML('beforeend', buildShell());
      shell = document.getElementById('walkthroughNavTour');
      bindEvents(shell);
    }

    const card = shell.querySelector('.wt-tour__card');
    if (card) card.style.transform = '';

    shell.hidden = false;
    document.body.classList.add('wt-tour-open');
    active = true;
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    await showStep(0);
    shell.querySelector('[data-wt-tour-next]')?.focus();
  }

  function shouldRun() {
    const path = (window.location.pathname || '').replace(/\/$/, '');
    if (path === '' || path.endsWith('/index.html')) return false;
    return storage.shouldShowNavTour();
  }

  function init() {
    if (!shouldRun()) return;
    const start = () => setTimeout(open, 400);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  root.GRADE_NAV_TOUR = { open, finish, init };
  init();
})(typeof globalThis !== 'undefined' ? globalThis : window);
