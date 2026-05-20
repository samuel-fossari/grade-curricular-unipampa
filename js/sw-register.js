/**
 * @file sw-register.js
 * @description Registra o Service Worker para cache offline dos arquivos estáticos.
 */
(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  const inCursos = /\/cursos\//.test(window.location.pathname);
  const base = inCursos ? '../' : './';

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(base + 'sw.js', { scope: base })
      .catch(() => {
        /* Falha silenciosa — site continua online-only */
      });
  });
})();
