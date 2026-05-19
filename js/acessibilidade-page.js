/**
 * Página Acessibilidade: reset de progresso por curso e reset global (localStorage).
 */
(function () {
  'use strict';

  const SIGLAS = ['es', 'cc', 'ec', 'ee', 'em', 'ea', 'et'];

  function progressKey(sigla) {
    return `grade_unipampa_${sigla}_progress_v1`;
  }

  function cccgPicksKey(sigla) {
    return `grade_unipampa_${sigla}_cccg_picks_v1`;
  }

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
    const t = document.getElementById('resetFeedback');
    if (t) {
      t.textContent =
        'Progresso de ' +
        sigla.toUpperCase() +
        ' resetado. Recarregue a página do curso para ver os cartões zerados.';
      t.hidden = false;
    }
  });

  document.getElementById('resetAllProgressBtn')?.addEventListener('click', () => {
    const ok = window.confirm(
      'Isso apagará o progresso de todos os 7 cursos. Continuar?'
    );
    if (!ok) return;
    for (const sigla of SIGLAS) {
      localStorage.removeItem(progressKey(sigla));
      localStorage.removeItem(cccgPicksKey(sigla));
    }
    const t = document.getElementById('resetAllFeedback');
    if (t) {
      t.textContent = 'Progresso de todos os cursos foi resetado.';
      t.hidden = false;
    }
  });
})();
