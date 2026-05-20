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

  const { SIGLAS, progressKey, cccgPicksKey, downloadExport, importAll, clearAllCourseData } = store;

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

    document.getElementById('resetAllDataBtn')?.addEventListener('click', () => {
      const ok = window.confirm(
        'Apagar progresso, CCCGs, horas manuais, anotações de horários e disciplinas avulsas de todos os cursos neste navegador?\n\nTema e tamanho da fonte são mantidos. Esta ação não pode ser desfeita.'
      );
      if (!ok) return;

      clearAllCourseData();

      showFeedback(
        'resetAllFeedback',
        'Todos os dados salvos foram apagados. Recarregue as páginas abertas (grades e Horários) para ver o estado zerado.'
      );
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
