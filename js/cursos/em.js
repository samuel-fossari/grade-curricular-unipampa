/**
 * Dados da grade — EM (UNIPAMPA Alegrete).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'calc1',   name:'Cálculo I',                          sem:1,  prereqs:[],                    codigo:'AL0363', ch:'90h'},
  {id:'geom',    name:'Geometria Analítica',                sem:1,  prereqs:[],                    codigo:'AL0002', ch:'60h'},
  {id:'fis1',    name:'Física I',                           sem:1,  prereqs:[],                    codigo:'AL0003', ch:'75h'},
  {id:'intro_em',name:'Introdução à Engenharia Mecânica',   sem:1,  prereqs:[],                    codigo:'AL0465', ch:'30h'},
  {id:'dt',      name:'Desenho Técnico',                    sem:1,  prereqs:[],                    codigo:'AL0007', ch:'30h'},
  {id:'quim',    name:'Química Geral e Experimental',       sem:1,  prereqs:[],                    codigo:'AL0366', ch:'45h'},
  {id:'alg',     name:'Algoritmos e Programação',           sem:1,  prereqs:[],                    codigo:'AL0005', ch:'60h'},
  // 2º SEM
  {id:'eletrot', name:'Eletrotécnica',                      sem:2,  prereqs:[],                    codigo:'AL0006', ch:'45h'},
  {id:'alg_lin', name:'Álgebra Linear',                     sem:2,  prereqs:[],                    codigo:'AL0009', ch:'60h'},
  {id:'calc2',   name:'Cálculo II',                         sem:2,  prereqs:['calc1'],             codigo:'AL0010', ch:'60h'},
  {id:'fis2',    name:'Física II',                          sem:2,  prereqs:['calc1'],             codigo:'AL0011', ch:'75h'},
  {id:'dm1',     name:'Desenho Mecânico I',                 sem:2,  prereqs:['dt'],                codigo:'AL0033', ch:'30h'},
  {id:'mat_eng', name:'Ciência e Engenharia de Materiais',  sem:2,  prereqs:['quim'],              codigo:'AL0175', ch:'60h'},
  {id:'mec_ger', name:'Mecânica Geral',                     sem:2,  prereqs:['geom','fis1'],       codigo:'AL0015', ch:'60h'},
  // 3º SEM
  {id:'termo1',  name:'Termodinâmica I',                    sem:3,  prereqs:['calc2','fis2'],      codigo:'AL0075', ch:'60h'},
  {id:'dm_comp', name:'Desenho Mecânico Computacional',     sem:3,  prereqs:['dm1'],               codigo:'AL0192', ch:'60h'},
  {id:'eq_dif1', name:'Equações Diferenciais I',            sem:3,  prereqs:['alg_lin','calc2'],   codigo:'AL0019', ch:'60h'},
  {id:'calc3',   name:'Cálculo III',                        sem:3,  prereqs:['calc2'],             codigo:'AL0020', ch:'60h'},
  {id:'fis3',    name:'Física III',                         sem:3,  prereqs:['calc2'],             codigo:'AL0021', ch:'75h'},
  {id:'res_mat1',name:'Resistência dos Materiais I',        sem:3,  prereqs:['mec_ger'],           codigo:'AL0375', ch:'60h'},
  {id:'ofic',    name:'Oficina de Práticas Mecânicas',      sem:3,  prereqs:[],                    codigo:'AL0474', ch:'30h'},
  // 4º SEM
  {id:'probest', name:'Probabilidade e Estatística',        sem:4,  prereqs:['calc2'],             codigo:'AL0022', ch:'60h'},
  {id:'metro',   name:'Metrologia',                         sem:4,  prereqs:['dm1'],               codigo:'AL0034', ch:'30h'},
  {id:'calc_num',name:'Cálculo Numérico',                   sem:4,  prereqs:['calc2','alg'],       codigo:'AL0037', ch:'60h'},
  {id:'maq_op',  name:'Máquinas Operatrizes',               sem:4,  prereqs:['dm1'],               codigo:'AL0053', ch:'45h'},
  {id:'lab_met', name:'Lab. Metalografia e Ensaios Mecânicos',sem:4,prereqs:['mat_eng'],           codigo:'AL0054', ch:'30h'},
  {id:'mec_flu', name:'Mecânica dos Fluidos',               sem:4,  prereqs:['fis2','eq_dif1'],    codigo:'AL0078', ch:'60h'},
  {id:'res_mat2',name:'Resistência dos Materiais II',       sem:4,  prereqs:['res_mat1'],          codigo:'AL0381', ch:'60h'},
  {id:'termo_ap',name:'Termodinâmica Aplicada',             sem:4,  prereqs:['termo1'],            codigo:'AL0466', ch:'60h'},
  // 5º SEM
  {id:'dinam',   name:'Dinâmica',                           sem:5,  prereqs:['mec_ger'],           codigo:'AL0055', ch:'60h'},
  {id:'mecan',   name:'Mecanismos',                         sem:5,  prereqs:['mec_ger','calc2'],   codigo:'AL0074', ch:'30h'},
  {id:'usinag',  name:'Usinagem',                           sem:5,  prereqs:['maq_op','mat_eng'],  codigo:'AL0076', ch:'60h'},
  {id:'maq_flu', name:'Máquinas de Fluido',                 sem:5,  prereqs:['mec_flu'],           codigo:'AL0136', ch:'60h'},
  {id:'trat_term',name:'Tratamentos Térmicos e Superficiais',sem:5, prereqs:['lab_met'],           codigo:'AL0176', ch:'60h'},
  {id:'transf',  name:'Transferência de Calor e Massa',     sem:5,  prereqs:['mec_flu','calc3'],   codigo:'AL0098', ch:'60h'},
  {id:'frat',    name:'Mecânica da Fratura e Fadiga',       sem:5,  prereqs:['res_mat2'],          codigo:'AL0467', ch:'60h'},
  // 6º SEM
  {id:'conform', name:'Conformação Mecânica',               sem:6,  prereqs:['res_mat1','trat_term'],codigo:'AL0118', ch:'60h'},
  {id:'vibr',    name:'Vibrações de Sistemas Mecânicos',    sem:6,  prereqs:['dinam','eq_dif1'],   codigo:'AL0194', ch:'60h'},
  {id:'sist_prod',name:'Sistemas de Produção',              sem:6,  prereqs:['maq_op'],            codigo:'AL0196', ch:'60h'},
  {id:'maq_el',  name:'Tópicos de Máquinas Elétricas',      sem:6,  prereqs:['eletrot','fis3'],    codigo:'AL0221', ch:'30h'},
  {id:'eng_eco', name:'Introdução à Engenharia Econômica',  sem:6,  prereqs:['probest'],           codigo:'AL0380', ch:'45h'},
  {id:'refrig',  name:'Refrigeração e Ar Condicionado',     sem:6,  prereqs:['termo_ap','mec_flu'],codigo:'AL0471', ch:'60h'},
  {id:'elem_maq1',name:'Elementos de Máquinas I',           sem:6,  prereqs:['res_mat2','trat_term','frat'],codigo:'AL0096', ch:'60h'},
  // 7º SEM
  {id:'elem_maq2',name:'Elementos de Máquinas II',          sem:7,  prereqs:['res_mat1'],          codigo:'AL0117', ch:'60h'},
  {id:'hid_pneu',name:'Sistemas Hidráulicos e Pneumáticos', sem:7,  prereqs:['mec_flu','maq_el'],  codigo:'AL0099', ch:'60h'},
  {id:'cam',     name:'Manufatura Assistida por Computador',sem:7,  prereqs:['dm_comp','usinag'],   codigo:'AL0468', ch:'60h'},
  {id:'sold',    name:'Soldagem',                           sem:7,  prereqs:['trat_term'],          codigo:'AL0469', ch:'60h'},
  {id:'met_proj',name:'Metodologia de Projeto de Produto',  sem:7,  prereqs:['conform'],           codigo:'AL0470', ch:'60h'},
  // 8º SEM
  {id:'leg_et',  name:'Legislação, Ética e Exercício Profissional',sem:8,prereqs:['intro_em'],     codigo:'AL0142', ch:'30h'},
  {id:'ctrl_mec',name:'Controle de Sistemas Mecânicos',     sem:8,  prereqs:['vibr'],              codigo:'AL0215', ch:'60h'},
  {id:'adm',     name:'Administração',                      sem:8,  prereqs:['eng_eco'],           codigo:'AL0394', ch:'30h'},
  {id:'fundicao',name:'Fundição',                           sem:8,  prereqs:['trat_term'],         codigo:'AL0472', ch:'60h'},
  {id:'proj_int1',name:'Projeto Integrado I',               sem:8,  prereqs:['met_proj','elem_maq2'],codigo:'AL0473', ch:'150h'},
  // 9º SEM
  {id:'gest_qual',name:'Sistemas e Gestão de Qualidade',    sem:9,  prereqs:['metro','sist_prod'],  codigo:'AL0116', ch:'60h'},
  {id:'tcc1',    name:'Trabalho de Conclusão de Curso I',   sem:9,  prereqs:[],                    codigo:'AL0241', ch:'30h'},
  {id:'gest_amb',name:'Fundamentos da Gestão Ambiental',    sem:9,  prereqs:[],                    codigo:'AL0390', ch:'30h'},
  {id:'proj_int2',name:'Projeto Integrado II',              sem:9,  prereqs:['proj_int1'],         codigo:'AL0475', ch:'150h'},
  {id:'seg_trab',name:'Segurança e Saúde no Trabalho',      sem:9,  prereqs:[],                    codigo:'AL0368', ch:'30h'},
  // 10º SEM
  {id:'estagio', name:'Estágio Supervisionado',             sem:10, prereqs:[],                    codigo:'AL0242', ch:'300h'},
  {id:'tcc2',    name:'Trabalho de Conclusão de Curso II',  sem:10, prereqs:['tcc1'],              codigo:'AL0159', ch:'30h'},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'em',
    title: "Grade Curricular \u2014 Engenharia Mec\u00e2nica",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
  };
})();
