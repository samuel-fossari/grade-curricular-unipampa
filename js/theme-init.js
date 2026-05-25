/** Aplica tema salvo antes do paint (evita flash). Padrão: claro. */
(function () {
  'use strict';
  var t = localStorage.getItem('grade_unipampa_theme_v1');
  var v = t === 'dark' || t === 'light' || t === 'contrast' ? t : 'light';
  document.documentElement.setAttribute('data-theme', v);
})();
