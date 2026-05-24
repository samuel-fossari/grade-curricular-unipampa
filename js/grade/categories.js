/**
 * Categorias do PPC — nomes, cores e ordem na legenda.
 */
(function (root) {
  'use strict';

  const CAT_NAMES = {
    nao_definido: 'Não categorizado',

    // Engenharias
    basico: 'Ciclo básico (engenharias)',
    especifico: 'Disciplinas específicas (engenharias)',

    // Engenharia de Software (PPC)
    es_matematica: 'Fundamentos da Matemática',
    es_computacao: 'Fundamentos da Computação',
    es_software: 'Engenharia de Software',
    es_contexto_profissional: 'Contexto Profissional',
    es_cccg: 'CCCG / Não categorizado',

    // Ciência da Computação (PPC)
    cc_fundamentos: 'Fundamentos da Computação',
    cc_tecnologias: 'Tecnologias da Computação',
    cc_matematica: 'Matemática',
    cc_contexto: 'Contexto Social e Profissional',
    cc_tcc: 'Trabalho de Conclusão de Curso',
    cc_cccg: 'CCCG',

    // Engenharia Elétrica — núcleos da matriz oficial
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

    // Demais cursos — CCCG / núcleos
    ea_cccg: 'CCCG',
    em_cccg: 'CCCG',
    ec_cccg: 'CCCG',
    et_basico: 'Núcleo Básico',
    et_eletromag: 'Núcleo Eletromagnetismo Aplicado',
    et_sinais: 'Núcleo Sinais e Sistemas',
    et_eletronica: 'Núcleo Eletrônica',
    et_computacao: 'Núcleo Computação',
    et_outras: 'Outras Áreas',
    et_cccg: 'CCCG',
  };

  const CAT_COLORS = {
    nao_definido: 'var(--cat-nd)',

    // Engenharias
    basico: 'var(--cat-basico)',
    especifico: 'var(--cat-especifico)',

    // Engenharia de Software (PPC)
    es_matematica: 'var(--cat-math)',
    es_computacao: 'var(--cat-comp)',
    es_software: 'var(--cat-sw)',
    es_contexto_profissional: 'var(--cat-prof)',
    es_cccg: 'var(--cat-nd)',

    // Ciência da Computação (PPC)
    cc_fundamentos: '#22c55e',
    cc_tecnologias: '#38bdf8',
    cc_matematica: '#fb7185',
    cc_contexto: '#eab308',
    cc_tcc: '#f97316',
    cc_cccg: '#a78bfa',

    // Engenharia Elétrica — núcleos da matriz oficial
    ee_matematica: '#bfdbfe',
    ee_fisico_quimica: '#86efac',
    ee_eletrotecnica: '#fde047',
    ee_logica_programacao: '#d8b4fe',
    ee_sistemas_digitais: '#d6cfc4',
    ee_circuitos_eletronicos: '#f9a8d4',
    ee_telecomunicacoes: '#fdba74',
    ee_conversao_energia: '#6ee7b7',
    ee_sistemas_eletricos_potencia: '#f87171',
    ee_controle_eletronica_potencia: '#60a5fa',
    ee_gestao: '#4ade80',
    ee_multidisciplinares: '#1d4ed8',
    ee_relacoes_sociedade: '#fb923c',
    ee_cccg: '#ede9fe',

    // Demais cursos — CCCG / núcleos
    ea_cccg: '#ede9fe',
    em_cccg: '#ede9fe',
    ec_cccg: '#c084fc',
    et_basico: '#9333ea',
    et_eletromag: '#0066ff',
    et_sinais: '#ff1744',
    et_eletronica: '#00c853',
    et_computacao: '#ff6d00',
    et_outras: '#546e7a',
    et_cccg: '#c084fc',
  };

  /* ------------------------------------------------------------------------
   * Ordem das categorias na legenda (por curso)
   * ------------------------------------------------------------------------ */

  const ES_CAT_ORDER = [
    'es_computacao',
    'es_matematica',
    'es_software',
    'es_contexto_profissional',
    'es_cccg',
  ];

  const CC_CAT_ORDER = [
    'cc_fundamentos',
    'cc_tecnologias',
    'cc_matematica',
    'cc_contexto',
    'cc_tcc',
    'cc_cccg',
  ];

  const DEFAULT_CAT_ORDER = [
    'basico',
    'especifico',
    'nao_definido',
    ...ES_CAT_ORDER,
    ...CC_CAT_ORDER,
  ];

  const ET_CAT_ORDER = [
    'et_basico',
    'et_eletromag',
    'et_sinais',
    'et_eletronica',
    'et_computacao',
    'et_outras',
  ];

  const EE_CAT_ORDER = [
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
  function getCatOrder(sigla) {
    if (sigla === 'ee') return EE_CAT_ORDER;
    if (sigla === 'et') return ET_CAT_ORDER;
    if (sigla === 'es') return ES_CAT_ORDER;
    if (sigla === 'cc') return CC_CAT_ORDER;
    return DEFAULT_CAT_ORDER;
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

  function catColor(cat) {
    return CAT_COLORS[cat] || '#64748b';
  }

  function catLabel(cat) {
    return CAT_NAMES[cat] || cat;
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
    CAT_COLORS,
    getCatOrder,
    sortCategories,
    cccgPickerCategories,
    catColor,
    catLabel,
    renderCategoryLegend,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
