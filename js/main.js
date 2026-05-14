/**
 * Motor genérico da grade: estados, localStorage, grid, diálogo de detalhes.
 * Depende de window.GRADE_CURSO_CONFIG = { sigla, title, subtitle?, maxSemesters?, disciplines }
 */
(function () {
  'use strict';

  const SIDEBAR_KEY = 'grade_unipampa_sidebar_v1';

  function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    if (!sidebar || !toggle) return;

    function applyCollapsed(collapsed) {
      sidebar.classList.toggle('collapsed', collapsed);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute(
        'aria-label',
        collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'
      );
      toggle.title = collapsed ? 'Expandir menu' : 'Recolher menu';
      toggle.textContent = collapsed ? '☰' : '←';
      localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded');
    }

    applyCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'collapsed');

    toggle.addEventListener('click', () =>
      applyCollapsed(!sidebar.classList.contains('collapsed'))
    );

    const cur =
      (window.location.pathname.split('/').pop() || '').split('?')[0].toLowerCase();
    document.querySelectorAll('#sidebar a.sb-item[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const file = href
        .replace(/^\.\.\//, '')
        .replace(/^.*\//, '')
        .split('?')[0]
        .toLowerCase();
      a.classList.toggle('active', file === cur);
    });
  }

  initSidebar();

  const cfg = window.GRADE_CURSO_CONFIG;
  if (!cfg || !Array.isArray(cfg.disciplines)) {
    return;
  }

  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';
  const ENG_SIGLAS = new Set(['ec', 'ee', 'em', 'ea', 'et']);
  /** Ids frequentemente no ciclo básico das engenharias (PPCs UNIPAMPA). */
  const ENG_BASICO_IDS = new Set([
    'calc1',
    'calc2',
    'calc3',
    'geom',
    'fis1',
    'fis2',
    'fis3',
    'alg_lin',
    'quim',
    'probest',
    'eq_dif',
    'eq_dif1',
    'eq_dif2',
    'alg',
    'dt',
    'mec_ger',
    'circ_dig',
    'circ_med',
    'intro_ec',
    'intro_ee',
    'intro_em',
    'intro_ea',
    'intro_ct',
    'eletrot',
    'fmat',
    'logica',
    'metcient',
  ]);

  /**
   * Garante cat, ementa e prereqs; preenche ementa de CCCG; inferência basico/especifico nas engenharias.
   */
  function normalizeDisciplines(raw, courseSigla) {
    const eng = ENG_SIGLAS.has(courseSigla);
    return raw.map((d) => {
      const idStr = String(d.id || '');
      const isCccg =
        /^cccg/i.test(idStr) ||
        (String(d.codigo || '') === '—' && String(d.name || '').includes('CCCG'));
      let ementa = d.ementa;
      if (ementa == null || String(ementa).trim() === '') {
        ementa = isCccg ? CCCG_EMENTA : '';
      }
      let cat = d.cat;
      if (cat == null || String(cat).trim() === '') {
        if (eng) {
          cat = isCccg ? 'nao_definido' : ENG_BASICO_IDS.has(d.id) ? 'basico' : 'especifico';
        } else {
          cat = 'nao_definido';
        }
      }
      const prereqs = Array.isArray(d.prereqs) ? [...d.prereqs] : [];
      return { ...d, cat, ementa, prereqs };
    });
  }

  const sigla = String(cfg.sigla || 'curso').toLowerCase();
  const disciplines = normalizeDisciplines(cfg.disciplines, sigla);
  const maxSem = Math.max(
    cfg.maxSemesters || 0,
    ...disciplines.map((d) => d.sem || 0)
  );

  const progressKey = `grade_unipampa_${sigla}_progress_v1`;
  const notesKey = `grade_unipampa_${sigla}_notes_v1`;
  const LEGACY_ES_KEY = 'grade_es_unipampa_v1';

  const CAT_NAMES = {
    matematica: 'Fundamentos da Matemática',
    computacao: 'Fundamentos da Computação',
    software: 'Engenharia de Software',
    profissional: 'Contexto Profissional',
    nao_definido: 'CCCG / Não categorizado',
    basico: 'Ciclo básico (engenharias)',
    especifico: 'Disciplinas específicas (engenharias)',
  };

  const CAT_COLORS = {
    matematica: 'var(--cat-math)',
    computacao: 'var(--cat-comp)',
    software: 'var(--cat-sw)',
    profissional: 'var(--cat-prof)',
    nao_definido: 'var(--cat-nd)',
    basico: 'var(--cat-basico)',
    especifico: 'var(--cat-especifico)',
  };

  /** @type {Record<string, string>} id -> not_done | in_progress | done */
  let progress = {};
  /** @type {Record<string, { horario?: string, sala?: string, prof?: string, email?: string }>} */
  let notes = {};

  function migrateLegacyESIfNeeded() {
    if (sigla !== 'es') return;
    const already = localStorage.getItem(progressKey);
    if (already) return;
    const raw = localStorage.getItem(LEGACY_ES_KEY);
    if (!raw) return;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return;
    }
    const next = {};
    if (Array.isArray(parsed)) {
      for (const id of parsed) next[id] = 'done';
    } else if (parsed && typeof parsed === 'object') {
      for (const [id, v] of Object.entries(parsed)) {
        next[id] = v === true || v === 'done' ? 'done' : 'not_done';
      }
    }
    localStorage.setItem(progressKey, JSON.stringify(next));
    localStorage.removeItem(LEGACY_ES_KEY);
  }

  function loadProgress() {
    migrateLegacyESIfNeeded();
    try {
      progress = JSON.parse(localStorage.getItem(progressKey) || '{}') || {};
    } catch {
      progress = {};
    }
    for (const d of disciplines) {
      if (!progress[d.id]) progress[d.id] = 'not_done';
    }
  }

  function saveProgress() {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function loadNotes() {
    try {
      notes = JSON.parse(localStorage.getItem(notesKey) || '{}') || {};
    } catch {
      notes = {};
    }
  }

  function saveNotes() {
    localStorage.setItem(notesKey, JSON.stringify(notes));
  }

  function prereqsAllDone(disc) {
    return disc.prereqs.every((pid) => progress[pid] === 'done');
  }

  function isLocked(disc) {
    return !prereqsAllDone(disc);
  }

  function storedState(disc) {
    return progress[disc.id] || 'not_done';
  }

  /** Estado exibido no cartão (locked sobrepõe). `ready` = liberada e ainda não iniciada. */
  function displayState(disc) {
    if (isLocked(disc)) return 'locked';
    const s = storedState(disc);
    if (s === 'not_done') return 'ready';
    return s;
  }

  function dependents(id) {
    return disciplines.filter((d) => d.prereqs.includes(id));
  }

  function canLeaveDoneOrProgress(id) {
    const deps = dependents(id);
    for (const d of deps) {
      const s = storedState(d);
      if (s === 'done' || s === 'in_progress') return false;
    }
    return true;
  }

  function closeAllDiscMenus() {
    document.querySelectorAll('.disc-menu.is-open').forEach((wrap) => {
      wrap.classList.remove('is-open');
      wrap.querySelector('.disc-menu-trigger')?.setAttribute('aria-expanded', 'false');
      const panel = wrap.querySelector('.disc-menu-panel');
      if (panel) {
        panel.style.left = '';
        panel.style.right = '';
        panel.style.top = '';
        panel.style.bottom = '';
      }
    });
  }

  /** Posiciona o menu na horizontal e na vertical para caber na viewport. */
  function positionDiscMenuPanel(menuWrap) {
    const panel = menuWrap.querySelector('.disc-menu-panel');
    const trigger = menuWrap.querySelector('.disc-menu-trigger');
    if (!panel || !trigger) return;
    requestAnimationFrame(() => {
      if (!menuWrap.classList.contains('is-open')) return;
      const rect = trigger.getBoundingClientRect();
      const pad = 12;
      const gap = 4;

      const w = Math.max(panel.offsetWidth, 200);
      if (rect.left + w > window.innerWidth - pad) {
        panel.style.left = 'auto';
        panel.style.right = '0';
      } else {
        panel.style.left = '0';
        panel.style.right = 'auto';
      }

      const h = Math.max(panel.offsetHeight, 1);
      const spaceBelow = window.innerHeight - rect.bottom - pad;
      const spaceAbove = rect.top - pad;
      let openUp = false;
      if (h <= spaceBelow) {
        openUp = false;
      } else if (h <= spaceAbove) {
        openUp = true;
      } else {
        openUp = spaceAbove > spaceBelow;
      }

      if (openUp) {
        panel.style.top = 'auto';
        panel.style.bottom = `calc(100% + ${gap}px)`;
      } else {
        panel.style.top = `calc(100% + ${gap}px)`;
        panel.style.bottom = 'auto';
      }
    });
  }

  function toastForState(disc, target) {
    if (target === 'done') showToast('✓ ' + disc.name + ' — concluída');
    else if (target === 'in_progress') showToast('◐ ' + disc.name + ' — em andamento');
    else showToast('○ ' + disc.name + ' — não iniciada');
  }

  /** @param {'not_done'|'in_progress'|'done'} target */
  function setDiscState(disc, target) {
    if (target !== 'not_done' && target !== 'in_progress' && target !== 'done') return;
    if (isLocked(disc) && (target === 'done' || target === 'in_progress')) {
      const missing = disc.prereqs
        .filter((p) => progress[p] !== 'done')
        .map((p) => disciplines.find((x) => x.id === p)?.name || p);
      showToast('🔒 Falta concluir: ' + missing.join(', '));
      return;
    }
    const cur = storedState(disc);
    if (cur === target) {
      closeAllDiscMenus();
      return;
    }
    const lowersFromDone =
      cur === 'done' && (target === 'not_done' || target === 'in_progress');
    if (lowersFromDone && !canLeaveDoneOrProgress(disc.id)) {
      const blocker = dependents(disc.id).find((d) => {
        const s = storedState(d);
        return s === 'done' || s === 'in_progress';
      });
      showToast('⚠️ "' + (blocker?.name || 'outra disciplina') + '" depende desta');
      return;
    }
    progress[disc.id] = target;
    saveProgress();
    announce(`${disc.name}: ${statusAnnounceLabel(target)}`);
    toastForState(disc, target);
    closeAllDiscMenus();
    render();
  }

  /** Texto para leitores de tela ao mudar status (setDiscState). */
  function statusAnnounceLabel(target) {
    if (target === 'done') return 'concluída';
    if (target === 'in_progress') return 'em andamento';
    return 'não feita';
  }

  /** Rótulo de status para aria-label do cartão (displayState). */
  function a11yCardStatusLabel(disc) {
    const disp = displayState(disc);
    if (disp === 'locked') return 'bloqueada — pré-requisitos pendentes';
    if (disp === 'in_progress') return 'em andamento';
    if (disp === 'done') return 'concluída';
    return 'disponível';
  }

  function announce(msg) {
    const el = document.getElementById('status-announcer');
    if (!el) return;
    el.textContent = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.textContent = msg;
      });
    });
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  const gridEl = document.getElementById('grid');
  const dialogEl = document.getElementById('detailDialog');
  const dialogTitleEl = document.getElementById('dialog-title');
  const dialogBody = document.getElementById('dialogBody');
  let lastFocusEl = null;
  /** @type {AbortController | null} */
  let dialogFocusTrapAbort = null;

  function detachDialogFocusTrap() {
    if (dialogFocusTrapAbort) {
      dialogFocusTrapAbort.abort();
      dialogFocusTrapAbort = null;
    }
  }

  function listDialogFocusables(rootEl) {
    const sel =
      'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return [...rootEl.querySelectorAll(sel)].filter((el) => {
      if (el.closest('[aria-hidden="true"]')) return false;
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      return true;
    });
  }

  function bindDialogFocusTrap(rootEl) {
    detachDialogFocusTrap();
    dialogFocusTrapAbort = new AbortController();
    const { signal } = dialogFocusTrapAbort;
    rootEl.addEventListener(
      'keydown',
      function onDialogTabTrap(e) {
        if (e.key !== 'Tab') return;
        const focusable = listDialogFocusables(rootEl);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      },
      { signal }
    );
  }

  function ementaText(disc) {
    if (disc.ementa && String(disc.ementa).trim()) return disc.ementa;
    return 'Ementa não cadastrada — consulte o PPC do curso.';
  }

  function openDialog(disc, returnFocusEl) {
    if (!dialogEl || !dialogTitleEl || !dialogBody) return;
    closeAllDiscMenus();
    lastFocusEl =
      returnFocusEl && typeof returnFocusEl.focus === 'function'
        ? returnFocusEl
        : document.activeElement;
    dialogTitleEl.textContent = disc.name;
    const st = displayState(disc);
    const stLabel =
      st === 'locked'
        ? 'Bloqueada'
        : st === 'done'
          ? 'Concluída'
          : st === 'in_progress'
            ? 'Em andamento'
            : 'Disponível (não iniciada)';

    let prereqHtml = '';
    if (disc.prereqs.length) {
      prereqHtml =
        '<div class="dlg-section"><div class="dlg-lbl">Pré-requisitos</div><ul class="dlg-prereq-list">';
      for (const pid of disc.prereqs) {
        const pd = disciplines.find((x) => x.id === pid);
        const ok = progress[pid] === 'done';
        prereqHtml += `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${pd?.name || pid}</li>`;
      }
      prereqHtml += '</ul></div>';
    } else {
      prereqHtml =
        '<div class="dlg-section"><div class="dlg-muted">Sem pré-requisitos por disciplina</div></div>';
    }

    let special = '';
    if (disc.specialMinCH) {
      special = `<div class="dlg-special" role="status"><span class="dlg-special-ic" aria-hidden="true">⏱</span> Este componente exige no mínimo <strong>${disc.specialMinCH}h</strong> integralizadas — verifique com a coordenação.</div>`;
    } else if (disc.specialNote) {
      special = `<div class="dlg-special" role="status"><span class="dlg-special-ic" aria-hidden="true">⏱</span> ${escapeHtml(
        String(disc.specialNote)
      )}</div>`;
    }

    const n = notes[disc.id] || {};
    const nh = n.horario ?? '';
    const ns = n.sala ?? '';
    const np = n.prof ?? '';
    const ne = n.email ?? '';

    const cats = [...new Set(disciplines.map((d) => d.cat).filter(Boolean))];
    let catLegendHtml =
      '<div class="dlg-section"><div class="dlg-lbl">Legenda — categorias do curso</div><div class="dlg-cat-legend">';
    for (const cat of cats) {
      const bg = CAT_COLORS[cat] || 'var(--muted)';
      catLegendHtml += `<span class="dlg-cat-legend-item"><span class="dlg-cat-dot" style="background:${bg}"></span>${escapeHtml(
        CAT_NAMES[cat] || cat
      )}</span>`;
    }
    catLegendHtml += '</div></div>';

    dialogBody.innerHTML = `
      <div class="dlg-row"><span class="dlg-k">Código</span><span class="dlg-mono">${disc.codigo}</span></div>
      <div class="dlg-row"><span class="dlg-k">Carga horária</span><span>${disc.ch}</span></div>
      <div class="dlg-row"><span class="dlg-k">Categoria</span><span>${CAT_NAMES[disc.cat] || disc.cat}</span></div>
      <div class="dlg-row"><span class="dlg-k">Status</span><span>${stLabel}</span></div>
      <div class="dlg-section"><div class="dlg-lbl">Ementa</div><div class="dlg-ementa">${ementaText(disc)}</div></div>
      ${catLegendHtml}
      ${prereqHtml}
      ${special}
      <hr class="dlg-hr" />
      <div class="dlg-section"><div class="dlg-lbl">Suas anotações</div>
        <label class="dlg-field"><span>Horários</span><input type="text" data-note="horario" value="${escapeAttr(nh)}" placeholder="Adicionar…" autocomplete="off" /></label>
        <label class="dlg-field"><span>Sala</span><input type="text" data-note="sala" value="${escapeAttr(ns)}" placeholder="Adicionar…" autocomplete="off" /></label>
        <label class="dlg-field"><span>Professor(a)</span><input type="text" data-note="prof" value="${escapeAttr(np)}" placeholder="Adicionar…" autocomplete="off" /></label>
        <label class="dlg-field"><span>E-mail</span><input type="email" data-note="email" value="${escapeAttr(ne)}" placeholder="Adicionar…" autocomplete="off" /></label>
      </div>
    `;

    dialogBody.querySelectorAll('input[data-note]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const field = inp.getAttribute('data-note');
        if (!notes[disc.id]) notes[disc.id] = {};
        notes[disc.id][field] = inp.value.trim();
        saveNotes();
      });
    });

    dialogEl.classList.add('open');
    dialogEl.removeAttribute('aria-hidden');
    dialogEl.removeAttribute('inert');
    dialogEl.setAttribute('aria-modal', 'true');
    dialogEl.setAttribute('aria-labelledby', 'dialog-title');
    dialogEl.setAttribute('role', 'dialog');

    bindDialogFocusTrap(dialogEl);

    requestAnimationFrame(() => {
      const focusable = listDialogFocusables(dialogEl);
      const closeBtn = dialogEl.querySelector('.dialog-close');
      const target =
        closeBtn && focusable.includes(closeBtn) ? closeBtn : focusable[0];
      if (target && typeof target.focus === 'function') target.focus();
    });
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function closeDialog() {
    if (!dialogEl) return;
    detachDialogFocusTrap();
    dialogEl.classList.remove('open');
    dialogEl.setAttribute('aria-hidden', 'true');
    dialogEl.setAttribute('inert', '');
    dialogBody.innerHTML = '';
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  }

  function render() {
    if (!gridEl) return;
    document.getElementById('pageTitle').textContent = cfg.title || 'Grade curricular';
    const total = disciplines.length;
    const nDone = disciplines.filter((d) => progress[d.id] === 'done').length;
    const pill = document.getElementById('headerProgressPill');
    if (pill) pill.textContent = `${nDone} / ${total} concluídas`;

    const nProg = disciplines.filter((d) => progress[d.id] === 'in_progress').length;
    let nLocked = 0;
    let nAvail = 0;
    for (const d of disciplines) {
      const disp = displayState(d);
      if (disp === 'locked') nLocked++;
      else if (disp === 'ready') nAvail++;
    }

    setStat('statDone', nDone);
    setStat('statProgress', nProg);
    setStat('statAvail', nAvail);
    setStat('statLocked', nLocked);
    setStat('statTotal', total);

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
      hdr.textContent = sem + 'º SEM';
      col.appendChild(hdr);

      for (const disc of bySem[sem]) {
        const disp = displayState(disc);
        const card = document.createElement('div');
        card.className = 'disc-card ' + disp;
        card.setAttribute('role', 'group');
        card.setAttribute('tabindex', '0');
        card.setAttribute(
          'aria-label',
          `${disc.name}, ${a11yCardStatusLabel(disc)}${
            disc.specialMinCH || disc.specialNote
              ? '. Regra especial de integralização — ver detalhes.'
              : ''
          }`
        );

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

        const row = document.createElement('div');
        row.className = 'disc-card-actions';
        const pip = document.createElement('div');
        pip.className = 'cat-pip';
        pip.style.background = CAT_COLORS[disc.cat] || '#64748b';
        pip.setAttribute('aria-hidden', 'true');

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

        const locked = isLocked(disc);
        const cur = storedState(disc);

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
            if (statusBlocked) return;
            if (opt.status) setDiscState(disc, value);
            else if (opt.details) openDialog(disc, card);
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
        addMenuItem('Ver detalhes', null, { details: true });

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasOpen = menuWrap.classList.contains('is-open');
          closeAllDiscMenus();
          if (!wasOpen) {
            menuWrap.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            positionDiscMenuPanel(menuWrap);
          }
        });

        menuWrap.appendChild(trigger);
        menuWrap.appendChild(panel);
        row.appendChild(pip);
        row.appendChild(menuWrap);

        card.appendChild(name);
        card.appendChild(row);

        card.addEventListener('keydown', (ev) => {
          if (ev.target !== card) return;
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            openDialog(disc, card);
          }
        });

        col.appendChild(card);
      }
      for (let i = bySem[sem].length; i < maxRows; i++) {
        const sp = document.createElement('div');
        sp.className = 'spacer';
        col.appendChild(sp);
      }
      gridEl.appendChild(col);
    }
  }

  function setStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dialogEl?.classList.contains('open')) {
        e.preventDefault();
        closeDialog();
      } else {
        closeAllDiscMenus();
      }
    }
  });

  document.addEventListener('click', () => {
    closeAllDiscMenus();
  });

  window.addEventListener('resize', () => {
    document.querySelectorAll('.disc-menu.is-open').forEach(positionDiscMenuPanel);
  });

  document.addEventListener(
    'scroll',
    () => {
      document.querySelectorAll('.disc-menu.is-open').forEach(positionDiscMenuPanel);
    },
    true
  );

  dialogEl?.addEventListener('click', (e) => {
    if (e.target === dialogEl) closeDialog();
  });

  dialogEl?.querySelector('.dialog-close')?.addEventListener('click', closeDialog);

  if (dialogEl && !dialogEl.classList.contains('open')) {
    dialogEl.setAttribute('aria-hidden', 'true');
    dialogEl.setAttribute('inert', '');
  }

  loadProgress();
  loadNotes();
  render();
})();
