/**
 * Walkthrough de apresentação na tela inicial (carrossel antes do uso do sistema).
 */
(function (root) {
  'use strict';

  const storage = root.GRADE_WALKTHROUGH_STORAGE;
  if (!storage) return;

  const SLIDES = [
    {
      icon: 'ti-school',
      title: 'Bem-vindo',
      body:
        'Este site reúne as grades dos sete cursos do campus Alegrete. Foi feito por um aluno de Engenharia de Software, como projeto de TCC.',
      note: 'Não é um sistema oficial da UNIPAMPA. Os dados vêm dos PPCs públicos e podem ter imprecisões.',
    },
    {
      icon: 'ti-checkbox',
      title: 'Sua grade na palma da mão',
      body:
        'Marque o que você já cursou, o que está fazendo e o que ainda falta. A grade mostra sozinha o que você pode matricular, de acordo com os pré-requisitos.',
      note: 'Cada cor indica um status: disponível, bloqueada, em andamento ou concluída.',
    },
    {
      icon: 'ti-books',
      title: 'Complementares e integralização',
      body:
        'Nos slots de CCCG você escolhe as disciplinas complementares do seu curso. Dá para acompanhar a carga horária de CCOG, CCCG, extensão e atividades complementares.',
      note: 'Serve para planejar a formação. Na dúvida, vale confirmar com a coordenação.',
    },
    {
      icon: 'ti-calendar-week',
      title: 'Horários, conta e backup',
      body:
        'Monte sua agenda semanal com as disciplinas em andamento. Pode usar sem criar conta: tudo fica salvo só neste navegador. Com conta, você sincroniza na nuvem.',
      note: 'Em Acessibilidade você exporta um backup em JSON para não perder seu progresso.',
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
      `<div class="wt-intro__backdrop"></div>` +
      `<div class="wt-intro__panel">` +
      `<p id="wt-intro-heading" class="wt-intro__kicker">Oi! É sua primeira vez por aqui?</p>` +
      `<div class="wt-intro__viewport">` +
      `<button type="button" class="wt-intro__tap wt-intro__tap--prev" data-wt-prev aria-label="Slide anterior"></button>` +
      `<div class="wt-intro__track">${slidesHtml}</div>` +
      `<button type="button" class="wt-intro__tap wt-intro__tap--next" data-wt-next aria-label="Próximo slide"></button>` +
      `</div>` +
      `<div class="wt-intro__footer">` +
      `<div class="wt-intro__dots" role="tablist" aria-label="Slides">${dotsHtml}</div>` +
      `<div class="wt-intro__actions">` +
      `<button type="button" class="a11y-btn a11y-btn--ghost wt-intro__btn-skip" data-wt-skip>Pular</button>` +
      `<div class="wt-intro__nav">` +
      `<button type="button" class="a11y-btn wt-intro__btn-prev" data-wt-prev>Anterior</button>` +
      `<button type="button" class="a11y-btn a11y-btn--primary wt-intro__btn-next" data-wt-next>Próximo</button>` +
      `</div>` +
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
