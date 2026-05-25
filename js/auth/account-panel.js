/**
 * Painel Conta / nuvem na página Acessibilidade.
 */
(function () {
  'use strict';

  const auth = window.GRADE_AUTH;
  const sync = window.GRADE_CLOUD_SYNC;
  if (!auth || !sync) return;

  const statusEl = document.getElementById('cloudAccountStatus');
  const emailEl = document.getElementById('cloudEmail');
  const passwordEl = document.getElementById('cloudPassword');
  const feedbackEl = document.getElementById('cloudFeedback');
  const signedOutEl = document.getElementById('cloudSignedOut');
  const signedInEl = document.getElementById('cloudSignedIn');

  function showFeedback(msg, isError) {
    if (!feedbackEl) return;
    feedbackEl.textContent = msg;
    feedbackEl.hidden = false;
    feedbackEl.classList.toggle('prefs-feedback--error', !!isError);
  }

  function countProgressSummary(source) {
    const siglas = window.GRADE_STORAGE?.SIGLAS || [];
    let done = 0;
    let inProgress = 0;
    for (const sigla of siglas) {
      const progress = source?.courses?.[sigla]?.progress;
      if (!progress || typeof progress !== 'object') continue;
      for (const value of Object.values(progress)) {
        if (value === 'done') done += 1;
        else if (value === 'in_progress') inProgress += 1;
      }
    }
    if (!done && !inProgress) return 'sem progresso nas grades';
    const parts = [];
    if (done) parts.push(`${done} concluída${done > 1 ? 's' : ''}`);
    if (inProgress) parts.push(`${inProgress} em andamento`);
    return parts.join(', ');
  }

  async function refreshUi() {
    if (!window.GRADE_SUPABASE?.isConfigured()) {
      if (statusEl) {
        statusEl.textContent =
          'Nuvem não configurada neste build. Rode npm run config e recarregue.';
      }
      signedOutEl?.removeAttribute('hidden');
      signedInEl?.setAttribute('hidden', '');
      return;
    }

    await window.GRADE_SUPABASE.init();
    const user = await auth.getUser();

    if (!user) {
      if (statusEl) statusEl.textContent = 'Não conectado.';
      signedOutEl?.removeAttribute('hidden');
      signedInEl?.setAttribute('hidden', '');
      return;
    }

    if (statusEl) {
      statusEl.textContent = user.email
        ? `Conectado como ${user.email}`
        : 'Conectado.';
    }
    signedOutEl?.setAttribute('hidden', '');
    signedInEl?.removeAttribute('hidden');
  }

  async function runAction(fn) {
    try {
      feedbackEl.hidden = true;
      await fn();
      await refreshUi();
    } catch (err) {
      showFeedback(err?.message || String(err), true);
    }
  }

  document.getElementById('cloudGoogleBtn')?.addEventListener('click', () => {
    runAction(() => auth.signInWithGoogle());
  });

  document.getElementById('cloudSignInBtn')?.addEventListener('click', () => {
    const email = emailEl?.value?.trim();
    const password = passwordEl?.value || '';
    if (!email || !password) {
      showFeedback('Informe e-mail e senha.', true);
      return;
    }
    runAction(async () => {
      await auth.signInWithPassword(email, password);
      showFeedback('Login realizado.', false);
    });
  });

  document.getElementById('cloudSignUpBtn')?.addEventListener('click', () => {
    const email = emailEl?.value?.trim();
    const password = passwordEl?.value || '';
    if (!email || !password) {
      showFeedback('Informe e-mail e senha.', true);
      return;
    }
    runAction(async () => {
      await auth.signUpWithPassword(email, password);
      showFeedback('Conta criada. Confirme o e-mail se o Supabase exigir.', false);
    });
  });

  document.getElementById('cloudSignOutBtn')?.addEventListener('click', () => {
    runAction(() => auth.signOut());
  });

  document.getElementById('cloudPushBtn')?.addEventListener('click', () => {
    runAction(async () => {
      const payload = window.GRADE_STORAGE?.exportAll?.();
      const summary = countProgressSummary(payload);
      const at = await sync.pushSnapshot();
      showFeedback(
        `Salvo na nuvem (${new Date(at).toLocaleString('pt-BR')}) — ${summary}.`,
        false
      );
    });
  });

  document.getElementById('cloudPullBtn')?.addEventListener('click', () => {
    const merge = document.getElementById('cloudPullMerge')?.checked;
    runAction(async () => {
      const at = await sync.pullSnapshot({ merge });
      if (!at) {
        showFeedback('Nenhum backup na nuvem ainda.', false);
        return;
      }
      const summary = countProgressSummary(window.GRADE_STORAGE?.exportAll?.());
      showFeedback(
        `Carregado da nuvem (${new Date(at).toLocaleString('pt-BR')}) — ${summary}. Abra ou recarregue (F5) a página do curso.`,
        false
      );
    });
  });

  auth.onAuthStateChange(async (event) => {
    if (event === 'SIGNED_IN') {
      try {
        const result = await sync.syncAfterLogin();
        if (result.action === 'pushed') {
          showFeedback('Login realizado. Progresso local enviado à nuvem.', false);
        } else if (result.action === 'pulled') {
          showFeedback('Login realizado. Dados carregados da nuvem.', false);
        }
      } catch (err) {
        showFeedback(err?.message || String(err), true);
      }
    }
    refreshUi();
  });

  refreshUi();
})();
