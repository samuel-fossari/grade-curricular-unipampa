/**
 * Tour de navegação contextual (tooltips com destaque nos elementos da interface).
 */
(function (root) {
  'use strict';

  const storage = root.GRADE_WALKTHROUGH_STORAGE;
  if (!storage) return;

  const WAIT_MS = 80;
  const MAX_WAIT_ATTEMPTS = 60;
  const MOBILE_MQ = window.matchMedia('(max-width: 768px)');

  /** @type {{ id: string, title: string, body: string, page?: string, placement?: string, findTarget: () => Element | null }[]} */
  const STEPS = [
    {
      id: 'sidebar',
      title: 'Menu lateral',
      body: 'Por aqui você alterna entre a tela inicial, seu curso, horários, FAQ e acessibilidade. Se estiver logado, o Perfil também aparece.',
      findTarget: () => document.getElementById('sidebar'),
      placement: 'right',
    },
    {
      id: 'progress',
      title: 'Progresso na grade',
      body: 'Essa barra resume quanto da grade você já concluiu. Os números logo abaixo mostram disponíveis, bloqueadas e em andamento.',
      page: 'grade',
      findTarget: () => {
        root.setGradeStripOpen?.(true);
        return (
          document.getElementById('legend-collapsible') ||
          document.querySelector('.page-strip .course-progress-row') ||
          document.querySelector('.page-strip')
        );
      },
      placement: 'bottom',
    },
    {
      id: 'search',
      title: 'Busca e filtros',
      body: 'Digite o nome ou código para achar uma disciplina. Os filtros por status ajudam a focar no que importa agora.',
      page: 'grade',
      findTarget: () => document.getElementById('gradeToolbar'),
      placement: 'bottom',
    },
    {
      id: 'disc-card',
      title: 'Cartões da grade',
      body: 'Clique nos três pontinhos de cada card para mudar o status ou abrir detalhes e ementa.',
      page: 'grade',
      findTarget: () => {
        const cards = document.querySelectorAll('.disc-card');
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            return card.querySelector('.disc-menu-trigger') || card;
          }
        }
        return null;
      },
      placement: 'bottom',
    },
    {
      id: 'horarios',
      title: 'Horários do semestre',
      body: 'Na página Horários você organiza a semana das disciplinas que está cursando, com sala e professor.',
      findTarget: () => document.querySelector('a.sb-item[href*="horarios.html"]'),
      placement: 'right',
    },
    {
      id: 'faq',
      title: 'Dúvidas frequentes',
      body: 'O FAQ explica siglas como CCOG e CCCG, além de backup e outras dúvidas comuns.',
      findTarget: () => document.querySelector('a.sb-item[href*="faq.html"]'),
      placement: 'right',
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

  async function waitForTarget(findTarget, attempt = 0) {
    const el = findTarget();
    if (el) return el;
    if (attempt >= MAX_WAIT_ATTEMPTS) return null;
    return new Promise((resolve) => {
      setTimeout(() => resolve(waitForTarget(findTarget, attempt + 1)), WAIT_MS);
    });
  }

  function resolvePlacement(step) {
    if (MOBILE_MQ.matches) {
      if (step.id === 'sidebar') return 'bottom';
      if (step.id === 'horarios' || step.id === 'faq') return 'bottom';
    }
    return step.placement || 'bottom';
  }

  function prepareTarget(step, target) {
    if (step.id === 'sidebar') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar?.classList.contains('collapsed')) {
        document.getElementById('sidebar-toggle')?.click();
      }
    }
    if (step.id === 'progress') {
      root.setGradeStripOpen?.(true);
    }
    target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }

  function positionTourUi(target, spotlight, card, placement) {
    const rect = target.getBoundingClientRect();
    const pad = 10;
    const holeTop = Math.max(0, rect.top - pad);
    const holeLeft = Math.max(0, rect.left - pad);
    const holeW = Math.min(window.innerWidth - holeLeft, rect.width + pad * 2);
    const holeH = Math.min(window.innerHeight - holeTop, rect.height + pad * 2);

    spotlight.style.top = `${holeTop}px`;
    spotlight.style.left = `${holeLeft}px`;
    spotlight.style.width = `${holeW}px`;
    spotlight.style.height = `${holeH}px`;
    spotlight.hidden = false;

    card.style.transform = '';
    card.style.visibility = 'hidden';
    card.style.display = 'block';
    const cardW = card.offsetWidth;
    const cardH = card.offsetHeight;
    card.style.visibility = '';

    const gap = 14;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let cardTop;
    let cardLeft;
    let finalPlacement = placement;

    if (placement === 'right') {
      cardLeft = holeLeft + holeW + gap;
      cardTop = holeTop + holeH / 2 - cardH / 2;
      if (cardLeft + cardW > vw - 12) {
        finalPlacement = 'bottom';
        cardTop = holeTop + holeH + gap;
        cardLeft = holeLeft + holeW / 2 - cardW / 2;
      }
    } else if (placement === 'left') {
      cardLeft = holeLeft - cardW - gap;
      cardTop = holeTop + holeH / 2 - cardH / 2;
      if (cardLeft < 12) {
        finalPlacement = 'bottom';
        cardTop = holeTop + holeH + gap;
        cardLeft = holeLeft + holeW / 2 - cardW / 2;
      }
    } else {
      cardTop = holeTop + holeH + gap;
      cardLeft = holeLeft + holeW / 2 - cardW / 2;
      if (cardTop + cardH > vh - 12) {
        finalPlacement = 'top';
        cardTop = holeTop - cardH - gap;
      }
    }

    cardTop = Math.max(12, Math.min(cardTop, vh - cardH - 12));
    cardLeft = Math.max(12, Math.min(cardLeft, vw - cardW - 12));

    card.style.top = `${cardTop}px`;
    card.style.left = `${cardLeft}px`;
    card.dataset.placement = finalPlacement;

    const targetCenterX = holeLeft + holeW / 2;
    const targetCenterY = holeTop + holeH / 2;
    card.style.setProperty('--wt-arrow-left', `${Math.max(18, Math.min(cardW - 18, targetCenterX - cardLeft))}px`);
    card.style.setProperty('--wt-arrow-top', `${Math.max(18, Math.min(cardH - 18, targetCenterY - cardTop))}px`);
  }

  async function showStep(i) {
    const steps = stepsForPage();
    if (!steps.length) {
      finish();
      return;
    }
    stepIndex = Math.max(0, Math.min(steps.length - 1, i));
    const step = steps[stepIndex];
    const target = await waitForTarget(step.findTarget);

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
      prepareTarget(step, target);
      await new Promise((r) => setTimeout(r, step.id === 'progress' ? 320 : 280));
      const highlight = step.findTarget() || target;
      positionTourUi(highlight, spotlight, card, resolvePlacement(step));
    } else {
      spotlight.hidden = true;
      card.dataset.placement = 'center';
      card.style.top = '50%';
      card.style.left = '50%';
      card.style.transform = 'translate(-50%, -50%)';
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
    const delay = pageKind() === 'grade' ? 900 : 400;
    const start = () => setTimeout(open, delay);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  }

  root.GRADE_NAV_TOUR = { open, finish, init };
  init();
})(typeof globalThis !== 'undefined' ? globalThis : window);
