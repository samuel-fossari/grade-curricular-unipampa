/**
 * @file grade-storage.js
 * @description Chaves de localStorage, export/import de backup JSON e utilitários compartilhados.
 *
 * Expõe `window.GRADE_STORAGE` para main.js, horarios.js e acessibilidade-page.js.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Constantes
   * ========================================================================== */

  /** Siglas dos cursos suportados pelo projeto. */
  const SIGLAS = ['es', 'cc', 'ec', 'ee', 'em', 'ea', 'et'];

  /** Versão do formato de exportação JSON. */
  const EXPORT_VERSION = 1;

  /** Chave legada da grade só de ES (antes do suporte multi-curso). */
  const LEGACY_ES_PROGRESS_KEY = 'grade_es_unipampa_v1';

  /** Disciplinas avulsas na página Horários. */
  const HORARIOS_AVULSAS_KEY = 'grade_unipampa_horarios_avulsas_v1';

  /* ==========================================================================
   * Chaves de localStorage por curso
   * ========================================================================== */

  /** @param {string} sigla */
  function progressKey(sigla) {
    return `grade_unipampa_${sigla}_progress_v1`;
  }

  /** @param {string} sigla */
  function cccgPicksKey(sigla) {
    return `grade_unipampa_${sigla}_cccg_picks_v1`;
  }

  /** @param {string} sigla */
  function notesKey(sigla) {
    return `grade_unipampa_${sigla}_notes_v1`;
  }

  /** @param {string} sigla */
  function manualChKey(sigla) {
    return `grade_unipampa_${sigla}_manual_ch_v1`;
  }

  /* ==========================================================================
   * Leitura / escrita
   * ========================================================================== */

  /**
   * Lê JSON do localStorage com fallback seguro.
   * @param {string} key
   * @param {*} fallback
   */
  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (raw == null || raw === '') return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  /**
   * Monta objeto de backup com progresso de todos os cursos e preferências globais.
   * @returns {object}
   */
  function exportAll() {
    /** @type {Record<string, object>} */
    const courses = {};
    for (const sigla of SIGLAS) {
      courses[sigla] = {
        progress: readJson(progressKey(sigla), {}),
        cccgPicks: readJson(cccgPicksKey(sigla), {}),
        manualCh: readJson(manualChKey(sigla), {}),
        notes: readJson(notesKey(sigla), {}),
      };
    }
    return {
      app: 'grade-curricular-unipampa',
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      theme: localStorage.getItem('grade_unipampa_theme_v1') || 'dark',
      font: localStorage.getItem('grade_unipampa_font_v1') || '16',
      sidebar: localStorage.getItem('grade_unipampa_sidebar_v1') || null,
      horariosCurso: localStorage.getItem('grade_unipampa_horarios_curso_v1') || null,
      horariosAvulsas: readJson(HORARIOS_AVULSAS_KEY, []),
      legacyEsProgressMigrated: !localStorage.getItem(LEGACY_ES_PROGRESS_KEY),
      courses,
    };
  }

  /**
   * Restaura backup exportado.
   * @param {object} data
   * @param {{ merge?: boolean }} [opts]
   */
  function importAll(data, opts) {
    if (!data || typeof data !== 'object') {
      throw new Error('Arquivo inválido: JSON esperado.');
    }
    if (data.app !== 'grade-curricular-unipampa') {
      throw new Error('Este arquivo não parece ser um backup deste projeto.');
    }
    const courses = data.courses;
    if (!courses || typeof courses !== 'object') {
      throw new Error('Backup sem dados de cursos.');
    }

    const merge = !!opts?.merge;

    for (const sigla of SIGLAS) {
      const block = courses[sigla];
      if (!block || typeof block !== 'object') continue;

      if (block.progress && typeof block.progress === 'object') {
        const key = progressKey(sigla);
        if (merge) {
          const cur = readJson(key, {});
          localStorage.setItem(key, JSON.stringify({ ...cur, ...block.progress }));
        } else {
          localStorage.setItem(key, JSON.stringify(block.progress));
        }
      }
      if (block.cccgPicks && typeof block.cccgPicks === 'object') {
        const key = cccgPicksKey(sigla);
        if (merge) {
          const cur = readJson(key, {});
          localStorage.setItem(key, JSON.stringify({ ...cur, ...block.cccgPicks }));
        } else {
          localStorage.setItem(key, JSON.stringify(block.cccgPicks));
        }
      }
      if (block.manualCh && typeof block.manualCh === 'object') {
        const key = manualChKey(sigla);
        if (merge) {
          const cur = readJson(key, {});
          localStorage.setItem(key, JSON.stringify({ ...cur, ...block.manualCh }));
        } else {
          localStorage.setItem(key, JSON.stringify(block.manualCh));
        }
      }
      if (block.notes && typeof block.notes === 'object') {
        const key = notesKey(sigla);
        if (merge) {
          const cur = readJson(key, {});
          localStorage.setItem(key, JSON.stringify({ ...cur, ...block.notes }));
        } else {
          localStorage.setItem(key, JSON.stringify(block.notes));
        }
      }
    }

    if (data.theme) localStorage.setItem('grade_unipampa_theme_v1', String(data.theme));
    if (data.font) localStorage.setItem('grade_unipampa_font_v1', String(data.font));
    if (data.sidebar) localStorage.setItem('grade_unipampa_sidebar_v1', String(data.sidebar));
    if (data.horariosCurso) {
      localStorage.setItem('grade_unipampa_horarios_curso_v1', String(data.horariosCurso));
    }
    if (Array.isArray(data.horariosAvulsas)) {
      localStorage.setItem(HORARIOS_AVULSAS_KEY, JSON.stringify(data.horariosAvulsas));
    }
  }

  /**
   * Apaga progresso, CCCGs, horas manuais, anotações de horários e avulsas de todos os cursos.
   * Não altera tema, fonte, sidebar nem curso selecionado em Horários.
   */
  function clearAllCourseData() {
    for (const sigla of SIGLAS) {
      localStorage.removeItem(progressKey(sigla));
      localStorage.removeItem(cccgPicksKey(sigla));
      localStorage.removeItem(manualChKey(sigla));
      localStorage.removeItem(notesKey(sigla));
    }
    localStorage.removeItem(HORARIOS_AVULSAS_KEY);
    localStorage.removeItem(LEGACY_ES_PROGRESS_KEY);
  }

  /** Dispara download do backup JSON no navegador. */
  function downloadExport() {
    const payload = exportAll();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `grade-unipampa-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.GRADE_BACKUP_NUDGE?.markBackupExported();
  }

  /* ==========================================================================
   * API pública
   * ========================================================================== */

  window.GRADE_STORAGE = {
    SIGLAS,
    EXPORT_VERSION,
    LEGACY_ES_PROGRESS_KEY,
    progressKey,
    cccgPicksKey,
    notesKey,
    manualChKey,
    HORARIOS_AVULSAS_KEY,
    exportAll,
    importAll,
    downloadExport,
    clearAllCourseData,
  };
})();
