/**
 * @file categories.js
 * @description Catálogo de categorias PPC: rótulos, cores (CSS) e ordem na legenda.
 *
 * Camadas (manter sincronizadas):
 * 1. `js/cursos/*.js` — campo `cat` nas disciplinas (quando definido).
 * 2. `js/grade/normalize.js` — preenche `cat` vazio (engenharias → basico/especifico; CCCG → CCCG_SLOT_CAT).
 * 3. Este arquivo — nomes, ordem da legenda, resolução de cor.
 * 4. `css/theme-tokens.css` — tokens `--cat-*` por tema (claro/escuro/contrasto/premium).
 *
 * Cores: `catColor()` lê variável CSS. Chaves ES usam tokens curtos (`--cat-math`, …) via CAT_CSS_VAR.
 */
(function (root) {
  'use strict';

  /* ==========================================================================
   * Rótulos (todas as chaves `cat` possíveis no site)
   * ========================================================================== */

  const CAT_NAMES = {
    nao_definido: 'Não categorizado',

    /* Engenharias genéricas (EC; EM/EA via normalize quando `cat` ausente) */
    basico: 'Ciclo básico (engenharias)',
    especifico: 'Disciplinas específicas (engenharias)',

    /* Engenharia de Software */
    es_matematica: 'Fundamentos da Matemática',
    es_computacao: 'Fundamentos da Computação',
    es_software: 'Engenharia de Software',
    es_contexto_profissional: 'Contexto Profissional',
    es_cccg: 'CCCG / Não categorizado',

    /* Ciência da Computação */
    cc_fundamentos: 'Fundamentos da Computação',
    cc_tecnologias: 'Tecnologias da Computação',
    cc_matematica: 'Matemática',
    cc_contexto: 'Contexto Social e Profissional',
    cc_tcc: 'Trabalho de Conclusão de Curso',
    cc_cccg: 'CCCG',

    /* Engenharia Elétrica — núcleos da matriz oficial */
    ee_matematica: 'Matemática',
    ee_fisico_quimica: 'Físico-química',
    ee_eletrotecnica: 'Eletrotécnica',
    ee_logica_programacao: 'Lógica e Programação',
    ee_sistemas_digitais: 'Sistemas Digitais',
    ee_circuitos_eletronicos: 'Circuitos Eletrônicos',
    ee_telecomunicacoes: 'Telecomunicações',
    ee_conversao_energia: 'Conversão de Energia',
    ee_sistemas_eletricos_potencia: 'Sistemas Elétricos de Potência',
    ee_controle_eletronica_potencia: 'Controle e Eletrônica de Potência',
    ee_gestao: 'Gestão',
    ee_multidisciplinares: 'Multidisciplinares',
    ee_relacoes_sociedade: 'Relações com a Sociedade',
    ee_cccg: 'CCCGs (núcleo depende do componente curricular)',

    /* CCCG / núcleos por curso */
    ea_cccg: 'CCCG',
    em_cccg: 'CCCG',
    ec_cccg: 'CCCG',

    /* Engenharia de Telecomunicações — núcleos + CCCG (slots usam et_outras, ver normalize.js) */
    et_basico: 'Núcleo Básico',
    et_eletromag: 'Núcleo Eletromagnetismo Aplicado',
    et_sinais: 'Núcleo Sinais e Sistemas',
    et_eletronica: 'Núcleo Eletrônica',
    et_computacao: 'Núcleo Computação',
    et_outras: 'Outras Áreas / CCCG',
  };

  /** @type {readonly string[]} */
  const CAT_KEYS = Object.freeze(Object.keys(CAT_NAMES));

  /* ==========================================================================
   * Token CSS por chave (padrão: --cat-{chave com _ → -})
   * Exceções: ES + engenharias genéricas usam nomes curtos em theme-tokens.css
   * ========================================================================== */

  const CAT_CSS_VAR = {
    nao_definido: '--cat-nd',
    basico: '--cat-basico',
    especifico: '--cat-especifico',
    es_matematica: '--cat-math',
    es_computacao: '--cat-comp',
    es_software: '--cat-sw',
    es_contexto_profissional: '--cat-prof',
    es_cccg: '--cat-nd',
  };

  const FALLBACK_CAT_COLOR = '#64748b';

  /* ==========================================================================
   * Ordem na legenda por sigla do curso
   * ========================================================================== */

  const CAT_ORDER_ES = [
    'es_computacao',
    'es_matematica',
    'es_software',
    'es_contexto_profissional',
    'es_cccg',
  ];

  const CAT_ORDER_CC = [
    'cc_fundamentos',
    'cc_tecnologias',
    'cc_matematica',
    'cc_contexto',
    'cc_tcc',
    'cc_cccg',
  ];

  const CAT_ORDER_EE = [
    'ee_matematica',
    'ee_fisico_quimica',
    'ee_eletrotecnica',
    'ee_logica_programacao',
    'ee_sistemas_digitais',
    'ee_circuitos_eletronicos',
    'ee_telecomunicacoes',
    'ee_conversao_energia',
    'ee_sistemas_eletricos_potencia',
    'ee_controle_eletronica_potencia',
    'ee_gestao',
    'ee_multidisciplinares',
    'ee_relacoes_sociedade',
    'ee_cccg',
  ];

  const CAT_ORDER_ET = [
    'et_basico',
    'et_eletromag',
    'et_sinais',
    'et_eletronica',
    'et_computacao',
    'et_outras',
  ];

  const CAT_ORDER_ENG_GENERIC = ['basico', 'especifico', 'nao_definido'];

  const CAT_ORDER_EC = [...CAT_ORDER_ENG_GENERIC, 'ec_cccg'];
  const CAT_ORDER_EM = [...CAT_ORDER_ENG_GENERIC, 'em_cccg'];
  const CAT_ORDER_EA = [...CAT_ORDER_ENG_GENERIC, 'ea_cccg'];

  /** @type {Record<string, readonly string[]>} */
  const CAT_ORDER_BY_SIGLA = Object.freeze({
    es: CAT_ORDER_ES,
    cc: CAT_ORDER_CC,
    ee: CAT_ORDER_EE,
    et: CAT_ORDER_ET,
    ec: CAT_ORDER_EC,
    em: CAT_ORDER_EM,
    ea: CAT_ORDER_EA,
  });

  /* ==========================================================================
   * API
   * ========================================================================== */

  function catCssVarName(cat) {
    return '--cat-' + String(cat).replace(/_/g, '-');
  }

  function resolveCatCssVar(cat) {
    return CAT_CSS_VAR[cat] || catCssVarName(cat);
  }

  function catColor(cat) {
    const varName = resolveCatCssVar(cat);
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return val || FALLBACK_CAT_COLOR;
  }

  function catLabel(cat) {
    return CAT_NAMES[cat] || cat;
  }

  function getCatOrder(sigla) {
    const key = String(sigla || '').toLowerCase();
    return CAT_ORDER_BY_SIGLA[key] || CAT_ORDER_ENG_GENERIC;
  }

  function sortCategories(sigla, cats) {
    const order = getCatOrder(sigla);
    return [...cats].sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }

  function cccgPickerCategories(sigla, catalog) {
    const cats = [...new Set(catalog.map((item) => item.cat).filter(Boolean))];
    return sortCategories(sigla, cats);
  }

  /**
   * Diagnóstico: chaves usadas nas grades que faltam em CAT_NAMES ou em theme-tokens.
   * @param {string[]} usedCats
   * @returns {{ unknownKeys: string[], missingCss: string[] }}
   */
  function auditCategoryKeys(usedCats) {
    const unknownKeys = [];
    const missingCss = [];
    for (const cat of usedCats) {
      if (!CAT_NAMES[cat]) unknownKeys.push(cat);
      else if (!catColor(cat) || catColor(cat) === FALLBACK_CAT_COLOR) {
        const v = getComputedStyle(document.documentElement)
          .getPropertyValue(resolveCatCssVar(cat))
          .trim();
        if (!v) missingCss.push(cat);
      }
    }
    return { unknownKeys, missingCss };
  }

  function renderCategoryLegend({ sigla, disciplines, escapeHtml }) {
    const legendEl = document.querySelector(
      '.status-legend--compact:not(.horarios-legend)'
    );
    if (!legendEl) return;

    const present = [...new Set(disciplines.map((d) => d.cat).filter(Boolean))];
    const cats = sortCategories(sigla, present);

    legendEl.classList.add('category-legend');
    legendEl.setAttribute('aria-label', 'Legenda de categorias');
    legendEl.innerHTML = cats
      .map((cat, i) => {
        const bg = catColor(cat);
        const name = catLabel(cat);
        const item = `<span class="stl-item"><span class="stl-dot" style="background:${bg}"></span>${escapeHtml(
          name
        )}</span>`;
        const sep = i < cats.length - 1 ? '<span class="stl-sep">·</span>' : '';
        return item + sep;
      })
      .join('');
  }

  root.GRADE_CATEGORIES = {
    CAT_NAMES,
    CAT_KEYS,
    CAT_CSS_VAR,
    CAT_ORDER_BY_SIGLA,
    catCssVarName,
    resolveCatCssVar,
    getCatOrder,
    sortCategories,
    cccgPickerCategories,
    catColor,
    catLabel,
    auditCategoryKeys,
    renderCategoryLegend,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
