/**
 * @file conta-guard.js
 * @description Redireciona visitantes da página Conta para index.html (login).
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile?.isAccountUser?.()) {
    window.location.replace('index.html?login=1');
    return;
  }

  (async function () {
    const auth = window.GRADE_AUTH;
    if (!auth || !window.GRADE_SUPABASE?.isConfigured()) return;
    await window.GRADE_SUPABASE.init();
    const user = await auth.getUser();
    if (!user) {
      profile.clearLoggedIn();
      window.location.replace('index.html?login=1');
    }
  })();
})();
