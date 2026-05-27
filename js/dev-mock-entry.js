/**
 * @file dev-mock-entry.js
 * @description Entrada mock na tela inicial — só localhost ou ?dev=1 (não usar em produção).
 */
(function () {
  'use strict';

  const DEV_MOCK_KEY = 'grade_unipampa_dev_mock_v1';
  const profile = window.GRADE_PROFILE;
  if (!profile) return;

  function isDevHost() {
    const h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
    return new URLSearchParams(location.search).get('dev') === '1';
  }

  function isDevMockActive() {
    return localStorage.getItem(DEV_MOCK_KEY) === 'true' && profile.isAccountUser();
  }

  function setDevMockActive(on) {
    if (on) localStorage.setItem(DEV_MOCK_KEY, 'true');
    else localStorage.removeItem(DEV_MOCK_KEY);
  }

  function clearMockAccount() {
    setDevMockActive(false);
    profile.setGuest(false);
    profile.clearLoggedIn();
    window.GRADE_SITEPREFS?.resetPremiumThemeOnLogout?.();
  }

  /** @param {string} sigla */
  function applyMockAccount(sigla) {
    const c = profile.getCurso(sigla);
    if (!c) return false;

    profile.setGuest(false);
    profile.setLoggedIn(true);
    setDevMockActive(true);
    profile.saveProfile({
      nome: 'Dev (mock)',
      curso: sigla,
      periodo: 3,
      anoIngresso: 2024,
      onboardingDone: true,
    });
    window.GRADE_SITEPREFS?.updateThemeSelectVisibility?.();
    const saved = localStorage.getItem('grade_unipampa_theme_v1');
    if (saved) window.GRADE_SITEPREFS?.applyTheme?.(saved);
    return true;
  }

  function initPanel() {
    const panel = document.getElementById('indexDevMock');
    const sel = document.getElementById('indexDevCurso');
    const enterBtn = document.getElementById('indexDevEnterBtn');
    const clearBtn = document.getElementById('indexDevClearBtn');
    if (!panel || !sel || !enterBtn) return;

    panel.hidden = false;
    sel.innerHTML = '';
    for (const c of profile.CURSOS) {
      const opt = document.createElement('option');
      opt.value = c.sigla;
      opt.textContent = `${c.name} (${c.sigla.toUpperCase()})`;
      sel.appendChild(opt);
    }

    const p = profile.readProfile();
    if (p.curso && profile.getCurso(p.curso)) sel.value = p.curso;
    else sel.value = 'es';

    enterBtn.addEventListener('click', () => {
      const sigla = sel.value;
      if (!applyMockAccount(sigla)) return;
      const c = profile.getCurso(sigla);
      window.location.href = profile.courseHref(c.html, false);
    });

    clearBtn?.addEventListener('click', () => {
      clearMockAccount();
      window.location.href = 'index.html';
    });
  }

  if (isDevHost() && window.GRADE_INDEX_ENTRY?.isIndexHub?.()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initPanel);
    } else {
      initPanel();
    }
  }

  window.GRADE_DEV_MOCK = {
    DEV_MOCK_KEY,
    isDevHost,
    isDevMockActive,
    applyMockAccount,
    clearMockAccount,
    devMockStatusLabel() {
      if (!isDevMockActive()) return null;
      const p = profile.readProfile();
      const c = profile.getCurso(p.curso);
      return c ? `Teste local — ${c.name}` : 'Teste local — conta mock';
    },
  };
})();
