import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const STORAGE_SRC = readFileSync(join(root, 'js/grade-storage.js'), 'utf8');

function createMemoryStorage(seed = {}) {
  const data = { ...seed };
  return {
    _data: data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

/** Traz valor do realm do VM para o realm do teste (normaliza prototypes). */
function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

/** Carrega grade-storage.js num sandbox, com GRADE_PROFILE/SITEPREFS dublados. */
function loadStorage(seed = {}) {
  const storage = createMemoryStorage(seed);
  const ownerCalls = [];
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.localStorage = storage;
  sandbox.GRADE_PROFILE = {
    setDataOwner: (owner) => ownerCalls.push(owner),
  };
  sandbox.GRADE_SITEPREFS = { reapplyFromStorage: () => {} };
  const context = createContext(sandbox);
  runInContext(STORAGE_SRC, context);
  return { api: sandbox.GRADE_STORAGE, storage, ownerCalls };
}

describe('GRADE_STORAGE.exportAll / importAll (round-trip)', () => {
  it('exporta progresso por curso e reimporta de forma idêntica', () => {
    const seed = {
      grade_unipampa_es_progress_v1: JSON.stringify({ alg: 'done' }),
      grade_unipampa_es_horarios_avulsas_v1: JSON.stringify([
        { id: 'a1', nome: 'Lab' },
      ]),
      grade_unipampa_es_cccg_custom_v1: JSON.stringify([
        { codigo: 'AV-1', nome: 'EaD avulsa', ch: 60, custom: true },
      ]),
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
    };
    const { api } = loadStorage(seed);
    const payload = api.exportAll();

    assert.equal(payload.app, 'grade-curricular-unipampa');
    assert.deepEqual(plain(payload.courses.es.progress), { alg: 'done' });
    assert.deepEqual(plain(payload.courses.es.avulsas), [{ id: 'a1', nome: 'Lab' }]);
    assert.equal(plain(payload.courses.es.cccgCustom)[0].codigo, 'AV-1');

    const { api: api2, storage: s2 } = loadStorage({
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
    });
    api2.importAll(payload);
    assert.deepEqual(
      JSON.parse(s2.getItem('grade_unipampa_es_progress_v1')),
      { alg: 'done' }
    );
    assert.deepEqual(
      JSON.parse(s2.getItem('grade_unipampa_es_horarios_avulsas_v1')),
      [{ id: 'a1', nome: 'Lab' }]
    );
    assert.equal(
      JSON.parse(s2.getItem('grade_unipampa_es_cccg_custom_v1'))[0].codigo,
      'AV-1'
    );
  });

  it('rejeita arquivo de outro app', () => {
    const { api } = loadStorage();
    assert.throws(() => api.importAll({ app: 'outro', courses: {} }), /backup deste projeto/);
  });

  it('importAll com merge preserva progresso existente e mescla', () => {
    const { api, storage } = loadStorage({
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
      grade_unipampa_cc_progress_v1: JSON.stringify({ a: 'done' }),
    });
    api.importAll(
      { app: 'grade-curricular-unipampa', courses: { cc: { progress: { b: 'in_progress' } } } },
      { merge: true }
    );
    assert.deepEqual(JSON.parse(storage.getItem('grade_unipampa_cc_progress_v1')), {
      a: 'done',
      b: 'in_progress',
    });
  });
});

describe('GRADE_STORAGE — avulsas por curso (isolamento)', () => {
  it('avulsas de um curso não vazam para outro', () => {
    const seed = {
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
      grade_unipampa_es_horarios_avulsas_v1: JSON.stringify([{ id: 'x', nome: 'ES only' }]),
    };
    const { api } = loadStorage(seed);
    const payload = api.exportAll();
    assert.deepEqual(plain(payload.courses.es.avulsas), [{ id: 'x', nome: 'ES only' }]);
    assert.deepEqual(plain(payload.courses.ea.avulsas), []);
  });

  it('backup legado (horariosAvulsas global) cai no curso es', () => {
    const { api, storage } = loadStorage({
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
    });
    api.importAll({
      app: 'grade-curricular-unipampa',
      courses: {},
      horariosAvulsas: [{ id: 'leg', nome: 'Legada' }],
    });
    assert.deepEqual(
      JSON.parse(storage.getItem('grade_unipampa_es_horarios_avulsas_v1')),
      [{ id: 'leg', nome: 'Legada' }]
    );
  });
});

describe('GRADE_STORAGE.migrateLegacyHorariosAvulsas', () => {
  it('move lista global legada para es e marca migração', () => {
    const { api, storage } = loadStorage({
      grade_unipampa_horarios_avulsas_v1: JSON.stringify([{ id: 'g', nome: 'Global' }]),
    });
    api.migrateLegacyHorariosAvulsas();
    assert.deepEqual(
      JSON.parse(storage.getItem('grade_unipampa_es_horarios_avulsas_v1')),
      [{ id: 'g', nome: 'Global' }]
    );
    assert.equal(storage.getItem('grade_unipampa_horarios_avulsas_v1'), null);
    assert.equal(storage.getItem('grade_unipampa_horarios_avulsas_migrated_v1'), '1');
  });

  it('é idempotente (não roda duas vezes)', () => {
    const { api, storage } = loadStorage({
      grade_unipampa_horarios_avulsas_v1: JSON.stringify([{ id: 'g', nome: 'Global' }]),
    });
    api.migrateLegacyHorariosAvulsas();
    storage.setItem('grade_unipampa_es_horarios_avulsas_v1', JSON.stringify([]));
    api.migrateLegacyHorariosAvulsas();
    assert.deepEqual(
      JSON.parse(storage.getItem('grade_unipampa_es_horarios_avulsas_v1')),
      []
    );
  });
});

describe('GRADE_STORAGE.clearAllCourseData', () => {
  it('apaga dados de curso mas preserva tema/fonte', () => {
    const { api, storage } = loadStorage({
      grade_unipampa_es_progress_v1: JSON.stringify({ alg: 'done' }),
      grade_unipampa_es_horarios_avulsas_v1: JSON.stringify([{ id: 'a' }]),
      grade_unipampa_es_cccg_custom_v1: JSON.stringify([{ codigo: 'AV-1' }]),
      grade_unipampa_theme_v1: 'kitty',
      grade_unipampa_font_v1: '18',
    });
    api.clearAllCourseData();
    assert.equal(storage.getItem('grade_unipampa_es_progress_v1'), null);
    assert.equal(storage.getItem('grade_unipampa_es_horarios_avulsas_v1'), null);
    assert.equal(storage.getItem('grade_unipampa_es_cccg_custom_v1'), null);
    assert.equal(storage.getItem('grade_unipampa_theme_v1'), 'kitty');
    assert.equal(storage.getItem('grade_unipampa_font_v1'), '18');
  });
});

describe('GRADE_STORAGE.importAll — data owner', () => {
  it('marca data owner como guest quando backup é de visitante', () => {
    const { api, ownerCalls } = loadStorage({
      grade_unipampa_horarios_avulsas_migrated_v1: '1',
    });
    api.importAll({ app: 'grade-curricular-unipampa', courses: {}, guest: true });
    assert.ok(ownerCalls.includes('guest'));
  });
});
