/**
 * Utilitários DOM compartilhados (escape, toast, viewport, focus trap).
 */
(function (root) {
  'use strict';

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;');
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function announce(msg) {
    const el = document.getElementById('status-announcer');
    if (!el) return;
    el.textContent = '';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.textContent = msg;
      });
    });
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  function isMobileViewport() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  function listDialogFocusables(rootEl) {
    const sel =
      'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return [...rootEl.querySelectorAll(sel)].filter((el) => {
      if (el.closest('[aria-hidden="true"]')) return false;
      const style = window.getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none') return false;
      return true;
    });
  }

  /** @returns {{ bind: Function, detach: Function }} */
  function createDialogFocusTrap() {
    /** @type {AbortController | null} */
    let abort = null;

    function detach() {
      if (abort) {
        abort.abort();
        abort = null;
      }
    }

    function bind(rootEl) {
      detach();
      abort = new AbortController();
      const { signal } = abort;
      rootEl.addEventListener(
        'keydown',
        function onDialogTabTrap(e) {
          if (e.key !== 'Tab') return;
          const focusable = listDialogFocusables(rootEl);
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        },
        { signal }
      );
    }

    return { bind, detach };
  }

  root.GRADE_DOM = {
    escapeAttr,
    escapeHtml,
    announce,
    showToast,
    isMobileViewport,
    listDialogFocusables,
    createDialogFocusTrap,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
