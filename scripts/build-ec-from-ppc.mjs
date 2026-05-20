#!/usr/bin/env node
/**
 * Gera js/cursos/ec.js a partir da matriz curricular do PPC (Tabelas 5–7).
 * Ementas/objetivos: preenchidos depois via scripts/ec-ppc.txt.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const PPC_PATH = path.join(__dirname, 'ec-ppc.txt');
const OUT_PATH = path.join(ROOT, 'js/cursos/ec.js');

/** Total CCOG no plano de integralização (PPC Tabela 1). */
const CCOG_PPC_REQUIRED = 3885;
const CCOG_MIN_CH_50 = Math.round(CCOG_PPC_REQUIRED * 0.5);

/** CCOGs — semestre, id, codigo, CH (Tabela 5). */
const MATRIX = [
  { id: 'intro_ec', codigo: 'AL0362', sem: 1, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'geom', codigo: 'AL0002', sem: 1, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc1', codigo: 'AL0363', sem: 1, ch: 90, ch_teo: 90, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dt', codigo: 'AL0007', sem: 1, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'geo_desc', codigo: 'AL0364', sem: 1, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'alg', codigo: 'AL0005', sem: 1, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext1', codigo: 'AL0365', sem: 1, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'quim', codigo: 'AL0366', sem: 2, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'alg_lin', codigo: 'AL0009', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc2', codigo: 'AL0010', sem: 2, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'dtcd', codigo: 'AL0367', sem: 2, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'seg_trab', codigo: 'AL0368', sem: 2, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis1', codigo: 'AL0003', sem: 2, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext2', codigo: 'AL0369', sem: 2, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'mec_ger', codigo: 'AL0015', sem: 3, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'cien_mat', codigo: 'AL0371', sem: 3, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'probest', codigo: 'AL0022', sem: 3, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eq_dif', codigo: 'AL0019', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'transp', codigo: 'AL0372', sem: 3, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fis2', codigo: 'AL0011', sem: 3, ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext3', codigo: 'AL0374', sem: 3, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'res_mat1', codigo: 'AL0375', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mat_cons1', codigo: 'AL0376', sem: 4, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'est_iso', codigo: 'AL0377', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'top', codigo: 'AL0046', sem: 4, ch: 90, ch_teo: 60, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'geo_eng', codigo: 'AL0378', sem: 4, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fen_trans', codigo: 'AL0038', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eng_traf', codigo: 'AL0379', sem: 4, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eng_eco', codigo: 'AL0380', sem: 4, ch: 45, ch_teo: 15, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'res_mat2', codigo: 'AL0381', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mat_cons2', codigo: 'AL0382', sem: 5, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'hidro', codigo: 'AL0109', sem: 5, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'hidraul', codigo: 'AL0170', sem: 5, ch: 75, ch_teo: 45, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mec_solo1', codigo: 'AL0383', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_via', codigo: 'AL0063', sem: 5, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'eletrot', codigo: 'AL0006', sem: 5, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'calc_num', codigo: 'AL0037', sem: 5, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'est_hiper', codigo: 'AL0384', sem: 6, ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'const1', codigo: 'AL0089', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'acoes', codigo: 'AL0385', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'inst_hid', codigo: 'AL0163', sem: 6, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mec_solo2', codigo: 'AL0386', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'terrap', codigo: 'AL0086', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'inst_el', codigo: 'AL0081', sem: 6, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'arq', codigo: 'AL0171', sem: 6, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'conc1', codigo: 'AL0388', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'const2', codigo: 'AL0389', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'gest_amb', codigo: 'AL0390', sem: 7, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'san1', codigo: 'AL0391', sem: 7, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'obras_t', codigo: 'AL0392', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'mat_via', codigo: 'AL0393', sem: 7, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'adm', codigo: 'AL0394', sem: 7, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext7', codigo: 'AL0395', sem: 7, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'conc2', codigo: 'AL0396', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'orc_ob', codigo: 'AL0397', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'est_mad', codigo: 'AL0398', sem: 8, ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'san2', codigo: 'AL0399', sem: 8, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'fund', codigo: 'AL0400', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'est_via', codigo: 'AL0401', sem: 8, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'empreend', codigo: 'AL0402', sem: 8, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext8', codigo: 'AL0403', sem: 8, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'conc3', codigo: 'AL0404', sem: 9, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ger_ob', codigo: 'AL0405', sem: 9, ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'est_aco', codigo: 'AL0406', sem: 9, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'pat', codigo: 'AL0407', sem: 9, ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'tcc1', codigo: 'AL0148', sem: 9, ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'leg_et', codigo: 'AL0142', sem: 9, ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'proj_int', codigo: 'AL0408', sem: 9, ch: 60, ch_teo: 15, ch_prat: 45, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'ext9', codigo: 'AL0409', sem: 9, ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30 },
  { id: 'estagio', codigo: 'AL0410', sem: 10, ch: 240, ch_teo: 0, ch_prat: 240, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
  { id: 'tcc2', codigo: 'AL0157', sem: 10, ch: 30, ch_teo: 0, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0 },
];

const CCOG_TOTAL = MATRIX.reduce((s, d) => s + d.ch, 0);

const DISC_NAMES = {
  AL0362: 'Introdução à Engenharia Civil',
  AL0002: 'Geometria Analítica',
  AL0363: 'Cálculo I',
  AL0007: 'Desenho Técnico',
  AL0364: 'Geometria Descritiva',
  AL0005: 'Algoritmos e Programação',
  AL0365: 'Práticas de Extensão em Engenharia Civil I',
  AL0366: 'Química Geral e Experimental',
  AL0009: 'Álgebra Linear',
  AL0010: 'Cálculo II',
  AL0367: 'Desenho Técnico Civil e Digital',
  AL0368: 'Segurança e Saúde no Trabalho',
  AL0003: 'Física I',
  AL0369: 'Práticas de Extensão em Engenharia Civil II',
  AL0015: 'Mecânica Geral',
  AL0371: 'Ciência dos Materiais',
  AL0022: 'Probabilidade e Estatística',
  AL0019: 'Equações Diferenciais I',
  AL0372: 'Sistemas de Transportes',
  AL0011: 'Física II',
  AL0374: 'Práticas de Extensão em Engenharia Civil III',
  AL0375: 'Resistência dos Materiais I',
  AL0376: 'Materiais de Construção Civil I',
  AL0377: 'Estruturas Isostáticas',
  AL0046: 'Topografia e Elementos de Geodésia',
  AL0378: 'Geologia de Engenharia',
  AL0038: 'Fenômenos de Transferência',
  AL0379: 'Engenharia de Tráfego',
  AL0380: 'Introdução à Engenharia Econômica',
  AL0381: 'Resistência dos Materiais II',
  AL0382: 'Materiais de Construção Civil II',
  AL0109: 'Hidrologia',
  AL0170: 'Hidráulica Geral',
  AL0383: 'Mecânica dos Solos I',
  AL0063: 'Projeto de Estruturas Viárias',
  AL0006: 'Eletrotécnica',
  AL0037: 'Cálculo Numérico',
  AL0384: 'Estruturas Hiperestáticas',
  AL0089: 'Construção Civil I',
  AL0385: 'Ações e Segurança das Estruturas',
  AL0163: 'Instalações Hidráulicas Prediais',
  AL0386: 'Mecânica dos Solos II',
  AL0086: 'Terraplanagem e Movimentação de Terra',
  AL0081: 'Instalações Elétricas Prediais',
  AL0171: 'Arquitetura',
  AL0388: 'Concreto Armado I',
  AL0389: 'Construção Civil II',
  AL0390: 'Fundamentos da Gestão Ambiental',
  AL0391: 'Sistemas de Saneamento Básico I',
  AL0392: 'Obras de Terra',
  AL0393: 'Materiais de Estruturas Viárias',
  AL0394: 'Administração',
  AL0395: 'Práticas de Extensão em Engenharia Civil VII',
  AL0396: 'Concreto Armado II',
  AL0397: 'Orçamento e Programação de Obras',
  AL0398: 'Estruturas de Madeira',
  AL0399: 'Sistemas de Saneamento Básico II',
  AL0400: 'Fundações',
  AL0401: 'Estruturas Viárias e Mecânica dos Pavimentos',
  AL0402: 'Empreendedorismo',
  AL0403: 'Práticas de Extensão em Engenharia Civil VIII',
  AL0404: 'Concreto Armado III',
  AL0405: 'Gerenciamento de Obras',
  AL0406: 'Estruturas de Aço',
  AL0407: 'Patologia das Construções',
  AL0148: 'Trabalho de Conclusão de Curso I',
  AL0142: 'Legislação, Ética e Exercício Profissional da Engenharia',
  AL0408: 'Projeto Integrado',
  AL0409: 'Práticas de Extensão em Engenharia Civil IX',
  AL0410: 'Estágio Supervisionado',
  AL0157: 'Trabalho de Conclusão de Curso II',
};

/** Pré-requisitos (Tabela 5). * = co-requisito modelado como prereq normal. */
const PREREQS = {
  alg_lin: ['geom'],
  calc2: ['calc1'],
  dtcd: ['dt', 'geo_desc'],
  fis1: ['calc1'],
  ext2: ['ext1'],
  mec_ger: ['fis1'],
  cien_mat: ['quim'],
  probest: ['calc2'],
  eq_dif: ['calc2'],
  fis2: ['fis1'],
  ext3: ['ext1'],
  res_mat1: ['mec_ger'],
  mat_cons1: ['cien_mat'],
  est_iso: ['mec_ger'],
  top: ['geom'],
  fen_trans: ['calc2', 'fis2'],
  eng_traf: ['transp'],
  eng_eco: ['probest'],
  res_mat2: ['res_mat1'],
  mat_cons2: ['mat_cons1'],
  hidro: ['probest'],
  hidraul: ['fen_trans'],
  mec_solo1: ['geo_eng'],
  proj_via: ['dtcd', 'top'],
  calc_num: ['alg', 'alg_lin', 'calc2'],
  est_hiper: ['est_iso', 'res_mat2'],
  const1: ['mat_cons2'],
  acoes: ['res_mat2', 'calc_num'],
  inst_hid: ['hidro', 'hidraul'],
  mec_solo2: ['mec_solo1'],
  terrap: ['mec_solo1', 'proj_via'],
  inst_el: ['eletrot'],
  arq: ['dtcd'],
  conc1: ['res_mat2', 'calc_num', 'acoes'],
  const2: ['const1'],
  san1: ['hidro', 'hidraul'],
  obras_t: ['mec_solo2'],
  mat_via: ['mec_solo1', 'terrap'],
  adm: ['eng_eco'],
  ext7: ['ext3'],
  conc2: ['conc1', 'est_hiper'],
  orc_ob: ['const2', 'inst_el', 'inst_hid'],
  est_mad: ['est_hiper', 'acoes'],
  san2: ['san1'],
  fund: ['obras_t'],
  est_via: ['transp', 'mat_via'],
  empreend: ['adm'],
  ext8: ['ext3'],
  conc3: ['conc2'],
  ger_ob: ['adm', 'orc_ob'],
  est_aco: ['est_hiper', 'acoes'],
  pat: ['const2'],
  tcc1: [],
  leg_et: ['orc_ob'],
  proj_int: ['conc2', 'san2', 'arq', 'fund'],
  ext9: ['ext7'],
  estagio: [],
  tcc2: ['tcc1'],
  intro_ec: [],
  geom: [],
  calc1: [],
  dt: [],
  geo_desc: [],
  alg: [],
  ext1: [],
  quim: [],
  seg_trab: [],
  transp: [],
  geo_eng: [],
  gest_amb: [],
  eletrot: [],
};

/** Ciclo básico vs específico (engenharia civil — sem núcleos coloridos no PPC). */
const BASICO_IDS = new Set([
  'intro_ec', 'geom', 'calc1', 'calc2', 'dt', 'geo_desc', 'alg', 'quim', 'alg_lin',
  'seg_trab', 'fis1', 'fis2', 'mec_ger', 'probest', 'eq_dif', 'eletrot', 'calc_num',
  'eng_eco', 'adm', 'empreend', 'leg_et', 'gest_amb',
]);

/** Tabela 6 + 7 — catálogo CCCG (180 h no curso). */
const CCCG_MATRIX = [
  { codigo: 'AL0020', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0021', ch: 75, ch_teo: 60, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0036', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2051', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2074', ch: 60, ch_teo: 60, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2126', ch: 45, ch_teo: 45, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2128', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2129', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2135', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2144', ch: 30, ch_teo: 30, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2146', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2147', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2113', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2148', ch: 60, ch_teo: 0, ch_prat: 0, ch_ead_t: 15, ch_ead_p: 45, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2155', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2162', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2167', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2169', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2182', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2201', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2196', ch: 60, ch_teo: 45, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0173', ch: 45, ch_teo: 30, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0167', ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL0165', ch: 45, ch_teo: 15, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2209', ch: 60, ch_teo: 30, ch_prat: 30, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
  { codigo: 'AL2229', ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30, prereqs: [] },
  { codigo: 'AL2230', ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30, prereqs: [] },
  { codigo: 'AL2231', ch: 30, ch_teo: 0, ch_prat: 0, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 30, prereqs: [] },
  { codigo: 'AL0486', ch: 30, ch_teo: 15, ch_prat: 15, ch_ead_t: 0, ch_ead_p: 0, ch_ext: 0, prereqs: [] },
];

const CCCG_NAMES = {
  AL0020: 'Cálculo III',
  AL0021: 'Física III',
  AL0036: 'Equações Diferenciais II',
  AL2051: 'Tecnologia Em Contexto Social',
  AL2074: 'Materiais Poliméricos E Compósitos',
  AL2126: 'Processo De Fabricação De Aços E Outros Metais',
  AL2128: 'Gerenciamento E Tratamento De Resíduos Sólidos',
  AL2129: 'Madeiras E Seus Derivados',
  AL2135: 'Plano De Prevenção E Proteção Contra Incêndio (PPCI)',
  AL2144: 'Relações Étnico-raciais',
  AL2146: 'Tratamento De Esgotos Domésticos',
  AL2147: 'Gestao De Recursos Hídricos E Licenciamento Ambiental De Obras De Engenharia',
  AL2113: 'Libras',
  AL2148: 'Libras II',
  AL2155: 'Ferrovias',
  AL2162: 'Geossintéticos E Aplicações',
  AL2167: 'Transporte Público',
  AL2169: 'Estudo Da Auto Cura (Self-Healing) e Durabilidade De Concretos',
  AL2182: 'Tecnologias Das Argamassas',
  AL2201: 'Estudos Básicos Hidrológicos Para Projetos De Reservatórios',
  AL2196: 'Desempenho Das Edificações',
  AL0173: 'Estruturas De Pontes',
  AL0167: 'Industrialização Das Construções',
  AL0165: 'Alvenaria Estrutural',
  AL2209: 'Acessibilidade Em Edificações E No Ambiente Urbano',
  AL2229: 'Práticas de Extensão em Engenharia Civil IV',
  AL2230: 'Práticas de Extensão em Engenharia Civil V',
  AL2231: 'Práticas de Extensão em Engenharia Civil VI',
  AL0486: 'Metodologia Científica',
};

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
  if (!text.trim()) return byCode;
  const blocks = text.split(/\n(?=[^\n]*\(AL\d{4}\))/);
  for (const block of blocks) {
    const firstLine = block.trim().split('\n')[0];
    const titleMatch = firstLine.match(/^(.+)\s*\(AL(\d{4})\)\s*$/);
    if (!titleMatch) continue;
    const codigo = `AL${titleMatch[2]}`;
    const name = titleMatch[1].trim();

    const inlineEmenta = block.match(/Ementa:\s*([\s\S]*?)(?=\nObjetivo Geral:|$)/i);
    const blockEmenta = block.match(/EMENTA\s*\n([\s\S]*?)(?=\nOBJETIVO GERAL|\nObjetivo)/i);
    const ementa = (inlineEmenta || blockEmenta)?.[1].replace(/\s+/g, ' ').trim() || '';

    const inlineObj = block.match(/Objetivo Geral:\s*([\s\S]*?)(?=\n─|\n={3,}|$)/i);
    const blockObj = block.match(
      /OBJETIVO GERAL\s*\n([\s\S]*?)(?=\nOBJETIVOS ESPECÍFICOS|\n[A-Za-zÀ-ú].*\(AL\d{4}|$)/i
    );
    const objetivo = (inlineObj || blockObj)?.[1].replace(/\s+/g, ' ').trim() || '';

    byCode.set(codigo, { name, ementa, objetivo });
  }
  return byCode;
}

function catFor(id) {
  return BASICO_IDS.has(id) ? 'basico' : 'especifico';
}

function fmtDisc(d, parsed) {
  const meta = parsed.get(d.codigo) || {};
  const name = meta.name || DISC_NAMES[d.codigo] || d.codigo;
  const lines = [
    '    {',
    `      id: '${d.id}',`,
    `      name: '${esc(name).replace(/'/g, "\\'")}',`,
    `      sem: ${d.sem},`,
    `      cat: '${catFor(d.id)}',`,
    `      prereqs: ${JSON.stringify(PREREQS[d.id] || [])},`,
  ];
  const minCh = d.specialMinCH ?? (d.id === 'tcc1' || d.id === 'estagio' ? CCOG_MIN_CH_50 : undefined);
  if (minCh) lines.push(`      specialMinCH: ${minCh},`);
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
  const nome = meta.name || CCCG_NAMES[item.codigo] || item.codigo;
  return `      {
        codigo: "${item.codigo}",
        nome: "${esc(nome)}",
        cat: 'ec_cccg',
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
    if (line.includes("id: 'adm'")) {
      out.push(`    {
      id: 'cccg7',
      name: 'CCCG',
      sem: 7,
      cat: 'ec_cccg',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
    }
    if (line.includes("id: 'empreend'")) {
      out.push(`    {
      id: 'cccg8',
      name: 'CCCG',
      sem: 8,
      cat: 'ec_cccg',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
    }
    if (line.includes("id: 'proj_int'")) {
      out.push(`    {
      id: 'cccg9',
      name: 'CCCG',
      sem: 9,
      cat: 'ec_cccg',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },`);
    }
  }
  return out;
}

const ppcText = fs.existsSync(PPC_PATH) ? fs.readFileSync(PPC_PATH, 'utf8') : '';
const parsed = parsePpc(ppcText);

const discLines = MATRIX.map((d) => fmtDisc(d, parsed));
const withSlots = insertSlots(discLines);
const cccgLines = CCCG_MATRIX.map((c) => fmtCccg(c, parsed));

const acevChExt = MATRIX.filter((d) => d.ch_ext > 0).reduce((s, d) => s + d.ch_ext, 0);

const output = `/**
 * Dados da grade — EC (UNIPAMPA Alegrete).
 * Matriz, CH e pré-requisitos conforme PPC (Tabelas 5–7).
 * Ementas/objetivos: preencher via scripts/ec-ppc.txt + build-ec-from-ppc.mjs.
 */
(function () {
  'use strict';
  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';

  const disciplines = [
${withSlots.join('\n')}
  ];

  window.GRADE_CURSO_CONFIG = {
    sigla: 'ec',
    title: "Grade Curricular \\u2014 Engenharia Civil",
    subtitle: "UNIPAMPA \\u00b7 Campus Alegrete \\u00b7 PPC vigente",
    maxSemesters: 10,
    disciplines,
    /** Plano de integralização (PPC — totais das tabelas). */
    chIntegralization: {
      total: 4600,
      buckets: [
        {
          id: 'ccog',
          shortLabel: 'CCOG',
          label: 'Componentes curriculares obrigatórios de graduação (CCOGs)',
          required: ${CCOG_PPC_REQUIRED},
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
          id: 'acg',
          shortLabel: 'ACG',
          label: 'Atividades complementares de graduação (ACGs)',
          required: 75,
          manual: true,
        },
        {
          id: 'acev',
          shortLabel: 'ACEV',
          label: 'Atividades curriculares de extensão vinculadas (ACEV)',
          required: 180,
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
          id: 'ace_flex',
          shortLabel: 'ACE flex.',
          label: 'Demais CH em atividades curriculares de extensão (flexível em CCCG ou ACEE)',
          required: 205,
          manual: true,
        },
      ],
    },
    cccgSemLimits: {
      7: 60,
      8: 60,
      9: 60,
    },
    cccgs: [
${cccgLines.join(',\n')},
    ],
  };
})();
`;

fs.writeFileSync(OUT_PATH, output, 'utf8');
console.log(`Wrote ${OUT_PATH}`);
console.log(`CCOG matriz: ${CCOG_TOTAL}h; CCOG PPC: ${CCOG_PPC_REQUIRED}h; specialMinCH 50%: ${CCOG_MIN_CH_50}h`);
console.log(`Mandatory: ${MATRIX.length}, CCCG catalog: ${CCCG_MATRIX.length}, ACEV ch_ext: ${acevChExt}h`);
if (!ppcText.trim()) console.log('Note: scripts/ec-ppc.txt vazio — ementas serão preenchidas depois.');
