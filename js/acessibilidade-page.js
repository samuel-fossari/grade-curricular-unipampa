/**
 * @file acessibilidade-page.js
 * @description Handlers da página Acessibilidade: reset de progresso e backup JSON.
 *
 * Depende de `window.GRADE_STORAGE` (grade-storage.js).
 */
(function () {
  'use strict';

  const store = window.GRADE_STORAGE;
  if (!store) return;

  const { SIGLAS, progressKey, cccgPicksKey, downloadExport, importAll } = store;

  /* ==========================================================================
   * Feedback visual
   * ========================================================================== */

  /**
   * @param {string} id ID do elemento de feedback
   * @param {string} message
   */
  function showFeedback(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
  }

  /* ==========================================================================
   * Reset de progresso
   * ========================================================================== */

  function setupResetHandlers() {
    document.getElementById('resetProgressBtn')?.addEventListener('click', () => {
      const sel = document.getElementById('courseResetSelect');
      const sigla = sel && sel.value ? String(sel.value).toLowerCase() : '';
      if (!SIGLAS.includes(sigla)) return;

      const ok = window.confirm(
        'Tem certeza? Todo o progresso salvo deste curso será apagado neste navegador. Esta ação não pode ser desfeita.'
      );
      if (!ok) return;

      localStorage.removeItem(progressKey(sigla));
      localStorage.removeItem(cccgPicksKey(sigla));
      localStorage.removeItem(store.manualChKey(sigla));

      showFeedback(
        'resetFeedback',
        'Progresso de ' + sigla.toUpperCase() + ' resetado. Recarregue a página do curso para ver os cartões zerados.'
      );
    });

    document.getElementById('resetAllProgressBtn')?.addEventListener('click', () => {
      const ok = window.confirm(
        'Isso apagará o progresso e CCCGs de todos os 7 cursos neste navegador. Anotações de horários e preferências de tema/fonte são mantidas. Continuar?'
      );
      if (!ok) return;

      for (const sigla of SIGLAS) {
        localStorage.removeItem(progressKey(sigla));
        localStorage.removeItem(cccgPicksKey(sigla));
        localStorage.removeItem(store.manualChKey(sigla));
      }

      showFeedback('resetAllFeedback', 'Progresso de todos os cursos foi resetado.');
    });
  }

  /* ==========================================================================
   * Export / import de backup
   * ========================================================================== */

  function setupBackupHandlers() {
    document.getElementById('exportBackupBtn')?.addEventListener('click', () => {
      try {
        downloadExport();
        showFeedback('backupFeedback', 'Backup exportado. Guarde o arquivo JSON em local seguro.');
      } catch (err) {
        window.alert('Não foi possível exportar: ' + (err.message || err));
      }
    });

    document.getElementById('importBackupBtn')?.addEventListener('click', () => {
      document.getElementById('importBackupFile')?.click();
    });

    document.getElementById('importBackupFile')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const merge = document.getElementById('importMergeCheck')?.checked;
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(String(reader.result || ''));
          if (!merge) {
            const ok = window.confirm(
              'Importar substituindo os dados locais atuais? Recomendamos exportar um backup antes.'
            );
            if (!ok) return;
          }
          importAll(data, { merge });
          showFeedback('backupFeedback', 'Backup importado com sucesso. Recarregue as páginas abertas se necessário.');
        } catch (err) {
          window.alert('Não foi possível importar: ' + (err.message || err));
        } finally {
          e.target.value = '';
        }
      };

      reader.readAsText(file);
    });
  }

  /* ==========================================================================
   * Inicialização
   * ========================================================================== */

  setupResetHandlers();
  setupBackupHandlers();
})();
