/**
 * Aviso discreto para exportar backup JSON (primeira visita ou após marcar progresso).
 */
(function () {
  'use strict';

  const DISMISS_KEY = 'grade_unipampa_backup_nudge_dismiss_v1';
  const EXPORTED_KEY = 'grade_unipampa_backup_exported_v1';
  const SIGLAS = ['es', 'cc', 'ec', 'ee', 'em', 'ea', 'et'];

  function hasBackupExported() {
    return localStorage.getItem(EXPORTED_KEY) === '1';
  }

  function isDismissed() {
    return localStorage.getItem(DISMISS_KEY) === '1';
  }

  function shouldShow() {
    return !isDismissed() && !hasBackupExported();
  }

  function hasAnyProgress() {
    for (const sigla of SIGLAS) {
      try {
        const raw = localStorage.getItem(`grade_unipampa_${sigla}_progress_v1`);
        if (!raw || raw === '{}') continue;
        const data = JSON.parse(raw);
        if (
          data &&
          typeof data === 'object' &&
          Object.values(data).some((v) => v === 'done' || v === 'in_progress')
        ) {
          return true;
        }
      } catch {
        /* ignore */
      }
    }
    return false;
  }

  function a11yHref() {
    const path = window.location.pathname || '';
    return path.includes('/cursos/') ? '../acessibilidade.html' : 'acessibilidade.html';
  }

  function hideBanner() {
    document.getElementById('backup-nudge')?.remove();
  }

  function showBanner(mode) {
    if (!shouldShow()) {
      hideBanner();
      return;
    }
    if (document.getElementById('backup-nudge')) return;

    const host =
      document.querySelector('.page-header') ||
      document.querySelector('.main-content') ||
      document.body;

    const banner = document.createElement('div');
    banner.id = 'backup-nudge';
    banner.className = 'backup-nudge';
    banner.setAttribute('role', 'status');

    const text =
      mode === 'progress'
        ? 'Seu progresso fica só neste navegador. Exporte um backup JSON para não perder ao trocar de aparelho.'
        : 'Seus dados ficam salvos apenas neste navegador. Quando começar a marcar a grade, exporte um backup em Acessibilidade.';

    banner.innerHTML =
      `<p class="backup-nudge-text">${text}</p>` +
      `<div class="backup-nudge-actions">` +
      `<a class="backup-nudge-link" href="${a11yHref()}#prefs-backup-h">Exportar backup</a>` +
      `<button type="button" class="backup-nudge-dismiss">Entendi</button>` +
      `</div>`;

    banner.querySelector('.backup-nudge-dismiss')?.addEventListener('click', () => {
      localStorage.setItem(DISMISS_KEY, '1');
      hideBanner();
    });

    host.insertAdjacentElement('afterend', banner);
  }

  function init() {
    if (!shouldShow()) return;
    showBanner(hasAnyProgress() ? 'progress' : 'welcome');
  }

  function onProgressChanged() {
    if (!shouldShow()) return;
    showBanner('progress');
  }

  function markBackupExported() {
    localStorage.setItem(EXPORTED_KEY, '1');
    hideBanner();
  }

  window.GRADE_BACKUP_NUDGE = {
    init,
    onProgressChanged,
    markBackupExported,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
