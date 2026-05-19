#!/usr/bin/env node
import fs from 'fs';
import vm from 'vm';

const txtPath = process.argv[2] || '/home/sam/Downloads/Componentes Curriculares engenharia eletrica.txt';
const eePath = new URL('../js/cursos/ee.js', import.meta.url).pathname;

const txt = fs.readFileSync(txtPath, 'utf8');
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(eePath, 'utf8'), ctx);
const oldDiscs = ctx.window.GRADE_CURSO_CONFIG.disciplines;

const CCCG_PREREQS = {
  AL2036: { prereqs: [], specialMinCH: 1845 },
  AL0316: { prereqs: ['AL0307'] },
  AL2211: { prereqs: ['AL0431'] },
  AL0320: { prereqs: ['AL0315'] },
  AL2212: { prereqs: ['AL0421'] },
  AL2042: { prereqs: ['AL0005'] },
  AL0305: { prereqs: ['AL0430'] },
  AL2213: { prereqs: ['AL0445'] },
  AL2214: { prereqs: ['AL0430', 'AL0438'] },
  AL2215: { prereqs: ['AL0434', 'AL0058'] },
  AL2216: { prereqs: ['AL0056'] },
  AL2113: { prereqs: [], specialMinCH: 1845 },
  AL2148: { prereqs: [], specialMinCH: 1845 },
  AL2240: { prereqs: [], specialMinCH: 1845 },
  AL2241: { prereqs: [], specialMinCH: 1845 },
  AL0315: { prereqs: ['AL0307'] },
  AL5106: { prereqs: ['AL0430', 'AL0431'] },
  AL2217: { prereqs: ['AL0430', 'AL0438'] },
  AL0307: { prereqs: ['AL0429'] },
  AL2133: { prereqs: ['AL0419'] },
  AL2218: { prereqs: ['AL0419'] },
  AL2219: { prereqs: ['AL0431'] },
  AL2221: { prereqs: ['AL0435'] },
  AL2220: { prereqs: ['AL0434'] },
  AL2222: { prereqs: ['AL0414'] },
  AL2223: { prereqs: ['AL0438', 'AL0431'] },
  AL2224: { prereqs: ['AL0431'] },
  AL2124: { prereqs: ['AL0036'] },
  AL2144: { prereqs: [], specialMinCH: 1845 },
  AL2225: { prereqs: ['AL0414', 'AL0438'] },
  AL2226: { prereqs: ['AL0434'] },
  AL2051: { prereqs: [], specialMinCH: 1845 },
};

const CCCG_EMENTA =
  'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';

function parseIntField(label, block) {
  const m = block.match(new RegExp(label + ':\\s*(\\d+)\\s*horas', 'i'));
  return m ? parseInt(m[1], 10) : 0;
}

function normalizeText(s) {
  return s.replace(/\u00ad/g, '').replace(/\s+/g, ' ').trim();
}

function parseComponents(text) {
  const parts = text.split(/\n(?=[^\n]+\(AL[A-Z0-9]+\)\s*\n)/);
  const items = [];
  for (const part of parts) {
    const firstLine = part.split('\n')[0].trim();
    const codigoM = firstLine.match(/\(AL[A-Z0-9]+\)\s*$/);
    if (!codigoM) continue;
    const codigo = codigoM[0].slice(1, -1);
    const nome = normalizeText(firstLine.replace(/\s*\(AL[A-Z0-9]+\)\s*$/, ''));
    const ementaM = part.match(/Ementa:\s*\n([\s\S]*?)\nObjetivos:/);
    const objM = part.match(/Objetivos:\s*\n([\s\S]*?)(?=\nSão objetivos específicos|\n[A-ZÁÉÍÓÚ][^\n(]+\(AL|$)/);
    let objetivo = objM ? normalizeText(objM[1]) : '';
    if (!objetivo) {
      const specM = part.match(/Objetivos:\s*\n([\s\S]*?)(?=\n\n|\nComponentes|\n[A-ZÁÉÍÓÚ])/);
      objetivo = specM ? normalizeText(specM[1].split('\nSão objetivos')[0]) : '';
    }
    const ementa = ementaM ? normalizeText(ementaM[1]) : '';
    items.push({
      codigo,
      nome,
      ch: parseIntField('Total do Componente', part),
      ch_teo: parseIntField('Presencial Teórica', part),
      ch_prat: parseIntField('Presencial Prática', part),
      ch_ead_t: parseIntField('EaD Teórica', part),
      ch_ead_p: parseIntField('EaD Prática', part),
      ch_ext: parseIntField('Extensão', part),
      ementa,
      objetivo,
    });
  }
  return items;
}

const ccgSplit = txt.split('Componentes Curriculares Complementares de Graduação');
const ccgItems = parseComponents(ccgSplit[0].replace(/^[\s\S]*?\(CCGs\)\s*\n?/, ''));
const cccgItems = parseComponents(ccgSplit[1] || '');

if (ccgItems.length !== 57) console.warn('warn: expected 57 CCG, got', ccgItems.length);
if (cccgItems.length !== 32) console.warn('warn: expected 32 CCCG, got', cccgItems.length);

const ccgByCode = Object.fromEntries(ccgItems.map((i) => [i.codigo, i]));

const newDiscs = oldDiscs.map((d) => {
  if (d.codigo === '—') {
    return { ...d, ementa: CCCG_EMENTA };
  }
  const p = ccgByCode[d.codigo];
  if (!p) {
    console.warn('missing ppc data for', d.codigo, d.id);
    return d;
  }
  return {
    ...d,
    ch: `${p.ch}h`,
    ch_teo: p.ch_teo,
    ch_prat: p.ch_prat,
    ch_ead_t: p.ch_ead_t,
    ch_ead_p: p.ch_ead_p,
    ch_ext: p.ch_ext,
    ementa: p.ementa,
    objetivo: p.objetivo,
  };
});

function jsStr(s) {
  return JSON.stringify(s);
}

function formatDisc(d) {
  const lines = [
    '      {',
    `        id: ${jsStr(d.id)},`,
    `        name: ${jsStr(d.name)},`,
    `        sem: ${d.sem},`,
    `        cat: ${jsStr(d.cat)},`,
    `        prereqs: ${JSON.stringify(d.prereqs)},`,
    `        codigo: ${jsStr(d.codigo)},`,
    `        ch: ${jsStr(d.ch)},`,
    `        ch_teo: ${d.ch_teo},`,
    `        ch_prat: ${d.ch_prat},`,
    `        ch_ead_t: ${d.ch_ead_t},`,
    `        ch_ead_p: ${d.ch_ead_p},`,
    `        ch_ext: ${d.ch_ext},`,
    `        ementa: ${jsStr(d.ementa)},`,
    `        objetivo: ${jsStr(d.objetivo)},`,
  ];
  if (d.specialMinCH) lines.push(`        specialMinCH: ${d.specialMinCH},`);
  lines.push('      },');
  return lines.join('\n');
}

function formatCccg(item) {
  const pr = CCCG_PREREQS[item.codigo] || { prereqs: [] };
  const lines = [
    '      {',
    `        codigo: ${jsStr(item.codigo)},`,
    `        nome: ${jsStr(item.nome)},`,
    `        cat: 'ee_cccg',`,
    `        ch: ${item.ch},`,
    `        ch_teo: ${item.ch_teo},`,
    `        ch_prat: ${item.ch_prat},`,
    `        ch_ead_t: ${item.ch_ead_t},`,
    `        ch_ead_p: ${item.ch_ead_p},`,
    `        ch_ext: ${item.ch_ext},`,
    `        prereqs: ${JSON.stringify(pr.prereqs || [])},`,
  ];
  if (pr.specialMinCH) lines.push(`        specialMinCH: ${pr.specialMinCH},`);
  lines.push(`        ementa: ${jsStr(item.ementa)},`);
  lines.push(`        objetivo: ${jsStr(item.objetivo)},`);
  lines.push('      },');
  return lines.join('\n');
}

const semGroups = new Map();
for (const d of oldDiscs) {
  if (!semGroups.has(d.sem)) semGroups.set(d.sem, []);
  semGroups.get(d.sem).push(d);
}

let discOut = '    disciplines: [\n';
for (const sem of [...semGroups.keys()].sort((a, b) => a - b)) {
  discOut += `      // ${sem}º SEM\n`;
  for (const d of semGroups.get(sem)) {
    const enriched = newDiscs.find((x) => x.id === d.id);
    discOut += formatDisc(enriched) + '\n';
  }
}
discOut += '    ],';

let cccgOut =
  '    cccgSemLimits: {\n      6: 60,\n      7: 60,\n      8: 60,\n    },\n    cccgs: [\n';
for (const item of cccgItems) {
  if (!CCCG_PREREQS[item.codigo]) console.warn('no prereq map for', item.codigo);
  cccgOut += formatCccg(item) + '\n';
}
cccgOut += '    ],';

let acev = 0;
for (const d of newDiscs) {
  if (!/^cccg/i.test(d.id)) acev += d.ch_ext || 0;
}
console.log('ACEV hours:', acev);

const out = `/**
 * Dados da grade — EE (UNIPAMPA Alegrete).
 * PPC 2023: CCGs, CCCGs, ementas e carga horária conforme ementário oficial.
 */
(function () {
'use strict';

  window.GRADE_CURSO_CONFIG = {
    sigla: 'ee',
    title: "Grade Curricular \\u2014 Engenharia El\\u00e9trica",
    subtitle: "UNIPAMPA \\u00b7 Campus Alegrete \\u00b7 PPC 2023",
    maxSemesters: 10,
${discOut}
    /** Plano de integralização (PPC 2023 — Tabela 1). */
    chIntegralization: {
      total: 3950,
      buckets: [
        {
          id: 'ccg',
          shortLabel: 'CCG',
          label: 'Componentes curriculares de graduação obrigatórios (CCGs)',
          required: 3510,
          source: 'mandatory',
        },
        {
          id: 'cccg',
          shortLabel: 'CCCG',
          label: 'Componentes curriculares complementares de graduação (CCCGs)',
          required: 180,
          source: 'cccg',
        },
        {
          id: 'acev',
          shortLabel: 'ACEV',
          label: 'Atividades curriculares de extensão vinculadas (ACEV)',
          required: 315,
          source: 'aceMandatory',
          countsTowardTotal: false,
        },
        {
          id: 'acee',
          shortLabel: 'ACEE',
          label: 'Atividades curriculares de extensão específicas (ACEE)',
          required: 80,
          manual: true,
        },
        {
          id: 'acg',
          shortLabel: 'ACG',
          label: 'Atividades complementares de graduação (ACGs)',
          required: 180,
          manual: true,
        },
      ],
    },
    /** Carga horária máxima de CCCG por semestre (PPC 2023). */
${cccgOut}
  };
})();
`;

fs.writeFileSync(eePath, out);
console.log('Wrote', eePath);
