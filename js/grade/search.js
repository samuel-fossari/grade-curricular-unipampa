/**
 * Busca e filtros da grade (toolbar e seletor CCCG).
 */
(function (root) {
  'use strict';

  function normalizeSearchText(raw) {
    return String(raw || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function cccgSearchKey(item) {
    return normalizeSearchText(
      `${item.nome || ''} ${item.codigo || ''} ${item.ementa || ''}`
    );
  }

  /**
   * Decide se um cartão da grade passa pelo filtro de status + busca textual.
   * A busca é insensível a acentos e maiúsculas (mesma normalização do seletor CCCG).
   * @param {object} disc - Disciplina normalizada.
   * @param {string} disp - Estado exibido (`done` | `in_progress` | `ready` | `locked`).
   * @param {string} gradeStatusFilter - Filtro de status ativo ou `'all'`.
   * @param {string} gradeSearchQuery - Texto digitado na busca.
   * @returns {boolean}
   */
  function cardMatchesFilter(disc, disp, gradeStatusFilter, gradeSearchQuery) {
    if (gradeStatusFilter !== 'all' && disp !== gradeStatusFilter) return false;
    const q = normalizeSearchText(gradeSearchQuery).trim();
    if (!q) return true;
    const hay = normalizeSearchText(
      `${disc.name || ''} ${disc.codigo || ''} ${disc.id || ''}`
    );
    return hay.includes(q);
  }

  root.GRADE_SEARCH = {
    normalizeSearchText,
    cccgSearchKey,
    cardMatchesFilter,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
