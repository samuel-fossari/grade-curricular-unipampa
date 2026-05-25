/**
 * Cliente Supabase (browser). Requer GRADE_SUPABASE_CONFIG e @supabase/supabase-js via esm.sh.
 */
(function (root) {
  'use strict';

  /** @type {import('@supabase/supabase-js').SupabaseClient | null} */
  let client = null;
  /** @type {Promise<import('@supabase/supabase-js').SupabaseClient | null> | null} */
  let initPromise = null;

  const SUPABASE_JS =
    'https://esm.sh/@supabase/supabase-js@2.49.8/dist/module/index.js';

  async function init() {
    if (client) return client;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      const cfg = root.GRADE_SUPABASE_CONFIG;
      if (!cfg?.url || !cfg?.anonKey) return null;

      const { createClient } = await import(/* webpackIgnore: true */ SUPABASE_JS);
      client = createClient(cfg.url, cfg.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return client;
    })();

    return initPromise;
  }

  function getClient() {
    return client;
  }

  function isConfigured() {
    return !!(root.GRADE_SUPABASE_CONFIG?.url && root.GRADE_SUPABASE_CONFIG?.anonKey);
  }

  root.GRADE_SUPABASE = {
    init,
    getClient,
    isConfigured,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
