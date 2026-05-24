/**
 * Renderização da grade — grid, estatísticas, CH e exportação.
 */
(function (root) {
  'use strict';

  const { escapeAttr, escapeHtml, isMobileViewport, showToast } = root.GRADE_DOM;
  const { cardMatchesFilter } = root.GRADE_SEARCH;

  /**
   * @param {object} deps
   */
  function createGradeRenderer(deps) {
    function setStat(id, val) {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    }

    function exportStatusLabel(disc) {
      const disp = deps.displayState(disc);
      if (disp === 'locked') return 'Bloqueada';
      if (disp === 'in_progress') return 'Em andamento';
      if (disp === 'done') return 'Concluída';
      return 'Disponível';
    }

    function formatCccgPicksNote(slotId) {
      const picks = deps.getSlotPicks(slotId);
      if (!picks.length) return '';
      return picks
        .map((codigo) => {
          const item = deps.cccgByCodigo.get(codigo);
          return item ? `${codigo} — ${item.nome}` : codigo;
        })
        .join(' · ');
    }

    function prereqNamesForExport(disc) {
      if (!disc.prereqs?.length) return '';
      return disc.prereqs
        .map((pid) => {
          const ref = deps.disciplines.find((x) => x.id === pid || x.codigo === pid);
          return ref ? ref.name : pid;
        })
        .join(' · ');
    }

    function buildGradeExportSnapshot() {
      const { disciplines, progress, cfg, sigla } = deps;
      const total = disciplines.length;
      let nLocked = 0;
      let nAvail = 0;
      for (const d of disciplines) {
        const disp = deps.displayState(d);
        if (disp === 'locked') nLocked++;
        else if (disp === 'ready') nAvail++;
      }

      const rows = disciplines
        .slice()
        .sort((a, b) => (a.sem - b.sem) || a.name.localeCompare(b.name, 'pt-BR'))
        .map((d) => ({
          sem: d.sem,
          codigo: d.codigo || '',
          name: d.name,
          category: deps.CAT_NAMES[d.cat] || d.cat || '',
          ch: deps.discChTotal(d),
          chLabel: typeof d.ch === 'string' ? d.ch : `${deps.discChTotal(d)}h`,
          status: exportStatusLabel(d),
          prereqs: prereqNamesForExport(d),
          cccgPicks: deps.isCccgSlot(d) ? formatCccgPicksNote(d.id) : '',
        }));

      return {
        sigla,
        title: cfg.title || 'Grade curricular',
        subtitle: cfg.subtitle || '',
        exportedAt: new Date().toLocaleString('pt-BR', {
          dateStyle: 'long',
          timeStyle: 'short',
        }),
        stats: {
          nDone: disciplines.filter((d) => progress[d.id] === 'done').length,
          nProg: disciplines.filter((d) => progress[d.id] === 'in_progress').length,
          nAvail,
          nLocked,
          total,
        },
        chData: deps.computeChIntegralization(),
        rows,
      };
    }

    function ensureGradeExportButtons() {
      const headerRight = document.querySelector('.page-header-right');
      if (!headerRight || document.getElementById('grade-export-actions')) return;

      const wrap = document.createElement('div');
      wrap.id = 'grade-export-actions';
      wrap.className = 'grade-export-actions';
      wrap.innerHTML =
        '<button type="button" id="grade-export-csv" class="btn-grade-export" title="Baixar planilha com status de cada disciplina">Exportar CSV</button>' +
        '<button type="button" id="grade-export-pdf" class="btn-grade-export" title="Abrir impressão; no celular use retrato para caber em uma página">PDF / imprimir</button>';
      headerRight.appendChild(wrap);
    }

    function setupGradeExport() {
      ensureGradeExportButtons();
      if (deps.uiState.gradeExportReady || !root.GRADE_EXPORT) return;
      deps.uiState.gradeExportReady = true;

      document.getElementById('grade-export-csv')?.addEventListener('click', () => {
        root.GRADE_EXPORT.downloadCsv(buildGradeExportSnapshot());
      });

      document.getElementById('grade-export-pdf')?.addEventListener('click', () => {
        root.GRADE_EXPORT.openPrintView(buildGradeExportSnapshot());
      });
    }

    function renderChIntegralization(chData) {
      const strip = document.querySelector('.page-strip');
      const headerRight = document.querySelector('.page-header-right');
      let chPill = document.getElementById('headerChPill');
      let row = document.getElementById('headerChProgress');

      if (!chData) {
        chPill?.remove();
        row?.remove();
        return;
      }

      if (headerRight) {
        if (!chPill) {
          chPill = document.createElement('span');
          chPill.id = 'headerChPill';
          chPill.className = 'header-progress-pill';
          chPill.setAttribute('role', 'status');
          chPill.setAttribute('aria-live', 'polite');
          const countPill = document.getElementById('headerProgressPill');
          headerRight.insertBefore(chPill, countPill?.nextSibling || null);
        }
        chPill.textContent = `${chData.totalDone}h / ${chData.total}h`;
        chPill.title = chData.buckets
          .map((b) => `${b.shortLabel || b.label}: ${b.done}/${b.required}h`)
          .join(' · ');
      }

      if (!strip) return;

      if (!row) {
        row = document.createElement('div');
        row.id = 'headerChProgress';
        row.className = 'ch-integralization-row';
        const statsRow = strip.querySelector('.stats-row');
        if (statsRow) strip.insertBefore(row, statsRow);
        else strip.appendChild(row);
      }

      row.setAttribute('aria-label', 'Progresso de carga horária para integralização');
      row.innerHTML =
        '<div class="ch-integralization-buckets">' +
        chData.buckets
          .map((b) => {
            const complete = b.done >= b.required;
            const manualNote = b.manual ? ' · fora da grade — informe horas validadas' : '';
            if (b.manual) {
              const val = Math.min(b.rawDone, b.required);
              return `<span class="ch-bucket ch-bucket--manual${complete ? ' is-complete' : ''}" title="${escapeAttr(
                b.label + manualNote
              )}">
            <span class="ch-bucket-label">${escapeHtml(b.shortLabel || b.label)}</span>
            <label class="ch-bucket-manual">
              <span class="visually-hidden">Horas ${escapeHtml(b.shortLabel || b.label)}</span>
              <input type="number" class="ch-bucket-manual-input" data-bucket="${escapeAttr(b.id)}" min="0" max="${b.required}" step="1" value="${val}" />
              <span class="ch-bucket-manual-suffix">/${b.required}h</span>
            </label>
          </span>`;
            }
            return `<span class="ch-bucket${complete ? ' is-complete' : ''}" title="${escapeAttr(
              b.label + manualNote
            )}">
            <span class="ch-bucket-label">${escapeHtml(b.shortLabel || b.label)}</span>
            <span class="ch-bucket-val">${b.done}/${b.required}h</span>
          </span>`;
          })
          .join('') +
        '</div>';

      if (!deps.uiState.manualChRowBound) {
        deps.uiState.manualChRowBound = true;
        row.addEventListener('change', (e) => {
          const input = e.target.closest('.ch-bucket-manual-input');
          if (!input) return;
          const bucketId = input.getAttribute('data-bucket');
          const max = parseInt(input.getAttribute('max'), 10) || 9999;
          let v = parseInt(input.value, 10);
          if (Number.isNaN(v) || v < 0) v = 0;
          if (v > max) v = max;
          input.value = String(v);
          deps.store.manualCh[bucketId] = v;
          deps.saveManualCh();
          renderChIntegralization(deps.computeChIntegralization());
        });
      }
    }

    function render() {
      const { gridEl, cfg, disciplines, maxSem, progress } = deps;
      if (!gridEl) return;

      deps.setupGradeToolbar();
      deps.updateReadyPanel();
      const searchEl = document.getElementById('gradeSearch');
      const gradeSearchQuery = deps.getSearchQuery();
      if (searchEl && document.activeElement !== searchEl && searchEl.value !== gradeSearchQuery) {
        searchEl.value = gradeSearchQuery;
      }

      const scrollPositions = new Map();
      if (isMobileViewport()) {
        document.querySelectorAll('.semester-cards').forEach((el) => {
          if (el.dataset.sem) scrollPositions.set(el.dataset.sem, el.scrollLeft);
        });
      }

      document.getElementById('pageTitle').textContent = cfg.title || 'Grade curricular';
      const total = disciplines.length;
      const nDone = disciplines.filter((d) => progress[d.id] === 'done').length;
      const pct = total > 0 ? Math.round((100 * nDone) / total) : 0;
      const pill = document.getElementById('headerProgressPill');
      if (pill) pill.textContent = `${nDone} / ${total} concluídas`;

      const fillEl = document.getElementById('headerProgressFill');
      const barEl = document.getElementById('headerProgressBar');
      const pctEl = document.getElementById('headerProgressPct');
      if (fillEl) fillEl.style.width = pct + '%';
      if (pctEl) pctEl.textContent = pct + '%';
      if (barEl) {
        barEl.setAttribute('aria-valuenow', String(pct));
        barEl.setAttribute('aria-valuetext', `${pct}% (${nDone} de ${total} concluídas)`);
      }

      const nProg = disciplines.filter((d) => progress[d.id] === 'in_progress').length;
      let nLocked = 0;
      let nAvail = 0;
      for (const d of disciplines) {
        const disp = deps.displayState(d);
        if (disp === 'locked') nLocked++;
        else if (disp === 'ready') nAvail++;
      }

      setStat('statDone', nDone);
      setStat('statProgress', nProg);
      setStat('statAvail', nAvail);
      setStat('statLocked', nLocked);
      setStat('statTotal', total);

      renderChIntegralization(deps.computeChIntegralization());

      setupGradeExport();

      if (typeof root.ensureGradeStripToggle === 'function') {
        root.ensureGradeStripToggle();
      }

      deps.renderCategoryLegend();

      gridEl.innerHTML = '';
      gridEl.style.gridTemplateColumns = `repeat(${maxSem}, 1fr)`;
      gridEl.style.minWidth = `${Math.max(960, maxSem * 106)}px`;

      const bySem = {};
      for (let i = 1; i <= maxSem; i++) bySem[i] = [];
      for (const d of disciplines) {
        if (!bySem[d.sem]) bySem[d.sem] = [];
        bySem[d.sem].push(d);
      }
      const maxRows = Math.max(...Object.values(bySem).map((a) => a.length));

      for (let sem = 1; sem <= maxSem; sem++) {
        const col = document.createElement('div');
        col.className = 'semester-col';
        const hdr = document.createElement('div');
        hdr.className = 'semester-header';
        const semList = bySem[sem] || [];
        const semDone = semList.filter((d) => progress[d.id] === 'done').length;
        const semPct = semList.length ? Math.round((100 * semDone) / semList.length) : 0;
        hdr.innerHTML =
          `<span class="semester-header-title">${sem}º SEM</span>` +
          `<span class="semester-header-meta">${semDone}/${semList.length} · ${semPct}%</span>`;
        col.appendChild(hdr);

        const cardsWrap = document.createElement('div');
        cardsWrap.className = 'semester-cards';
        cardsWrap.dataset.sem = String(sem);
        col.appendChild(cardsWrap);

        for (const disc of bySem[sem]) {
          const disp = deps.displayState(disc);
          const card = document.createElement('div');
          card.className = 'disc-card ' + disp;
          card.dataset.discId = disc.id;
          if (!cardMatchesFilter(disc, disp, deps.getStatusFilter(), deps.getSearchQuery())) {
            card.classList.add('disc-card--filtered');
          }
          card.setAttribute('role', 'group');
          card.setAttribute('tabindex', '0');
          card.setAttribute(
            'aria-label',
            `${disc.name}, ${deps.a11yCardStatusLabel(disc)}${
              deps.isCccgSlot(disc)
                ? (() => {
                    const sum = deps.cccgSlotSummary(disc.id);
                    return sum
                      ? `. ${sum.count} componente(s) no semestre, ${sum.totalCh} de ${sum.semLimit} horas.`
                      : '. Nenhum componente selecionado — clique para escolher.';
                  })()
                : disc.specialMinCH || disc.specialNote
                  ? '. Regra especial de integralização — ver detalhes.'
                  : ''
            }`
          );

          const ribbon = document.createElement('div');
          ribbon.className = 'disc-cat-ribbon';
          ribbon.setAttribute('aria-hidden', 'true');
          ribbon.style.background = deps.catColor(disc.cat);

          const name = document.createElement('div');
          name.className = 'disc-name';
          if (disc.specialMinCH || disc.specialNote) {
            const hint = document.createElement('span');
            hint.className = 'disc-ch-hint';
            hint.setAttribute('aria-hidden', 'true');
            hint.textContent = '⏱ ';
            name.appendChild(hint);
          }
          name.appendChild(document.createTextNode(disc.name));

          if (deps.isCccgSlot(disc)) {
            const sum = deps.cccgSlotSummary(disc.id);
            const sub = document.createElement('div');
            sub.className = 'disc-cccg-summary';
            if (sum) {
              sub.textContent = `${sum.totalCh}h / ${sum.semLimit}h no semestre`;
              sub.title = sum.labels.join(', ');
            } else {
              sub.textContent = 'Clique para escolher';
            }
            name.appendChild(sub);
          }

          const row = document.createElement('div');
          row.className = 'disc-card-actions';

          const menuWrap = document.createElement('div');
          menuWrap.className = 'disc-menu';

          const trigger = document.createElement('button');
          trigger.type = 'button';
          trigger.className = 'disc-menu-trigger';
          trigger.setAttribute('aria-expanded', 'false');
          trigger.setAttribute('aria-haspopup', 'true');
          trigger.setAttribute(
            'aria-label',
            `Opções da disciplina ${disc.name}`
          );
          trigger.textContent = '...';

          const panel = document.createElement('div');
          panel.className = 'disc-menu-panel';
          panel.setAttribute('role', 'menu');
          panel.setAttribute('aria-label', 'Ações');
          panel.addEventListener('click', (ev) => ev.stopPropagation());

          const locked = deps.isLocked(disc);
          const cur = deps.storedState(disc);

          function addMenuItem(label, value, opts) {
            const opt = opts || {};
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'disc-menu-item';
            b.setAttribute('role', 'menuitem');
            b.textContent = label;
            if (opt.current) b.classList.add('is-current');
            const statusBlocked = locked && opt.status && (value === 'done' || value === 'in_progress');
            if (statusBlocked) {
              b.classList.add('is-disabled');
              b.setAttribute('aria-disabled', 'true');
            }
            b.addEventListener('click', (ev) => {
              ev.stopPropagation();
              if (statusBlocked) {
                const missing = deps.unmetLockReasons(disc);
                showToast('🔒 ' + missing.join(', '));
                return;
              }
              deps.closeAllDiscMenus();
              if (opt.status) deps.setDiscState(disc, value);
              else if (opt.cccgPicker) deps.openCccgPicker(disc, card);
              else if (opt.details) deps.openDialog(disc, card);
            });
            panel.appendChild(b);
          }

          addMenuItem('Não iniciada', 'not_done', { status: true, current: cur === 'not_done' });
          addMenuItem('Em andamento', 'in_progress', { status: true, current: cur === 'in_progress' });
          addMenuItem('Concluída', 'done', { status: true, current: cur === 'done' });
          const sep = document.createElement('div');
          sep.className = 'disc-menu-sep';
          sep.setAttribute('role', 'separator');
          panel.appendChild(sep);
          if (deps.isCccgSlot(disc)) {
            addMenuItem('Escolher componentes', null, { cccgPicker: true });
          } else {
            addMenuItem('Ver detalhes', null, { details: true });
          }

          menuWrap._discPanel = panel;

          trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = menuWrap.classList.contains('is-open');
            deps.closeAllDiscMenus();
            if (!wasOpen) {
              menuWrap.classList.add('is-open');
              trigger.setAttribute('aria-expanded', 'true');
              deps.openDiscMenuPanel(menuWrap);
              deps.positionDiscMenuPanel(menuWrap);
            }
          });

          menuWrap.appendChild(trigger);
          row.appendChild(menuWrap);

          card.appendChild(ribbon);
          card.appendChild(name);
          card.appendChild(row);

          card.addEventListener('keydown', (ev) => {
            if (ev.target !== card) return;
            if (ev.key === 'Enter' || ev.key === ' ') {
              ev.preventDefault();
              deps.cardPrimaryAction(disc, card);
            }
          });

          card.addEventListener('click', (ev) => {
            if (!deps.isCccgSlot(disc)) return;
            if (ev.target.closest('.disc-menu, .disc-menu-trigger, .disc-menu-panel')) return;
            deps.openCccgPicker(disc, card);
          });

          cardsWrap.appendChild(card);
        }
        for (let i = bySem[sem].length; i < maxRows; i++) {
          const sp = document.createElement('div');
          sp.className = 'spacer';
          col.appendChild(sp);
        }
        gridEl.appendChild(col);
      }

      if (isMobileViewport()) {
        document.querySelectorAll('.semester-cards').forEach((el) => {
          const saved = scrollPositions.get(el.dataset.sem);
          if (saved != null) el.scrollLeft = saved;
        });
      }
    }

    return {
      render,
      renderChIntegralization,
      setStat,
      buildGradeExportSnapshot,
      ensureGradeExportButtons,
      setupGradeExport,
    };
  }

  root.GRADE_RENDER = { createGradeRenderer };
})(typeof globalThis !== 'undefined' ? globalThis : window);
