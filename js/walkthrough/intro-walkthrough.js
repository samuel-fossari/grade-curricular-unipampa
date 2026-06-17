/**
 * Walkthrough de apresentação na tela inicial (carrossel antes do uso do sistema).
 * Inspirado em walkthroughs de onboarding (ex.: Slack) — ver artigo Alura.
 */
(function (root) {
  'use strict';

  const storage = root.GRADE_WALKTHROUGH_STORAGE;
  if (!storage) return;

  const SLIDES = [
    {
      icon: 'ti-layout-grid',
      title: 'Grades curriculares UNIPAMPA',
      body:
        'Projeto acadêmico independente para os sete cursos do campus Alegrete. Acompanhe sua grade, consulte ementas e planeje a matrícula com base nos PPCs públicos.',
      note: 'Não é um sistema oficial da universidade.',
    },
    {
      icon: 'ti-checkbox',
      title: 'Marque seu progresso',
      body:
        'Cada disciplina pode ficar como não iniciada, em andamento ou concluída. O sistema calcula pré-requisitos e mostra o que está liberado ou bloqueado.',
      note: 'As cores na grade indicam disponível, bloqueada, em andamento e concluída.',
    },
    {
      icon: 'ti-books',
      title: 'CCCGs e integralização',
      body:
        'Escolha componentes complementares (CCCG) nos slots da grade e acompanhe a carga horária por categoria — CCOG, CCCG, extensão e atividades complementares.',
      note: 'Use como referência de planejamento; confirme com a coordenação.',
    },
    {
      icon: 'ti-calendar-week',
      title: 'Horários, conta e backup',
      body:
        'Monte a agenda semanal das disciplinas em andamento. Você pode usar sem conta (dados só neste navegador) ou entrar para sincronizar na nuvem.',
      note: 'Exporte um backup JSON em Acessibilidade para não perder o progresso.',
    },
  ];

  let active = false;
  let index = 0;
  let touchStartX = null;

  function buildMarkup() {
    const slidesHtml = SLIDES.map(
      (s, i) =>
        `<article class="wt-intro__slide" data-slide="${i}" aria-hidden="${i === 0 ? 'false' : 'true'}">` +
        `<div class="wt-intro__icon" aria-hidden="true"><i class="ti ${s.icon}"></i></div>` +
        `<h2 class="wt-intro__title">${s.title}</h2>` +
        `<p class="wt-intro__body">${s.body}</p>` +
        (s.note ? `<p class="wt-intro__note">${s.note}</p>` : '') +
        `</article>`
    ).join('');

    const dotsHtml = SLIDES.map(
      (_, i) =>
        `<button type="button" class="wt-intro__dot${i === 0 ? ' is-active' : ''}" data-dot="${i}" aria-label="Slide ${i + 1} de ${SLIDES.length}"></button>`
    ).join('');

    return (
      `<div id="walkthroughIntro" class="wt-intro" role="dialog" aria-modal="true" aria-labelledby="wt-intro-heading" hidden>` +
      `<div class="wt-intro__backdrop" data-wt-dismiss="zone"></div>` +
      `<button type="button" class="wt-intro__skip" data-wt-skip>Pular apresentação</button>` +
      `<div class="wt-intro__panel">` +
      `<p id="wt-intro-heading" class="wt-intro__kicker">Primeira visita</p>` +
      `<div class="wt-intro__viewport">` +
      `<button type="button" class="wt-intro__tap wt-intro__tap--prev" data-wt-prev aria-label="Slide anterior"></button>` +
      `<div class="wt-intro__track">${slidesHtml}</div>` +
      `<button type="button" class="wt-intro__tap wt-intro__tap--next" data-wt-next aria-label="Próximo slide"></button>` +
      `</div>` +
      `<div class="wt-intro__footer">` +
      `<div class="wt-intro__dots" role="tablist" aria-label="Slides">${dotsHtml}</div>` +
      `<div class="wt-intro__actions">` +
      `<button type="button" class="a11y-btn wt-intro__btn-prev" data-wt-prev>Anterior</button>` +
      `<button type="button" class="a11y-btn a11y-btn--primary wt-intro__btn-next" data-wt-next>Próximo</button>` +
      `</div>` +
      `</div>` +
      `</div>` +
      `</div>`
    );
  }

  function getEl() {
    return document.getElementById('walkthroughIntro');
  }

  function updateUi() {
    const el = getEl();
    if (!el) return;
    const track = el.querySelector('.wt-intro__track');
    if (track) track.style.transform = `translateX(-${index * 100}%)`;

    el.querySelectorAll('.wt-intro__slide').forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });

    el.querySelectorAll('.wt-intro__dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    const prevBtn = el.querySelector('.wt-intro__btn-prev');
    const nextBtn = el.querySelector('.wt-intro__btn-next');
    if (prevBtn) prevBtn.hidden = index === 0;
    if (nextBtn) {
      nextBtn.textContent = index === SLIDES.length - 1 ? 'Começar' : 'Próximo';
    }
  }

  function finish() {
    const el = getEl();
    if (!el) return;
    el.hidden = true;
    document.body.classList.remove('wt-intro-open');
    active = false;
    storage.setIntroDone(true);
  }

  function goTo(nextIndex) {
    index = Math.max(0, Math.min(SLIDES.length - 1, nextIndex));
    updateUi();
  }

  function next() {
    if (index >= SLIDES.length - 1) {
      finish();
      return;
    }
    goTo(index + 1);
  }

  function prev() {
    if (index <= 0) return;
    goTo(index - 1);
  }

  function bindEvents(el) {
    el.addEventListener('click', (e) => {
      if (e.target.closest('[data-wt-skip]')) {
        finish();
        return;
      }
      if (e.target.closest('[data-wt-next]')) {
        next();
        return;
      }
      if (e.target.closest('[data-wt-prev]')) {
        prev();
      }
      const dot = e.target.closest('[data-dot]');
      if (dot) goTo(Number(dot.getAttribute('data-dot')));
    });

    el.addEventListener(
      'touchstart',
      (e) => {
        if (!e.changedTouches?.[0]) return;
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );

    el.addEventListener(
      'touchend',
      (e) => {
        if (touchStartX == null || !e.changedTouches?.[0]) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(delta) < 48) return;
        if (delta < 0) next();
        else prev();
      },
      { passive: true }
    );

    document.addEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (!active) return;
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Escape') finish();
  }

  function open() {
    if (active) return;
    let el = getEl();
    if (!el) {
      document.body.insertAdjacentHTML('beforeend', buildMarkup());
      el = getEl();
      bindEvents(el);
    }
    index = 0;
    updateUi();
    el.hidden = false;
    document.body.classList.add('wt-intro-open');
    active = true;
    el.querySelector('.wt-intro__btn-next')?.focus();
  }

  function shouldRunOnIndex() {
    const path = (window.location.pathname || '').replace(/\/$/, '');
    return path === '' || path.endsWith('/index.html');
  }

  function init() {
    if (!shouldRunOnIndex()) return;
    if (!storage.shouldShowIntro()) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', open);
    } else {
      open();
    }
  }

  root.GRADE_INTRO_WALKTHROUGH = { open, finish, init };
  init();
})(typeof globalThis !== 'undefined' ? globalThis : window);
