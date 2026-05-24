/**
 * Carga horária e integralização por buckets do PPC.
 */
(function (root) {
  'use strict';

  function parseChHours(ch) {
    if (typeof ch === 'number') return ch;
    const m = String(ch || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
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

  function isCccgSlot(disc, cccgsEnabled) {
    return cccgsEnabled && /^cccg/i.test(String(disc.id || ''));
  }

  /**
   * @param {object} input
   * @param {object} input.plan - cfg.chIntegralization
   * @param {object[]} input.disciplines
   * @param {Record<string, string>} input.progress
   * @param {Record<string, number>} input.manualCh
   * @param {Record<string, string[]>} input.cccgPicks
   * @param {Map<string, object>} input.cccgByCodigo
   * @param {boolean} input.cccgsEnabled
   */
  function computeChIntegralization(input) {
    const {
      plan,
      disciplines,
      progress,
      manualCh,
      cccgPicks,
      cccgByCodigo,
      cccgsEnabled,
    } = input;

    if (!plan || !Array.isArray(plan.buckets)) return null;

    let mandatoryDone = 0;
    let aceFromDisc = 0;
    let eadFromDisc = 0;
    for (const d of disciplines) {
      if (progress[d.id] !== 'done') continue;
      if (isCccgSlot(d, cccgsEnabled)) continue;
      mandatoryDone += discChTotal(d);
      aceFromDisc += d.ch_ext || 0;
      eadFromDisc += (d.ch_ead_t || 0) + (d.ch_ead_p || 0);
    }

    let cccgDone = 0;
    let aceFromCccg = 0;
    if (cccgsEnabled && cccgPicks && cccgByCodigo) {
      for (const slotId of Object.keys(cccgPicks)) {
        const picks = cccgPicks[slotId];
        if (!Array.isArray(picks)) continue;
        for (const codigo of picks) {
          const item = cccgByCodigo.get(codigo);
          if (!item) continue;
          cccgDone += parseChHours(item.ch);
          aceFromCccg += item.ch_ext || 0;
        }
      }
    }

    const bySource = {
      mandatory: mandatoryDone,
      ccog: mandatoryDone,
      cco: mandatoryDone,
      cccg: cccgDone,
      ccc: cccgDone,
      ace: aceFromDisc + aceFromCccg,
      acev: aceFromDisc,
      aceMandatory: aceFromDisc,
      ead: eadFromDisc,
      acg: 0,
      acee: 0,
    };

    function bucketRawDone(bucket) {
      if (bucket.manual) {
        const v = manualCh[bucket.id];
        return typeof v === 'number' && !Number.isNaN(v) ? v : 0;
      }
      const key = bucket.source || bucket.id;
      return bySource[key] ?? 0;
    }

    const buckets = plan.buckets.map((b) => {
      const rawDone = bucketRawDone(b);
      return {
        ...b,
        rawDone,
        done: Math.min(rawDone, b.required),
      };
    });

    const totalDone = buckets.reduce((sum, b) => {
      if (b.countsTowardTotal === false) return sum;
      return sum + b.done;
    }, 0);

    return {
      total: plan.total || buckets.reduce((sum, b) => sum + b.required, 0),
      buckets,
      totalDone,
    };
  }

  function mandatoryIntegralizedCh(chData) {
    if (!chData) return 0;
    const ccg = chData.buckets.find(
      (b) => b.id === 'ccg' || b.id === 'ccog' || b.id === 'cco' || b.source === 'mandatory'
    );
    return ccg?.rawDone ?? 0;
  }

  root.GRADE_CH = {
    parseChHours,
    discChTotal,
    isCccgSlot,
    computeChIntegralization,
    mandatoryIntegralizedCh,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
