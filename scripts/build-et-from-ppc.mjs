#!/usr/bin/env node
/**
 * Gera js/cursos/et.js a partir do ementário PPC (scripts/et-ppc.txt).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PPC_PATH = path.join(__dirname, 'et-ppc.txt');
const OUT_PATH = path.join(ROOT, 'js/cursos/et.js');

/** Metadados fixos da matriz (semestre, id, codigo, CH detalhada). */
const MATRIX = [
  { id: 'calc1', codigo: 'AL0363', sem: 1, ch: 90, ch_teo: 90, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'geom', codigo: 'AL0002', sem: 1, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis1', codigo: 'AL0003', sem: 1, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'intro_ct', codigo: 'AL0004', sem: 1, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'alg', codigo: 'AL0005', sem: 1, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'seg_trab', codigo: 'AL0368', sem: 1, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext1', codigo: 'AL0411', sem: 1, ch: 45, ch_teo: 15, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'alg_lin', codigo: 'AL0009', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc2', codigo: 'AL0010', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis2', codigo: 'AL0011', sem: 2, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'quim', codigo: 'AL0366', sem: 2, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ_dig', codigo: 'AL0013', sem: 2, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'probest', codigo: 'AL0022', sem: 2, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ_med', codigo: 'AL0412', sem: 2, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eq_dif1', codigo: 'AL0019', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc3', codigo: 'AL0020', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis3', codigo: 'AL0021', sem: 3, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'gest_amb', codigo: 'AL0390', sem: 3, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'arq_comp', codigo: 'AL0023', sem: 3, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ1', codigo: 'AL0413', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dtcd', codigo: 'AL0367', sem: 3, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eletromag', codigo: 'AL0270', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis_apl', codigo: 'AL0271', sem: 4, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eq_dif2', codigo: 'AL0036', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sinais', codigo: 'AL0272', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ2', codigo: 'AL0414', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'lab_c1', codigo: 'AL0415', sem: 4, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc_num', codigo: 'AL0037', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ondas', codigo: 'AL0307', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fot', codigo: 'AL2165', sem: 5, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proc_est', codigo: 'AL0308', sem: 5, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sist_com1', codigo: 'AL0310', sem: 5, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'so', codigo: 'AL0341', sem: 5, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'lab_c2', codigo: 'AL0418', sem: 5, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ_el1', codigo: 'AL0419', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'microond', codigo: 'AL0315', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sist_com2', codigo: 'AL0313', sem: 6, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'pds1', codigo: 'AL0420', sem: 6, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'redes_com', codigo: 'AL0309', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ_el2', codigo: 'AL0421', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'com_opt', codigo: 'AL0322', sem: 6, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'inst_el', codigo: 'AL0081', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext2', codigo: 'AL0422', sem: 6, ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 60 },
  { id: 'antenas', codigo: 'AL0316', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sist_com3', codigo: 'AL0318', sem: 7, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'sist_dist', codigo: 'AL0423', sem: 7, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'el_inst', codigo: 'AL0059', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'circ_el3', codigo: 'AL0424', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'pds2', codigo: 'AL0425', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eng_eco', codigo: 'AL0380', sem: 7, ch: 45, ch_teo: 15, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext3', codigo: 'AL0426', sem: 7, ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 60 },
  { id: 'circ_mw', codigo: 'AL0320', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'prop', codigo: 'AL0317', sem: 8, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'com_mov', codigo: 'AL0321', sem: 8, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_rf', codigo: 'AL0427', sem: 8, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'micro', codigo: 'AL0105', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_pesq', codigo: 'AL0144', sem: 8, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, specialMinCH: 2457 },
  { id: 'adm', codigo: 'AL0394', sem: 8, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'tcc', codigo: 'AL0155', sem: 9, ch: 60, ch_teo: 0, ch_prat: 60, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'leg_et', codigo: 'AL0142', sem: 9, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'empreend', codigo: 'AL0402', sem: 9, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'estagio', codigo: 'AL0448', sem: 10, ch: 165, ch_teo: 0, ch_prat: 165, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, specialMinCH: 2808 },
];

const PREREQS = {
  alg_lin: [],
  calc2: ['calc1'],
  fis2: ['fis1'],
  circ_dig: [],
  eq_dif1: ['calc2'],
  calc3: ['calc2'],
  fis3: ['calc2'],
  arq_comp: ['circ_dig'],
  circ1: ['calc2'],
  eletromag: ['calc3', 'fis3'],
  fis_apl: ['fis3'],
  eq_dif2: ['eq_dif1'],
  sinais: ['calc2'],
  calc_num: ['alg'],
  circ2: ['circ1'],
  lab_c1: ['circ_med', 'circ1'],
  ondas: ['eletromag'],
  fot: ['fis_apl'],
  proc_est: ['calc2', 'probest'],
  sist_com1: ['sinais'],
  so: ['alg'],
  lab_c2: ['circ2', 'lab_c1'],
  circ_el1: ['circ1'],
  microond: ['ondas'],
  sist_com2: ['sist_com1'],
  pds1: ['sinais'],
  redes_com: ['so'],
  circ_el2: ['circ_el1', 'lab_c2'],
  com_opt: ['fot'],
  inst_el: ['circ2'],
  ext2: ['ext1'],
  antenas: ['ondas'],
  sist_com3: ['sist_com1'],
  sist_dist: ['redes_com'],
  el_inst: ['circ_el2'],
  circ_el3: ['circ_el2'],
  pds2: ['pds1'],
  eng_eco: ['probest'],
  ext3: ['ext2'],
  circ_mw: ['microond'],
  prop: ['ondas'],
  com_mov: ['sist_com2'],
  proj_rf: ['circ_el3'],
  micro: ['circ_el1'],
  proj_pesq: [],
  adm: ['eng_eco'],
  tcc: ['proj_pesq'],
  empreend: ['adm'],
  estagio: [],
  calc1: [],
  geom: [],
  fis1: [],
  intro_ct: [],
  alg: [],
  seg_trab: [],
  ext1: [],
  quim: [],
  probest: [],
  circ_med: [],
  gest_amb: [],
  dtcd: [],
  leg_et: [],
};

/** Núcleos da matriz curricular (fluxograma). */
const CAT_BY_ID = {
  calc1: 'et_basico',
  geom: 'et_basico',
  fis1: 'et_basico',
  fis2: 'et_basico',
  fis3: 'et_basico',
  intro_ct: 'et_basico',
  alg: 'et_basico',
  seg_trab: 'et_basico',
  alg_lin: 'et_basico',
  calc2: 'et_basico',
  calc3: 'et_basico',
  quim: 'et_basico',
  probest: 'et_basico',
  eq_dif1: 'et_basico',
  eq_dif2: 'et_basico',
  gest_amb: 'et_basico',
  dtcd: 'et_basico',
  fis_apl: 'et_basico',
  calc_num: 'et_computacao',
  circ_dig: 'et_computacao',
  arq_comp: 'et_computacao',
  so: 'et_computacao',
  redes_com: 'et_computacao',
  sist_dist: 'et_computacao',
  eletromag: 'et_eletromag',
  ondas: 'et_eletromag',
  fot: 'et_eletromag',
  microond: 'et_eletromag',
  antenas: 'et_eletromag',
  prop: 'et_eletromag',
  circ_mw: 'et_eletromag',
  com_opt: 'et_eletromag',
  sinais: 'et_sinais',
  proc_est: 'et_sinais',
  sist_com1: 'et_sinais',
  sist_com2: 'et_sinais',
  sist_com3: 'et_sinais',
  pds1: 'et_sinais',
  pds2: 'et_sinais',
  com_mov: 'et_sinais',
  circ_med: 'et_eletronica',
  circ1: 'et_eletronica',
  circ2: 'et_eletronica',
  lab_c1: 'et_eletronica',
  lab_c2: 'et_eletronica',
  circ_el1: 'et_eletronica',
  circ_el2: 'et_eletronica',
  circ_el3: 'et_eletronica',
  el_inst: 'et_eletronica',
  inst_el: 'et_eletronica',
  proj_rf: 'et_eletronica',
  micro: 'et_eletronica',
  ext1: 'et_basico',
  ext2: 'et_basico',
  ext3: 'et_basico',
  tcc: 'et_outras',
  estagio: 'et_outras',
  proj_pesq: 'et_outras',
  leg_et: 'et_basico',
  empreend: 'et_basico',
  adm: 'et_basico',
  eng_eco: 'et_basico',
};

const CCCG_MATRIX = [
  { codigo: 'AL2062', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: ['alg'] },
  { codigo: 'AL2140', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2133', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2202', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2149', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2150', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2139', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2183', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2240', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2241', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0430', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2144', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
];

/** Corrige typo do PPC (AL22240 → AL2240). */
const CODE_ALIASES = { AL22240: 'AL2240' };

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
  const blocks = text.split(
    /\n(?=[^\n]*\(AL\d{4,5}\)|[^\n]*\(EaD\s*-\s*AL\d{4}\)|[^\n]*\(EaD\)\s*\(AL\d{4,5}\))/
  );
  for (const block of blocks) {
    const titleMatch =
      block.match(/^([^\n(]+)\s*\(AL(\d{4,5})\)/m) ||
      block.match(/^([^\n(]+)\s*\(EaD\s*-\s*AL(\d{4})\)/m) ||
      block.match(/^([^\n(]+)\s*\(EaD\)\s*\(AL(\d{4,5})\)/m);
    if (!titleMatch) continue;
    let codigo = `AL${titleMatch[2].slice(-4)}`;
    if (CODE_ALIASES[codigo]) codigo = CODE_ALIASES[codigo];
    const name = titleMatch[1].replace(/\s*\(EaD\)\s*$/i, '').trim();

    const ementaMatch = block.match(/EMENTA\s*\n([\s\S]*?)(?=\nOBJETIVO GERAL|\nObjetivo)/i);
    const objMatch = block.match(
      /OBJETIVO GERAL\s*\n([\s\S]*?)(?=\nOBJETIVOS ESPECÍFICOS|\n[A-Za-zÀ-ú].*\(AL\d{4}|\nComponentes Curriculares|$)/i
    );

    const ementa = ementaMatch ? ementaMatch[1].replace(/\s+/g, ' ').trim() : '';
    const objetivo = objMatch ? objMatch[1].replace(/\s+/g, ' ').trim() : '';

    byCode.set(codigo, { name, ementa, objetivo });
  }
  return byCode;
}

function resolvePrereqs(list) {
  return (list || []).map((p) => p);
}

function fmtDisc(d, parsed) {
  const meta = parsed.get(d.codigo) || {};
  const name = meta.name || d.name || d.codigo;
  const cat = CAT_BY_ID[d.id] || 'et_outras';
  const lines = [
    '    {',
    `      id: '${d.id}',`,
    `      name: '${esc(name).replace(/'/g, "\\'")}',`,
    `      sem: ${d.sem},`,
    `      cat: '${cat}',`,
    `      prereqs: ${JSON.stringify(resolvePrereqs(PREREQS[d.id]))},`,
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
  const meta = parsed.get(item.codigo) || {};
  const nome = meta.name || item.codigo;
  return `      {
        codigo: "${item.codigo}",
        nome: "${esc(nome)}",
        cat: 'et_outras',
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
    if (line.includes("id: 'empreend'")) {
      out.push(`    {
      id: 'cccg1',
      name: 'CCCG',
      sem: 9,
      cat: 'et_outras',
      prereqs: [],
      codigo: '',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
      out.push(`    {
      id: 'cccg2',
      name: 'CCCG',
      sem: 9,
      cat: 'et_outras',
      prereqs: [],
      codigo: '',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
    }
  }
  return out;
}

const ppcText = fs.readFileSync(PPC_PATH, 'utf8');
const parsed = parsePpc(ppcText);

const discLines = MATRIX.map((d) => fmtDisc(d, parsed));
const withSlots = insertSlots(discLines);
const cccgLines = CCCG_MATRIX.map((c) => fmtCccg(c, parsed));

const acevChExt = MATRIX.filter((d) => d.ch_ext > 0).reduce((s, d) => s + d.ch_ext, 0);

const output = `/**
 * Dados da grade: ET (UNIPAMPA Alegrete).
 * Ementas e objetivos separados, CH alinhada ao ementário oficial (PPC).
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
    sigla: 'et',
    title: "Grade Curricular \\u2014 Engenharia de Telecomunica\\u00e7\\u00f5es",
    subtitle: "UNIPAMPA \\u00b7 Campus Alegrete \\u00b7 PPC vigente",
    maxSemesters: 10,
    disciplines,
    /** Plano de integralização (PPC: Tabela 1). */
    chIntegralization: {
      total: 3930,
      buckets: [
        {
          id: 'ccog',
          shortLabel: 'CCOG',
          label: 'Componentes curriculares obrigatórios de graduação (CCOGs)',
          required: 3510,
          source: 'mandatory',
        },
        {
          id: 'cccg',
          shortLabel: 'CCCG',
          label: 'Componentes curriculares complementares de graduação (CCCGs)',
          required: 120,
          source: 'cccg',
        },
        {
          id: 'acev',
          shortLabel: 'ACEV',
          label: 'Atividades curriculares de extensão vinculadas (ACEV)',
          required: 165,
          source: 'aceMandatory',
          countsTowardTotal: false,
        },
        {
          id: 'acee',
          shortLabel: 'ACEE',
          label: 'Atividades curriculares de extensão específicas (ACEE)',
          required: 240,
          manual: true,
        },
        {
          id: 'acg',
          shortLabel: 'ACG',
          label: 'Atividades complementares de graduação (ACGs)',
          required: 60,
          manual: true,
        },
      ],
    },
    cccgSemLimits: {
      9: 120,
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
console.log(`ACEV ch_ext sum (Extensão I–III): ${acevChExt}h (bucket required: 165h)`);
const missing = [...MATRIX, ...CCCG_MATRIX]
  .map((x) => x.codigo)
  .filter((c) => !parsed.has(c));
if (missing.length) console.warn('Missing ementa/objetivo for:', missing.join(', '));
