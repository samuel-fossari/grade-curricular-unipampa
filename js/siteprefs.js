/**
 * @file siteprefs.js
 * @description Preferências globais de tema e tamanho de fonte.
 *
 * Persistência: `grade_unipampa_theme_v1`, `grade_unipampa_font_v1`
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Constantes
   * ========================================================================== */

  const THEME_KEY = 'grade_unipampa_theme_v1';
  const FONT_KEY = 'grade_unipampa_font_v1';
  const FONT_SIZES = [14, 16, 18];
  const VALID_THEMES = ['light', 'dark', 'contrast', 'ocean', 'sepia', 'nord'];
  const PREMIUM_THEMES = ['ocean', 'sepia', 'nord'];

  /* ==========================================================================
   * Fonte
   * ========================================================================== */

  /** @returns {number} Tamanho em px (14, 16 ou 18). */
  function readFontPx() {
    const raw = localStorage.getItem(FONT_KEY);
    const n = parseInt(raw || '16', 10);
    return FONT_SIZES.includes(n) ? n : 16;
  }

  /** @param {number} px */
  function fontIndex(px) {
    const i = FONT_SIZES.indexOf(px);
    return i < 0 ? 1 : i;
  }

  /** Aplica tamanho de fonte na raiz do documento. */
  function applyFont(px) {
    const n = FONT_SIZES.includes(px) ? px : 16;
    document.documentElement.style.fontSize = n + 'px';
    document.documentElement.style.setProperty('--base-font-size', n + 'px');
    localStorage.setItem(FONT_KEY, String(n));
  }

  /* ==========================================================================
   * Tema
   * ========================================================================== */

  function isAccountUser() {
    return window.GRADE_PROFILE?.isAccountUser?.() === true;
  }

  function normalizeTheme(theme) {
    let t = VALID_THEMES.includes(theme) ? theme : 'light';
    if (PREMIUM_THEMES.includes(t) && !isAccountUser()) t = 'light';
    return t;
  }

  /** @param {string} theme */
  function applyTheme(theme) {
    const v = normalizeTheme(theme);
    document.documentElement.setAttribute('data-theme', v);
    localStorage.setItem(THEME_KEY, v);
    const sel = document.getElementById('themeSel');
    if (sel && sel.value !== v) sel.value = v;
    updateThemeSelectVisibility();
  }

  /** Revela temas de conta no select de Acessibilidade. */
  function updateThemeSelectVisibility() {
    const show = isAccountUser();
    document.querySelectorAll('#themeSel option.theme-premium').forEach((opt) => {
      opt.hidden = !show;
      opt.disabled = !show;
    });
  }

  /** Ao sair da conta: temas premium voltam para claro. */
  function resetPremiumThemeOnLogout() {
    const t = localStorage.getItem(THEME_KEY);
    if (PREMIUM_THEMES.includes(t)) applyTheme('light');
    else updateThemeSelectVisibility();
  }

  function reapplyFromStorage() {
    applyTheme(localStorage.getItem(THEME_KEY) || 'light');
    applyFont(readFontPx());
  }

  /* ==========================================================================
   * Inicialização
   * ========================================================================== */

  function init() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    applyTheme(savedTheme || 'light');
    applyFont(readFontPx());

    const themeSel = document.getElementById('themeSel');
    if (themeSel) {
      themeSel.value = document.documentElement.getAttribute('data-theme') || 'light';
      themeSel.addEventListener('change', () => applyTheme(themeSel.value));
    }
    updateThemeSelectVisibility();

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

  window.GRADE_SITEPREFS = {
    applyTheme,
    applyFont,
    reapplyFromStorage,
    updateThemeSelectVisibility,
    resetPremiumThemeOnLogout,
    PREMIUM_THEMES,
  };
})();
