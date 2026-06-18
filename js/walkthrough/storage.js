/**
 * Persistência do walkthrough (intro + tour de navegação).
 */
(function (root) {
  'use strict';

  const INTRO_KEY = 'grade_unipampa_walkthrough_intro_v1';
  const NAV_TOUR_KEY = 'grade_unipampa_walkthrough_nav_v1';

  /**
   * Só para testes locais. Com `true`, intro e tour aparecem a cada recarregamento.
   * Voltar para `false` antes de publicar.
   */
  const ALWAYS_SHOW_WALKTHROUGH = false;

  function readFlag(key) {
    try {
      return localStorage.getItem(key) === '1';
    } catch {
      return false;
    }
  }

  function writeFlag(key, done) {
    try {
      if (done) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch {
      /* storage indisponível */
    }
  }

  function replayRequested(kind) {
    const params = new URLSearchParams(window.location.search);
    const replay = params.get('replay-tour');
    return replay === kind || replay === 'all';
  }

  root.GRADE_WALKTHROUGH_STORAGE = {
    INTRO_KEY,
    NAV_TOUR_KEY,
    ALWAYS_SHOW_WALKTHROUGH,
    isIntroDone: () => readFlag(INTRO_KEY),
    setIntroDone: (done = true) => writeFlag(INTRO_KEY, done),
    isNavTourDone: () => readFlag(NAV_TOUR_KEY),
    setNavTourDone: (done = true) => writeFlag(NAV_TOUR_KEY, done),
    shouldShowIntro: () =>
      ALWAYS_SHOW_WALKTHROUGH || !readFlag(INTRO_KEY) || replayRequested('intro'),
    shouldShowNavTour: () =>
      ALWAYS_SHOW_WALKTHROUGH || !readFlag(NAV_TOUR_KEY) || replayRequested('nav'),
    replayRequested,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
