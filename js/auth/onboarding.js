/**
 * @file onboarding.js
 * @description Perfil após login (entrar.html).
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  const auth = window.GRADE_AUTH;
  const sync = window.GRADE_CLOUD_SYNC;
  if (!profile || !auth) return;

  const panel = document.getElementById('onboardingPanel');
  const authPanel = document.getElementById('authMainPanel');
  const gatePanel = document.getElementById('gatePanel');
  const nomeEl = document.getElementById('onboardingNome');
  const cursoEl = document.getElementById('onboardingCurso');
  const periodoEl = document.getElementById('onboardingPeriodo');
  const anoEl = document.getElementById('onboardingAnoIngresso');
  const matriculaEl = document.getElementById('onboardingMatricula');
  const feedbackEl = document.getElementById('cloudFeedback');

  function showFeedback(msg, isError) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.hidden = false;
    feedbackEl.classList.toggle('prefs-feedback--error', !!isError);
  }

  function fillCursoSelect() {
    if (!cursoEl) return;
    cursoEl.innerHTML = '<option value="">Selecione…</option>';
    for (const c of profile.CURSOS) {
      const opt = document.createElement('option');
      opt.value = c.sigla;
      opt.textContent = c.name;
      cursoEl.appendChild(opt);
    }
  }

  function showOnboarding(show) {
    if (gatePanel) gatePanel.hidden = true;
    if (authPanel) authPanel.hidden = true;
    if (panel) panel.hidden = !show;
    if (show) window.GRADE_ENTRAR_PAGE?.showView?.('onboarding');
  }

  async function refreshOnboarding() {
    const user = await auth.getUser();
    if (!user) {
      if (panel) panel.hidden = true;
      window.GRADE_ENTRAR_PAGE?.showGate?.();
      return;
    }
    const p = profile.readProfile();
    if (profile.needsOnboarding()) {
      showOnboarding(true);
      if (nomeEl && p.nome) nomeEl.value = p.nome;
      if (cursoEl && p.curso) cursoEl.value = p.curso;
      if (periodoEl && p.periodo) periodoEl.value = String(p.periodo);
      if (anoEl && p.anoIngresso) anoEl.value = String(p.anoIngresso);
      if (matriculaEl && p.matricula) matriculaEl.value = p.matricula;
      return;
    }
    if (panel) panel.hidden = true;
    if (/entrar\.html$/i.test(window.location.pathname)) {
      const href = profile.primaryCourseHref(false);
      window.location.replace(href || 'index.html');
    }
  }

  fillCursoSelect();

  document.getElementById('onboardingSaveBtn')?.addEventListener('click', async () => {
    const nome = nomeEl?.value?.trim() || '';
    const curso = cursoEl?.value || '';
    const periodo = parseInt(periodoEl?.value || '', 10);
    const anoIngresso = parseInt(anoEl?.value || '', 10);
    const matricula = matriculaEl?.value?.trim() || '';
    if (!curso) {
      showFeedback('Selecione seu curso.', true);
      return;
    }
    profile.setGuest(false);
    profile.setLoggedIn(true);
    profile.saveProfile({
      nome,
      curso,
      periodo: Number.isFinite(periodo) ? periodo : null,
      anoIngresso: Number.isFinite(anoIngresso) ? anoIngresso : null,
      matricula,
      onboardingDone: true,
    });
    profile.setShowAllCourses(false);

    try {
      if (sync && (await auth.getUser())) {
        await sync.pushSnapshot();
      }
    } catch {
      /* nuvem opcional */
    }

    const c = profile.getCurso(curso);
    window.location.href = c ? 'cursos/' + c.html : 'index.html';
  });

  auth.onAuthStateChange(() => {
    refreshOnboarding();
  });

  refreshOnboarding();

  window.GRADE_ONBOARDING = { refreshOnboarding };
})();
