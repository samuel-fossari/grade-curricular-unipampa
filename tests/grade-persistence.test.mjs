import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function createMemoryStorage(seed = {}) {
  const data = { ...seed };
  return {
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = String(value);
    },
    removeItem: (key) => {
      delete data[key];
    },
  };
}

function loadPersistence(storage) {
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.localStorage = storage;
  const context = createContext(sandbox);
  runInContext(readFileSync(join(root, 'js/grade/persistence.js'), 'utf8'), context);
  return context.globalThis.GRADE_PERSISTENCE;
}

describe('GRADE_PERSISTENCE.loadProgress', () => {
  it('preenche o mesmo objeto referenciado pelo renderizador', () => {
    const storage = createMemoryStorage({
      grade_unipampa_es_progress_v1: JSON.stringify({
        alg: 'done',
        logica: 'in_progress',
      }),
    });
    const { createGradePersistence } = loadPersistence(storage);
    const disciplines = [
      { id: 'alg', name: 'Algoritmos' },
      { id: 'logica', name: 'Lógica' },
    ];
    const store = { progress: {}, manualCh: {}, cccgPicks: {} };
    const progressRef = store.progress;

    const persistence = createGradePersistence({
      sigla: 'es',
      disciplines,
      cccgsEnabled: false,
      progressKey: 'grade_unipampa_es_progress_v1',
      manualChKey: 'grade_unipampa_es_manual_ch_v1',
      cccgPicksKey: 'grade_unipampa_es_cccg_picks_v1',
      legacyEsKey: 'grade_es_unipampa_v1',
      store,
    });

    persistence.loadProgress();

    assert.equal(store.progress, progressRef);
    assert.equal(progressRef.alg, 'done');
    assert.equal(progressRef.logica, 'in_progress');
    assert.equal('calc' in progressRef, false);

    const nDone = disciplines.filter((d) => progressRef[d.id] === 'done').length;
    assert.equal(nDone, 1);
  });

  it('normaliza valores legados booleanos para done', () => {
    const storage = createMemoryStorage({
      grade_unipampa_cc_progress_v1: JSON.stringify({ alg: true }),
    });
    const { createGradePersistence } = loadPersistence(storage);
    const disciplines = [{ id: 'alg', name: 'Algoritmos' }];
    const store = { progress: {}, manualCh: {}, cccgPicks: {} };

    const persistence = createGradePersistence({
      sigla: 'cc',
      disciplines,
      cccgsEnabled: false,
      progressKey: 'grade_unipampa_cc_progress_v1',
      manualChKey: 'grade_unipampa_cc_manual_ch_v1',
      cccgPicksKey: 'grade_unipampa_cc_cccg_picks_v1',
      legacyEsKey: 'grade_es_unipampa_v1',
      store,
    });

    persistence.loadProgress();
    assert.equal(store.progress.alg, 'done');
  });
});
