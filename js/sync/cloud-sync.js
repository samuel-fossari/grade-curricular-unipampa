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

  /** @param {object | null | undefined} payload */
  function remoteProfileComplete(payload) {
    const p = payload?.profile;
    return !!(
      p &&
      typeof p === 'object' &&
      p.onboardingDone &&
      p.curso
    );
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
    root.GRADE_PROFILE?.setDataOwner?.(user.id);
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
    root.GRADE_PROFILE?.setDataOwner?.(user.id);
    return data.updated_at;
  }

  /**
   * Sync inicial após login.
   * Progresso anônimo/visitante não sobrescreve a conta na nuvem; ao logar, a nuvem prevalece.
   */
  async function syncAfterLogin() {
    const sb = await ensureClient();
    const user = await root.GRADE_AUTH?.getUser();
    const storage = root.GRADE_STORAGE;
    const profile = root.GRADE_PROFILE;
    if (!sb || !user || !storage) return { action: 'skipped' };

    const local = localProgressCount();
    const owner = profile?.getDataOwner?.() ?? null;
    const anonymousLocal = profile?.isLocalProgressAnonymous?.(owner) ?? true;
    const finishOwner = () => profile?.setDataOwner?.(user.id);

    const { data, error } = await sb
      .from(TABLE)
      .select('payload, updated_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    const localNeedsProfile = profile?.needsOnboarding?.() ?? false;

    if (anonymousLocal) {
      if (!data) {
        if (local.total > 0) storage.clearAllCourseData?.();
        finishOwner();
        return local.total > 0 ? { action: 'cleared-anonymous' } : { action: 'skipped' };
      }

      if (localNeedsProfile && remoteProfileComplete(data.payload)) {
        storage.importPreferences?.(data.payload);
        profile?.setLoggedIn?.(true);
        profile?.setGuest?.(false);
        finishOwner();
        return { action: 'profile-restored', updatedAt: data.updated_at };
      }

      const remote = countProgress(data.payload);
      if (remote.total > 0) {
        await pullSnapshot({ merge: false });
        finishOwner();
        return { action: 'pulled', updatedAt: data.updated_at };
      }

      if (local.total > 0) storage.clearAllCourseData?.();
      storage.importPreferences?.(data.payload);
      finishOwner();
      return local.total > 0
        ? { action: 'cleared-anonymous-prefs', updatedAt: data.updated_at }
        : { action: 'prefs', updatedAt: data.updated_at };
    }

    if (!data) {
      if (local.total > 0) {
        await pushSnapshot();
        finishOwner();
        return { action: 'pushed' };
      }
      finishOwner();
      return { action: 'skipped' };
    }

    if (localNeedsProfile && remoteProfileComplete(data.payload)) {
      storage.importPreferences?.(data.payload);
      profile?.setLoggedIn?.(true);
      profile?.setGuest?.(false);
      finishOwner();
      return { action: 'profile-restored', updatedAt: data.updated_at };
    }

    const remote = countProgress(data.payload);

    if (local.total > 0 && remote.total === 0) {
      await pushSnapshot();
      finishOwner();
      return { action: 'pushed' };
    }

    if (local.total === 0 && remote.total > 0) {
      await pullSnapshot({ merge: false });
      finishOwner();
      return { action: 'pulled', updatedAt: data.updated_at };
    }

    if (local.total === 0 && data.payload) {
      storage.importPreferences?.(data.payload);
      finishOwner();
      return { action: 'prefs', updatedAt: data.updated_at };
    }

    finishOwner();
    return { action: 'skipped' };
  }

  root.GRADE_CLOUD_SYNC = {
    pushSnapshot,
    pullSnapshot,
    syncAfterLogin,
    readMeta,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
