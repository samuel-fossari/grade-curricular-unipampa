import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = readFileSync(join(root, 'js/sync/cloud-sync.js'), 'utf8');

/** Espera o microtask/macrotask queue esvaziar. */
const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms));

/**
 * Carrega cloud-sync.js num sandbox com Supabase/Auth/Storage/Profile dublados.
 * `counters` registra quantas vezes o corpo real do sync (ensureClient → init) rodou.
 */
function loadCloudSync({ user = { id: 'u1' }, remote = null, failTimes = 0 } = {}) {
  const counters = { init: 0, getUser: 0, query: 0 };
  let failsLeft = failTimes;

  const sb = {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            counters.query += 1;
            if (failsLeft > 0) {
              failsLeft -= 1;
              return { data: null, error: new Error('falha de rede') };
            }
            return { data: remote, error: null };
          },
        }),
      }),
      upsert: () => ({
        select: () => ({ single: async () => ({ updated_at: 'now' }) }),
      }),
    }),
  };

  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.localStorage = {
    _d: {},
    getItem(k) {
      return k in this._d ? this._d[k] : null;
    },
    setItem(k, v) {
      this._d[k] = String(v);
    },
    removeItem(k) {
      delete this._d[k];
    },
  };
  sandbox.GRADE_SUPABASE = {
    async init() {
      counters.init += 1;
      await tick();
      return sb;
    },
  };
  sandbox.GRADE_AUTH = {
    async getUser() {
      counters.getUser += 1;
      await tick();
      return user;
    },
  };
  sandbox.GRADE_STORAGE = {
    SIGLAS: [],
    exportAll: () => ({ courses: {} }),
    importAll: () => {},
    importPreferences: () => {},
    clearAllCourseData: () => {},
  };
  sandbox.GRADE_PROFILE = {
    getDataOwner: () => null,
    isLocalProgressAnonymous: () => true,
    needsOnboarding: () => false,
    setDataOwner: () => {},
    setLoggedIn: () => {},
    setGuest: () => {},
  };

  const context = createContext(sandbox);
  runInContext(SRC, context);
  return { api: sandbox.GRADE_CLOUD_SYNC, counters };
}

describe('cloud-sync: syncAfterLogin idempotente', () => {
  it('coalesce chamadas concorrentes: roda o corpo só uma vez', async () => {
    const { api, counters } = loadCloudSync();
    const [a, b, c] = await Promise.all([
      api.syncAfterLogin(),
      api.syncAfterLogin(),
      api.syncAfterLogin(),
    ]);
    assert.equal(counters.init, 1, 'ensureClient/init deve rodar uma única vez');
    assert.deepEqual(a, b);
    assert.deepEqual(b, c);
  });

  it('repetição do mesmo usuário dentro da janela reaproveita o resultado', async () => {
    const { api, counters } = loadCloudSync();
    await api.syncAfterLogin();
    await api.syncAfterLogin();
    assert.equal(counters.init, 1, 'segunda chamada não deve re-executar o sync');
  });

  it('retorna um resultado válido e libera o in-flight ao terminar', async () => {
    const { api, counters } = loadCloudSync();
    const r1 = await api.syncAfterLogin();
    assert.ok(r1 && typeof r1.action === 'string');
    assert.equal(counters.init, 1);
  });

  it('não cacheia erro: após falha, a próxima chamada volta a executar', async () => {
    const { api, counters } = loadCloudSync({ failTimes: 1 });
    await assert.rejects(() => api.syncAfterLogin(), /falha de rede/);
    // erro não foi cacheado: nova chamada executa o corpo de novo (e agora dá certo)
    const r2 = await api.syncAfterLogin();
    assert.ok(r2 && typeof r2.action === 'string');
    assert.equal(counters.init, 2, 'deve re-executar após erro, não reaproveitar cache');
  });
});
