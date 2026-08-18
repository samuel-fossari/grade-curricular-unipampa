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
 * Cores: `catColor()` usa paletas dedicadas por curso (`CAT_PALETTES`) quando existem;
 * caso contrário lê `--cat-*` em theme-tokens.css. ES ainda expõe tokens curtos (`--cat-math`, …) no CSS.
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
    cccg_custom: 'Fora do catálogo PPC',

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
    cccg_custom: '--cat-nd',
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

  const THEME_PALETTE_KEY = Object.freeze({
    light: 'light',
    sepia: 'sepia',
    dark: 'dark',
    ocean: 'dark',
    nord: 'dark',
    contrast: 'contrast',
    kitty: 'kitty',
    cyberpunk: 'cyberpunk',
    miku: 'miku',
  });

  const ENG_PALETTE_SLOTS = Object.freeze(['basico', 'especifico', 'nao_definido', '__cccg__']);

  /**
   * Paletas por curso (índice = ordem em CAT_ORDER_* / ENG_PALETTE_SLOTS).
   * Manter em sync com `--cat-*` em theme-tokens.css.
   */
  const CAT_PALETTES = Object.freeze({
    es: Object.freeze({
      light: ['#4f46e5', '#ea580c', '#059669', '#ca8a04', '#64748b'],
      sepia: ['#5a68b8', '#b86820', '#4a8868', '#a88820', '#887878'],
      dark: ['#818cf8', '#fb923c', '#34d399', '#fbbf24', '#94a3b8'],
      kitty: ['#a5b4fc', '#fb923c', '#6ee7b7', '#fcd34d', '#cc6080'],
      cyberpunk: ['#00e5ff', '#ffe600', '#39ff14', '#bf6fff', '#ff2d78'],
      miku: ['#00c8d4', '#e0f8ff', '#5cff6e', '#6e63f0', '#ff7abd'],
      contrast: ['#6699ff', '#ff9900', '#00ff00', '#ffff00', '#cccccc'],
    }),
    cc: Object.freeze({
      light: ['#16a34a', '#0284c7', '#db2777', '#a16207', '#7c3aed', '#64748b'],
      sepia: ['#4a8868', '#4a7898', '#a85878', '#887030', '#7858a0', '#787878'],
      dark: ['#22c55e', '#38bdf8', '#f472b6', '#eab308', '#a78bfa', '#94a3b8'],
      kitty: ['#bbf7d0', '#7dd3fc', '#f9a8d4', '#fde68a', '#d8b4fe', '#cc6080'],
      cyberpunk: ['#39ff14', '#00e5ff', '#ff2d78', '#ffe600', '#ff7a00', '#7b2fff'],
      miku: ['#5cff6e', '#00e8f5', '#ff4da6', '#6e63f0', '#8b5cf6', '#b8c8ff'],
      contrast: ['#00ff00', '#00ffff', '#ff6666', '#ffff00', '#ff9900', '#cc99ff'],
    }),
    et: Object.freeze({
      light: ['#7c3aed', '#1d4ed8', '#dc2626', '#047857', '#c2410c', '#52525b'],
      sepia: ['#7858a0', '#3a5890', '#a84040', '#3a6858', '#a05828', '#585858'],
      dark: ['#a78bfa', '#60a5fa', '#f87171', '#34d399', '#fb923c', '#94a3b8'],
      kitty: ['#e9d5ff', '#93c5fd', '#fca5a5', '#86efac', '#fdba74', '#cc6080'],
      cyberpunk: ['#ffe600', '#00e5ff', '#ff2d78', '#39ff14', '#ff7a00', '#5b8cff'],
      miku: ['#00e8f5', '#5c5ce6', '#ff4da6', '#5cff6e', '#ff7abd', '#c8fff0'],
      contrast: ['#cc99ff', '#6699ff', '#ff6666', '#66ff66', '#ff9966', '#cccccc'],
    }),
    eng: Object.freeze({
      light: ['#38bdf8', '#818cf8', '#94a3b8', '#c084fc'],
      sepia: ['#5a88b0', '#8878b0', '#888888', '#a080c0'],
      dark: ['#38bdf8', '#a78bfa', '#94a3b8', '#c084fc'],
      kitty: ['#bae6fd', '#d8b4fe', '#cc6080', '#e9d5ff'],
      cyberpunk: ['#ffe600', '#ff2d78', '#00e5ff', '#7b2fff'],
      miku: ['#00e8f5', '#ff4da6', '#5cff6e', '#e0f8ff'],
      contrast: ['#00ffff', '#ff00ff', '#ffff00', '#cc99ff'],
    }),
    ee: Object.freeze({
      light: [
      '#60a5fa',
      '#34d399',
      '#facc15',
      '#c084fc',
      '#a8a29e',
      '#f472b6',
      '#fb923c',
      '#2dd4bf',
      '#ef4444',
      '#818cf8',
      '#4ade80',
      '#2563eb',
      '#f97316',
      '#e9d5ff',
      ],
      sepia: [
      '#5a8fc4',
      '#5a9a6a',
      '#c9a832',
      '#9a7ab8',
      '#8a8078',
      '#c87898',
      '#c89050',
      '#4a9a82',
      '#c05858',
      '#6888b8',
      '#58a068',
      '#3a68a0',
      '#b07040',
      '#b8a8d0',
      ],
      dark: [
      '#38bdf8',
      '#22d3ee',
      '#2dd4bf',
      '#34d399',
      '#a3e635',
      '#facc15',
      '#fb923c',
      '#f472b6',
      '#e879f9',
      '#a78bfa',
      '#818cf8',
      '#60a5fa',
      '#f87171',
      '#c4b5fd',
      ],
      kitty: [
      '#93c5fd',
      '#86efac',
      '#fde047',
      '#d8b4fe',
      '#d6d3d1',
      '#f9a8d4',
      '#fdba74',
      '#5eead4',
      '#fca5a5',
      '#a5b4fc',
      '#bbf7d0',
      '#7dd3fc',
      '#fcd34d',
      '#e9d5ff',
      ],
      cyberpunk: [
      '#00e5ff',
      '#00ffc8',
      '#39ff14',
      '#a8ff00',
      '#ffe600',
      '#ffb800',
      '#ff7a00',
      '#ff2d78',
      '#ff1493',
      '#e040fb',
      '#bf6fff',
      '#5b8cff',
      '#ff4d4d',
      '#7b2fff',
      ],
      miku: [
      '#00e8f5',
      '#6e63f0',
      '#00c8d4',
      '#4de8e0',
      '#5cff6e',
      '#8aff9a',
      '#b8ffd0',
      '#ff4da6',
      '#ff7abd',
      '#c884ff',
      '#8b5cf6',
      '#5c5ce6',
      '#b8c8ff',
      '#c8fff0',
      ],
      contrast: [
      '#99ccff',
      '#99ff99',
      '#ffff66',
      '#cc99ff',
      '#cccccc',
      '#ff99cc',
      '#ffcc99',
      '#66ffcc',
      '#ff6666',
      '#6699ff',
      '#66ff66',
      '#3366ff',
      '#ff9966',
      '#ccccff',
      ],
    }),
  });

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

  function resolvePaletteThemeKey() {
    const t = document.documentElement.getAttribute('data-theme') || 'light';
    return THEME_PALETTE_KEY[t] || 'light';
  }

  /** @param {readonly string[]} order @param {string} cat */
  function colorFromOrder(order, cat, palettes) {
    const idx = order.indexOf(cat);
    if (idx < 0) return null;
    const key = resolvePaletteThemeKey();
    const palette = palettes[key] || palettes.light;
    return palette[idx] || null;
  }

  /** @param {string} cat */
  function dedicatedPaletteColor(cat) {
    const c = String(cat);
    if (c.startsWith('ee_')) {
      return colorFromOrder(CAT_ORDER_EE, c, CAT_PALETTES.ee);
    }
    if (c.startsWith('es_')) {
      return colorFromOrder(CAT_ORDER_ES, c, CAT_PALETTES.es);
    }
    if (c.startsWith('cc_')) {
      return colorFromOrder(CAT_ORDER_CC, c, CAT_PALETTES.cc);
    }
    if (c.startsWith('et_')) {
      return colorFromOrder(CAT_ORDER_ET, c, CAT_PALETTES.et);
    }
    if (c === 'basico' || c === 'especifico' || c === 'nao_definido') {
      return colorFromOrder(ENG_PALETTE_SLOTS, c, CAT_PALETTES.eng);
    }
    if (c.endsWith('_cccg')) {
      return colorFromOrder(ENG_PALETTE_SLOTS, '__cccg__', CAT_PALETTES.eng);
    }
    return null;
  }

  function catColor(cat) {
    const dedicated = dedicatedPaletteColor(cat);
    if (dedicated) return dedicated;
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
    CAT_ORDER_EE,
    CAT_PALETTES,
    THEME_PALETTE_KEY,
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
