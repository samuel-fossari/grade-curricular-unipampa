#!/usr/bin/env node
/**
 * Gera js/cursos/em.js a partir do ementário PPC (scripts/em-ppc.txt).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PPC_PATH = path.join(__dirname, 'em-ppc.txt');
const OUT_PATH = path.join(ROOT, 'js/cursos/em.js');

/** Metadados fixos da matriz (semestre, id, codigo, CH detalhada). */
const MATRIX = [
  { id: 'calc1', codigo: 'AL0363', sem: 1, ch: 90, ch_teo: 90, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'geom', codigo: 'AL0002', sem: 1, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis1', codigo: 'AL0003', sem: 1, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'intro_em', codigo: 'AL0465', sem: 1, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dt', codigo: 'AL0007', sem: 1, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'quim', codigo: 'AL0366', sem: 1, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'alg', codigo: 'AL0005', sem: 1, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eletrot', codigo: 'AL0006', sem: 2, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'alg_lin', codigo: 'AL0009', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc2', codigo: 'AL0010', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis2', codigo: 'AL0011', sem: 2, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dm1', codigo: 'AL0033', sem: 2, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mat_eng', codigo: 'AL0175', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mec_ger', codigo: 'AL0015', sem: 2, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'termo1', codigo: 'AL0075', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dm_comp', codigo: 'AL0192', sem: 3, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eq_dif1', codigo: 'AL0019', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc3', codigo: 'AL0020', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis3', codigo: 'AL0021', sem: 3, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'res_mat1', codigo: 'AL0375', sem: 3, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ofic', codigo: 'AL0474', sem: 3, ch: 30, ch_teo: 0, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 15, specialMinCH: 300 },
  { id: 'probest', codigo: 'AL0022', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'metro', codigo: 'AL0034', sem: 4, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc_num', codigo: 'AL0037', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'maq_op', codigo: 'AL0053', sem: 4, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'lab_met', codigo: 'AL0054', sem: 4, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mec_flu', codigo: 'AL0078', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'res_mat2', codigo: 'AL0381', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'termo_ap', codigo: 'AL0466', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dinam', codigo: 'AL0055', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mecan', codigo: 'AL0074', sem: 5, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'usinag', codigo: 'AL0076', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'maq_flu', codigo: 'AL0136', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'trat_term', codigo: 'AL0176', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'frat', codigo: 'AL0467', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'transf', codigo: 'AL0098', sem: 5, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'conform', codigo: 'AL0118', sem: 6, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'vibr', codigo: 'AL0194', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sist_prod', codigo: 'AL0196', sem: 6, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'maq_el', codigo: 'AL0221', sem: 6, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eng_eco', codigo: 'AL0380', sem: 6, ch: 45, ch_teo: 15, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'refrig', codigo: 'AL0471', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'elem_maq1', codigo: 'AL0096', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'elem_maq2', codigo: 'AL0117', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'hid_pneu', codigo: 'AL0099', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'cam', codigo: 'AL0468', sem: 7, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sold', codigo: 'AL0469', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'met_proj', codigo: 'AL0470', sem: 7, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'leg_et', codigo: 'AL0142', sem: 8, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ctrl_mec', codigo: 'AL0215', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'adm', codigo: 'AL0394', sem: 8, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fundicao', codigo: 'AL0472', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_int1', codigo: 'AL0473', sem: 8, ch: 150, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 150 },
  { id: 'gest_qual', codigo: 'AL0116', sem: 9, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'tcc1', codigo: 'AL0241', sem: 9, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, specialMinCH: 2400 },
  { id: 'gest_amb', codigo: 'AL0390', sem: 9, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_int2', codigo: 'AL0475', sem: 9, ch: 150, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 150 },
  { id: 'seg_trab', codigo: 'AL0368', sem: 9, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'estagio', codigo: 'AL0242', sem: 10, ch: 300, ch_teo: 0, ch_prat: 300, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, specialMinCH: 3330 },
  { id: 'tcc2', codigo: 'AL0159', sem: 10, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
];

const PREREQS = {
  calc2: ['calc1'],
  fis2: ['calc1'],
  dm1: ['dt'],
  mat_eng: ['quim'],
  mec_ger: ['geom', 'fis1'],
  termo1: ['calc2', 'fis2'],
  dm_comp: ['dm1'],
  eq_dif1: ['alg_lin', 'calc2'],
  calc3: ['calc2'],
  fis3: ['calc2'],
  res_mat1: ['mec_ger'],
  ofic: [],
  probest: ['calc2'],
  metro: ['dm1'],
  calc_num: ['calc2', 'alg'],
  maq_op: ['dm1'],
  lab_met: ['mat_eng'],
  mec_flu: ['fis2', 'eq_dif1'],
  res_mat2: ['res_mat1'],
  termo_ap: ['termo1'],
  dinam: ['mec_ger'],
  mecan: ['mec_ger', 'calc2'],
  usinag: ['maq_op', 'mat_eng'],
  maq_flu: ['mec_flu'],
  trat_term: ['lab_met'],
  frat: ['res_mat2'],
  transf: ['mec_flu', 'calc3'],
  conform: ['res_mat1', 'trat_term'],
  vibr: ['dinam', 'eq_dif1'],
  sist_prod: ['maq_op'],
  maq_el: ['eletrot', 'fis3'],
  eng_eco: ['probest'],
  refrig: ['termo_ap', 'transf'],
  elem_maq1: ['frat', 'trat_term'],
  elem_maq2: ['res_mat2'],
  hid_pneu: ['mec_flu', 'maq_el'],
  cam: ['dm_comp', 'usinag'],
  sold: ['trat_term'],
  met_proj: ['conform'],
  leg_et: ['intro_em'],
  ctrl_mec: ['vibr'],
  adm: ['eng_eco'],
  fundicao: ['trat_term'],
  proj_int1: ['met_proj', 'elem_maq2'],
  gest_qual: ['metro', 'sist_prod'],
  tcc1: [],
  gest_amb: [],
  proj_int2: ['proj_int1'],
  seg_trab: [],
  estagio: [],
  tcc2: ['tcc1'],
};

const CCCG_MATRIX = [
  { codigo: 'AL0056', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['fis2'] },
  { codigo: 'AL2072', ch: 45, ch_teo: 15, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['res_mat2'] },
  { codigo: 'AL2121', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['dinam', 'elem_maq2'] },
  { codigo: 'AL2190', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['maq_flu', 'hid_pneu'] },
  { codigo: 'AL2245', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['conform', 'dm_comp'] },
  { codigo: 'AL2073', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['lab_met'] },
  { codigo: 'AL2074', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['mat_eng'] },
  { codigo: 'AL2153', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['trat_term'] },
  { codigo: 'AL2154', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['lab_met'] },
  { codigo: 'AL2043', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['alg_lin', 'calc2'] },
  { codigo: 'AL0024', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['calc2'] },
  { codigo: 'AL2115', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['ctrl_mec'] },
  { codigo: 'AL0119', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['sist_prod', 'eq_dif1'] },
  { codigo: 'AL0036', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['eq_dif1'] },
  { codigo: 'AL2062', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['alg'] },
  { codigo: 'AL2113', ch: 60, ch_teo: 15, ch_prat: 45, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2148', ch: 60, ch_teo: 15, ch_prat: 45, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['AL2113'] },
  { codigo: 'AL2144', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2051', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2090', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0486', ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [],
    fallback: {
      name: 'Metodologia Científica',
      ementa: 'Delineamento da pesquisa científica. Redação, apresentação e defesa do trabalho científico. Estrutura do trabalho científico.',
      objetivo: 'Aprender a elaborar e apresentar trabalhos científicos, tais como projeto de pesquisa, artigos e trabalho de conclusão de curso.',
    },
  },
  { codigo: 'AL2240', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2241', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2227', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 30, ch_ead_p: 30, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2232', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 30, ch_ead_p: 30, ch_ext: 0, prereqs: [] },
];

function esc(s) {
  return String(s || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r\n/g, '\n')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePpc(text) {
  const byCode = new Map();
  const blocks = text.split(/\n(?=[A-Za-zÀ-ú0-9][^\n]*\(AL\d{4}\)|[^\n]*\(EaD\s*-\s*AL\d{4}\))/);
  for (const block of blocks) {
    const titleMatch =
      block.match(/^([^\n(]+)\s*\(AL(\d{4})\)/m) ||
      block.match(/^([^\n(]+)\s*\(EaD\s*-\s*AL(\d{4})\)/m);
    if (!titleMatch) continue;
    const codigo = `AL${titleMatch[2]}`;
    const name = titleMatch[1].trim();

    const ementaMatch = block.match(/Ementa:\s*\n([\s\S]*?)(?=\nObjetivos?:)/i);
    const objMatch = block.match(/Objetivos?:\s*\n([\s\S]*?)(?=\nSão objetivos específicos|\n[A-Za-zÀ-ú].*\(AL\d{4}\)|$)/i);

    let ementa = ementaMatch ? ementaMatch[1].replace(/\s+/g, ' ').trim() : '';
    let objetivo = '';
    if (objMatch) {
      objetivo = objMatch[1]
        .replace(/\s+/g, ' ')
        .replace(/^Ao final do componente o discente é capaz de:\s*/i, '')
        .replace(/^Ao final do componente o discente é capaz de:\s*/i, '')
        .trim();
      const idx = objetivo.search(/São objetivos específicos/i);
      if (idx >= 0) objetivo = objetivo.slice(0, idx).trim();
    }
    byCode.set(codigo, { name, ementa, objetivo });
  }
  return byCode;
}

function resolvePrereqs(list, codigoToId) {
  return (list || []).map((p) => {
    if (/^AL\d{4}$/.test(p)) return codigoToId.get(p) || p;
    return p;
  }).filter(Boolean);
}

function fmtDisc(d, parsed, codigoToId) {
  const meta = parsed.get(d.codigo) || {};
  const name = meta.name || d.name || d.codigo;
  const lines = [
    '    {',
    `      id: '${d.id}',`,
    `      name: '${esc(name).replace(/'/g, "\\'")}',`,
    `      sem: ${d.sem},`,
    `      prereqs: ${JSON.stringify(resolvePrereqs(PREREQS[d.id], codigoToId))},`,
  ];
  if (d.specialMinCH) lines.push(`      specialMinCH: ${d.specialMinCH},`);
  lines.push(
    `      codigo: '${d.codigo}',`,
    `      ch: '${d.ch}h',`,
    `      ch_teo: ${d.ch_teo},`,
    `      ch_prat: ${d.ch_prat},`,
    `      ch_ead_t: ${d.ch_ead_t},`,
    `      ch_ead_p: ${d.ch_ead_p},`,
    `      ch_ext: ${d.ch_ext},`,
    `      ementa: "${esc(meta.ementa)}",`,
    `      objetivo: "${esc(meta.objetivo)}",`,
    '    },'
  );
  return lines.join('\n');
}

function fmtCccg(item, parsed) {
  const meta = parsed.get(item.codigo) || item.fallback || {};
  const nome = meta.name || item.codigo;
  return `      {
        codigo: "${item.codigo}",
        nome: "${esc(nome)}",
        cat: 'em_cccg',
        ch: ${item.ch},
        ch_teo: ${item.ch_teo},
        ch_prat: ${item.ch_prat},
        ch_ead_t: ${item.ch_ead_t},
        ch_ead_p: ${item.ch_ead_p},
        ch_ext: ${item.ch_ext},
        prereqs: ${JSON.stringify(item.prereqs)},
        ementa: "${esc(meta.ementa)}",
        objetivo: "${esc(meta.objetivo)}",
      }`;
}

function insertSlots(lines) {
  const out = [];
  for (const line of lines) {
    out.push(line);
    if (line.includes("id: 'met_proj'")) {
      out.push(`    {
      id: 'cccg7',
      name: 'CCCG',
      sem: 7,
      cat: 'em_cccg',
      prereqs: [],
      codigo: '',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
    }
    if (line.includes("id: 'proj_int1'")) {
      out.push(`    {
      id: 'cccg8',
      name: 'CCCG',
      sem: 8,
      cat: 'em_cccg',
      prereqs: [],
      codigo: '',
      ch: '45h',
      ementa: CCCG_EMENTA,
    },`);
    }
  }
  return out;
}

const ppcText = fs.readFileSync(PPC_PATH, 'utf8');
const parsed = parsePpc(ppcText);
const codigoToId = new Map(MATRIX.map((m) => [m.codigo, m.id]));

const discLines = MATRIX.map((d) => fmtDisc(d, parsed, codigoToId));
const withSlots = insertSlots(discLines);

const cccgLines = CCCG_MATRIX.map((c) => fmtCccg(c, parsed));

const output = `/**
 * Dados da grade: EM (UNIPAMPA Alegrete).
 * Ementas e objetivos separados, CH alinhada ao ementário oficial (PPC 2023).
 * Semestragem e pré-requisitos conforme matriz curricular.
 */
(function () {
  'use strict';
  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';

  const disciplines = [
${withSlots.join('\n')}
  ];

  window.GRADE_CURSO_CONFIG = {
    sigla: 'em',
    title: "Grade Curricular \\u2014 Engenharia Mec\\u00e2nica",
    subtitle: "UNIPAMPA \\u00b7 Campus Alegrete \\u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
    /** Plano de integralização (PPC 2023: Tabela 1). */
    chIntegralization: {
      total: 3900,
      buckets: [
        {
          id: 'ccog',
          shortLabel: 'CCOG',
          label: 'Componentes curriculares obrigatórios de graduação (CCOGs)',
          required: 3615,
          source: 'mandatory',
        },
        {
          id: 'cccg',
          shortLabel: 'CCCG',
          label: 'Componentes curriculares complementares de graduação (CCCGs)',
          required: 105,
          source: 'cccg',
        },
        {
          id: 'acev',
          shortLabel: 'ACEV',
          label: 'Atividades curriculares de extensão vinculadas (ACEV)',
          required: 330,
          source: 'aceMandatory',
          countsTowardTotal: false,
        },
        {
          id: 'acee',
          shortLabel: 'ACEE',
          label: 'Atividades curriculares de extensão específicas (ACEE)',
          required: 75,
          manual: true,
        },
        {
          id: 'acg',
          shortLabel: 'ACG',
          label: 'Atividades complementares de graduação (ACGs)',
          required: 105,
          manual: true,
        },
      ],
    },
    cccgSemLimits: {
      7: 60,
      8: 45,
    },
    cccgs: [
${cccgLines.join(',\n')},
    ],
  };
})();
`;

fs.writeFileSync(OUT_PATH, output, 'utf8');
console.log(`Wrote ${OUT_PATH}`);
console.log(`Parsed ${parsed.size} PPC entries; mandatory ${MATRIX.length}, cccg ${CCCG_MATRIX.length}`);
const missing = [...MATRIX, ...CCCG_MATRIX]
  .map((x) => x.codigo)
  .filter((c) => !parsed.has(c));
if (missing.length) console.warn('Missing ementa/objetivo for:', missing.join(', '));
