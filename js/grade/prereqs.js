/**
 * Pré-requisitos, bloqueio de cartões e transições de status.
 */
(function (root) {
  'use strict';

  function isCodigoPickedAnywhere(codigo, cccgPicks, exceptSlotId) {
    for (const [slotId, list] of Object.entries(cccgPicks || {})) {
      if (exceptSlotId && slotId === exceptSlotId) continue;
      if (Array.isArray(list) && list.includes(codigo)) return true;
    }
    return false;
  }

  function isPrereqSatisfied(pid, ctx) {
    const { disciplines, progress, cccgPicks } = ctx;
    const byId = disciplines.find((x) => x.id === pid);
    if (byId) return progress[pid] === 'done';
    const byCodigo = disciplines.find((x) => x.codigo === pid);
    if (byCodigo) return progress[byCodigo.id] === 'done';
    return isCodigoPickedAnywhere(pid, cccgPicks);
  }

  function prereqsAllDone(disc, ctx) {
    return (disc.prereqs || []).every((pid) => isPrereqSatisfied(pid, ctx));
  }

  function specialMinChMet(disc, mandatoryDone) {
    if (!disc.specialMinCH) return true;
    return mandatoryDone >= disc.specialMinCH;
  }

  function isDiscLocked(disc, ctx) {
    if (ctx.isCccgSlot(disc)) return false;
    const mandatoryDone = ctx.mandatoryIntegralizedCh();
    return !prereqsAllDone(disc, ctx) || !specialMinChMet(disc, mandatoryDone);
  }

  function displayDiscState(disc, ctx) {
    if (isDiscLocked(disc, ctx)) return 'locked';
    const s = ctx.progress[disc.id] || 'not_done';
    if (s === 'not_done') return 'ready';
    return s;
  }

  function unmetLockReasons(disc, ctx) {
    const reasons = [];
    for (const pid of disc.prereqs || []) {
      if (!isPrereqSatisfied(pid, ctx)) reasons.push(ctx.prereqLabel(pid));
    }
    const mandatoryDone = ctx.mandatoryIntegralizedCh();
    if (disc.specialMinCH && !specialMinChMet(disc, mandatoryDone)) {
      reasons.push(
        `${disc.specialMinCH}h integralizadas (CCOG) — ${mandatoryDone}/${disc.specialMinCH}h`
      );
    }
    return reasons;
  }

  function dependents(id, disciplines) {
    return disciplines.filter((d) => (d.prereqs || []).includes(id));
  }

  function canLeaveDoneOrProgress(id, disciplines, progress) {
    for (const d of dependents(id, disciplines)) {
      const s = progress[d.id] || 'not_done';
      if (s === 'done' || s === 'in_progress') return false;
    }
    return true;
  }

  root.GRADE_PREREQS = {
    isCodigoPickedAnywhere,
    isPrereqSatisfied,
    prereqsAllDone,
    specialMinChMet,
    isDiscLocked,
    displayDiscState,
    unmetLockReasons,
    dependents,
    canLeaveDoneOrProgress,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
