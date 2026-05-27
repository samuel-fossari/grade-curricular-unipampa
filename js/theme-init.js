/** Aplica tema salvo antes do paint (evita flash). Padrão: claro. */
(function () {
  'use strict';
  var VALID = ['light', 'dark', 'contrast', 'ocean', 'sepia', 'nord'];
  var PREMIUM = ['ocean', 'sepia', 'nord'];
  var t = localStorage.getItem('grade_unipampa_theme_v1');
  var v = VALID.indexOf(t) >= 0 ? t : 'light';
  var loggedIn =
    localStorage.getItem('grade_unipampa_logged_in_v1') === 'true' &&
    localStorage.getItem('grade_unipampa_guest_v1') !== 'true';
  if (PREMIUM.indexOf(v) >= 0 && !loggedIn) v = 'light';
  document.documentElement.setAttribute('data-theme', v);
})();
