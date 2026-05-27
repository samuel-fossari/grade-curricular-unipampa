/**
 * Sessão Supabase Auth — login, logout e estado.
 */
(function (root) {
  'use strict';

  async function ensureClient() {
    if (!root.GRADE_SUPABASE?.isConfigured()) return null;
    return root.GRADE_SUPABASE.init();
  }

  async function getSession() {
    const sb = await ensureClient();
    if (!sb) return null;
    const { data, error } = await sb.auth.getSession();
    if (error) throw error;
    return data.session;
  }

  async function getUser() {
    const session = await getSession();
    return session?.user ?? null;
  }

  function authRedirectUrl() {
    const base =
      root.GRADE_SUPABASE_CONFIG?.siteUrl?.replace(/\/$/, '') ||
      root.location?.origin ||
      '';
    return `${base}/entrar.html`;
  }

  async function signInWithGoogle() {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authRedirectUrl() },
    });
    if (error) throw error;
  }

  async function signInWithPassword(email, password) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUpWithPassword(email, password) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirectUrl() },
    });
    if (error) throw error;
  }

  async function signOut() {
    const sb = await ensureClient();
    if (!sb) return;
    const { error } = await sb.auth.signOut();
    if (error) throw error;
  }

  /**
   * @param {(event: string, session: object | null) => void} handler
   * @returns {Promise<() => void>}
   */
  async function onAuthStateChange(handler) {
    const sb = await ensureClient();
    if (!sb) return () => {};
    const { data } = sb.auth.onAuthStateChange((event, session) => {
      handler(event, session);
    });
    return () => data.subscription.unsubscribe();
  }

  root.GRADE_AUTH = {
    getSession,
    getUser,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    onAuthStateChange,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
