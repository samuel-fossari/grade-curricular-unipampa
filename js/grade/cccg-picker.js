/**
 * Seletor de CCCGs no modal: catálogo, cotas, escolhas por slot e cadastro avulso.
 */
(function (root) {
  'use strict';

  const { escapeAttr, escapeHtml, createDialogFocusTrap } = root.GRADE_DOM;
  const { normalizeSearchText, cccgSearchKey } = root.GRADE_SEARCH;

  /**
   * @param {object} deps
   */
  function createCccgPicker(deps) {
    const focusTrap = deps.focusTrap || createDialogFocusTrap();

    function isCustomItem(item) {
      return deps.isCustomCccg
        ? deps.isCustomCccg(item)
        : !!(item && item.custom);
    }

    function getCatalog() {
      if (typeof deps.getCccgsCatalog === 'function') return deps.getCccgsCatalog();
      return deps.cccgsCatalog || [];
    }

    function cccgItemAsDisc(item) {
      return {
        id: item.codigo,
        name: item.nome,
        codigo: item.codigo,
        cat: item.cat,
        ch: `${item.ch}h`,
        ch_teo: item.ch_teo,
        ch_prat: item.ch_prat,
        ch_ead_t: item.ch_ead_t,
        ch_ead_p: item.ch_ead_p,
        ch_ext: item.ch_ext,
        ementa: item.ementa,
        objetivo: item.objetivo,
        prereqs: item.prereqs || [],
        specialMinCH: item.specialMinCH,
        custom: isCustomItem(item),
      };
    }

    function customBadgeHtml() {
      return '<span class="cccg-picker-badge">Fora do PPC</span>';
    }

    function itemMetaHtml(item) {
      const custom = isCustomItem(item) ? ` ${customBadgeHtml()}` : '';
      return `${escapeHtml(item.codigo)} · ${deps.cccgItemCh(item)}h${custom}`;
    }

    function cccgSlotSummary(slotId) {
      const slotDisc = deps.disciplines.find((d) => d.id === slotId);
      if (!slotDisc) return null;
      const sem = slotDisc.sem;
      const semTotal = deps.cccgSemesterPicksChTotal(sem);
      if (!semTotal) return null;
      const semLimit = deps.cccgSemesterLimit(sem);
      const labels = [];
      for (const sid of deps.cccgSlotIdsInSem(sem)) {
        for (const codigo of deps.getSlotPicks(sid)) {
          const item = deps.cccgByCodigo.get(codigo);
          if (item) labels.push(item.nome);
        }
      }
      const slotCount = deps.getSlotPicks(slotId).length;
      return {
        count: labels.length,
        totalCh: semTotal,
        semLimit,
        slotCount,
        labels,
      };
    }

    function toggleCccgPick(slotId, codigo, slotDisc) {
      const item = deps.cccgByCodigo.get(codigo);
      if (!item) return;
      const picks = deps.getSlotPicks(slotId);
      const idx = picks.indexOf(codigo);
      if (idx >= 0) {
        picks.splice(idx, 1);
        deps.store.cccgPicks[slotId] = picks;
        deps.saveCccgPicks();
        deps.showToast('Removido: ' + item.nome);
        return;
      }
      const block = deps.cccgPickBlockReason(item, slotId, slotDisc);
      if (block) {
        deps.showToast('⚠️ ' + block);
        return;
      }
      picks.push(codigo);
      deps.store.cccgPicks[slotId] = picks;
      deps.saveCccgPicks();
      deps.showToast('✓ Adicionado: ' + item.nome);
    }

    function selectedItemHtml(codigo, readonly) {
      const item = deps.cccgByCodigo.get(codigo);
      if (!item) return '';
      const extraClass = readonly ? ' cccg-picker-selected-item--readonly' : '';
      const actions = readonly
        ? ''
        : `<span class="cccg-picker-selected-actions">
                <button type="button" class="cccg-picker-btn cccg-picker-btn--info" data-cccg-detail="${escapeAttr(codigo)}" aria-label="Ver detalhes de ${escapeAttr(item.nome)}">ℹ</button>
                <button type="button" class="cccg-picker-btn cccg-picker-btn--remove" data-cccg-remove="${escapeAttr(codigo)}" aria-label="Remover ${escapeAttr(item.nome)}">×</button>
              </span>`;
      return `<li class="cccg-picker-selected-item${extraClass}">
              <span class="cccg-picker-selected-dot" style="background:${deps.catColor(item.cat)}"></span>
              <span class="cccg-picker-selected-text">
                <strong>${escapeHtml(item.nome)}</strong>
                <span class="cccg-picker-selected-meta">${itemMetaHtml(item)}</span>
              </span>
              ${actions}
            </li>`;
    }

    function addFormHtml() {
      return `<form class="cccg-add-form" id="cccg-add-form">
        <p class="cccg-add-form-note">Cadastro para planejamento. Não substitui aproveitamento oficial (equivalência ou AL0000).</p>
        <label class="dlg-field">
          <span>Nome <abbr title="obrigatório">*</abbr></span>
          <input type="text" name="nome" maxlength="200" required autocomplete="off" />
        </label>
        <div class="cccg-add-form-row">
          <label class="dlg-field">
            <span>Código</span>
            <input type="text" name="codigo" maxlength="24" autocomplete="off" placeholder="Gerado se vazio" />
          </label>
          <label class="dlg-field">
            <span>Carga horária (h) <abbr title="obrigatório">*</abbr></span>
            <input type="number" name="ch" min="1" max="300" step="1" required inputmode="numeric" />
          </label>
        </div>
        <label class="dlg-field">
          <span>Ementa ou observação</span>
          <textarea name="ementa" rows="3" maxlength="2000"></textarea>
        </label>
        <p class="cccg-add-form-error" hidden role="alert"></p>
        <div class="cccg-add-form-actions">
          <button type="submit" class="cccg-add-form-save">Salvar e selecionar</button>
          <button type="button" class="cccg-add-form-cancel" data-cccg-add-cancel>Cancelar</button>
        </div>
      </form>`;
    }

    function openCccgPicker(slotDisc, returnFocusEl, opts) {
      const { dialogEl, dialogTitleEl, dialogBody, cccgsEnabled } = deps;
      if (!dialogEl || !dialogTitleEl || !dialogBody || !cccgsEnabled) return;
      deps.closeAllDiscMenus();
      deps.uiState.cccgPickerRestore = null;
      deps.uiState.lastFocusEl =
        returnFocusEl && typeof returnFocusEl.focus === 'function'
          ? returnFocusEl
          : document.activeElement;

      const slotId = slotDisc.id;
      const sem = slotDisc.sem;
      const semLimit = deps.cccgSemesterLimit(sem);
      const semSelectedCh = deps.cccgSemesterPicksChTotal(sem);
      const semRemaining = deps.cccgSemesterRemaining(sem);
      const picks = deps.getSlotPicks(slotId);
      const siblingSlots = deps.cccgSlotIdsInSem(sem).filter((id) => id !== slotId);
      const siblingPicks = siblingSlots.flatMap((id) => deps.getSlotPicks(id));
      const showAddForm = !!(opts && opts.showAddForm);
      const restoreFilter = opts && typeof opts.filterQuery === 'string' ? opts.filterQuery : '';
      const catalog = getCatalog();

      dialogTitleEl.textContent = `CCCGs: ${sem}º semestre`;
      deps.setDialogCccgMode(true);

      let selectedHtml = '';
      if (picks.length) {
        selectedHtml =
          '<ul class="cccg-picker-selected">' +
          picks.map((codigo) => selectedItemHtml(codigo, false)).join('') +
          '</ul>';
      } else {
        selectedHtml =
          '<p class="dlg-muted">Nenhum componente neste card. Escolha abaixo até completar a carga de CCCG do semestre.</p>';
      }

      let siblingHtml = '';
      if (siblingPicks.length) {
        siblingHtml =
          '<div class="dlg-section dlg-block"><div class="dlg-lbl">Escolhidos em outros cards deste semestre</div><ul class="cccg-picker-selected">' +
          siblingPicks.map((codigo) => selectedItemHtml(codigo, true)).join('') +
          '</ul></div>';
      }

      const byCat = {};
      const pickerCats = deps.cccgPickerCategories();
      const oversized = [];
      for (const cat of pickerCats) byCat[cat] = [];
      for (const item of catalog) {
        const tooLarge =
          deps.cccgItemCh(item) > semLimit && !picks.includes(item.codigo);
        if (tooLarge) {
          oversized.push(item);
          continue;
        }
        const cat = item.cat || 'nao_definido';
        if (!byCat[cat]) byCat[cat] = [];
        byCat[cat].push(item);
      }

      function renderPickerItem(item) {
        const pickedHere = picks.includes(item.codigo);
        const block = pickedHere ? null : deps.cccgPickBlockReason(item, slotId, slotDisc);
        const disabled = !pickedHere && !!block;
        const custom = isCustomItem(item);
        const deleteBtn = custom
          ? `<button type="button" class="cccg-picker-btn cccg-picker-btn--remove" data-cccg-delete-custom="${escapeAttr(item.codigo)}" aria-label="Excluir cadastro de ${escapeAttr(item.nome)}">×</button>`
          : '';
        return `<li class="cccg-picker-item${pickedHere ? ' is-selected' : ''}${disabled ? ' is-disabled' : ''}${custom ? ' cccg-picker-item--custom' : ''}" data-cccg-search="${escapeAttr(
          cccgSearchKey(item)
        )}">
          <button type="button" class="cccg-picker-toggle" data-cccg-toggle="${escapeAttr(item.codigo)}" ${disabled ? 'disabled aria-disabled="true"' : ''} aria-pressed="${pickedHere ? 'true' : 'false'}">
            <span class="cccg-picker-item-name">${escapeHtml(item.nome)}</span>
            <span class="cccg-picker-item-meta">${itemMetaHtml(item)}</span>
          </button>
          <span class="cccg-picker-item-actions">
            <button type="button" class="cccg-picker-btn cccg-picker-btn--info" data-cccg-detail="${escapeAttr(item.codigo)}" aria-label="Ver detalhes de ${escapeAttr(item.nome)}">ℹ</button>
            ${deleteBtn}
          </span>
          ${disabled && block ? `<span class="cccg-picker-item-hint">${escapeHtml(block)}</span>` : ''}
        </li>`;
      }

      let catalogHtml = '';
      for (const cat of pickerCats) {
        const items = byCat[cat] || [];
        if (!items.length) continue;
        catalogHtml += `<div class="cccg-picker-group" data-cccg-cat="${escapeAttr(cat)}">
        <div class="cccg-picker-group-title"><span class="cccg-picker-group-dot" style="background:${deps.catColor(cat)}"></span>${escapeHtml(deps.catLabel(cat))}</div>
        <ul class="cccg-picker-list">`;
        for (const item of items) {
          catalogHtml += renderPickerItem(item);
        }
        catalogHtml += '</ul></div>';
      }

      if (oversized.length) {
        catalogHtml += `<div class="cccg-picker-group cccg-picker-group--oversized" data-cccg-cat="oversized">
        <div class="cccg-picker-group-title">Excedem ${semLimit}h deste semestre</div>
        <p class="cccg-picker-oversized-note">Estes componentes têm carga horária maior que a cota de CCCG do ${sem}º semestre (${semLimit}h).</p>
        <ul class="cccg-picker-list">`;
        for (const item of oversized) {
          catalogHtml += renderPickerItem(item);
        }
        catalogHtml += '</ul></div>';
      }

      const addPanel = showAddForm
        ? addFormHtml()
        : `<button type="button" class="cccg-add-open" data-cccg-add-open>Não encontrou? Adicionar componente fora do catálogo</button>`;

      dialogBody.innerHTML = `
      <div class="cccg-picker-meta" role="status">
        <span><strong>${semSelectedCh}h</strong> / ${semLimit}h no ${sem}º semestre</span>
        <span>${semRemaining}h restantes · ${picks.length} neste card</span>
      </div>
      <div class="dlg-section dlg-block">
        <div class="dlg-lbl">Selecionados neste card</div>
        ${selectedHtml}
      </div>
      ${siblingHtml}
      <div class="dlg-section dlg-block cccg-add-section">
        ${addPanel}
      </div>
      <div class="dlg-section dlg-block">
        <div class="dlg-lbl">Catálogo de CCCGs</div>
        <label class="cccg-picker-filter-wrap">
          <span class="visually-hidden">Filtrar componentes</span>
          <input type="search" class="cccg-picker-filter" placeholder="Buscar por nome ou código…" autocomplete="off" />
        </label>
        <div class="cccg-picker-catalog">${catalogHtml}<p class="cccg-picker-no-results" hidden>Nenhum componente encontrado. Cadastre um fora do catálogo do PPC acima.</p></div>
      </div>
    `;

      dialogBody.dataset.cccgSlotId = slotId;

      const filterInput = dialogBody.querySelector('.cccg-picker-filter');
      const noResultsEl = dialogBody.querySelector('.cccg-picker-no-results');
      if (filterInput && restoreFilter) filterInput.value = restoreFilter;

      function applyCccgPickerFilter() {
        const q = normalizeSearchText(filterInput?.value.trim() || '');
        let anyVisible = false;
        dialogBody.querySelectorAll('.cccg-picker-item').forEach((el) => {
          const hay = el.getAttribute('data-cccg-search') || '';
          const show = !q || hay.includes(q);
          el.hidden = !show;
          if (show) anyVisible = true;
        });
        dialogBody.querySelectorAll('.cccg-picker-group').forEach((group) => {
          const visible = [...group.querySelectorAll('.cccg-picker-item')].some(
            (el) => !el.hidden
          );
          group.hidden = !visible;
        });
        if (noResultsEl) noResultsEl.hidden = !q || anyVisible;
      }

      filterInput?.addEventListener('input', applyCccgPickerFilter);
      filterInput?.addEventListener('search', applyCccgPickerFilter);
      applyCccgPickerFilter();

      const addForm = dialogBody.querySelector('#cccg-add-form');
      addForm?.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const fd = new FormData(addForm);
        const errorEl = addForm.querySelector('.cccg-add-form-error');
        const result = deps.addCustomCccg({
          nome: String(fd.get('nome') || ''),
          codigo: String(fd.get('codigo') || ''),
          ch: String(fd.get('ch') || ''),
          ementa: String(fd.get('ementa') || ''),
        });
        if (!result?.ok) {
          if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = result?.error || 'Não foi possível salvar.';
          }
          return;
        }
        toggleCccgPick(slotId, result.item.codigo, slotDisc);
        deps.render();
        openCccgPicker(slotDisc, returnFocusEl, { filterQuery: filterInput?.value || '' });
      });

      dialogEl.classList.add('open');
      dialogEl.removeAttribute('aria-hidden');
      dialogEl.removeAttribute('inert');
      dialogEl.setAttribute('aria-modal', 'true');
      dialogEl.setAttribute('aria-labelledby', 'dialog-title');
      dialogEl.setAttribute('role', 'dialog');

      focusTrap.bind(dialogEl);

      requestAnimationFrame(() => {
        if (showAddForm) {
          addForm?.querySelector('input[name="nome"]')?.focus();
        } else {
          filterInput?.focus();
        }
      });
    }

    function cardPrimaryAction(disc, card) {
      if (deps.isCccgSlot(disc)) openCccgPicker(disc, card);
      else deps.openDialog(disc, card);
    }

    function handleCccgPickerClick(ev) {
      if (!deps.dialogBody?.classList.contains('dialog-body--cccg-picker')) return;
      const slotId = deps.dialogBody.dataset.cccgSlotId;
      const slotDisc = deps.disciplines.find((d) => d.id === slotId);
      if (!slotDisc) return;
      const returnFocusEl = deps.uiState.lastFocusEl;
      const filterQuery = deps.dialogBody.querySelector('.cccg-picker-filter')?.value || '';

      const addOpen = ev.target.closest('[data-cccg-add-open]');
      if (addOpen) {
        ev.preventDefault();
        openCccgPicker(slotDisc, returnFocusEl, { showAddForm: true, filterQuery });
        return;
      }
      const addCancel = ev.target.closest('[data-cccg-add-cancel]');
      if (addCancel) {
        ev.preventDefault();
        openCccgPicker(slotDisc, returnFocusEl, { filterQuery });
        return;
      }

      const toggle = ev.target.closest('[data-cccg-toggle]');
      if (toggle && !toggle.disabled) {
        ev.preventDefault();
        toggleCccgPick(slotId, toggle.getAttribute('data-cccg-toggle'), slotDisc);
        deps.render();
        openCccgPicker(slotDisc, returnFocusEl, { filterQuery });
        return;
      }
      const removeBtn = ev.target.closest('[data-cccg-remove]');
      if (removeBtn) {
        ev.preventDefault();
        toggleCccgPick(slotId, removeBtn.getAttribute('data-cccg-remove'), slotDisc);
        deps.render();
        openCccgPicker(slotDisc, returnFocusEl, { filterQuery });
        return;
      }
      const deleteBtn = ev.target.closest('[data-cccg-delete-custom]');
      if (deleteBtn) {
        ev.preventDefault();
        const codigo = deleteBtn.getAttribute('data-cccg-delete-custom');
        const item = deps.cccgByCodigo.get(codigo);
        const label = item?.nome || codigo;
        if (!window.confirm(`Excluir o cadastro “${label}”? Ele sai da grade e deixa de contar nas horas.`)) {
          return;
        }
        deps.deleteCustomCccg(codigo);
        deps.render();
        openCccgPicker(slotDisc, returnFocusEl, { filterQuery });
        return;
      }
      const detailBtn = ev.target.closest('[data-cccg-detail]');
      if (detailBtn) {
        ev.preventDefault();
        const codigo = detailBtn.getAttribute('data-cccg-detail');
        const item = deps.cccgByCodigo.get(codigo);
        if (!item) return;
        deps.uiState.cccgPickerRestore = { slotDisc, returnFocusEl };
        deps.openDialog(cccgItemAsDisc(item), detailBtn);
      }
    }

    return {
      openCccgPicker,
      toggleCccgPick,
      handleCccgPickerClick,
      cccgSlotSummary,
      cccgItemAsDisc,
      cardPrimaryAction,
    };
  }

  root.GRADE_CCCG_PICKER = { createCccgPicker };
})(typeof globalThis !== 'undefined' ? globalThis : window);
