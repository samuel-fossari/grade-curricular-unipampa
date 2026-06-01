import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadGradeModules } from './load-grade.mjs';

const {
  GRADE_NORMALIZE,
  GRADE_CH,
  GRADE_PREREQS,
  GRADE_CCCG,
} = loadGradeModules();

const { normalizeDisciplines } = GRADE_NORMALIZE;
const { parseChHours, discChTotal, computeChIntegralization, mandatoryIntegralizedCh } =
  GRADE_CH;
const {
  isPrereqSatisfied,
  isDiscLocked,
  displayDiscState,
  isCodigoPickedAnywhere,
} = GRADE_PREREQS;
const {
  buildCccgSlotsBySem,
  cccgPickBlockReason,
  cccgSemesterLimit,
} = GRADE_CCCG;

function baseCtx(overrides = {}) {
  const disciplines = overrides.disciplines || [];
  const progress = overrides.progress || {};
  const cccgPicks = overrides.cccgPicks || {};
  const cccgByCodigo = overrides.cccgByCodigo || new Map();
  const cfg = overrides.cfg || { cccgSemLimits: {} };
  const cccgsEnabled = overrides.cccgsEnabled ?? true;
  const cccgSlotsBySem =
    overrides.cccgSlotsBySem || buildCccgSlotsBySem(disciplines, cccgsEnabled);

  const chInput = {
    plan: overrides.plan,
    disciplines,
    progress,
    manualCh: overrides.manualCh || {},
    cccgPicks,
    cccgByCodigo,
    cccgsEnabled,
  };

  return {
    disciplines,
    progress,
    cccgPicks,
    cccgByCodigo,
    cfg,
    cccgSlotsBySem,
    cccgsEnabled,
    isCccgSlot: (d) => GRADE_CCCG.isCccgSlot(d, cccgsEnabled),
    mandatoryIntegralizedCh: () =>
      mandatoryIntegralizedCh(computeChIntegralization(chInput)),
    prereqLabel: (pid) =>
      String(pid).startsWith('__minch:')
        ? `${String(pid).slice(8)}h integralizadas (CCOG)`
        : pid,
    ...overrides.ctxExtra,
  };
}

describe('normalizeDisciplines', () => {
  it('preenche ementa e categoria de slot CCCG em ES', () => {
    const raw = [{ id: 'cccg1', codigo: '—', name: 'CCCG 1', sem: 3 }];
    const out = normalizeDisciplines(raw, 'es');
    assert.match(out[0].ementa, /Complementar de Graduação/);
    assert.equal(out[0].cat, 'es_cccg');
    assert.equal(out[0].prereqs.length, 0);
  });

  it('classifica ciclo básico vs específico em engenharia', () => {
    const raw = [
      { id: 'calc1', name: 'Cálculo I', sem: 1 },
      { id: 'projeto_x', name: 'Projeto X', sem: 8 },
    ];
    const out = normalizeDisciplines(raw, 'ee');
    assert.equal(out[0].cat, 'basico');
    assert.equal(out[1].cat, 'especifico');
  });
});

describe('carga horária', () => {
  it('parseChHours aceita número e string', () => {
    assert.equal(parseChHours(60), 60);
    assert.equal(parseChHours('90h'), 90);
    assert.equal(parseChHours(''), 0);
  });

  it('discChTotal soma campos detalhados ou fallback em ch', () => {
    assert.equal(
      discChTotal({ ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 }),
      60
    );
    assert.equal(discChTotal({ ch: '45h' }), 45);
  });

  it('computeChIntegralization conta obrigatórias concluídas e CCCG', () => {
    const disciplines = [
      { id: 'alg1', ch: '60h', sem: 1 },
      { id: 'cccg1', ch: '30h', sem: 3 },
    ];
    const cccgByCodigo = new Map([
      ['AL123', { codigo: 'AL123', ch: 30, ch_ext: 0 }],
    ]);
    const plan = {
      total: 3600,
      buckets: [
        { id: 'ccg', source: 'mandatory', required: 3000 },
        { id: 'ccc', source: 'cccg', required: 600 },
      ],
    };
    const chData = computeChIntegralization({
      plan,
      disciplines,
      progress: { alg1: 'done' },
      manualCh: {},
      cccgPicks: { cccg1: ['AL123'] },
      cccgByCodigo,
      cccgsEnabled: true,
    });
    assert.equal(mandatoryIntegralizedCh(chData), 60);
    const ccc = chData.buckets.find((b) => b.id === 'ccc');
    assert.equal(ccc.rawDone, 30);
    assert.equal(chData.totalDone, 90);
  });
});

describe('pré-requisitos', () => {
  const disciplines = [
    { id: 'alg1', codigo: 'ALG1', name: 'Álgebra', prereqs: [], sem: 1 },
    { id: 'calc1', codigo: 'CALC1', name: 'Cálculo', prereqs: ['alg1'], sem: 2 },
  ];

  it('isPrereqSatisfied por id, código ou CCCG escolhido', () => {
    const ctxA = baseCtx({
      disciplines,
      progress: { alg1: 'done' },
    });
    assert.equal(isPrereqSatisfied('alg1', ctxA), true);
    assert.equal(isPrereqSatisfied('ALG1', ctxA), true);

    const ctxB = baseCtx({
      disciplines,
      progress: {},
      cccgPicks: { cccg1: ['AL999'] },
    });
    assert.equal(isPrereqSatisfied('AL999', ctxB), true);
  });

  it('isDiscLocked bloqueia com pré-requisito pendente ou CH mínima', () => {
    const withMinCh = [
      ...disciplines,
      { id: 'tcc', name: 'TCC', prereqs: [], specialMinCH: 2000, sem: 10 },
    ];
    const ctx = baseCtx({
      disciplines: withMinCh,
      progress: { alg1: 'done' },
      plan: {
        total: 3600,
        buckets: [{ id: 'ccg', source: 'mandatory', required: 3000 }],
      },
    });
    assert.equal(isDiscLocked(withMinCh[1], ctx), false);
    assert.equal(isDiscLocked(withMinCh[2], ctx), true);

    ctx.progress.calc1 = 'done';
    assert.equal(displayDiscState(withMinCh[1], ctx), 'done');
  });
});

describe('regras CCCG', () => {
  const disciplines = [
    { id: 'cccg1', name: 'CCCG 1', ch: '30h', sem: 5 },
    { id: 'cccg2', name: 'CCCG 2', ch: '30h', sem: 5 },
  ];
  const cccgByCodigo = new Map([
    ['A30', { codigo: 'A30', nome: 'Componente 30h', ch: 30, prereqs: [] }],
    ['B60', { codigo: 'B60', nome: 'Componente 60h', ch: 60, prereqs: [] }],
    ['C30', { codigo: 'C30', nome: 'Outro 30h', ch: 30, prereqs: ['X99'] }],
  ]);

  it('cccgSemesterLimit usa cccgSemLimits ou soma dos slots', () => {
    const slots = buildCccgSlotsBySem(disciplines, true);
    assert.equal(cccgSemesterLimit(5, { cccgSemLimits: { 5: 45 } }, slots), 45);
    assert.equal(cccgSemesterLimit(5, {}, slots), 60);
  });

  it('cccgPickBlockReason respeita cota, duplicidade e pré-requisito', () => {
    const ctx = baseCtx({
      disciplines,
      cccgByCodigo,
      cccgPicks: { cccg1: ['A30'] },
      cfg: {},
    });
    const slot = disciplines[0];

    assert.equal(
      cccgPickBlockReason(cccgByCodigo.get('A30'), 'cccg1', slot, ctx),
      null
    );

    assert.match(
      cccgPickBlockReason(cccgByCodigo.get('B60'), 'cccg2', slot, ctx),
      /60h/
    );

    assert.equal(
      cccgPickBlockReason(cccgByCodigo.get('A30'), 'cccg2', slot, ctx),
      'Já escolhido em outro slot'
    );

    assert.match(
      cccgPickBlockReason(cccgByCodigo.get('C30'), 'cccg2', slot, ctx),
      /Pré-requisito pendente/
    );
  });

  it('isCodigoPickedAnywhere ignora slot de exceção', () => {
    const picks = { s1: ['AL1'], s2: ['AL2'] };
    assert.equal(isCodigoPickedAnywhere('AL1', picks), true);
    assert.equal(isCodigoPickedAnywhere('AL1', picks, 's1'), false);
  });
});
