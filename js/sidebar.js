/**
 * @file sidebar.js
 * @description Injeta a sidebar compartilhada antes de `#main` em todas as páginas.
 *
 * Deve ser carregado antes de siteprefs.js, mobile-nav.js e main.js.
 */
(function () {
  'use strict';

  /* ==========================================================================
   * Caminhos relativos
   * ========================================================================== */

  const isSubpage = window.location.pathname.includes('/cursos/');
  /** Prefixo para páginas na raiz do site (index, horários, FAQ…). */
  const rootBase = isSubpage ? '../' : '';

  /** @param {string} file Nome do HTML do curso (ex.: engenharia-software.html) */
  function courseHref(file) {
    return isSubpage ? file : 'cursos/' + file;
  }

  /* ==========================================================================
   * Markup da sidebar
   * ========================================================================== */

  const sidebarHTML = `
    <aside id="sidebar" class="sidebar">
      <div class="sb-brand" aria-label="Grades curriculares UNIPAMPA Alegrete">
        <i class="ti ti-layout-grid sb-brand-icon" aria-hidden="true"></i>
        <span class="sb-brand-text">Grades UNIPAMPA</span>
      </div>
      <button type="button" id="sidebar-toggle" class="sb-toggle" aria-expanded="true" aria-label="Recolher menu lateral" title="Recolher menu">←</button>
      <div class="sb-scroll">
        <nav class="sb-nav" aria-label="Início">
          <a class="sb-item" href="${rootBase}index.html" title="Tela inicial"><i class="ti ti-home" aria-hidden="true"></i><span class="sb-text">Tela inicial</span></a>
        </nav>
        <div class="sb-divider" aria-hidden="true"></div>
        <div class="sb-section sb-label">CURSOS</div>
        <nav class="sb-nav" aria-label="Cursos">
          <a class="sb-item" href="${courseHref('engenharia-software.html')}" title="Engenharia de Software"><i class="ti ti-code" aria-hidden="true"></i><span class="sb-text">Engenharia de Software</span></a>
          <a class="sb-item" href="${courseHref('ciencias-computacao.html')}" title="Ciência da Computação"><i class="ti ti-cpu" aria-hidden="true"></i><span class="sb-text">Ciência da Computação</span></a>
          <a class="sb-item" href="${courseHref('engenharia-civil.html')}" title="Engenharia Civil"><i class="ti ti-building" aria-hidden="true"></i><span class="sb-text">Engenharia Civil</span></a>
          <a class="sb-item" href="${courseHref('engenharia-eletrica.html')}" title="Engenharia Elétrica"><i class="ti ti-bolt" aria-hidden="true"></i><span class="sb-text">Engenharia Elétrica</span></a>
          <a class="sb-item" href="${courseHref('engenharia-mecanica.html')}" title="Engenharia Mecânica"><i class="ti ti-tool" aria-hidden="true"></i><span class="sb-text">Engenharia Mecânica</span></a>
          <a class="sb-item" href="${courseHref('engenharia-agricola.html')}" title="Engenharia Agrícola"><i class="ti ti-seeding" aria-hidden="true"></i><span class="sb-text">Engenharia Agrícola</span></a>
          <a class="sb-item" href="${courseHref('engenharia-telecom.html')}" title="Engenharia de Telecomunicações"><i class="ti ti-antenna" aria-hidden="true"></i><span class="sb-text">Engenharia de Telecomunicações</span></a>
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

  /* ==========================================================================
   * Injeção no DOM e item ativo
   * ========================================================================== */

  const main = document.getElementById('main');
  if (main) {
    const skipHref = '#main';
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<a class="skip-link" href="${skipHref}">Ir para o conteúdo</a>`
    );
    main.insertAdjacentHTML('beforebegin', sidebarHTML);
  }

  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!currentPage) currentPage = 'index.html';
  currentPage = currentPage.split('?')[0].toLowerCase();

  document.querySelectorAll('.sb-item[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    const linkPage = href.split('/').pop().split('?')[0].toLowerCase();
    if (linkPage === currentPage) {
      a.classList.add('active');
      if (linkPage === 'index.html') a.setAttribute('aria-current', 'page');
    }
  });
})();
