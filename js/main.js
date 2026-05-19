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
  /** Categoria padrão de slots CCCG por curso (quando cat ausente no dado). */
  const CCCG_SLOT_CAT = {
    es: 'es_cccg',
    cc: 'cc_cccg',
    ee: 'ee_cccg',
  };
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
        } else if (isCccg) {
          cat = CCCG_SLOT_CAT[courseSigla] || 'nao_definido';
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
    nao_definido: 'Não categorizado',
    /* Engenharias */
    basico: 'Ciclo básico (engenharias)',
    especifico: 'Disciplinas específicas (engenharias)',
    /* Engenharia de Software (PPC) */
    es_matematica: 'Fundamentos da Matemática',
    es_computacao: 'Fundamentos da Computação',
    es_software: 'Engenharia de Software',
    es_contexto_profissional: 'Contexto Profissional',
    es_cccg: 'CCCG / Não categorizado',
    /* Ciência da Computação (PPC / CCOG + CCCG) */
    cc_fundamentos: 'Fundamentos da Computação',
    cc_tecnologias: 'Tecnologias da Computação',
    cc_matematica: 'Matemática',
    cc_contexto: 'Contexto Social e Profissional',
    cc_tcc: 'Trabalho de Conclusão de Curso',
    cc_cccg: 'CCCG',
    /* EE — núcleos de conteúdos (matriz curricular oficial) */
    ee_matematica: 'Matemática',
    ee_fisico_quimica: 'Físico-química',
    ee_eletrotecnica: 'Eletrotécnica',
    ee_logica_programacao: 'Lógica e Programação',
    ee_sistemas_digitais: 'Sistemas Digitais',
    ee_circuitos_eletronicos: 'Circuitos Eletrônicos',
    ee_telecomunicacoes: 'Telecomunicações',
    ee_conversao_energia: 'Conversão de Energia',
    ee_sistemas_eletricos_potencia: 'Sistemas Elétricos de Potência',
    ee_controle_eletronica_potencia: 'Controle e Eletrônica de Potência',
    ee_gestao: 'Gestão',
    ee_multidisciplinares: 'Multidisciplinares',
    ee_relacoes_sociedade: 'Relações com a Sociedade',
    ee_cccg: 'CCCGs (núcleo depende do componente curricular)',
  };

  const CAT_COLORS = {
    nao_definido: 'var(--cat-nd)',
    /* Engenharias */
    basico: 'var(--cat-basico)',
    especifico: 'var(--cat-especifico)',
    /* Engenharia de Software (PPC) */
    es_matematica: 'var(--cat-math)',
    es_computacao: 'var(--cat-comp)',
    es_software: 'var(--cat-sw)',
    es_contexto_profissional: 'var(--cat-prof)',
    es_cccg: 'var(--cat-nd)',
    /* Ciência da Computação (PPC / CCOG + CCCG) */
    cc_fundamentos: '#22c55e',
    cc_tecnologias: '#38bdf8',
    cc_matematica: '#fb7185',
    cc_contexto: '#eab308',
    cc_tcc: '#f97316',
    cc_cccg: '#a78bfa',
    /* EE — núcleos de conteúdos (matriz curricular oficial) */
    ee_matematica: '#bfdbfe',
    ee_fisico_quimica: '#86efac',
    ee_eletrotecnica: '#fde047',
    ee_logica_programacao: '#d8b4fe',
    ee_sistemas_digitais: '#d6cfc4',
    ee_circuitos_eletronicos: '#f9a8d4',
    ee_telecomunicacoes: '#fdba74',
    ee_conversao_energia: '#6ee7b7',
    ee_sistemas_eletricos_potencia: '#f87171',
    ee_controle_eletronica_potencia: '#60a5fa',
    ee_gestao: '#4ade80',
    ee_multidisciplinares: '#1d4ed8',
    ee_relacoes_sociedade: '#fb923c',
    ee_cccg: '#ede9fe',
  };

  /** Ordem da legenda de categorias (ES). */
  const ES_CAT_ORDER = [
    'es_computacao',
    'es_matematica',
    'es_software',
    'es_contexto_profissional',
    'es_cccg',
  ];

  /** Ordem da legenda de categorias (CC). */
  const CC_CAT_ORDER = [
    'cc_fundamentos',
    'cc_tecnologias',
    'cc_matematica',
    'cc_contexto',
    'cc_tcc',
    'cc_cccg',
  ];

  /** Ordem padrão da legenda de categorias (demais cursos). */
  const DEFAULT_CAT_ORDER = [
    'basico',
    'especifico',
    'nao_definido',
    ...ES_CAT_ORDER,
    ...CC_CAT_ORDER,
  ];

  /** Ordem da legenda dos núcleos (EE). */
  const EE_CAT_ORDER = [
    'ee_matematica',
    'ee_fisico_quimica',
    'ee_eletrotecnica',
    'ee_logica_programacao',
    'ee_sistemas_digitais',
    'ee_circuitos_eletronicos',
    'ee_telecomunicacoes',
    'ee_conversao_energia',
    'ee_sistemas_eletricos_potencia',
    'ee_controle_eletronica_potencia',
    'ee_gestao',
    'ee_multidisciplinares',
    'ee_relacoes_sociedade',
    'ee_cccg',
  ];

  /** @type {Record<string, string>} id -> not_done | in_progress | done */
  let progress = {};
  /** @type {Record<string, { horario?: string, sala?: string, prof?: string, email?: string }>} */
  let notes = {};

  const cccgsCatalog = Array.isArray(cfg.cccgs) ? cfg.cccgs : [];
  /** Ativo em qualquer curso que declare cfg.cccgs com itens. */
  const cccgsEnabled = cccgsCatalog.length > 0;
  const cccgPicksKey = `grade_unipampa_${sigla}_cccg_picks_v1`;
  /** @type {Record<string, string[]>} slotId -> códigos AL */
  let cccgPicks = {};
  /** @type {{ slotDisc: object, returnFocusEl: Element | null } | null} */
  let cccgPickerRestore = null;
  const cccgByCodigo = new Map(
    cccgsCatalog.map((item) => [String(item.codigo), item])
  );
  /** Slots CCCG agrupados por semestre (vários cards podem compartilhar a mesma cota). */
  const cccgSlotsBySem = new Map();
  for (const d of disciplines) {
    if (!isCccgSlot(d)) continue;
    if (!cccgSlotsBySem.has(d.sem)) cccgSlotsBySem.set(d.sem, []);
    cccgSlotsBySem.get(d.sem).push(d);
  }

  function loadCccgPicks() {
    if (!cccgsEnabled) return;
    try {
      cccgPicks = JSON.parse(localStorage.getItem(cccgPicksKey) || '{}') || {};
    } catch {
      cccgPicks = {};
    }
  }

  function saveCccgPicks() {
    if (!cccgsEnabled) return;
    localStorage.setItem(cccgPicksKey, JSON.stringify(cccgPicks));
  }

  function isCccgSlot(disc) {
    return cccgsEnabled && /^cccg/i.test(String(disc.id || ''));
  }

  function parseChHours(ch) {
    if (typeof ch === 'number') return ch;
    const m = String(ch || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function cccgItemCh(item) {
    return parseChHours(item?.ch);
  }

  function cccgSlotIdsInSem(sem) {
    return (cccgSlotsBySem.get(sem) || []).map((d) => d.id);
  }

  /** Carga horária máxima de CCCG no semestre (PPC ou soma dos slots do semestre). */
  function cccgSemesterLimit(sem) {
    const explicit = cfg.cccgSemLimits?.[sem];
    if (explicit != null) return explicit;
    return (cccgSlotsBySem.get(sem) || []).reduce(
      (sum, d) => sum + parseChHours(d.ch),
      0
    );
  }

  function cccgSemesterPicksChTotal(sem) {
    return cccgSlotIdsInSem(sem).reduce((sum, slotId) => sum + slotPicksChTotal(slotId), 0);
  }

  function cccgSemesterRemaining(sem) {
    return Math.max(0, cccgSemesterLimit(sem) - cccgSemesterPicksChTotal(sem));
  }

  /** Nome legível de um pré-requisito (id interno, código AL ou CCCG do catálogo). */
  function prereqLabel(pid) {
    const byId = disciplines.find((x) => x.id === pid);
    if (byId) return byId.name;
    const byCodigo = disciplines.find((x) => x.codigo === pid);
    if (byCodigo) return byCodigo.name;
    const cat = cccgByCodigo.get(pid);
    if (cat) return cat.nome;
    return pid;
  }

  function cccgUnmetPrereqs(item) {
    return (item.prereqs || []).filter((pid) => !isPrereqSatisfied(pid));
  }

  function getSlotPicks(slotId) {
    return Array.isArray(cccgPicks[slotId]) ? [...cccgPicks[slotId]] : [];
  }

  function slotPicksChTotal(slotId) {
    return getSlotPicks(slotId).reduce((sum, codigo) => {
      const item = cccgByCodigo.get(codigo);
      return sum + cccgItemCh(item);
    }, 0);
  }

  function isCodigoPickedAnywhere(codigo, exceptSlotId) {
    for (const [slotId, list] of Object.entries(cccgPicks)) {
      if (exceptSlotId && slotId === exceptSlotId) continue;
      if (Array.isArray(list) && list.includes(codigo)) return true;
    }
    return false;
  }

  function isPrereqSatisfied(pid) {
    const byId = disciplines.find((x) => x.id === pid);
    if (byId) return progress[pid] === 'done';
    const byCodigo = disciplines.find((x) => x.codigo === pid);
    if (byCodigo) return progress[byCodigo.id] === 'done';
    return isCodigoPickedAnywhere(pid);
  }

  function cccgPickBlockReason(item, slotId, slotDisc) {
    const picks = getSlotPicks(slotId);
    if (picks.includes(item.codigo)) return null;

    const sem = slotDisc.sem;
    const semLimit = cccgSemesterLimit(sem);
    const itemCh = cccgItemCh(item);
    const remaining = cccgSemesterRemaining(sem);

    if (itemCh > semLimit) {
      return `Componente de ${itemCh}h — o ${sem}º semestre permite ${semLimit}h de CCCG`;
    }
    if (itemCh > remaining) {
      return remaining
        ? `Soma passaria de ${semLimit}h no ${sem}º semestre (restam ${remaining}h)`
        : `Carga de CCCG do ${sem}º semestre já completa (${semLimit}h)`;
    }

    const unmet = cccgUnmetPrereqs(item);
    if (unmet.length) {
      const labels = unmet.map(prereqLabel);
      const suffix =
        labels.length === 1 ? labels[0] : labels.slice(0, 2).join(', ') + (labels.length > 2 ? '…' : '');
      return `Pré-requisito pendente: ${suffix}`;
    }

    if (isCodigoPickedAnywhere(item.codigo, slotId)) {
      return 'Já escolhido em outro slot';
    }

    return null;
  }

  function cccgItemAsDisc(item) {
    return {
      id: item.codigo,
      name: item.nome,
      codigo: item.codigo,
      cat: item.cat,
      ch: `${item.ch}h`,
      ch_teo: item.ch_teo,
      ch_prat: item.ch_prat,
      ch_ead_t: item.ch_ead_t,
      ch_ead_p: item.ch_ead_p,
      ch_ext: item.ch_ext,
      ementa: item.ementa,
      objetivo: item.objetivo,
      prereqs: item.prereqs || [],
    };
  }

  function cccgSlotSummary(slotId) {
    const slotDisc = disciplines.find((d) => d.id === slotId);
    if (!slotDisc) return null;
    const sem = slotDisc.sem;
    const semTotal = cccgSemesterPicksChTotal(sem);
    if (!semTotal) return null;
    const semLimit = cccgSemesterLimit(sem);
    const labels = [];
    for (const sid of cccgSlotIdsInSem(sem)) {
      for (const codigo of getSlotPicks(sid)) {
        const item = cccgByCodigo.get(codigo);
        if (item) labels.push(item.nome);
      }
    }
    const slotCount = getSlotPicks(slotId).length;
    return {
      count: labels.length,
      totalCh: semTotal,
      semLimit,
      slotCount,
      labels,
    };
  }

  function toggleCccgPick(slotId, codigo, slotDisc) {
    const item = cccgByCodigo.get(codigo);
    if (!item) return;
    const picks = getSlotPicks(slotId);
    const idx = picks.indexOf(codigo);
    if (idx >= 0) {
      picks.splice(idx, 1);
      cccgPicks[slotId] = picks;
      saveCccgPicks();
      showToast('Removido: ' + item.nome);
      return;
    }
    const block = cccgPickBlockReason(item, slotId, slotDisc);
    if (block) {
      showToast('⚠️ ' + block);
      return;
    }
    picks.push(codigo);
    cccgPicks[slotId] = picks;
    saveCccgPicks();
    showToast('✓ Adicionado: ' + item.nome);
  }

  function setDialogCccgMode(isPicker) {
    const panel = dialogEl?.querySelector('.dialog-panel');
    panel?.classList.toggle('dialog-panel--cccg', isPicker);
    dialogBody?.classList.toggle('dialog-body--cccg-picker', isPicker);
  }

  function openCccgPicker(slotDisc, returnFocusEl) {
    if (!dialogEl || !dialogTitleEl || !dialogBody || !cccgsEnabled) return;
    closeAllDiscMenus();
    cccgPickerRestore = null;
    lastFocusEl =
      returnFocusEl && typeof returnFocusEl.focus === 'function'
        ? returnFocusEl
        : document.activeElement;

    const slotId = slotDisc.id;
    const sem = slotDisc.sem;
    const semLimit = cccgSemesterLimit(sem);
    const semSelectedCh = cccgSemesterPicksChTotal(sem);
    const semRemaining = cccgSemesterRemaining(sem);
    const picks = getSlotPicks(slotId);
    const siblingSlots = cccgSlotIdsInSem(sem).filter((id) => id !== slotId);
    const siblingPicks = siblingSlots.flatMap((id) => getSlotPicks(id));

    dialogTitleEl.textContent = `CCCGs — ${sem}º semestre`;
    setDialogCccgMode(true);

    let selectedHtml = '';
    if (picks.length) {
      selectedHtml =
        '<ul class="cccg-picker-selected">' +
        picks
          .map((codigo) => {
            const item = cccgByCodigo.get(codigo);
            if (!item) return '';
            return `<li class="cccg-picker-selected-item">
              <span class="cccg-picker-selected-dot" style="background:${catColor(item.cat)}"></span>
              <span class="cccg-picker-selected-text">
                <strong>${escapeHtml(item.nome)}</strong>
                <span class="cccg-picker-selected-meta">${escapeHtml(item.codigo)} · ${item.ch}h</span>
              </span>
              <span class="cccg-picker-selected-actions">
                <button type="button" class="cccg-picker-btn cccg-picker-btn--info" data-cccg-detail="${escapeAttr(codigo)}" aria-label="Ver detalhes de ${escapeAttr(item.nome)}">ℹ</button>
                <button type="button" class="cccg-picker-btn cccg-picker-btn--remove" data-cccg-remove="${escapeAttr(codigo)}" aria-label="Remover ${escapeAttr(item.nome)}">×</button>
              </span>
            </li>`;
          })
          .join('') +
        '</ul>';
    } else {
      selectedHtml =
        '<p class="dlg-muted">Nenhum componente neste card. Escolha abaixo até completar a carga de CCCG do semestre.</p>';
    }

    let siblingHtml = '';
    if (siblingPicks.length) {
      siblingHtml =
        '<div class="dlg-section dlg-block"><div class="dlg-lbl">Escolhidos em outros cards deste semestre</div><ul class="cccg-picker-selected">' +
        siblingPicks
          .map((codigo) => {
            const item = cccgByCodigo.get(codigo);
            if (!item) return '';
            return `<li class="cccg-picker-selected-item cccg-picker-selected-item--readonly">
              <span class="cccg-picker-selected-dot" style="background:${catColor(item.cat)}"></span>
              <span class="cccg-picker-selected-text">
                <strong>${escapeHtml(item.nome)}</strong>
                <span class="cccg-picker-selected-meta">${escapeHtml(item.codigo)} · ${cccgItemCh(item)}h</span>
              </span>
            </li>`;
          })
          .join('') +
        '</ul></div>';
    }

    const byCat = {};
    const pickerCats = cccgPickerCategories();
    const oversized = [];
    for (const cat of pickerCats) byCat[cat] = [];
    for (const item of cccgsCatalog) {
      const tooLarge =
        cccgItemCh(item) > semLimit && !picks.includes(item.codigo);
      if (tooLarge) {
        oversized.push(item);
        continue;
      }
      const cat = item.cat || 'nao_definido';
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(item);
    }

    function renderPickerItem(item) {
      const pickedHere = picks.includes(item.codigo);
      const block = pickedHere ? null : cccgPickBlockReason(item, slotId, slotDisc);
      const disabled = !pickedHere && !!block;
      return `<li class="cccg-picker-item${pickedHere ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}" data-cccg-search="${escapeAttr(
        (item.nome + ' ' + item.codigo).toLowerCase()
      )}">
          <button type="button" class="cccg-picker-toggle" data-cccg-toggle="${escapeAttr(item.codigo)}" ${disabled ? 'disabled aria-disabled="true"' : ''} aria-pressed="${pickedHere ? 'true' : 'false'}">
            <span class="cccg-picker-item-name">${escapeHtml(item.nome)}</span>
            <span class="cccg-picker-item-meta">${escapeHtml(item.codigo)} · ${cccgItemCh(item)}h</span>
          </button>
          <button type="button" class="cccg-picker-btn cccg-picker-btn--info" data-cccg-detail="${escapeAttr(item.codigo)}" aria-label="Ver detalhes de ${escapeAttr(item.nome)}">ℹ</button>
          ${disabled && block ? `<span class="cccg-picker-item-hint">${escapeHtml(block)}</span>` : ''}
        </li>`;
    }

    let catalogHtml = '';
    for (const cat of pickerCats) {
      const items = byCat[cat] || [];
      if (!items.length) continue;
      catalogHtml += `<div class="cccg-picker-group" data-cccg-cat="${escapeAttr(cat)}">
        <div class="cccg-picker-group-title"><span class="cccg-picker-group-dot" style="background:${catColor(cat)}"></span>${escapeHtml(catLabel(cat))}</div>
        <ul class="cccg-picker-list">`;
      for (const item of items) {
        catalogHtml += renderPickerItem(item);
      }
      catalogHtml += '</ul></div>';
    }

    if (oversized.length) {
      catalogHtml += `<div class="cccg-picker-group cccg-picker-group--oversized" data-cccg-cat="oversized">
        <div class="cccg-picker-group-title">Excedem ${semLimit}h deste semestre</div>
        <p class="cccg-picker-oversized-note">Estes componentes têm carga horária maior que a cota de CCCG do ${sem}º semestre (${semLimit}h).</p>
        <ul class="cccg-picker-list">`;
      for (const item of oversized) {
        catalogHtml += renderPickerItem(item);
      }
      catalogHtml += '</ul></div>';
    }

    dialogBody.innerHTML = `
      <div class="cccg-picker-meta" role="status">
        <span><strong>${semSelectedCh}h</strong> / ${semLimit}h no ${sem}º semestre</span>
        <span>${semRemaining}h restantes · ${picks.length} neste card</span>
      </div>
      <div class="dlg-section dlg-block">
        <div class="dlg-lbl">Selecionados neste card</div>
        ${selectedHtml}
      </div>
      ${siblingHtml}
      <div class="dlg-section dlg-block">
        <div class="dlg-lbl">Catálogo de CCCGs</div>
        <label class="cccg-picker-filter-wrap">
          <span class="visually-hidden">Filtrar componentes</span>
          <input type="search" class="cccg-picker-filter" placeholder="Buscar por nome ou código…" autocomplete="off" />
        </label>
        <div class="cccg-picker-catalog">${catalogHtml}</div>
      </div>
    `;

    dialogBody.dataset.cccgSlotId = slotId;

    const filterInput = dialogBody.querySelector('.cccg-picker-filter');
    filterInput?.addEventListener('input', () => {
      const q = filterInput.value.trim().toLowerCase();
      dialogBody.querySelectorAll('.cccg-picker-item').forEach((el) => {
        const hay = el.getAttribute('data-cccg-search') || '';
        el.hidden = q.length > 0 && !hay.includes(q);
      });
      dialogBody.querySelectorAll('.cccg-picker-group').forEach((group) => {
        const visible = [...group.querySelectorAll('.cccg-picker-item')].some(
          (el) => !el.hidden
        );
        group.hidden = !visible;
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
      filterInput?.focus();
    });
  }

  function cardPrimaryAction(disc, card) {
    if (isCccgSlot(disc)) openCccgPicker(disc, card);
    else openDialog(disc, card);
  }

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

  function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function getDiscMenuPanel(menuWrap) {
    return menuWrap._discPanel || menuWrap.querySelector('.disc-menu-panel');
  }

  function resetDiscMenuPanelStyle(panel) {
    if (!panel) return;
    panel.classList.remove('disc-menu-panel--fixed');
    panel.style.position = '';
    panel.style.left = '';
    panel.style.right = '';
    panel.style.top = '';
    panel.style.bottom = '';
    panel.style.zIndex = '';
    panel.style.minWidth = '';
    panel.style.pointerEvents = '';
    panel.style.display = '';
  }

  function openDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    if (!panel) return;
    if (isMobileViewport()) {
      document.body.appendChild(panel);
    } else if (!menuWrap.contains(panel)) {
      menuWrap.appendChild(panel);
    }
    panel.classList.add('is-open');
    panel.style.pointerEvents = 'auto';
  }

  function closeDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    menuWrap.classList.remove('is-open');
    menuWrap.querySelector('.disc-menu-trigger')?.setAttribute('aria-expanded', 'false');
    if (!panel) return;
    panel.classList.remove('is-open', 'disc-menu-panel--fixed');
    resetDiscMenuPanelStyle(panel);
    if (panel.parentNode) panel.remove();
  }

  function closeAllDiscMenus() {
    document.querySelectorAll('.disc-menu.is-open').forEach(closeDiscMenuPanel);
    document.querySelectorAll('body > .disc-menu-panel').forEach((panel) => {
      panel.classList.remove('is-open', 'disc-menu-panel--fixed');
      resetDiscMenuPanelStyle(panel);
      panel.remove();
    });
  }

  /** Posiciona o menu na horizontal e na vertical para caber na viewport. */
  function positionDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    const trigger = menuWrap.querySelector('.disc-menu-trigger');
    if (!panel || !trigger) return;
    requestAnimationFrame(() => {
      if (!menuWrap.classList.contains('is-open') || !panel.classList.contains('is-open')) return;
      const rect = trigger.getBoundingClientRect();
      const pad = 12;
      const gap = 4;

      if (isMobileViewport()) {
        panel.classList.add('disc-menu-panel--fixed');
        panel.style.position = 'fixed';
        panel.style.zIndex = '250';
        panel.style.minWidth = '12.5rem';
        panel.style.pointerEvents = 'auto';
        const w = Math.max(panel.offsetWidth, 200);
        const h = Math.max(panel.offsetHeight, 1);
        let left = rect.left;
        if (left + w > window.innerWidth - pad) {
          left = Math.max(pad, window.innerWidth - pad - w);
        }
        let top = rect.bottom + gap;
        if (top + h > window.innerHeight - pad) {
          top = Math.max(pad, rect.top - gap - h);
        }
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        return;
      }

      resetDiscMenuPanelStyle(panel);
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
        .filter((p) => !isPrereqSatisfied(p))
        .map(prereqLabel);
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

  function getCatOrder() {
    if (sigla === 'ee') return EE_CAT_ORDER;
    if (sigla === 'es') return ES_CAT_ORDER;
    if (sigla === 'cc') return CC_CAT_ORDER;
    return DEFAULT_CAT_ORDER;
  }

  function sortCategories(cats) {
    const order = getCatOrder();
    return [...cats].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  /** Categorias presentes no catálogo CCCG, na ordem da legenda do curso. */
  function cccgPickerCategories() {
    const cats = [...new Set(cccgsCatalog.map((item) => item.cat).filter(Boolean))];
    return sortCategories(cats);
  }

  function catColor(cat) {
    return CAT_COLORS[cat] || '#64748b';
  }

  function catLabel(cat) {
    return CAT_NAMES[cat] || cat;
  }

  function renderCategoryLegend() {
    const legendEl = document.querySelector(
      '.status-legend--compact:not(.horarios-legend)'
    );
    if (!legendEl) return;

    const present = [...new Set(disciplines.map((d) => d.cat).filter(Boolean))];
    const cats = sortCategories(present);

    legendEl.classList.add('category-legend');
    legendEl.setAttribute('aria-label', 'Legenda de categorias');
    legendEl.innerHTML = cats
      .map((cat, i) => {
        const bg = catColor(cat);
        const name = catLabel(cat);
        const item = `<span class="stl-item"><span class="stl-dot" style="background:${bg}"></span>${escapeHtml(
          name
        )}</span>`;
        const sep =
          i < cats.length - 1 ? '<span class="stl-sep">·</span>' : '';
        return item + sep;
      })
      .join('');
  }

  function buildChSectionHtml(disc) {
    const rows = [
      `<div class="dlg-ch-row"><span>Total:</span><span>${escapeHtml(disc.ch || '—')}</span></div>`,
    ];
    const breakdown = [
      ['ch_teo', 'Presencial teórica'],
      ['ch_prat', 'Presencial prática'],
      ['ch_ead_t', 'EaD teórica'],
      ['ch_ead_p', 'EaD prática'],
      ['ch_ext', 'Extensão'],
    ];
    for (const [key, label] of breakdown) {
      if (Object.prototype.hasOwnProperty.call(disc, key)) {
        rows.push(
          `<div class="dlg-ch-row"><span>${label}:</span><span>${disc[key]}h</span></div>`
        );
      }
    }
    return `<div class="dlg-section dlg-block"><div class="dlg-lbl">Carga horária</div>${rows.join('')}</div>`;
  }

  function openDialog(disc, returnFocusEl) {
    if (!dialogEl || !dialogTitleEl || !dialogBody) return;
    closeAllDiscMenus();
    setDialogCccgMode(false);
    delete dialogBody.dataset.cccgSlotId;
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
        const ok = isPrereqSatisfied(pid);
        const label = prereqLabel(pid);
        prereqHtml += `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${escapeHtml(label)}</li>`;
      }
      prereqHtml += '</ul></div>';
    } else {
      prereqHtml =
        '<div class="dlg-section dlg-block"><div class="dlg-lbl">Pré-requisitos</div><div class="dlg-muted">Sem pré-requisitos por disciplina</div></div>';
    }

    let special = '';
    if (disc.specialMinCH) {
      special = `<div class="dlg-special" role="status"><span class="dlg-special-ic" aria-hidden="true">⏱</span> Este componente exige no mínimo <strong>${disc.specialMinCH}h</strong> integralizadas — verifique com a coordenação.</div>`;
    } else if (disc.specialNote) {
      special = `<div class="dlg-special" role="status"><span class="dlg-special-ic" aria-hidden="true">⏱</span> ${escapeHtml(
        String(disc.specialNote)
      )}</div>`;
    }

    const objetivoHtml =
      disc.objetivo && String(disc.objetivo).trim()
        ? `<div class="dlg-section dlg-block"><div class="dlg-lbl">Objetivo</div><div class="dlg-ementa">${escapeHtml(
            disc.objetivo
          )}</div></div>`
        : '';

    dialogBody.innerHTML = `
      <div class="dlg-row"><span class="dlg-k">Código</span><span class="dlg-mono">${escapeHtml(String(disc.codigo))}</span></div>
      <div class="dlg-row"><span class="dlg-k">Eixo/Categoria</span><span>${escapeHtml(CAT_NAMES[disc.cat] || disc.cat)}</span></div>
      <div class="dlg-row"><span class="dlg-k">Status</span><span>${stLabel}</span></div>
      <hr class="dlg-hr" />
      ${buildChSectionHtml(disc)}
      <div class="dlg-section dlg-block"><div class="dlg-lbl">Ementa</div><div class="dlg-ementa">${escapeHtml(ementaText(disc))}</div></div>
      ${objetivoHtml}
      ${prereqHtml}
      ${special}
    `;

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
    setDialogCccgMode(false);
    delete dialogBody.dataset.cccgSlotId;

    if (cccgPickerRestore) {
      const ctx = cccgPickerRestore;
      cccgPickerRestore = null;
      requestAnimationFrame(() => openCccgPicker(ctx.slotDisc, ctx.returnFocusEl));
      return;
    }

    if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  }

  function discChTotal(disc) {
    if (
      disc.ch_teo != null ||
      disc.ch_prat != null ||
      disc.ch_ead_t != null ||
      disc.ch_ead_p != null ||
      disc.ch_ext != null
    ) {
      return (
        (disc.ch_teo || 0) +
        (disc.ch_prat || 0) +
        (disc.ch_ead_t || 0) +
        (disc.ch_ead_p || 0) +
        (disc.ch_ext || 0)
      );
    }
    return parseChHours(disc.ch);
  }

  /** Progresso de CH por bucket do PPC (quando cfg.chIntegralization está definido). */
  function computeChIntegralization() {
    const plan = cfg.chIntegralization;
    if (!plan || !Array.isArray(plan.buckets)) return null;

    let ccogDone = 0;
    let aceFromDisc = 0;
    for (const d of disciplines) {
      if (progress[d.id] !== 'done') continue;
      if (isCccgSlot(d)) continue;
      ccogDone += discChTotal(d);
      aceFromDisc += d.ch_ext || 0;
    }

    let cccgDone = 0;
    let aceFromCccg = 0;
    if (cccgsEnabled) {
      for (const slotId of Object.keys(cccgPicks)) {
        for (const codigo of getSlotPicks(slotId)) {
          const item = cccgByCodigo.get(codigo);
          if (!item) continue;
          cccgDone += cccgItemCh(item);
          aceFromCccg += item.ch_ext || 0;
        }
      }
    }

    const rawById = {
      ccog: ccogDone,
      cccg: cccgDone,
      ace: aceFromDisc + aceFromCccg,
      acg: 0,
    };

    const buckets = plan.buckets.map((b) => {
      const rawDone = rawById[b.id] ?? 0;
      return {
        ...b,
        rawDone,
        done: Math.min(rawDone, b.required),
      };
    });

    const totalDone = buckets.reduce((sum, b) => sum + b.done, 0);

    return {
      total: plan.total || buckets.reduce((sum, b) => sum + b.required, 0),
      buckets,
      totalDone,
    };
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
          const manualNote = b.manual ? ' · fora da grade' : '';
          return `<span class="ch-bucket${complete ? ' is-complete' : ''}" title="${escapeAttr(
            b.label + manualNote
          )}">
            <span class="ch-bucket-label">${escapeHtml(b.shortLabel || b.label)}</span>
            <span class="ch-bucket-val">${b.done}/${b.required}h</span>
          </span>`;
        })
        .join('') +
      '</div>';
  }

  function render() {
    if (!gridEl) return;

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
      const disp = displayState(d);
      if (disp === 'locked') nLocked++;
      else if (disp === 'ready') nAvail++;
    }

    setStat('statDone', nDone);
    setStat('statProgress', nProg);
    setStat('statAvail', nAvail);
    setStat('statLocked', nLocked);
    setStat('statTotal', total);

    renderChIntegralization(computeChIntegralization());

    if (typeof window.ensureMobileLegendToggle === 'function') {
      window.ensureMobileLegendToggle();
    }

    renderCategoryLegend();

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

      const cardsWrap = document.createElement('div');
      cardsWrap.className = 'semester-cards';
      cardsWrap.dataset.sem = String(sem);
      col.appendChild(cardsWrap);

      for (const disc of bySem[sem]) {
        const disp = displayState(disc);
        const card = document.createElement('div');
        card.className = 'disc-card ' + disp;
        card.setAttribute('role', 'group');
        card.setAttribute('tabindex', '0');
        card.setAttribute(
          'aria-label',
          `${disc.name}, ${a11yCardStatusLabel(disc)}${
            isCccgSlot(disc)
              ? (() => {
                  const sum = cccgSlotSummary(disc.id);
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
        ribbon.style.background = catColor(disc.cat);

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

        if (isCccgSlot(disc)) {
          const sum = cccgSlotSummary(disc.id);
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
            closeAllDiscMenus();
            if (opt.status) setDiscState(disc, value);
            else if (opt.cccgPicker) openCccgPicker(disc, card);
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
        if (isCccgSlot(disc)) {
          addMenuItem('Escolher componentes', null, { cccgPicker: true });
        } else {
          addMenuItem('Ver detalhes', null, { details: true });
        }

        menuWrap._discPanel = panel;

        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          const wasOpen = menuWrap.classList.contains('is-open');
          closeAllDiscMenus();
          if (!wasOpen) {
            menuWrap.classList.add('is-open');
            trigger.setAttribute('aria-expanded', 'true');
            openDiscMenuPanel(menuWrap);
            positionDiscMenuPanel(menuWrap);
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
            cardPrimaryAction(disc, card);
          }
        });

        card.addEventListener('click', (ev) => {
          if (!isCccgSlot(disc)) return;
          if (ev.target.closest('.disc-menu, .disc-menu-trigger, .disc-menu-panel')) return;
          openCccgPicker(disc, card);
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

  function setStat(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof window.closeMobileDrawer === 'function' && window.closeMobileDrawer()) {
        e.preventDefault();
        return;
      }
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
      if (isMobileViewport()) {
        closeAllDiscMenus();
        return;
      }
      document.querySelectorAll('.disc-menu.is-open').forEach(positionDiscMenuPanel);
    },
    true
  );

  function handleCccgPickerClick(ev) {
    if (!dialogBody?.classList.contains('dialog-body--cccg-picker')) return;
    const slotId = dialogBody.dataset.cccgSlotId;
    const slotDisc = disciplines.find((d) => d.id === slotId);
    if (!slotDisc) return;
    const returnFocusEl = lastFocusEl;

    const toggle = ev.target.closest('[data-cccg-toggle]');
    if (toggle && !toggle.disabled) {
      ev.preventDefault();
      toggleCccgPick(slotId, toggle.getAttribute('data-cccg-toggle'), slotDisc);
      render();
      openCccgPicker(slotDisc, returnFocusEl);
      return;
    }
    const removeBtn = ev.target.closest('[data-cccg-remove]');
    if (removeBtn) {
      ev.preventDefault();
      toggleCccgPick(slotId, removeBtn.getAttribute('data-cccg-remove'), slotDisc);
      render();
      openCccgPicker(slotDisc, returnFocusEl);
      return;
    }
    const detailBtn = ev.target.closest('[data-cccg-detail]');
    if (detailBtn) {
      ev.preventDefault();
      const codigo = detailBtn.getAttribute('data-cccg-detail');
      const item = cccgByCodigo.get(codigo);
      if (!item) return;
      cccgPickerRestore = { slotDisc, returnFocusEl };
      openDialog(cccgItemAsDisc(item), detailBtn);
    }
  }

  dialogEl?.addEventListener('click', (e) => {
    if (e.target === dialogEl) closeDialog();
  });

  dialogBody?.addEventListener('click', handleCccgPickerClick);

  dialogEl?.querySelector('.dialog-close')?.addEventListener('click', closeDialog);

  if (dialogEl && !dialogEl.classList.contains('open')) {
    dialogEl.setAttribute('aria-hidden', 'true');
    dialogEl.setAttribute('inert', '');
  }

  loadProgress();
  loadNotes();
  loadCccgPicks();
  render();
})();
