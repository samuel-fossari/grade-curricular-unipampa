/**
 * Tema (escuro / claro / alto contraste) e tamanho de fonte — Etapas 4–5 do guia.
 * Persistência: grade_unipampa_theme_v1, grade_unipampa_font_v1
 */
(function () {
  'use strict';

  const THEME_KEY = 'grade_unipampa_theme_v1';
  const FONT_KEY = 'grade_unipampa_font_v1';
  const FONT_SIZES = [14, 16, 18];

  function readFontPx() {
    const raw = localStorage.getItem(FONT_KEY);
    const n = parseInt(raw || '16', 10);
    return FONT_SIZES.includes(n) ? n : 16;
  }

  function fontIndex(px) {
    const i = FONT_SIZES.indexOf(px);
    return i < 0 ? 1 : i;
  }

  function applyFont(px) {
    const n = FONT_SIZES.includes(px) ? px : 16;
    document.documentElement.style.fontSize = n + 'px';
    document.documentElement.style.setProperty('--base-font-size', n + 'px');
    localStorage.setItem(FONT_KEY, String(n));
  }

  function applyTheme(theme) {
    const v = theme === 'light' || theme === 'contrast' || theme === 'dark' ? theme : 'dark';
    document.documentElement.setAttribute('data-theme', v);
    localStorage.setItem(THEME_KEY, v);
    const sel = document.getElementById('themeSel');
    if (sel && sel.value !== v) sel.value = v;
  }

  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme || 'dark');
    applyFont(readFontPx());

    const themeSel = document.getElementById('themeSel');
    if (themeSel) {
      themeSel.value = document.documentElement.getAttribute('data-theme') || 'dark';
      themeSel.addEventListener('change', () => applyTheme(themeSel.value));
    }

    document.getElementById('fontDec')?.addEventListener('click', () => {
      const i = fontIndex(readFontPx());
      applyFont(FONT_SIZES[Math.max(0, i - 1)]);
    });
    document.getElementById('fontInc')?.addEventListener('click', () => {
      const i = fontIndex(readFontPx());
      applyFont(FONT_SIZES[Math.min(FONT_SIZES.length - 1, i + 1)]);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
