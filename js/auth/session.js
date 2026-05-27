/**
 * Sessão Supabase Auth — login, logout e estado.
 */
(function (root) {
  'use strict';

  async function ensureClient() {
    if (!root.GRADE_SUPABASE?.isConfigured()) return null;
    return root.GRADE_SUPABASE.init();
  }

  function isLocalDevOrigin(origin) {
    return /localhost|127\.0\.0\.1/i.test(origin || '');
  }

  function authRedirectUrl() {
    const configured = root.GRADE_SUPABASE_CONFIG?.siteUrl?.replace(/\/$/, '') || '';
    const origin = root.location?.origin?.replace(/\/$/, '') || '';
    // Local: origem atual (porta do npm start). Produção/preview: mesma origem do
    // navegador — evita 404 quando SUPABASE_SITE_URL no build aponta para deploy antigo.
    let base;
    if (origin && isLocalDevOrigin(origin)) {
      base = origin;
    } else if (origin) {
      base = origin;
    } else {
      base = configured || 'http://localhost:3000';
    }
    return `${base}/index.html`;
  }

  function hasAuthCallbackInUrl() {
    const search = root.location?.search || '';
    if (!search) {
      const hash = root.location?.hash || '';
      return /(?:^|[&#])(?:access_token|refresh_token)=/.test(hash);
    }
    const q = new URLSearchParams(search);
    return (
      q.has('code') ||
      q.has('error') ||
      q.has('error_description') ||
      q.has('type')
    );
  }

  function formatAuthErrorMessage(raw) {
    if (!raw) return null;
    let text = raw;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        text = parsed.msg || parsed.message || parsed.error_description || raw;
      }
    } catch {
      text = raw;
    }
    try {
      text = decodeURIComponent(String(text).replace(/\+/g, ' '));
    } catch {
      /* mantém text */
    }
    if (/provider is not enabled|unsupported provider/i.test(text)) {
      return (
        'Login com Google não está ativo neste projeto Supabase. ' +
        'No painel: Authentication → Providers → Google → Enable, ' +
        'preencha Client ID e Client Secret (Google Cloud Console) e salve.'
      );
    }
    return text;
  }

  function getAuthCallbackError() {
    const q = new URLSearchParams(root.location?.search || '');
    const raw = q.get('error_description') || q.get('error');
    if (!raw) return null;
    return formatAuthErrorMessage(raw);
  }

  function clearAuthCallbackFromUrl() {
    if (!root.history?.replaceState || !root.location) return;
    const q = new URLSearchParams(root.location.search);
    ['code', 'state', 'error', 'error_description'].forEach((k) => q.delete(k));
    const qs = q.toString();
    const next = qs
      ? `${root.location.pathname}?${qs}${root.location.hash || ''}`
      : `${root.location.pathname}${root.location.hash || ''}`;
    root.history.replaceState({}, root.document?.title || '', next);
  }

  function normalizeAuthError(error) {
    if (!error) return error;
    const msg = error.message || '';
    const code = error.code || '';
    if (
      code === 'email_not_confirmed' ||
      /email not confirmed/i.test(msg)
    ) {
      return new Error(
        'Confirme seu e-mail antes de entrar. Verifique a caixa de entrada e o spam.'
      );
    }
    const friendly = formatAuthErrorMessage(msg);
    if (friendly && friendly !== msg) return new Error(friendly);
    return error;
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

  async function signInWithGoogle() {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: authRedirectUrl() },
    });
    if (error) throw normalizeAuthError(error);
    if (!data?.url) {
      throw new Error(
        'Não foi possível abrir o login do Google. Confira o provedor Google no Supabase e as Redirect URLs (index.html).'
      );
    }
    root.location.assign(data.url);
  }

  async function signInWithPassword(email, password) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw normalizeAuthError(error);
  }

  /**
   * @returns {Promise<{ needsEmailConfirmation: boolean }>}
   */
  async function signUpWithPassword(email, password) {
    const sb = await ensureClient();
    if (!sb) throw new Error('Supabase não configurado.');
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: authRedirectUrl() },
    });
    if (error) throw error;
    const needsEmailConfirmation = !!(data?.user && !data.session);
    return { needsEmailConfirmation };
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
    authRedirectUrl,
    getSession,
    getUser,
    signInWithGoogle,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    onAuthStateChange,
    hasAuthCallbackInUrl,
    getAuthCallbackError,
    clearAuthCallbackFromUrl,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
