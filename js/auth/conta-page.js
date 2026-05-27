/**
 * @file conta-page.js
 * @description Resumo do perfil na página Conta.
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  if (!profile) return;

  const summaryEl = document.getElementById('contaProfileSummary');
  const pillEl = document.getElementById('contaProfilePill');
  const p = profile.readProfile();
  const c = profile.getCurso(p.curso);

  if (summaryEl) {
    const parts = [];
    if (p.nome) parts.push(p.nome);
    if (c) parts.push(c.name);
    if (p.periodo) parts.push(`${p.periodo}º período`);
    if (p.anoIngresso) parts.push(`ingresso ${p.anoIngresso}`);
    if (p.matricula) parts.push(`matr. ${p.matricula}`);
    summaryEl.textContent = parts.length ? parts.join(' · ') : 'Complete seu perfil na tela inicial (index.html).';
  }
  if (pillEl && c) pillEl.textContent = c.name;
})();
