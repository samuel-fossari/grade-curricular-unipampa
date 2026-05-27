/**
 * @file index-page.js
 * @description Tela inicial: visitante (login) ou logado (início + sair).
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile) return;

  const loginCard = document.getElementById('indexLoginCard');
  const loggedInCard = document.getElementById('indexLoggedInCard');
  const entrySection = document.getElementById('indexEntrySection');
  const onboardingPanel = document.getElementById('onboardingPanel');

  function isIndexHub() {
    const path = (window.location.pathname || '').replace(/\/$/, '');
    return path === '' || path === '/index.html' || path.endsWith('/index.html');
  }

  function showView(view) {
    const isLoggedIn = view === 'loggedIn';
    const isOnboarding = view === 'onboarding';

    if (loggedInCard) loggedInCard.hidden = !isLoggedIn;
    if (loginCard) loginCard.hidden = isLoggedIn;

    if (entrySection) entrySection.hidden = view !== 'entry';
    if (onboardingPanel) onboardingPanel.hidden = !isOnboarding;
  }

  function refreshLoggedInUi(user) {
    const statusEl = document.getElementById('indexLoggedInStatus');
    const gradeLink = document.getElementById('indexLinkGrade');
    if (statusEl) {
      const mockLabel = window.GRADE_DEV_MOCK?.devMockStatusLabel?.();
      statusEl.textContent = mockLabel
        ? mockLabel
        : user?.email
          ? `Conectado como ${user.email}`
          : 'Conectado.';
    }
    if (gradeLink) {
      gradeLink.href =
        profile.primaryCourseHref(false) || 'cursos/engenharia-software.html';
    }
  }

  async function showLoggedInHome() {
    let user = null;
    const auth = window.GRADE_AUTH;
    if (auth && window.GRADE_SUPABASE?.isConfigured()) {
      try {
        await window.GRADE_SUPABASE.init();
        user = await auth.getUser();
      } catch {
        /* ignore */
      }
    }
    refreshLoggedInUi(user);
    window.GRADE_SITEPREFS?.updateThemeSelectVisibility?.();
    showView('loggedIn');
  }

  function defaultGuestCourseHref() {
    const href = profile.primaryCourseHref(false);
    return href || 'cursos/engenharia-software.html';
  }

  async function bootstrap() {
    if (!isIndexHub()) return;

    const params = new URLSearchParams(window.location.search);
    const wantsEdit = params.get('edit') === '1';
    const wantsLogin = params.get('login') === '1';
    const oauthReturn = window.GRADE_AUTH?.hasAuthCallbackInUrl?.() ?? false;

    if (oauthReturn || wantsLogin) profile.setGuest(false);

    if (window.GRADE_DEV_MOCK?.isDevMockActive?.()) {
      await showLoggedInHome();
      return;
    }

    try {
      const auth = window.GRADE_AUTH;
      if (auth && window.GRADE_SUPABASE?.isConfigured()) {
        await window.GRADE_SUPABASE.init();
        const user = await auth.getUser();
        if (user) {
          profile.setGuest(false);
          profile.setLoggedIn(true);
          if (oauthReturn || profile.needsOnboarding()) {
            try {
              await window.GRADE_CLOUD_SYNC?.syncAfterLogin?.();
            } catch (err) {
              console.error('sync após login:', err);
            }
          }
          if (wantsEdit || profile.needsOnboarding()) {
            showView('onboarding');
            window.GRADE_ONBOARDING?.refreshOnboarding?.();
            return;
          }
          await showLoggedInHome();
          return;
        }
      }
    } catch (err) {
      console.error('index bootstrap auth:', err);
    }

    showView('entry');
    window.GRADE_ONBOARDING?.refreshOnboarding?.();
  }

  document.getElementById('entrarSemContaBtn')?.addEventListener('click', () => {
    profile.setGuest(true);
    profile.clearLoggedIn?.();
    window.GRADE_SITEPREFS?.resetPremiumThemeOnLogout?.();
    window.location.href = defaultGuestCourseHref();
  });

  window.GRADE_INDEX_ENTRY = {
    isIndexHub,
    showView,
    showEntry: () => showView('entry'),
    showLoggedInHome,
  };

  bootstrap();
})();
