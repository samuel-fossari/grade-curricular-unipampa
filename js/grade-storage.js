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
  const EXPORT_VERSION = 2;

  const PROFILE_KEY = 'grade_unipampa_profile_v1';
  const GUEST_KEY = 'grade_unipampa_guest_v1';

  /** Chave legada da grade só de ES (antes do suporte multi-curso). */
  const LEGACY_ES_PROGRESS_KEY = 'grade_es_unipampa_v1';

  /** Disciplinas avulsas globais (legado: migrado para chave por curso). */
  const LEGACY_HORARIOS_AVULSAS_KEY = 'grade_unipampa_horarios_avulsas_v1';
  const AVULSAS_MIGRATED_FLAG = 'grade_unipampa_horarios_avulsas_migrated_v1';

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
  function cccgCustomKey(sigla) {
    return `grade_unipampa_${sigla}_cccg_custom_v1`;
  }

  /** @param {string} sigla */
  function notesKey(sigla) {
    return `grade_unipampa_${sigla}_notes_v1`;
  }

  /** @param {string} sigla */
  function manualChKey(sigla) {
    return `grade_unipampa_${sigla}_manual_ch_v1`;
  }

  /** @param {string} sigla */
  function avulsasKey(sigla) {
    return `grade_unipampa_${sigla}_horarios_avulsas_v1`;
  }

  /**
   * Move lista global legada para o curso ativo em Horários (uma vez).
   */
  function migrateLegacyHorariosAvulsas() {
    if (localStorage.getItem(AVULSAS_MIGRATED_FLAG) === '1') return;
    const legacy = readJson(LEGACY_HORARIOS_AVULSAS_KEY, null);
    if (!Array.isArray(legacy) || legacy.length === 0) {
      localStorage.setItem(AVULSAS_MIGRATED_FLAG, '1');
      localStorage.removeItem(LEGACY_HORARIOS_AVULSAS_KEY);
      return;
    }
    /* Lista global não tinha curso; avulsas históricas ficam em ES (curso padrão da página). */
    const target = 'es';
    const key = avulsasKey(target);
    const existing = readJson(key, []);
    if (!Array.isArray(existing) || existing.length === 0) {
      localStorage.setItem(key, JSON.stringify(legacy));
    }
    localStorage.removeItem(LEGACY_HORARIOS_AVULSAS_KEY);
    localStorage.setItem(AVULSAS_MIGRATED_FLAG, '1');
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
        cccgCustom: readJson(cccgCustomKey(sigla), []),
        manualCh: readJson(manualChKey(sigla), {}),
        notes: readJson(notesKey(sigla), {}),
        avulsas: readJson(avulsasKey(sigla), []),
      };
    }
    migrateLegacyHorariosAvulsas();
    const profile = readJson(PROFILE_KEY, null);
    return {
      app: 'grade-curricular-unipampa',
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      profile: profile && typeof profile === 'object' ? profile : null,
      guest: localStorage.getItem(GUEST_KEY) === 'true',
      loggedIn: localStorage.getItem('grade_unipampa_logged_in_v1') === 'true',
      theme: localStorage.getItem('grade_unipampa_theme_v1') || 'light',
      font: localStorage.getItem('grade_unipampa_font_v1') || '16',
      sidebar: localStorage.getItem('grade_unipampa_sidebar_v1') || null,
      horariosCurso: localStorage.getItem('grade_unipampa_horarios_curso_v1') || null,
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
      if (Array.isArray(block.cccgCustom)) {
        const key = cccgCustomKey(sigla);
        if (merge) {
          const cur = readJson(key, []);
          const byCodigo = new Map();
          for (const item of Array.isArray(cur) ? cur : []) {
            if (item && typeof item.codigo === 'string') byCodigo.set(item.codigo, item);
          }
          for (const item of block.cccgCustom) {
            if (item && typeof item.codigo === 'string') byCodigo.set(item.codigo, item);
          }
          localStorage.setItem(key, JSON.stringify([...byCodigo.values()]));
        } else {
          localStorage.setItem(key, JSON.stringify(block.cccgCustom));
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
      if (Array.isArray(block.avulsas)) {
        const key = avulsasKey(sigla);
        if (merge) {
          const cur = readJson(key, []);
          const byId = new Map(
            (Array.isArray(cur) ? cur : [])
              .filter((x) => x && typeof x.id === 'string')
              .map((x) => [x.id, x])
          );
          for (const item of block.avulsas) {
            if (item && typeof item.id === 'string') byId.set(item.id, item);
          }
          localStorage.setItem(key, JSON.stringify([...byId.values()]));
        } else {
          localStorage.setItem(key, JSON.stringify(block.avulsas));
        }
      }
    }

    if (Array.isArray(data.horariosAvulsas)) {
      const legacyTarget =
        typeof data.horariosCurso === 'string' && SIGLAS.includes(data.horariosCurso)
          ? data.horariosCurso
          : 'es';
      const key = avulsasKey(legacyTarget);
      if (merge) {
        const cur = readJson(key, []);
        const byId = new Map(
          (Array.isArray(cur) ? cur : [])
            .filter((x) => x && typeof x.id === 'string')
            .map((x) => [x.id, x])
        );
        for (const item of data.horariosAvulsas) {
          if (item && typeof item.id === 'string') byId.set(item.id, item);
        }
        localStorage.setItem(key, JSON.stringify([...byId.values()]));
      } else {
        localStorage.setItem(key, JSON.stringify(data.horariosAvulsas));
      }
    }

    if (data.profile && typeof data.profile === 'object') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
    }
    if (typeof data.guest === 'boolean') {
      if (data.guest) {
        localStorage.setItem(GUEST_KEY, 'true');
        window.GRADE_PROFILE?.setDataOwner?.('guest');
      } else {
        localStorage.removeItem(GUEST_KEY);
      }
    }
    if (typeof data.loggedIn === 'boolean') {
      if (data.loggedIn) localStorage.setItem('grade_unipampa_logged_in_v1', 'true');
      else localStorage.removeItem('grade_unipampa_logged_in_v1');
    }

    if (data.theme) localStorage.setItem('grade_unipampa_theme_v1', String(data.theme));
    if (data.font) localStorage.setItem('grade_unipampa_font_v1', String(data.font));
    if (data.sidebar) localStorage.setItem('grade_unipampa_sidebar_v1', String(data.sidebar));
    if (data.horariosCurso) {
      localStorage.setItem('grade_unipampa_horarios_curso_v1', String(data.horariosCurso));
    }
    if (typeof window !== 'undefined') {
      window.GRADE_SITEPREFS?.reapplyFromStorage?.();
    }
  }

  /** Restaura só tema, fonte e preferências globais (sem progresso). */
  function importPreferences(data) {
    if (!data || typeof data !== 'object') return;
    if (data.profile && typeof data.profile === 'object') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));
    }
    if (typeof data.guest === 'boolean') {
      if (data.guest) {
        localStorage.setItem(GUEST_KEY, 'true');
        window.GRADE_PROFILE?.setDataOwner?.('guest');
      } else {
        localStorage.removeItem(GUEST_KEY);
      }
    }
    if (typeof data.loggedIn === 'boolean') {
      if (data.loggedIn) localStorage.setItem('grade_unipampa_logged_in_v1', 'true');
      else localStorage.removeItem('grade_unipampa_logged_in_v1');
    }
    if (data.theme) localStorage.setItem('grade_unipampa_theme_v1', String(data.theme));
    if (data.font) localStorage.setItem('grade_unipampa_font_v1', String(data.font));
    if (data.sidebar) localStorage.setItem('grade_unipampa_sidebar_v1', String(data.sidebar));
    if (data.horariosCurso) {
      localStorage.setItem('grade_unipampa_horarios_curso_v1', String(data.horariosCurso));
    }
    window.GRADE_SITEPREFS?.reapplyFromStorage?.();
  }

  /**
   * Apaga progresso, CCCGs, horas manuais, anotações de horários e avulsas de todos os cursos.
   * Não altera tema, fonte, sidebar nem curso selecionado em Horários.
   */
  function clearAllCourseData() {
    for (const sigla of SIGLAS) {
      localStorage.removeItem(progressKey(sigla));
      localStorage.removeItem(cccgPicksKey(sigla));
      localStorage.removeItem(cccgCustomKey(sigla));
      localStorage.removeItem(manualChKey(sigla));
      localStorage.removeItem(notesKey(sigla));
      localStorage.removeItem(avulsasKey(sigla));
    }
    localStorage.removeItem(LEGACY_HORARIOS_AVULSAS_KEY);
    localStorage.removeItem(AVULSAS_MIGRATED_FLAG);
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
    cccgCustomKey,
    notesKey,
    manualChKey,
    avulsasKey,
    LEGACY_HORARIOS_AVULSAS_KEY,
    migrateLegacyHorariosAvulsas,
    exportAll,
    importAll,
    importPreferences,
    downloadExport,
    clearAllCourseData,
  };
})();
