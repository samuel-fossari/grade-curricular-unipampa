/**
 * Toolbar de busca, filtros e painel “Disponíveis agora”.
 */
(function (root) {
  'use strict';

  const { escapeAttr, escapeHtml } = root.GRADE_DOM;

  /**
   * @param {object} deps
   * @param {object[]} deps.disciplines
   * @param {Element | null} deps.gridEl
   * @param {() => string} deps.getSearchQuery
   * @param {(q: string) => void} deps.setSearchQuery
   * @param {() => string} deps.getStatusFilter
   * @param {(f: string) => void} deps.setStatusFilter
   * @param {(disc: object) => string} deps.displayState
   * @param {() => void} deps.render
   * @param {(disc: object, el: Element) => void} deps.openDialog
   */
  function createGradeToolbar(deps) {
    let ready = false;

    function ensureGradeToolbar() {
      const strip = document.querySelector('.page-strip');
      if (!strip || document.getElementById('gradeToolbar')) return;

      const bar = document.createElement('div');
      bar.id = 'gradeToolbar';
      bar.className = 'grade-toolbar';
      bar.innerHTML =
        '<label class="grade-search-wrap">' +
        '<span class="visually-hidden">Buscar disciplina</span>' +
        '<input type="search" id="gradeSearch" class="grade-search-input" placeholder="Buscar por nome ou código…" autocomplete="off" />' +
        '</label>' +
        '<div class="grade-filter-chips" role="group" aria-label="Filtrar por status">' +
        '<button type="button" class="grade-filter-chip is-active" data-grade-filter="all">Todas</button>' +
        '<button type="button" class="grade-filter-chip" data-grade-filter="ready">Disponíveis</button>' +
        '<button type="button" class="grade-filter-chip" data-grade-filter="in_progress">Em andamento</button>' +
        '<button type="button" class="grade-filter-chip" data-grade-filter="done">Concluídas</button>' +
        '</div>' +
        '<button type="button" id="gradeReadyToggle" class="grade-ready-toggle" aria-expanded="false" aria-controls="gradeReadyPanel">Disponíveis agora</button>';

      const panel = document.createElement('div');
      panel.id = 'gradeReadyPanel';
      panel.className = 'grade-ready-panel';
      panel.hidden = true;
      panel.innerHTML =
        '<h3 class="grade-ready-title">Disciplinas que você pode cursar agora</h3>' +
        '<ul id="gradeReadyList" class="grade-ready-list"></ul>';

      const statsRow = strip.querySelector('.stats-row');
      if (statsRow) {
        strip.insertBefore(panel, statsRow);
        strip.insertBefore(bar, panel);
      } else {
        strip.appendChild(bar);
        strip.appendChild(panel);
      }
    }

    function updateReadyPanel() {
      const list = document.getElementById('gradeReadyList');
      if (!list) return;
      const ready = deps.disciplines.filter((d) => deps.displayState(d) === 'ready');
      list.innerHTML = ready.length
        ? ready
            .map(
              (d) =>
                `<li><button type="button" class="grade-ready-link" data-disc-id="${escapeAttr(d.id)}">${escapeHtml(d.name)}${d.codigo && d.codigo !== '—' ? ` <span class="grade-ready-code">(${escapeHtml(d.codigo)})</span>` : ''}</button></li>`
            )
            .join('')
        : '<li class="grade-ready-empty">Nenhuma disciplina liberada com o progresso atual.</li>';
    }

    function setupGradeToolbar() {
      if (ready || !deps.gridEl) return;
      ensureGradeToolbar();
      const toolbar = document.getElementById('gradeToolbar');
      if (!toolbar) return;
      ready = true;

      let searchTimer = null;
      toolbar.querySelector('#gradeSearch')?.addEventListener('input', (e) => {
        deps.setSearchQuery(e.target.value);
        // Debounce: evita re-render da grade inteira a cada tecla digitada.
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => deps.render(), 150);
      });

      toolbar.querySelectorAll('[data-grade-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          deps.setStatusFilter(btn.getAttribute('data-grade-filter') || 'all');
          toolbar.querySelectorAll('[data-grade-filter]').forEach((b) => {
            b.classList.toggle('is-active', b === btn);
          });
          deps.render();
        });
      });

      document.getElementById('gradeReadyToggle')?.addEventListener('click', () => {
        const panel = document.getElementById('gradeReadyPanel');
        const toggle = document.getElementById('gradeReadyToggle');
        if (!panel || !toggle) return;
        panel.hidden = !panel.hidden;
        toggle.setAttribute('aria-expanded', panel.hidden ? 'false' : 'true');
        if (!panel.hidden) updateReadyPanel();
      });

      document.getElementById('gradeReadyList')?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-disc-id]');
        if (!btn) return;
        const disc = deps.disciplines.find((d) => d.id === btn.getAttribute('data-disc-id'));
        if (!disc) return;
        const card = document.querySelector(`.disc-card[data-disc-id="${disc.id}"]`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          card.focus({ preventScroll: true });
        } else {
          deps.openDialog(disc, btn);
        }
      });
    }

    return { ensureGradeToolbar, setupGradeToolbar, updateReadyPanel };
  }

  root.GRADE_TOOLBAR = { createGradeToolbar };
})(typeof globalThis !== 'undefined' ? globalThis : window);
