/**
 * Regras de seleção de CCCG (cotas, duplicidade, pré-requisitos).
 */
(function (root) {
  'use strict';

  function ch() {
    return root.GRADE_CH;
  }

  function prereqs() {
    return root.GRADE_PREREQS;
  }

  function isCccgSlot(disc, cccgsEnabled) {
    return cccgsEnabled && /^cccg/i.test(String(disc.id || ''));
  }

  function buildCccgSlotsBySem(disciplines, cccgsEnabled) {
    const map = new Map();
    for (const d of disciplines) {
      if (!isCccgSlot(d, cccgsEnabled)) continue;
      if (!map.has(d.sem)) map.set(d.sem, []);
      map.get(d.sem).push(d);
    }
    return map;
  }

  function cccgItemCh(item) {
    return ch().parseChHours(item?.ch);
  }

  function getSlotPicks(slotId, cccgPicks) {
    return Array.isArray(cccgPicks[slotId]) ? [...cccgPicks[slotId]] : [];
  }

  function slotPicksChTotal(slotId, cccgPicks, cccgByCodigo) {
    return getSlotPicks(slotId, cccgPicks).reduce((sum, codigo) => {
      const item = cccgByCodigo.get(codigo);
      return sum + cccgItemCh(item);
    }, 0);
  }

  function cccgSlotIdsInSem(sem, cccgSlotsBySem) {
    return (cccgSlotsBySem.get(sem) || []).map((d) => d.id);
  }

  function cccgSemesterLimit(sem, cfg, cccgSlotsBySem) {
    const explicit = cfg.cccgSemLimits?.[sem];
    if (explicit != null) return explicit;
    return (cccgSlotsBySem.get(sem) || []).reduce(
      (sum, d) => sum + ch().parseChHours(d.ch),
      0
    );
  }

  function cccgSemesterPicksChTotal(sem, cccgPicks, cccgByCodigo, cccgSlotsBySem) {
    return cccgSlotIdsInSem(sem, cccgSlotsBySem).reduce(
      (sum, slotId) => sum + slotPicksChTotal(slotId, cccgPicks, cccgByCodigo),
      0
    );
  }

  function cccgSemesterRemaining(sem, cfg, cccgPicks, cccgByCodigo, cccgSlotsBySem) {
    const limit = cccgSemesterLimit(sem, cfg, cccgSlotsBySem);
    const total = cccgSemesterPicksChTotal(sem, cccgPicks, cccgByCodigo, cccgSlotsBySem);
    return Math.max(0, limit - total);
  }

  function cccgUnmetPrereqs(item, ctx) {
    const unmet = (item.prereqs || []).filter((pid) => !prereqs().isPrereqSatisfied(pid, ctx));
    if (item.specialMinCH && ctx.mandatoryIntegralizedCh() < item.specialMinCH) {
      unmet.push(`__minch:${item.specialMinCH}`);
    }
    return unmet;
  }

  const CUSTOM_CCCG_CAT = 'cccg_custom';

  function isCustomCccg(item) {
    return !!(item && (item.custom === true || item.cat === CUSTOM_CCCG_CAT));
  }

  function normalizeCccgCodigo(raw) {
    return String(raw || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/[^A-Z0-9._-]/g, '')
      .slice(0, 24);
  }

  function generateCustomCccgCodigo(taken) {
    const takenSet = taken instanceof Set ? taken : new Set(taken || []);
    for (let i = 0; i < 24; i++) {
      const n = Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .toUpperCase()
        .padStart(6, '0');
      const codigo = 'AV-' + n;
      if (!takenSet.has(codigo)) return codigo;
    }
    return 'AV-' + Date.now().toString(36).toUpperCase();
  }

  function normalizeCustomCccgRecord(item) {
    if (!item || typeof item !== 'object') return null;
    const codigo = normalizeCccgCodigo(item.codigo);
    const nome = String(item.nome || '').trim().slice(0, 200);
    const ch = typeof item.ch === 'number' ? item.ch : parseInt(String(item.ch || ''), 10);
    if (!codigo || nome.length < 2 || !Number.isFinite(ch) || ch < 1 || ch > 300) return null;
    const ementa = String(item.ementa || '').trim().slice(0, 2000);
    return {
      codigo,
      nome,
      ch,
      cat: CUSTOM_CCCG_CAT,
      custom: true,
      prereqs: [],
      ementa:
        ementa ||
        'Componente cadastrado pelo aluno: fora do catálogo do PPC. Confirme o aproveitamento com a coordenação.',
      ch_teo: 0,
      ch_prat: 0,
      ch_ead_t: 0,
      ch_ead_p: 0,
      ch_ext: 0,
    };
  }

  function sanitizeCustomCccgList(raw) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    const seen = new Set();
    for (const item of raw) {
      const rec = normalizeCustomCccgRecord(item);
      if (!rec || seen.has(rec.codigo)) continue;
      seen.add(rec.codigo);
      out.push(rec);
    }
    return out;
  }

  /**
   * @param {{ nome?: string, codigo?: string, ch?: string|number, ementa?: string }} input
   * @param {{ takenCodigos?: Set<string>|string[] }} [opts]
   */
  function parseCustomCccgForm(input, opts) {
    const nome = String(input?.nome || '').trim();
    if (nome.length < 2) {
      return { ok: false, error: 'Informe o nome do componente (mínimo 2 caracteres).' };
    }
    const ch = parseInt(String(input?.ch ?? '').replace(/[^\d]/g, ''), 10);
    if (!Number.isFinite(ch) || ch < 1 || ch > 300) {
      return { ok: false, error: 'Informe a carga horária em horas (1 a 300).' };
    }
    const taken = opts?.takenCodigos instanceof Set
      ? opts.takenCodigos
      : new Set(opts?.takenCodigos || []);
    let codigo = normalizeCccgCodigo(input?.codigo);
    if (!codigo) codigo = generateCustomCccgCodigo(taken);
    if (taken.has(codigo)) {
      return { ok: false, error: 'Este código já está no catálogo do PPC ou nos seus cadastros.' };
    }
    const record = normalizeCustomCccgRecord({
      nome,
      codigo,
      ch,
      ementa: input?.ementa,
    });
    if (!record) return { ok: false, error: 'Não foi possível validar o componente.' };
    return { ok: true, item: record };
  }

  function fillCccgByCodigo(map, ppcCatalog, customCatalog) {
    map.clear();
    for (const item of ppcCatalog || []) {
      if (item && item.codigo) map.set(String(item.codigo), item);
    }
    for (const rec of sanitizeCustomCccgList(customCatalog)) {
      if (map.has(rec.codigo)) continue;
      map.set(rec.codigo, rec);
    }
    return map;
  }

  function removeCodigoFromCccgPicks(cccgPicks, codigo) {
    const code = String(codigo);
    for (const slotId of Object.keys(cccgPicks || {})) {
      const list = cccgPicks[slotId];
      if (!Array.isArray(list)) continue;
      cccgPicks[slotId] = list.filter((c) => String(c) !== code);
    }
  }

  function cccgPickBlockReason(item, slotId, slotDisc, ctx) {
    const { cccgPicks, cccgByCodigo, cfg, cccgSlotsBySem, prereqLabel } = ctx;
    const picks = getSlotPicks(slotId, cccgPicks);
    if (picks.includes(item.codigo)) return null;

    const sem = slotDisc.sem;
    const semLimit = cccgSemesterLimit(sem, cfg, cccgSlotsBySem);
    const itemCh = cccgItemCh(item);
    const remaining = cccgSemesterRemaining(sem, cfg, cccgPicks, cccgByCodigo, cccgSlotsBySem);

    if (itemCh > semLimit) {
      return `Componente de ${itemCh}h: o ${sem}º semestre permite ${semLimit}h de CCCG`;
    }
    if (itemCh > remaining) {
      return remaining
        ? `Soma passaria de ${semLimit}h no ${sem}º semestre (restam ${remaining}h)`
        : `Carga de CCCG do ${sem}º semestre já completa (${semLimit}h)`;
    }

    const unmet = cccgUnmetPrereqs(item, ctx);
    if (unmet.length) {
      const labels = unmet.map(prereqLabel);
      const suffix =
        labels.length === 1 ? labels[0] : labels.slice(0, 2).join(', ') + (labels.length > 2 ? '…' : '');
      return `Pré-requisito pendente: ${suffix}`;
    }

    if (prereqs().isCodigoPickedAnywhere(item.codigo, ctx.cccgPicks, slotId)) {
      return 'Já escolhido em outro slot';
    }

    return null;
  }

  root.GRADE_CCCG = {
    CUSTOM_CCCG_CAT,
    isCccgSlot,
    isCustomCccg,
    normalizeCccgCodigo,
    generateCustomCccgCodigo,
    normalizeCustomCccgRecord,
    sanitizeCustomCccgList,
    parseCustomCccgForm,
    fillCccgByCodigo,
    removeCodigoFromCccgPicks,
    buildCccgSlotsBySem,
    cccgItemCh,
    getSlotPicks,
    slotPicksChTotal,
    cccgSlotIdsInSem,
    cccgSemesterLimit,
    cccgSemesterPicksChTotal,
    cccgSemesterRemaining,
    cccgUnmetPrereqs,
    cccgPickBlockReason,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
