/**
 * @file perfil-guard.js
 * @description Redireciona visitantes da página Perfil para entrar.html.
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile?.isAccountUser?.()) {
    window.location.replace('entrar.html?login=1');
    return;
  }

  (async function () {
    const auth = window.GRADE_AUTH;
    if (!auth || !window.GRADE_SUPABASE?.isConfigured()) return;
    await window.GRADE_SUPABASE.init();
    const user = await auth.getUser();
    if (!user) {
      profile.clearLoggedIn();
      window.location.replace('entrar.html?login=1');
    }
  })();
})();
