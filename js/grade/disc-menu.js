/**
 * Menu contextual dos cartões (⋯): posicionamento e teleport no mobile.
 */
(function (root) {
  'use strict';

  const { isMobileViewport } = root.GRADE_DOM;

  /**
   * Retorna o painel do menu de um cartão (referência em cache ou via DOM).
   * @param {Element} menuWrap - Wrapper `.disc-menu` do cartão.
   * @returns {Element | null}
   */
  function getDiscMenuPanel(menuWrap) {
    return menuWrap._discPanel || menuWrap.querySelector('.disc-menu-panel');
  }

  /** Remove estilos inline e classe de posicionamento fixo do painel. */
  function resetDiscMenuPanelStyle(panel) {
    if (!panel) return;
    panel.classList.remove('disc-menu-panel--fixed');
    panel.style.position = '';
    panel.style.left = '';
    panel.style.right = '';
    panel.style.top = '';
    panel.style.bottom = '';
    panel.style.zIndex = '';
    panel.style.minWidth = '';
    panel.style.pointerEvents = '';
    panel.style.display = '';
  }

  /**
   * Abre o painel do menu. No mobile, “teleporta” o painel para `document.body`
   * para escapar de overflow/clipping da coluna do semestre.
   * @param {Element} menuWrap
   */
  function openDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    if (!panel) return;
    if (isMobileViewport()) {
      document.body.appendChild(panel);
    } else if (!menuWrap.contains(panel)) {
      menuWrap.appendChild(panel);
    }
    panel.classList.add('is-open');
    panel.style.pointerEvents = 'auto';
  }

  /**
   * Fecha um menu específico e devolve o painel ao DOM original (se teleportado).
   * @param {Element} menuWrap
   */
  function closeDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    menuWrap.classList.remove('is-open');
    menuWrap.querySelector('.disc-menu-trigger')?.setAttribute('aria-expanded', 'false');
    if (!panel) return;
    panel.classList.remove('is-open', 'disc-menu-panel--fixed');
    resetDiscMenuPanelStyle(panel);
    if (panel.parentNode) panel.remove();
  }

  /** Fecha todos os menus abertos e remove painéis teleportados órfãos do body. */
  function closeAllDiscMenus() {
    document.querySelectorAll('.disc-menu.is-open').forEach(closeDiscMenuPanel);
    document.querySelectorAll('body > .disc-menu-panel').forEach((panel) => {
      panel.classList.remove('is-open', 'disc-menu-panel--fixed');
      resetDiscMenuPanelStyle(panel);
      panel.remove();
    });
  }

  /**
   * Posiciona o painel relativo ao gatilho, escolhendo abrir para cima/baixo e
   * evitando estourar as bordas da viewport. No mobile usa `position: fixed`.
   * @param {Element} menuWrap
   */
  function positionDiscMenuPanel(menuWrap) {
    const panel = getDiscMenuPanel(menuWrap);
    const trigger = menuWrap.querySelector('.disc-menu-trigger');
    if (!panel || !trigger) return;
    requestAnimationFrame(() => {
      if (!menuWrap.classList.contains('is-open') || !panel.classList.contains('is-open')) return;
      const rect = trigger.getBoundingClientRect();
      const pad = 12;
      const gap = 4;

      if (isMobileViewport()) {
        panel.classList.add('disc-menu-panel--fixed');
        panel.style.position = 'fixed';
        panel.style.zIndex = '250';
        panel.style.minWidth = '12.5rem';
        panel.style.pointerEvents = 'auto';
        const w = Math.max(panel.offsetWidth, 200);
        const h = Math.max(panel.offsetHeight, 1);
        let left = rect.left;
        if (left + w > window.innerWidth - pad) {
          left = Math.max(pad, window.innerWidth - pad - w);
        }
        let top = rect.bottom + gap;
        if (top + h > window.innerHeight - pad) {
          top = Math.max(pad, rect.top - gap - h);
        }
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        return;
      }

      resetDiscMenuPanelStyle(panel);
      const w = Math.max(panel.offsetWidth, 200);
      if (rect.left + w > window.innerWidth - pad) {
        panel.style.left = 'auto';
        panel.style.right = '0';
      } else {
        panel.style.left = '0';
        panel.style.right = 'auto';
      }

      const h = Math.max(panel.offsetHeight, 1);
      const spaceBelow = window.innerHeight - rect.bottom - pad;
      const spaceAbove = rect.top - pad;
      let openUp = false;
      if (h <= spaceBelow) {
        openUp = false;
      } else if (h <= spaceAbove) {
        openUp = true;
      } else {
        openUp = spaceAbove > spaceBelow;
      }

      if (openUp) {
        panel.style.top = 'auto';
        panel.style.bottom = `calc(100% + ${gap}px)`;
      } else {
        panel.style.top = `calc(100% + ${gap}px)`;
        panel.style.bottom = 'auto';
      }
    });
  }

  root.GRADE_DISC_MENU = {
    getDiscMenuPanel,
    openDiscMenuPanel,
    closeDiscMenuPanel,
    closeAllDiscMenus,
    positionDiscMenuPanel,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
