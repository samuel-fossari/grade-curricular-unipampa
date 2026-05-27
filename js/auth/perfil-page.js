/**
 * @file perfil-page.js
 * @description Perfil do usuário + dashboard de desempenho.
 */
(function () {
  'use strict';

  const profile = window.GRADE_PROFILE;
  const storage = window.GRADE_STORAGE;
  if (!profile || !storage) return;

  const dataList = document.getElementById('perfilDataList');
  const statsEl = document.getElementById('perfilStats');
  const chartEl = document.getElementById('perfilSemChart');
  const emptyEl = document.getElementById('perfilDashEmpty');
  const headerPill = document.getElementById('perfilHeaderPill');

  function readProgress(sigla) {
    try {
      const raw = localStorage.getItem(storage.progressKey(sigla));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function renderProfileInfo(email) {
    const p = profile.readProfile();
    const c = profile.getCurso(p.curso);
    if (headerPill && c) headerPill.textContent = c.name;

    const rows = [
      ['Nome', p.nome || '—'],
      ['Curso', c?.name || '—'],
      ['Período atual', p.periodo ? `${p.periodo}º` : '—'],
      ['Ano de ingresso', p.anoIngresso ? String(p.anoIngresso) : '—'],
      ['Matrícula', p.matricula || '—'],
      ['E-mail', email || '—'],
    ];

    if (!dataList) return;
    dataList.innerHTML = rows
      .map(
        ([k, v]) =>
          `<div class="perfil-dl__row"><dt class="perfil-dl__k">${k}</dt><dd class="perfil-dl__v">${escapeHtml(v)}</dd></div>`
      )
      .join('');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderDashboard(cfg, progress) {
    const discs = Array.isArray(cfg.disciplines) ? cfg.disciplines : [];
    let done = 0;
    let inProgress = 0;
    const bySem = {};

    for (const d of discs) {
      const id = d.id || d.codigo;
      if (!id) continue;
      const sem = d.sem || 0;
      if (!bySem[sem]) bySem[sem] = { total: 0, done: 0, inProgress: 0 };
      bySem[sem].total += 1;
      const st = progress[id];
      if (st === 'done') {
        done += 1;
        bySem[sem].done += 1;
      } else if (st === 'in_progress') {
        inProgress += 1;
        bySem[sem].inProgress += 1;
      }
    }

    const total = discs.length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    if (statsEl) {
      statsEl.innerHTML = `
        <div class="perfil-stat"><span class="perfil-stat__n">${done}</span><span class="perfil-stat__l">Concluídas</span></div>
        <div class="perfil-stat"><span class="perfil-stat__n">${inProgress}</span><span class="perfil-stat__l">Em andamento</span></div>
        <div class="perfil-stat"><span class="perfil-stat__n">${total - done - inProgress}</span><span class="perfil-stat__l">Não feitas</span></div>
        <div class="perfil-stat perfil-stat--accent"><span class="perfil-stat__n">${pct}%</span><span class="perfil-stat__l">Concluído</span></div>
      `;
    }

    const semesters = Object.keys(bySem)
      .map(Number)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);

    if (chartEl && semesters.length) {
      chartEl.innerHTML = semesters
        .map((sem) => {
          const b = bySem[sem];
          const semPct = b.total ? Math.round((b.done / b.total) * 100) : 0;
          return `
            <div class="perfil-sem-row">
              <span class="perfil-sem-row__lbl">${sem}º sem.</span>
              <div class="perfil-sem-row__track" role="presentation">
                <div class="perfil-sem-row__fill" style="width:${semPct}%"></div>
              </div>
              <span class="perfil-sem-row__pct">${b.done}/${b.total}</span>
            </div>
          `;
        })
        .join('');
    }

    const hasActivity = done + inProgress > 0;
    if (emptyEl) emptyEl.hidden = hasActivity;
    if (chartEl) chartEl.hidden = !semesters.length;
  }

  async function loadDashboard() {
    const p = profile.readProfile();
    if (!p.curso) return;

    const script = document.createElement('script');
    script.src = `js/cursos/${p.curso}.js`;
    script.onload = () => {
      const cfg = window.GRADE_CURSO_CONFIG;
      if (!cfg) return;
      renderDashboard(cfg, readProgress(p.curso));
    };
    script.onerror = () => {
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent = 'Não foi possível carregar os dados do curso.';
      }
    };
    document.body.appendChild(script);
  }

  (async function init() {
    let email = '';
    if (window.GRADE_AUTH && window.GRADE_SUPABASE?.isConfigured()) {
      await window.GRADE_SUPABASE.init();
      const user = await window.GRADE_AUTH.getUser();
      email = user?.email || '';
    }
    renderProfileInfo(email);
    loadDashboard();
  })();
})();
