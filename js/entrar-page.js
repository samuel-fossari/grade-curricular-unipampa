/**
 * @file entrar-page.js
 * @description Tela de entrada: visitante ou fluxo de conta (sem sidebar).
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile) return;

  const gatePanel = document.getElementById('gatePanel');
  const authPanel = document.getElementById('authMainPanel');
  const onboardingPanel = document.getElementById('onboardingPanel');

  function showView(view) {
    if (gatePanel) gatePanel.hidden = view !== 'gate';
    if (authPanel) authPanel.hidden = view !== 'auth';
    if (onboardingPanel) onboardingPanel.hidden = view !== 'onboarding';
  }

  async function bootstrap() {
    const params = new URLSearchParams(window.location.search);
    const wantsLogin = params.get('login') === '1';
    const wantsEdit = params.get('edit') === '1';

    if (profile.isGuest()) {
      showView('gate');
      return;
    }

    const auth = window.GRADE_AUTH;
    if (auth && window.GRADE_SUPABASE?.isConfigured()) {
      await window.GRADE_SUPABASE.init();
      const user = await auth.getUser();
      if (user) {
        const p = profile.readProfile();
        if (wantsEdit || profile.needsOnboarding()) {
          showView('onboarding');
          window.GRADE_ONBOARDING?.refreshOnboarding?.();
          return;
        }
        const href = profile.primaryCourseHref(false);
        window.location.replace(href || 'index.html');
        return;
      }
    }

    if (wantsLogin) {
      profile.setGuest(false);
      showView('auth');
      return;
    }

    showView('gate');
  }

  document.getElementById('entrarSemContaBtn')?.addEventListener('click', () => {
    profile.setGuest(true);
    window.location.href = 'index.html';
  });

  document.getElementById('entrarComContaBtn')?.addEventListener('click', () => {
    profile.setGuest(false);
    showView('auth');
  });

  document.getElementById('authBackBtn')?.addEventListener('click', () => {
    showView('gate');
  });

  window.GRADE_ENTRAR_PAGE = { showView, showGate: () => showView('gate') };

  bootstrap();
})();
