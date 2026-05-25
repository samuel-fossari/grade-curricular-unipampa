/**
 * Sync nuvem ↔ localStorage via tabela user_sync_snapshots.
 */
(function (root) {
  'use strict';

  const TABLE = 'user_sync_snapshots';
  const META_KEY = 'grade_unipampa_cloud_sync_v1';

  function readMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function writeMeta(userId, updatedAt) {
    localStorage.setItem(
      META_KEY,
      JSON.stringify({ userId, updatedAt: updatedAt || new Date().toISOString() })
    );
  }

  async function ensureClient() {
    return root.GRADE_SUPABASE?.init() ?? null;
  }

  /** @param {object | null | undefined} exportPayload */
  function countProgress(exportPayload) {
    const siglas = root.GRADE_STORAGE?.SIGLAS || [];
    let done = 0;
    let inProgress = 0;
    for (const sigla of siglas) {
      const progress = exportPayload?.courses?.[sigla]?.progress;
      if (!progress || typeof progress !== 'object') continue;
      for (const value of Object.values(progress)) {
        if (value === 'done') done += 1;
        else if (value === 'in_progress') inProgress += 1;
      }
    }
    return { done, inProgress, total: done + inProgress };
  }

  function localProgressCount() {
    return countProgress(root.GRADE_STORAGE?.exportAll?.());
  }

  /**
   * Envia exportAll() para a nuvem (upsert).
   * @returns {Promise<string>} ISO updated_at do servidor
   */
  async function pushSnapshot() {
    const sb = await ensureClient();
    const user = await root.GRADE_AUTH?.getUser();
    const storage = root.GRADE_STORAGE;
    if (!sb || !user || !storage?.exportAll) {
      throw new Error('É necessário estar logado e com GRADE_STORAGE disponível.');
    }

    const payload = storage.exportAll();
    const { data, error } = await sb
      .from(TABLE)
      .upsert(
        { user_id: user.id, payload, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      )
      .select('updated_at')
      .single();

    if (error) throw error;
    writeMeta(user.id, data.updated_at);
    return data.updated_at;
  }

  /**
   * Baixa snapshot e aplica no localStorage.
   * @param {{ merge?: boolean }} [opts]
   * @returns {Promise<string|null>} updated_at remoto ou null se vazio
   */
  async function pullSnapshot(opts) {
    const sb = await ensureClient();
    const user = await root.GRADE_AUTH?.getUser();
    const storage = root.GRADE_STORAGE;
    if (!sb || !user || !storage?.importAll) {
      throw new Error('É necessário estar logado e com GRADE_STORAGE disponível.');
    }

    const { data, error } = await sb
      .from(TABLE)
      .select('payload, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data?.payload) return null;

    storage.importAll(data.payload, { merge: !!opts?.merge });
    writeMeta(user.id, data.updated_at);
    return data.updated_at;
  }

  /**
   * Sync inicial após login — nunca substitui progresso local por nuvem vazia.
   */
  async function syncAfterLogin() {
    const sb = await ensureClient();
    const user = await root.GRADE_AUTH?.getUser();
    if (!sb || !user) return { action: 'skipped' };

    const local = localProgressCount();

    const { data, error } = await sb
      .from(TABLE)
      .select('payload, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      if (local.total > 0) {
        await pushSnapshot();
        return { action: 'pushed' };
      }
      return { action: 'skipped' };
    }

    const remote = countProgress(data.payload);

    if (local.total > 0 && remote.total === 0) {
      await pushSnapshot();
      return { action: 'pushed' };
    }

    if (local.total === 0 && remote.total > 0) {
      await pullSnapshot({ merge: false });
      return { action: 'pulled', updatedAt: data.updated_at };
    }

    if (local.total === 0 && data.payload) {
      root.GRADE_STORAGE?.importPreferences?.(data.payload);
      return { action: 'prefs', updatedAt: data.updated_at };
    }

    return { action: 'skipped' };
  }

  root.GRADE_CLOUD_SYNC = {
    pushSnapshot,
    pullSnapshot,
    syncAfterLogin,
    readMeta,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
