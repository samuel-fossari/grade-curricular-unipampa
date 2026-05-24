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

  function cardMatchesFilter(disc, disp, gradeStatusFilter, gradeSearchQuery) {
    if (gradeStatusFilter !== 'all' && disp !== gradeStatusFilter) return false;
    const q = gradeSearchQuery.trim().toLowerCase();
    if (!q) return true;
    const hay = `${disc.name} ${disc.codigo || ''} ${disc.id}`.toLowerCase();
    return hay.includes(q);
  }

  root.GRADE_SEARCH = {
    normalizeSearchText,
    cccgSearchKey,
    cardMatchesFilter,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
