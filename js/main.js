/**
 * @file main.js
 * @description Motor genérico da grade curricular interativa.
 *
 * Responsabilidades:
 * - Bootstrap do curso e regras de pré-requisitos/CCCG
 * - Orquestração dos módulos em js/grade/*
 * - Eventos globais e inicialização
 *
 * Dependência global: `window.GRADE_CURSO_CONFIG`
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Bootstrap: configuração do curso
   * ========================================================================== */

  const cfg = window.GRADE_CURSO_CONFIG;
  if (!cfg || !Array.isArray(cfg.disciplines)) {
    return;
  }

  const { normalizeDisciplines } = window.GRADE_NORMALIZE;
  const {
    discChTotal,
    computeChIntegralization: computeChIntegralizationCore,
    mandatoryIntegralizedCh: mandatoryIntegralizedChFromData,
    isCccgSlot: isCccgSlotDisc,
  } = window.GRADE_CH;
  const GPr = window.GRADE_PREREQS;
  const GCc = window.GRADE_CCCG;
  const {
    escapeHtml,
    announce,
    showToast,
    isMobileViewport,
  } = window.GRADE_DOM;
  const {
    CAT_NAMES,
    cccgPickerCategories: cccgPickerCategoriesFor,
    catColor,
    catLabel,
    renderCategoryLegend,
  } = window.GRADE_CATEGORIES;
  const {
    closeAllDiscMenus,
    openDiscMenuPanel,
    positionDiscMenuPanel,
  } = window.GRADE_DISC_MENU;

  const sigla = String(cfg.sigla || 'curso').toLowerCase();
  const disciplines = normalizeDisciplines(cfg.disciplines, sigla);
  const maxSem = Math.max(
    cfg.maxSemesters || 0,
    ...disciplines.map((d) => d.sem || 0)
  );

  const progressKey = `grade_unipampa_${sigla}_progress_v1`;
  const manualChKey = `grade_unipampa_${sigla}_manual_ch_v1`;
  const LEGACY_ES_KEY = 'grade_es_unipampa_v1';

  /* ------------------------------------------------------------------------
   * Estado em memória (espelha localStorage durante a sessão)
   * ------------------------------------------------------------------------ */

  const store = {
    progress: {},
    manualCh: {},
    cccgPicks: {},
    cccgCustom: [],
  };

  let gradeSearchQuery = '';
  let gradeStatusFilter = 'all';

  const uiState = {
    lastFocusEl: null,
    cccgPickerRestore: null,
    manualChRowBound: false,
    gradeExportReady: false,
  };

  /* ------------------------------------------------------------------------
   * CCCG: catálogo e índices derivados
   * ------------------------------------------------------------------------ */

  const cccgsCatalog = Array.isArray(cfg.cccgs) ? cfg.cccgs : [];
  const cccgsEnabled = cccgsCatalog.length > 0;
  const cccgPicksKey = `grade_unipampa_${sigla}_cccg_picks_v1`;
  const cccgCustomKey = `grade_unipampa_${sigla}_cccg_custom_v1`;
  const cccgByCodigo = new Map();
  const cccgSlotsBySem = GCc.buildCccgSlotsBySem(disciplines, cccgsEnabled);

  function rebuildCccgIndex() {
    GCc.fillCccgByCodigo(cccgByCodigo, cccgsCatalog, store.cccgCustom);
  }

  function getCccgsCatalog() {
    const ppcCodes = new Set(cccgsCatalog.map((item) => String(item.codigo)));
    const custom = store.cccgCustom.filter((item) => !ppcCodes.has(String(item.codigo)));
    return [...cccgsCatalog, ...custom];
  }

  rebuildCccgIndex();

  /* ------------------------------------------------------------------------
   * DOM: referências compartilhadas
   * ------------------------------------------------------------------------ */

  const gridEl = document.getElementById('grid');
  const dialogEl = document.getElementById('detailDialog');
  const dialogTitleEl = document.getElementById('dialog-title');
  const dialogBody = document.getElementById('dialogBody');

  /* ==========================================================================
   * Regras: pré-requisitos, bloqueios e CCCG
   * ========================================================================== */

  function isCccgSlot(disc) {
    return isCccgSlotDisc(disc, cccgsEnabled);
  }

  function gradeRulesCtx() {
    return {
      disciplines,
      progress: store.progress,
      cccgPicks: store.cccgPicks,
      cccgByCodigo,
      cfg,
      cccgSlotsBySem,
      mandatoryIntegralizedCh,
      prereqLabel,
      isCccgSlot,
    };
  }

  function prereqLabel(pid) {
    if (String(pid).startsWith('__minch:')) {
      return `${String(pid).slice(8)}h integralizadas (CCOG)`;
    }
    const byId = disciplines.find((x) => x.id === pid);
    if (byId) return byId.name;
    const byCodigo = disciplines.find((x) => x.codigo === pid);
    if (byCodigo) return byCodigo.name;
    const cat = cccgByCodigo.get(pid);
    if (cat) return cat.nome;
    return pid;
  }

  function mandatoryIntegralizedCh() {
    return mandatoryIntegralizedChFromData(computeChIntegralization());
  }

  function computeChIntegralization() {
    return computeChIntegralizationCore({
      plan: cfg.chIntegralization,
      disciplines,
      progress: store.progress,
      manualCh: store.manualCh,
      cccgPicks: store.cccgPicks,
      cccgByCodigo,
      cccgsEnabled,
    });
  }

  function cccgItemCh(item) {
    return GCc.cccgItemCh(item);
  }

  function cccgSlotIdsInSem(sem) {
    return GCc.cccgSlotIdsInSem(sem, cccgSlotsBySem);
  }

  function cccgSemesterLimit(sem) {
    return GCc.cccgSemesterLimit(sem, cfg, cccgSlotsBySem);
  }

  function cccgSemesterPicksChTotal(sem) {
    return GCc.cccgSemesterPicksChTotal(sem, store.cccgPicks, cccgByCodigo, cccgSlotsBySem);
  }

  function cccgSemesterRemaining(sem) {
    return GCc.cccgSemesterRemaining(sem, cfg, store.cccgPicks, cccgByCodigo, cccgSlotsBySem);
  }

  function cccgUnmetPrereqs(item) {
    return GCc.cccgUnmetPrereqs(item, gradeRulesCtx());
  }

  function getSlotPicks(slotId) {
    return GCc.getSlotPicks(slotId, store.cccgPicks);
  }

  function slotPicksChTotal(slotId) {
    return GCc.slotPicksChTotal(slotId, store.cccgPicks, cccgByCodigo);
  }

  function isCodigoPickedAnywhere(codigo, exceptSlotId) {
    return GPr.isCodigoPickedAnywhere(codigo, store.cccgPicks, exceptSlotId);
  }

  function isPrereqSatisfied(pid) {
    return GPr.isPrereqSatisfied(pid, gradeRulesCtx());
  }

  function cccgPickBlockReason(item, slotId, slotDisc) {
    return GCc.cccgPickBlockReason(item, slotId, slotDisc, gradeRulesCtx());
  }

  function cccgPickerCategories() {
    const cats = cccgPickerCategoriesFor(sigla, getCccgsCatalog());
    const customCat = GCc.CUSTOM_CCCG_CAT;
    if (!store.cccgCustom.length) return cats;
    return [customCat, ...cats.filter((c) => c !== customCat)];
  }

  function prereqsAllDone(disc) {
    return GPr.prereqsAllDone(disc, gradeRulesCtx());
  }

  function specialMinChMet(disc) {
    return GPr.specialMinChMet(disc, mandatoryIntegralizedCh());
  }

  function unmetLockReasons(disc) {
    return GPr.unmetLockReasons(disc, gradeRulesCtx());
  }

  function isLocked(disc) {
    return GPr.isDiscLocked(disc, gradeRulesCtx());
  }

  function storedState(disc) {
    return store.progress[disc.id] || 'not_done';
  }

  function displayState(disc) {
    return GPr.displayDiscState(disc, gradeRulesCtx());
  }

  function dependents(id) {
    return GPr.dependents(id, disciplines);
  }

  function canLeaveDoneOrProgress(id) {
    return GPr.canLeaveDoneOrProgress(id, disciplines, store.progress);
  }

  /* ==========================================================================
   * Persistência
   * ========================================================================== */

  const persistence = window.GRADE_PERSISTENCE.createGradePersistence({
    sigla,
    disciplines,
    cccgsEnabled,
    progressKey,
    manualChKey,
    cccgPicksKey,
    cccgCustomKey,
    legacyEsKey: LEGACY_ES_KEY,
    store,
  });

  const {
    loadProgress,
    saveProgress,
    loadManualCh,
    saveManualCh,
    loadCccgPicks,
    saveCccgPicks,
    loadCccgCustom,
    saveCccgCustom,
  } = persistence;

  function addCustomCccg(input) {
    const parsed = GCc.parseCustomCccgForm(input, {
      takenCodigos: new Set(cccgByCodigo.keys()),
    });
    if (!parsed.ok) return parsed;
    store.cccgCustom.push(parsed.item);
    saveCccgCustom();
    rebuildCccgIndex();
    window.GRADE_BACKUP_NUDGE?.onProgressChanged();
    return parsed;
  }

  function deleteCustomCccg(codigo) {
    const idx = store.cccgCustom.findIndex((item) => String(item.codigo) === String(codigo));
    if (idx < 0) return false;
    store.cccgCustom.splice(idx, 1);
    GCc.removeCodigoFromCccgPicks(store.cccgPicks, codigo);
    saveCccgCustom();
    saveCccgPicks();
    rebuildCccgIndex();
    showToast('Cadastro excluído: ' + codigo);
    return true;
  }

  /** Referências cruzadas preenchidas após criação dos factories. */
  const cross = {
    openDialog: null,
    closeDialog: null,
    openCccgPicker: null,
    render: null,
  };

  const dialogFocusTrap = window.GRADE_DOM.createDialogFocusTrap();

  /* ==========================================================================
   * Estado dos cartões: transições de progresso
   * ========================================================================== */

  function toastForState(disc, target) {
    if (target === 'done') showToast('✓ ' + disc.name + ': concluída');
    else if (target === 'in_progress') showToast('◐ ' + disc.name + ': em andamento');
    else showToast('○ ' + disc.name + ': não iniciada');
  }

  function statusAnnounceLabel(target) {
    if (target === 'done') return 'concluída';
    if (target === 'in_progress') return 'em andamento';
    return 'não feita';
  }

  function a11yCardStatusLabel(disc) {
    const disp = displayState(disc);
    if (disp === 'locked') return 'bloqueada: requisitos pendentes';
    if (disp === 'in_progress') return 'em andamento';
    if (disp === 'done') return 'concluída';
    return 'disponível';
  }

  function setDiscState(disc, target) {
    if (target !== 'not_done' && target !== 'in_progress' && target !== 'done') return;
    if (isLocked(disc) && (target === 'done' || target === 'in_progress')) {
      const missing = unmetLockReasons(disc);
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
    store.progress[disc.id] = target;
    saveProgress();
    window.GRADE_BACKUP_NUDGE?.onProgressChanged();
    announce(`${disc.name}: ${statusAnnounceLabel(target)}`);
    toastForState(disc, target);
    closeAllDiscMenus();
    cross.render();
  }

  /* ==========================================================================
   * Módulos: modal, seletor CCCG, toolbar e render
   * ========================================================================== */

  const modal = window.GRADE_MODAL.createGradeModal({
    cfg,
    sigla,
    dialogEl,
    dialogTitleEl,
    dialogBody,
    uiState,
    focusTrap: dialogFocusTrap,
    CAT_NAMES,
    displayState,
    isPrereqSatisfied,
    prereqLabel,
    specialMinChMet,
    mandatoryIntegralizedCh,
    closeAllDiscMenus,
    get openCccgPicker() {
      return cross.openCccgPicker;
    },
  });

  const cccgPicker = window.GRADE_CCCG_PICKER.createCccgPicker({
    cfg,
    sigla,
    disciplines,
    store,
    dialogEl,
    dialogTitleEl,
    dialogBody,
    uiState,
    focusTrap: dialogFocusTrap,
    cccgsEnabled,
    cccgsCatalog,
    getCccgsCatalog,
    cccgByCodigo,
    isCustomCccg: GCc.isCustomCccg,
    addCustomCccg,
    deleteCustomCccg,
    catColor,
    catLabel,
    cccgItemCh,
    cccgSemesterLimit,
    cccgSemesterPicksChTotal,
    cccgSemesterRemaining,
    cccgSlotIdsInSem,
    getSlotPicks,
    cccgPickBlockReason,
    cccgPickerCategories,
    isCccgSlot,
    saveCccgPicks,
    showToast,
    closeAllDiscMenus,
    setDialogCccgMode: modal.setDialogCccgMode,
    openDialog: (...args) => modal.openDialog(...args),
    get render() {
      return cross.render;
    },
  });

  const toolbar = window.GRADE_TOOLBAR.createGradeToolbar({
    disciplines,
    gridEl,
    getSearchQuery: () => gradeSearchQuery,
    setSearchQuery: (q) => {
      gradeSearchQuery = q;
    },
    getStatusFilter: () => gradeStatusFilter,
    setStatusFilter: (f) => {
      gradeStatusFilter = f;
    },
    displayState,
    get render() {
      return cross.render;
    },
    openDialog: (...args) => modal.openDialog(...args),
  });

  const renderer = window.GRADE_RENDER.createGradeRenderer({
    cfg,
    sigla,
    disciplines,
    maxSem,
    store,
    gridEl,
    uiState,
    CAT_NAMES,
    progress: store.progress,
    getSearchQuery: () => gradeSearchQuery,
    getStatusFilter: () => gradeStatusFilter,
    displayState,
    isCccgSlot,
    isLocked,
    storedState,
    unmetLockReasons,
    setDiscState,
    catColor,
    cccgSlotSummary: cccgPicker.cccgSlotSummary,
    cardPrimaryAction: cccgPicker.cardPrimaryAction,
    computeChIntegralization,
    discChTotal,
    getSlotPicks,
    cccgByCodigo,
    saveManualCh,
    setupGradeToolbar: toolbar.setupGradeToolbar,
    updateReadyPanel: toolbar.updateReadyPanel,
    renderCategoryLegend: () =>
      renderCategoryLegend({ sigla, disciplines, escapeHtml }),
    closeAllDiscMenus,
    openDiscMenuPanel,
    positionDiscMenuPanel,
    openDialog: (...args) => modal.openDialog(...args),
    openCccgPicker: (...args) => cccgPicker.openCccgPicker(...args),
    a11yCardStatusLabel,
  });

  cross.openDialog = modal.openDialog;
  cross.closeDialog = modal.closeDialog;
  cross.openCccgPicker = cccgPicker.openCccgPicker;
  cross.render = renderer.render;

  const { render } = renderer;
  const { closeDialog } = modal;
  const { handleCccgPickerClick } = cccgPicker;

  /* ==========================================================================
   * Eventos globais e inicialização
   * ========================================================================== */

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
  loadManualCh();
  loadCccgPicks();
  loadCccgCustom();
  rebuildCccgIndex();
  render();
})();
