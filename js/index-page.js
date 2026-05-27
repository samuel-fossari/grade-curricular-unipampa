/**
 * @file index-page.js
 * @description Index personalizada: saudação, só o curso do usuário, CTA de conta.
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile) return;

  const list = document.querySelector('.index-course-list');
  const accountCta = document.getElementById('indexAccountCta');
  const coursesTitle = document.getElementById('index-courses-h');

  if (profile.isAccountUser()) {
    accountCta?.setAttribute('hidden', '');
  }

  document.getElementById('indexLoginBtn')?.addEventListener('click', () => {
    window.location.href = 'entrar.html?login=1';
  });

  if (!list) return;

  const p = profile.readProfile();
  const personalized = profile.isPersonalizedNav();
  const primary = personalized ? profile.getCurso(p.curso) : null;

  if (personalized) {
    document.body.classList.add('page-index--personalized');
  }

  if (personalized && p.nome) {
    const h1 = document.querySelector('.page-header h1');
    if (h1) h1.textContent = `Olá, ${p.nome}`;
    const pill = document.querySelector('.header-progress-pill--muted');
    if (pill) {
      const bits = [primary?.name || '', p.periodo ? `${p.periodo}º período` : ''].filter(Boolean);
      pill.textContent = bits.join(' · ') || 'Campus Alegrete';
    }
  }

  if (!primary || !personalized) return;

  if (coursesTitle) coursesTitle.textContent = 'Meu curso';

  const items = [...list.querySelectorAll('li')];
  const primaryLi = items.find((li) => {
    const a = li.querySelector('a');
    return a && a.getAttribute('href')?.includes(primary.html);
  });
  if (!primaryLi) return;

  primaryLi.querySelector('.index-course-card')?.classList.add('index-course-card--primary');
  list.innerHTML = '';
  list.appendChild(primaryLi);
})();
