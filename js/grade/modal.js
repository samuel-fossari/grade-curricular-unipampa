/**
 * Modal de detalhes da disciplina — foco, ementa e CH.
 */
(function (root) {
  'use strict';

  const { escapeAttr, escapeHtml, listDialogFocusables, createDialogFocusTrap } = root.GRADE_DOM;

  /**
   * @param {object} deps
   * @param {object} deps.cfg
   * @param {string} deps.sigla
   * @param {Element | null} deps.dialogEl
   * @param {Element | null} deps.dialogTitleEl
   * @param {Element | null} deps.dialogBody
   * @param {object} deps.uiState - lastFocusEl, cccgPickerRestore getters/setters
   * @param {object} deps.CAT_NAMES
   * @param {(disc: object) => string} deps.displayState
   * @param {(pid: string) => boolean} deps.isPrereqSatisfied
   * @param {(pid: string) => string} deps.prereqLabel
   * @param {(disc: object) => boolean} deps.specialMinChMet
   * @param {() => number} deps.mandatoryIntegralizedCh
   * @param {() => void} deps.closeAllDiscMenus
   * @param {(slotDisc: object, el: Element) => void} deps.openCccgPicker
   */
  function createGradeModal(deps) {
    const focusTrap = deps.focusTrap || createDialogFocusTrap();

    function setDialogCccgMode(isPicker) {
      const panel = deps.dialogEl?.querySelector('.dialog-panel');
      panel?.classList.toggle('dialog-panel--cccg', isPicker);
      deps.dialogBody?.classList.toggle('dialog-body--cccg-picker', isPicker);
    }

    function ementaText(disc) {
      if (disc.ementa && String(disc.ementa).trim()) return disc.ementa;
      return 'Ementa não cadastrada — consulte o PPC do curso.';
    }

    function buildChSectionHtml(disc) {
      const rows = [
        `<div class="dlg-ch-row"><span>Total:</span><span>${escapeHtml(disc.ch || '—')}</span></div>`,
      ];
      const breakdown = [
        ['ch_teo', 'Presencial teórica'],
        ['ch_prat', 'Presencial prática'],
        ['ch_ead_t', 'EaD teórica'],
        ['ch_ead_p', 'EaD prática'],
        ['ch_ext', 'Extensão'],
      ];
      for (const [key, label] of breakdown) {
        if (Object.prototype.hasOwnProperty.call(disc, key)) {
          rows.push(
            `<div class="dlg-ch-row"><span>${label}:</span><span>${disc[key]}h</span></div>`
          );
        }
      }
      return `<div class="dlg-section dlg-block"><div class="dlg-lbl">Carga horária</div>${rows.join('')}</div>`;
    }

    function openDialog(disc, returnFocusEl) {
      const { dialogEl, dialogTitleEl, dialogBody } = deps;
      if (!dialogEl || !dialogTitleEl || !dialogBody) return;
      deps.closeAllDiscMenus();
      setDialogCccgMode(false);
      delete dialogBody.dataset.cccgSlotId;
      deps.uiState.lastFocusEl =
        returnFocusEl && typeof returnFocusEl.focus === 'function'
          ? returnFocusEl
          : document.activeElement;
      dialogTitleEl.textContent = disc.name;
      const st = deps.displayState(disc);
      const stLabel =
        st === 'locked'
          ? 'Bloqueada'
          : st === 'done'
            ? 'Concluída'
            : st === 'in_progress'
              ? 'Em andamento'
              : 'Disponível (não iniciada)';

      let prereqHtml = '';
      const hasPrereqs = disc.prereqs.length > 0 || disc.specialMinCH;
      if (hasPrereqs) {
        prereqHtml =
          '<div class="dlg-section"><div class="dlg-lbl">Pré-requisitos</div><ul class="dlg-prereq-list">';
        for (const pid of disc.prereqs) {
          const ok = deps.isPrereqSatisfied(pid);
          const label = deps.prereqLabel(pid);
          prereqHtml += `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${escapeHtml(label)}</li>`;
        }
        if (disc.specialMinCH) {
          const ok = deps.specialMinChMet(disc);
          const cur = deps.mandatoryIntegralizedCh();
          const label = `${disc.specialMinCH}h integralizadas (CCOG) — ${cur}/${disc.specialMinCH}h`;
          prereqHtml += `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${escapeHtml(label)}</li>`;
        }
        prereqHtml += '</ul></div>';
      } else {
        prereqHtml =
          '<div class="dlg-section dlg-block"><div class="dlg-lbl">Pré-requisitos</div><div class="dlg-muted">Sem pré-requisitos por disciplina</div></div>';
      }

      let special = '';
      if (disc.specialNote) {
        special = `<div class="dlg-special" role="status"><span class="dlg-special-ic" aria-hidden="true">⏱</span> ${escapeHtml(
          String(disc.specialNote)
        )}</div>`;
      }

      const objetivoHtml =
        disc.objetivo && String(disc.objetivo).trim()
          ? `<div class="dlg-section dlg-block"><div class="dlg-lbl">Objetivo</div><div class="dlg-ementa">${escapeHtml(
              disc.objetivo
            )}</div></div>`
          : '';

      dialogBody.innerHTML = `
      <div class="dlg-row"><span class="dlg-k">Código</span><span class="dlg-mono">${escapeHtml(String(disc.codigo))}</span></div>
      <div class="dlg-row"><span class="dlg-k">Eixo/Categoria</span><span>${escapeHtml(deps.CAT_NAMES[disc.cat] || disc.cat)}</span></div>
      <div class="dlg-row"><span class="dlg-k">Status</span><span>${stLabel}</span></div>
      <hr class="dlg-hr" />
      ${buildChSectionHtml(disc)}
      <div class="dlg-section dlg-block"><div class="dlg-lbl">Ementa</div><div class="dlg-ementa">${escapeHtml(ementaText(disc))}</div></div>
      ${objetivoHtml}
      ${prereqHtml}
      ${special}
      <p class="dlg-horarios-link-wrap"><a href="../horarios.html?curso=${encodeURIComponent(deps.sigla)}" class="dlg-horarios-link">Editar horário, sala e professor</a></p>
    `;

      dialogEl.classList.add('open');
      dialogEl.removeAttribute('aria-hidden');
      dialogEl.removeAttribute('inert');
      dialogEl.setAttribute('aria-modal', 'true');
      dialogEl.setAttribute('aria-labelledby', 'dialog-title');
      dialogEl.setAttribute('role', 'dialog');

      focusTrap.bind(dialogEl);

      requestAnimationFrame(() => {
        const focusable = listDialogFocusables(dialogEl);
        const closeBtn = dialogEl.querySelector('.dialog-close');
        const target =
          closeBtn && focusable.includes(closeBtn) ? closeBtn : focusable[0];
        if (target && typeof target.focus === 'function') target.focus();
      });
    }

    function closeDialog() {
      const { dialogEl, dialogBody } = deps;
      if (!dialogEl) return;
      focusTrap.detach();
      dialogEl.classList.remove('open');
      dialogEl.setAttribute('aria-hidden', 'true');
      dialogEl.setAttribute('inert', '');
      dialogBody.innerHTML = '';
      setDialogCccgMode(false);
      delete dialogBody.dataset.cccgSlotId;

      if (deps.uiState.cccgPickerRestore) {
        const ctx = deps.uiState.cccgPickerRestore;
        deps.uiState.cccgPickerRestore = null;
        requestAnimationFrame(() => deps.openCccgPicker(ctx.slotDisc, ctx.returnFocusEl));
        return;
      }

      const lastFocusEl = deps.uiState.lastFocusEl;
      if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
    }

    return {
      openDialog,
      closeDialog,
      setDialogCccgMode,
      buildChSectionHtml,
      ementaText,
    };
  }

  root.GRADE_MODAL = { createGradeModal };
})(typeof globalThis !== 'undefined' ? globalThis : window);
