/**
 * Dados da grade — EA (UNIPAMPA Alegrete).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'calc1',   name:'Cálculo I',                          sem:1,  prereqs:[],               codigo:'AL0363', ch:'90h'},
  {id:'fis1',    name:'Física I',                           sem:1,  prereqs:[],               codigo:'AL0003', ch:'75h'},
  {id:'quim',    name:'Química Geral e Experimental',       sem:1,  prereqs:[],               codigo:'AL0366', ch:'45h'},
  {id:'dt',      name:'Desenho Técnico',                    sem:1,  prereqs:[],               codigo:'AL0007', ch:'30h'},
  {id:'intro_ea',name:'Introdução à Engenharia Agrícola',   sem:1,  prereqs:[],               codigo:'AL0449', ch:'30h'},
  {id:'alg',     name:'Algoritmos e Programação',           sem:1,  prereqs:[],               codigo:'AL0005', ch:'60h'},
  {id:'metcient',name:'Metodologia Científica',             sem:1,  prereqs:[],               codigo:'AL0486', ch:'30h'},
  // 2º SEM
  {id:'geom',    name:'Geometria Analítica',                sem:2,  prereqs:[],               codigo:'AL0002', ch:'60h'},
  {id:'mec_ger', name:'Mecânica Geral',                     sem:2,  prereqs:['fis1'],         codigo:'AL0015', ch:'60h'},
  {id:'dt_dig',  name:'Desenho Digital',                    sem:2,  prereqs:['dt'],           codigo:'AL0490', ch:'60h'},
  {id:'fis2',    name:'Física II',                          sem:2,  prereqs:['fis1'],         codigo:'AL0011', ch:'75h'},
  {id:'calc2',   name:'Cálculo II',                         sem:2,  prereqs:['calc1'],        codigo:'AL0010', ch:'60h'},
  {id:'prod_veg',name:'Princípios Básicos da Produção Vegetal',sem:2,prereqs:[],              codigo:'AL0450', ch:'60h'},
  // 3º SEM
  {id:'alg_lin', name:'Álgebra Linear',                     sem:3,  prereqs:['geom'],         codigo:'AL0009', ch:'60h'},
  {id:'probest', name:'Probabilidade e Estatística',        sem:3,  prereqs:[],               codigo:'AL0022', ch:'60h'},
  {id:'est_iso', name:'Estruturas Isostáticas',             sem:3,  prereqs:['mec_ger'],      codigo:'AL0377', ch:'60h'},
  {id:'fen_trans',name:'Fenômenos de Transferência',        sem:3,  prereqs:['fis2'],         codigo:'AL0038', ch:'60h'},
  {id:'eletrot', name:'Eletrotécnica',                      sem:3,  prereqs:['fis2'],         codigo:'AL0006', ch:'45h'},
  {id:'solo',    name:'Fundamentos da Ciência do Solo',     sem:3,  prereqs:[],               codigo:'AL0452', ch:'60h'},
  {id:'agroclim',name:'Agroclimatologia',                   sem:3,  prereqs:['prod_veg'],     codigo:'AL0482', ch:'75h'},
  // 4º SEM
  {id:'res_mat', name:'Resistência dos Materiais',          sem:4,  prereqs:['est_iso'],      codigo:'AL0232', ch:'75h'},
  {id:'hidraul', name:'Hidráulica Agrícola',                sem:4,  prereqs:['fen_trans'],    codigo:'AL0296', ch:'60h'},
  {id:'maq_el',  name:'Tópicos de Máquinas Elétricas',      sem:4,  prereqs:['eletrot'],      codigo:'AL0221', ch:'30h'},
  {id:'mat_const',name:'Materiais e Técnicas de Construção',sem:4,  prereqs:[],               codigo:'AL0451', ch:'60h'},
  {id:'geo_eng', name:'Geologia para Engenharia Agrícola',  sem:4,  prereqs:[],               codigo:'AL0491', ch:'45h'},
  {id:'eng_eco', name:'Introdução à Engenharia Econômica',  sem:4,  prereqs:['probest'],      codigo:'AL0380', ch:'45h'},
  {id:'top',     name:'Topografia',                         sem:4,  prereqs:['geom'],         codigo:'AL0454', ch:'60h'},
  // 5º SEM
  {id:'elem_maq',name:'Elementos de Máquinas Agrícolas',    sem:5,  prereqs:['mec_ger'],      codigo:'AL0455', ch:'45h'},
  {id:'hidro',   name:'Hidrologia Agrícola',                sem:5,  prereqs:['probest'],      codigo:'AL0488', ch:'60h'},
  {id:'instr',   name:'Instrumentação e Automação Agrícola',sem:5,  prereqs:['eletrot'],      codigo:'AL0456', ch:'60h'},
  {id:'exp_agr', name:'Experimentação Agrícola',            sem:5,  prereqs:['probest'],      codigo:'AL0492', ch:'60h'},
  {id:'est_conc',name:'Estruturas de Concreto',             sem:5,  prereqs:['res_mat'],      codigo:'AL0370', ch:'60h'},
  {id:'est_aco', name:'Estruturas de Aço e Madeira',        sem:5,  prereqs:['res_mat'],      codigo:'AL0236', ch:'45h'},
  {id:'ajust',   name:'Ajustamento de Observações Geodésicas',sem:5,prereqs:['top'],          codigo:'AL0457', ch:'60h'},
  // 6º SEM
  {id:'mot_trat',name:'Motores e Tratores Agrícolas',       sem:6,  prereqs:['elem_maq'],     codigo:'AL0460', ch:'60h'},
  {id:'inst_el', name:'Instalações Elétricas Prediais',     sem:6,  prereqs:['maq_el'],       codigo:'AL0081', ch:'60h'},
  {id:'agua_solo',name:'Relação Água-Solo-Planta',          sem:6,  prereqs:['hidraul'],      codigo:'AL0487', ch:'45h'},
  {id:'adm',     name:'Administração',                      sem:6,  prereqs:['eng_eco'],      codigo:'AL0394', ch:'30h'},
  {id:'mec_solo',name:'Mecânica dos Solos',                 sem:6,  prereqs:['geo_eng'],      codigo:'AL0480', ch:'60h'},
  {id:'cart_geo',name:'Cartografia e Geoprocessamento',     sem:6,  prereqs:['top'],          codigo:'AL0458', ch:'60h'},
  {id:'cult_agr',name:'Cultivos Agrícolas',                 sem:6,  prereqs:['agroclim'],     codigo:'AL0459', ch:'60h'},
  {id:'man_solo',name:'Manejo e Conservação do Solo e da Água',sem:6,prereqs:['hidro'],       codigo:'AL0253', ch:'60h'},
  // 7º SEM
  {id:'leg_et',  name:'Legislação, Ética e Exercício Profissional',sem:7,prereqs:[],          codigo:'AL0142', ch:'30h'},
  {id:'maq_agr', name:'Máquinas Agrícolas',                 sem:7,  prereqs:['mot_trat'],     codigo:'AL0461', ch:'60h'},
  {id:'irrig',   name:'Irrigação e Drenagem',               sem:7,  prereqs:['agua_solo'],    codigo:'AL0479', ch:'60h'},
  {id:'sec_aer', name:'Secagem e Aeração de Produtos Agrícolas',sem:7,prereqs:['fen_trans'],  codigo:'AL0462', ch:'60h'},
  {id:'obras_t', name:'Projeto de Obras de Terra',          sem:7,  prereqs:['mec_solo'],     codigo:'AL0481', ch:'60h'},
  {id:'const_rur',name:'Construções Rurais e Ambiência',    sem:7,  prereqs:['est_conc'],     codigo:'AL0255', ch:'60h'},
  {id:'geo_per', name:'Geotecnologias Aplicadas à Perícias Agrícolas',sem:7,prereqs:['cart_geo'],codigo:'AL0463', ch:'60h'},
  // 8º SEM
  {id:'irrig_p', name:'Irrigação Pressurizada',             sem:8,  prereqs:['irrig'],        codigo:'AL0464', ch:'60h'},
  {id:'arm_prod',name:'Armazenamento e Beneficiamento de Produtos Agrícolas',sem:8,prereqs:['sec_aer'],codigo:'AL0256', ch:'60h'},
  {id:'mec_agr', name:'Mecanização Agrícola',               sem:8,  prereqs:['maq_agr'],      codigo:'AL0476', ch:'60h'},
  {id:'sens_rem',name:'Sensoriamento Remoto',               sem:8,  prereqs:['cart_geo'],     codigo:'AL0477', ch:'60h'},
  {id:'proj_int1',name:'Projeto Integrado I',               sem:8,  prereqs:[],               codigo:'AL0484', ch:'150h'},
  {id:'fund',    name:'Fundações',                          sem:8,  prereqs:['obras_t'],      codigo:'AL0400', ch:'60h'},
  {id:'empreend',name:'Empreendedorismo',                   sem:8,  prereqs:['adm'],          codigo:'AL0402', ch:'30h'},
  // 9º SEM
  {id:'proj_arm',name:'Projeto de Unidades Armazenadoras',  sem:9,  prereqs:['arm_prod'],     codigo:'AL0478', ch:'60h'},
  {id:'agr_prec',name:'Agricultura de Precisão',            sem:9,  prereqs:['maq_agr'],      codigo:'AL0483', ch:'60h'},
  {id:'proj_int2',name:'Projeto Integrado II',              sem:9,  prereqs:['proj_int1'],    codigo:'AL0485', ch:'150h'},
  {id:'gest_amb',name:'Fundamentos da Gestão Ambiental',    sem:9,  prereqs:[],               codigo:'AL0390', ch:'30h'},
  {id:'seg_trab',name:'Segurança e Saúde no Trabalho',      sem:9,  prereqs:[],               codigo:'AL0368', ch:'30h'},
  {id:'tcc1',    name:'Trabalho de Conclusão de Curso I',   sem:9,  prereqs:[],               codigo:'AL0283', ch:'30h'},
  {id:'ext_rur', name:'Extensão Rural',                     sem:9,  prereqs:[],               codigo:'AL0453', ch:'60h'},
  // 10º SEM
  {id:'tcc2',    name:'Trabalho de Conclusão de Curso II',  sem:10, prereqs:['tcc1'],         codigo:'AL0284', ch:'30h'},
  {id:'estagio', name:'Estágio Obrigatório',                sem:10, prereqs:[],               codigo:'AL0489', ch:'210h'},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'ea',
    title: "Grade Curricular \u2014 Engenharia Agr\u00edcola",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
  };
})();
