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

  function cccgPickBlockReason(item, slotId, slotDisc, ctx) {
    const { cccgPicks, cccgByCodigo, cfg, cccgSlotsBySem, prereqLabel } = ctx;
    const picks = getSlotPicks(slotId, cccgPicks);
    if (picks.includes(item.codigo)) return null;

    const sem = slotDisc.sem;
    const semLimit = cccgSemesterLimit(sem, cfg, cccgSlotsBySem);
    const itemCh = cccgItemCh(item);
    const remaining = cccgSemesterRemaining(sem, cfg, cccgPicks, cccgByCodigo, cccgSlotsBySem);

    if (itemCh > semLimit) {
      return `Componente de ${itemCh}h — o ${sem}º semestre permite ${semLimit}h de CCCG`;
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
    isCccgSlot,
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
