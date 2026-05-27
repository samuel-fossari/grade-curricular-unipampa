/**
 * @file sidebar.js
 * @description Injeta a sidebar compartilhada antes de `#main` em todas as páginas.
 */
(function () {
  'use strict';

  const profileApi = window.GRADE_PROFILE;

  const isSubpage = window.location.pathname.includes('/cursos/');
  const rootBase = isSubpage ? '../' : '';

  function courseLink(html) {
    return profileApi?.courseHref(html, isSubpage) || (isSubpage ? html : 'cursos/' + html);
  }

  function buildCoursesNavHtml() {
    const cursos = profileApi?.CURSOS || [];
    const personalized = profileApi?.isPersonalizedNav?.();

    if (!personalized) {
      return cursos
        .map(
          (c) =>
            `<a class="sb-item" href="${courseLink(c.html)}" title="${c.name}"><i class="ti ${c.icon}" aria-hidden="true"></i><span class="sb-text">${c.name}</span></a>`
        )
        .join('');
    }

    const p = profileApi.readProfile();
    const primary = profileApi.getCurso(p.curso);
    if (!primary) {
      return cursos
        .map(
          (c) =>
            `<a class="sb-item" href="${courseLink(c.html)}" title="${c.name}"><i class="ti ${c.icon}" aria-hidden="true"></i><span class="sb-text">${c.name}</span></a>`
        )
        .join('');
    }

    return `<a class="sb-item" href="${courseLink(primary.html)}" title="${primary.name}"><i class="ti ${primary.icon}" aria-hidden="true"></i><span class="sb-text">${primary.name}</span></a>`;
  }

  const loggedIn = profileApi?.isAccountUser?.() ?? false;
  const homeLink = `<a class="sb-item" href="${rootBase}index.html" title="${loggedIn ? 'Início do projeto' : 'Entrar ou continuar sem conta'}"><i class="ti ti-home" aria-hidden="true"></i><span class="sb-text">Tela inicial</span></a>`;
  const perfilLink = loggedIn
    ? `<a class="sb-item" href="${rootBase}perfil.html" title="Perfil e desempenho"><i class="ti ti-user-circle" aria-hidden="true"></i><span class="sb-text">Perfil</span></a>`
    : '';

  const sidebarHTML = `
    <aside id="sidebar" class="sidebar">
      <div class="sb-brand" aria-label="Grades curriculares UNIPAMPA Alegrete">
        <i class="ti ti-layout-grid sb-brand-icon" aria-hidden="true"></i>
        <span class="sb-brand-text">Grades UNIPAMPA</span>
      </div>
      <button type="button" id="sidebar-toggle" class="sb-toggle" aria-expanded="true" aria-label="Recolher menu lateral" title="Recolher menu">←</button>
      <div class="sb-scroll">
        <nav class="sb-nav" aria-label="Início">
          ${homeLink}
          ${perfilLink}
        </nav>
        <div class="sb-divider" aria-hidden="true"></div>
        <div class="sb-section sb-label">CURSOS</div>
        <nav class="sb-nav" aria-label="Cursos" id="sb-courses-nav">
          ${buildCoursesNavHtml()}
        </nav>
        <div class="sb-divider" aria-hidden="true"></div>
        <nav class="sb-nav" aria-label="Horários">
          <a class="sb-item" href="${rootBase}horarios.html" title="Horários do semestre"><i class="ti ti-calendar-week" aria-hidden="true"></i><span class="sb-text">Horários</span></a>
        </nav>
        <div class="sb-divider" aria-hidden="true"></div>
        <nav class="sb-nav sb-nav--meta" aria-label="Informações">
          <a class="sb-item" href="${rootBase}faq.html" title="Perguntas frequentes"><i class="ti ti-help-circle" aria-hidden="true"></i><span class="sb-text">FAQ</span></a>
          <a class="sb-item" href="${rootBase}acessibilidade.html" title="Acessibilidade"><i class="ti ti-accessible" aria-hidden="true"></i><span class="sb-text">Acessibilidade</span></a>
          <a class="sb-item" href="${rootBase}sobre.html" title="Sobre"><i class="ti ti-info-circle" aria-hidden="true"></i><span class="sb-text">Sobre</span></a>
        </nav>
      </div>
      <footer class="sb-footer">Projeto acadêmico independente</footer>
    </aside>
  `;

  const main = document.getElementById('main');
  if (main) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<a class="skip-link" href="#main">Ir para o conteúdo</a>`
    );
    main.insertAdjacentHTML('beforebegin', sidebarHTML);
  }

  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  currentPage = currentPage.split('?')[0].toLowerCase();

  document.querySelectorAll('.sb-item[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const linkPage = href.split('/').pop().split('?')[0].toLowerCase();
    if (linkPage === currentPage) {
      a.classList.add('active');
      if (linkPage === 'index.html') a.setAttribute('aria-current', 'page');
    }
  });

  const SIDEBAR_KEY = 'grade_unipampa_sidebar_v1';
  const mobileMq = window.matchMedia('(max-width: 768px)');

  function initSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    if (!sidebar || !toggle) return;

    function applyCollapsed(collapsed) {
      if (mobileMq.matches) {
        sidebar.classList.remove('collapsed');
        return;
      }
      sidebar.classList.toggle('collapsed', collapsed);
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      toggle.setAttribute(
        'aria-label',
        collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'
      );
      toggle.title = collapsed ? 'Expandir menu' : 'Recolher menu';
      toggle.textContent = collapsed ? '☰' : '←';
      localStorage.setItem(SIDEBAR_KEY, collapsed ? 'collapsed' : 'expanded');
    }

    applyCollapsed(localStorage.getItem(SIDEBAR_KEY) === 'collapsed');
    toggle.addEventListener('click', () =>
      applyCollapsed(!sidebar.classList.contains('collapsed'))
    );
    mobileMq.addEventListener('change', (ev) => {
      if (ev.matches) sidebar.classList.remove('collapsed');
    });
  }

  initSidebarToggle();
})();
