/**
 * Normalização de disciplinas do PPC (categorias, ementas, pré-requisitos).
 */
(function (root) {
  'use strict';

  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';
  const ENG_SIGLAS = new Set(['ec', 'ee', 'em', 'ea', 'et']);
  /** Slots CCCG na grade → chave `cat` (rótulos/cores em grade/categories.js). */
  const CCCG_SLOT_CAT = {
    es: 'es_cccg',
    cc: 'cc_cccg',
    ee: 'ee_cccg',
    ea: 'ea_cccg',
    em: 'em_cccg',
    ec: 'ec_cccg',
    et: 'et_outras', /* CCCG e “outras” no catálogo ET */
  };
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
    'geo_desc',
    'intro_ee',
    'intro_em',
    'intro_ea',
    'intro_ct',
    'eletrot',
    'fmat',
    'logica',
    'metcient',
  ]);

  function isCccgDiscipline(d) {
    const idStr = String(d.id || '');
    if (/^cccg/i.test(idStr)) return true;
    const codigo = String(d.codigo || '').trim();
    const semCodigo = !codigo || codigo === 'n/d';
    return semCodigo && String(d.name || '').includes('CCCG');
  }

  function normalizeDisciplines(raw, courseSigla) {
    const eng = ENG_SIGLAS.has(courseSigla);
    return raw.map((d) => {
      const isCccg = isCccgDiscipline(d);
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

  root.GRADE_NORMALIZE = {
    normalizeDisciplines,
    isCccgDiscipline,
    CCCG_EMENTA,
    ENG_BASICO_IDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
