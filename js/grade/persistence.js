/**
 * Persistência em localStorage (progresso, CH manual, escolhas CCCG).
 */
(function (root) {
  'use strict';

  /**
   * @param {object} opts
   * @param {string} opts.sigla
   * @param {object[]} opts.disciplines
   * @param {boolean} opts.cccgsEnabled
   * @param {string} opts.progressKey
   * @param {string} opts.manualChKey
   * @param {string} opts.cccgPicksKey
   * @param {string} opts.legacyEsKey
   * @param {object} opts.store - `{ progress, manualCh, cccgPicks }` mutáveis
   */
  function createGradePersistence(opts) {
    const {
      sigla,
      disciplines,
      cccgsEnabled,
      progressKey,
      manualChKey,
      cccgPicksKey,
      legacyEsKey,
      store,
    } = opts;

    function migrateLegacyESIfNeeded() {
      if (sigla !== 'es') return;
      const already = localStorage.getItem(progressKey);
      if (already) return;
      const raw = localStorage.getItem(legacyEsKey);
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
      localStorage.removeItem(legacyEsKey);
    }

    function loadProgress() {
      migrateLegacyESIfNeeded();
      try {
        store.progress = JSON.parse(localStorage.getItem(progressKey) || '{}') || {};
      } catch {
        store.progress = {};
      }
      for (const d of disciplines) {
        if (!store.progress[d.id]) store.progress[d.id] = 'not_done';
      }
    }

    function saveProgress() {
      localStorage.setItem(progressKey, JSON.stringify(store.progress));
    }

    function loadManualCh() {
      try {
        store.manualCh = JSON.parse(localStorage.getItem(manualChKey) || '{}') || {};
      } catch {
        store.manualCh = {};
      }
    }

    function saveManualCh() {
      localStorage.setItem(manualChKey, JSON.stringify(store.manualCh));
    }

    function loadCccgPicks() {
      if (!cccgsEnabled) return;
      try {
        store.cccgPicks = JSON.parse(localStorage.getItem(cccgPicksKey) || '{}') || {};
      } catch {
        store.cccgPicks = {};
      }
    }

    function saveCccgPicks() {
      if (!cccgsEnabled) return;
      localStorage.setItem(cccgPicksKey, JSON.stringify(store.cccgPicks));
    }

    return {
      loadProgress,
      saveProgress,
      loadManualCh,
      saveManualCh,
      loadCccgPicks,
      saveCccgPicks,
    };
  }

  root.GRADE_PERSISTENCE = { createGradePersistence };
})(typeof globalThis !== 'undefined' ? globalThis : window);
