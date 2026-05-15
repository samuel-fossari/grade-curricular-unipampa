/**
 * Dados da grade — EE (UNIPAMPA Alegrete).
 * Conferência: matriz curricular por núcleos (PDF oficial); códigos AL e semestres.
 * Campo `cat`: núcleos da legenda do PDF. Ementas vazias (exceto CCCG) — ver GUIA_PROJETO.md.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'calc1',   name:'Cálculo I',                                   sem:1,  prereqs:[],                            codigo:'AL0363', ch:'90h',  cat:'ee_matematica'},
  {id:'geom',    name:'Geometria Analítica',                         sem:1,  prereqs:[],                            codigo:'AL0002', ch:'60h',  cat:'ee_matematica'},
  {id:'fis1',    name:'Física I',                                    sem:1,  prereqs:[],                            codigo:'AL0003', ch:'75h',  cat:'ee_fisico_quimica'},
  {id:'intro_ee',name:'Introdução à Engenharia Elétrica',            sem:1,  prereqs:[],                            codigo:'AL0428', ch:'45h',  cat:'ee_relacoes_sociedade'},
  {id:'alg',     name:'Algoritmos e Programação',                    sem:1,  prereqs:[],                            codigo:'AL0005', ch:'60h',  cat:'ee_logica_programacao'},
  // 2º SEM
  {id:'alg_lin', name:'Álgebra Linear',                              sem:2,  prereqs:['geom'],                      codigo:'AL0009', ch:'60h',  cat:'ee_matematica'},
  {id:'calc2',   name:'Cálculo II',                                  sem:2,  prereqs:['calc1'],                     codigo:'AL0010', ch:'60h',  cat:'ee_matematica'},
  {id:'fis2',    name:'Física II',                                   sem:2,  prereqs:['calc1'],                     codigo:'AL0011', ch:'75h',  cat:'ee_fisico_quimica'},
  {id:'circ_med',name:'Introdução a Circuitos e Medidas Elétricas',  sem:2,  prereqs:['fis1'],                      codigo:'AL0412', ch:'30h',  cat:'ee_eletrotecnica'},
  {id:'circ_dig',name:'Circuitos Digitais',                          sem:2,  prereqs:['alg'],                       codigo:'AL0013', ch:'60h',  cat:'ee_sistemas_digitais'},
  {id:'dt',      name:'Desenho Técnico',                             sem:2,  prereqs:[],                            codigo:'AL0007', ch:'30h',  cat:'ee_multidisciplinares'},
  {id:'quim',    name:'Química Geral e Experimental',                sem:2,  prereqs:[],                            codigo:'AL0366', ch:'45h',  cat:'ee_fisico_quimica'},
  // 3º SEM
  {id:'eq_dif1', name:'Equações Diferenciais I',                     sem:3,  prereqs:['calc2'],                     codigo:'AL0019', ch:'60h',  cat:'ee_matematica'},
  {id:'calc3',   name:'Cálculo III',                                 sem:3,  prereqs:['calc2'],                     codigo:'AL0020', ch:'60h',  cat:'ee_matematica'},
  {id:'fis3',    name:'Física III',                                  sem:3,  prereqs:['fis1','calc2'],              codigo:'AL0021', ch:'75h',  cat:'ee_fisico_quimica'},
  {id:'probest', name:'Probabilidade e Estatística',                 sem:3,  prereqs:['calc1'],                     codigo:'AL0022', ch:'60h',  cat:'ee_matematica'},
  {id:'arq_comp',name:'Arquitetura e Org. de Computadores I',        sem:3,  prereqs:['circ_dig'],                  codigo:'AL0023', ch:'60h',  cat:'ee_sistemas_digitais'},
  {id:'circ1',   name:'Circuitos Elétricos I',                       sem:3,  prereqs:['calc2','circ_med'],          codigo:'AL0413', ch:'60h',  cat:'ee_eletrotecnica'},
  // 4º SEM
  {id:'eq_dif2', name:'Equações Diferenciais II',                    sem:4,  prereqs:['eq_dif1'],                   codigo:'AL0036', ch:'60h',  cat:'ee_matematica'},
  {id:'calc_num',name:'Cálculo Numérico',                            sem:4,  prereqs:['alg_lin','calc2'],           codigo:'AL0037', ch:'60h',  cat:'ee_logica_programacao'},
  {id:'sinais',  name:'Sinais e Sistemas',                           sem:4,  prereqs:['calc2'],                     codigo:'AL0272', ch:'60h',  cat:'ee_controle_eletronica_potencia'},
  {id:'eletromag',name:'Eletromagnetismo',                           sem:4,  prereqs:['calc3','fis3'],              codigo:'AL0429', ch:'60h',  cat:'ee_conversao_energia'},
  {id:'fen_trans',name:'Fenômenos de Transferência',                 sem:4,  prereqs:['fis2'],                      codigo:'AL0038', ch:'60h',  cat:'ee_fisico_quimica'},
  {id:'circ2',   name:'Circuitos Elétricos II',                      sem:4,  prereqs:['circ1'],                     codigo:'AL0414', ch:'60h',  cat:'ee_eletrotecnica'},
  {id:'lab_c1',  name:'Laboratório de Circuitos Elétricos I',        sem:4,  prereqs:['circ1'],                     codigo:'AL0415', ch:'30h',  cat:'ee_eletrotecnica'},
  // 5º SEM
  {id:'ctrl1',   name:'Sistemas de Controle I',                      sem:5,  prereqs:['eq_dif2','sinais'],          codigo:'AL0430', ch:'60h',  cat:'ee_controle_eletronica_potencia'},
  {id:'sist_com1',name:'Sistemas de Comunicação I',                  sem:5,  prereqs:['eq_dif2'],                   codigo:'AL0310', ch:'60h',  cat:'ee_telecomunicacoes'},
  {id:'micro',   name:'Microcontroladores',                          sem:5,  prereqs:['arq_comp'],                  codigo:'AL0432', ch:'60h',  cat:'ee_sistemas_digitais'},
  {id:'circ_el1',name:'Circuitos Eletrônicos I',                     sem:5,  prereqs:['circ2'],                     codigo:'AL0419', ch:'60h',  cat:'ee_circuitos_eletronicos'},
  {id:'sep1',    name:'Introdução a Sistemas Elétricos de Potência', sem:5,  prereqs:['circ2'],                     codigo:'AL0431', ch:'60h',  cat:'ee_sistemas_eletricos_potencia'},
  {id:'lab_c2',  name:'Laboratório de Circuitos Elétricos II',       sem:5,  prereqs:['circ2','lab_c1'],            codigo:'AL0418', ch:'30h',  cat:'ee_eletrotecnica'},
  {id:'circ_mag',name:'Circuitos Magnéticos e Transformadores',    sem:5,  prereqs:['eletromag','circ1'],         codigo:'AL0041', ch:'60h',  cat:'ee_conversao_energia'},
  // 6º SEM
  {id:'ctrl2',   name:'Sistemas de Controle II',                     sem:6,  prereqs:['ctrl1'],                     codigo:'AL0433', ch:'60h',  cat:'ee_controle_eletronica_potencia'},
  {id:'circ_el2',name:'Circuitos Eletrônicos II',                    sem:6,  prereqs:['circ_el1'],                  codigo:'AL0421', ch:'60h',  cat:'ee_circuitos_eletronicos'},
  {id:'pds1',    name:'Processamento Digital de Sinais I',           sem:6,  prereqs:['sinais'],                    codigo:'AL0420', ch:'60h',  cat:'ee_telecomunicacoes'},
  {id:'sep2',    name:'Análise de Sistemas Elétricos de Potência',   sem:6,  prereqs:['sep1','calc_num'],           codigo:'AL0434', ch:'60h',  cat:'ee_sistemas_eletricos_potencia'},
  {id:'maq_el1', name:'Máquinas Elétricas I',                        sem:6,  prereqs:['circ_mag'],                  codigo:'AL0058', ch:'60h',  cat:'ee_conversao_energia'},
  {id:'eng_eco', name:'Introdução à Engenharia Econômica',           sem:6,  prereqs:['probest'],                   codigo:'AL0380', ch:'45h',  cat:'ee_gestao'},
  {id:'cccg6',   name:'CCCG 1',                                      sem:6,  prereqs:[],                            codigo:'—',      ch:'60h',  cat:'ee_cccg'},
  // 7º SEM
  {id:'el_pot',  name:'Eletrônica de Potência',                      sem:7,  prereqs:['circ_el1'],                  codigo:'AL0438', ch:'60h',  cat:'ee_controle_eletronica_potencia'},
  {id:'maq_el2', name:'Máquinas Elétricas II',                       sem:7,  prereqs:['maq_el1'],                   codigo:'AL0436', ch:'60h',  cat:'ee_conversao_energia'},
  {id:'el_inst', name:'Eletrônica Aplicada e Instrumentação',        sem:7,  prereqs:['circ_el1'],                  codigo:'AL0437', ch:'60h',  cat:'ee_circuitos_eletronicos'},
  {id:'sist_hid',name:'Sistemas Hidráulicos e Térmicos',             sem:7,  prereqs:['fen_trans'],                 codigo:'AL0056', ch:'60h',  cat:'ee_conversao_energia'},
  {id:'dist_sep',name:'Distribuição de Energia Elétrica',            sem:7,  prereqs:['sep2'],                      codigo:'AL0435', ch:'60h',  cat:'ee_sistemas_eletricos_potencia'},
  {id:'adm',     name:'Administração',                               sem:7,  prereqs:['eng_eco'],                   codigo:'AL0394', ch:'30h',  cat:'ee_gestao'},
  {id:'cccg7',   name:'CCCG 2',                                      sem:7,  prereqs:[],                            codigo:'—',      ch:'60h',  cat:'ee_cccg'},
  // 8º SEM
  {id:'inst_pred',name:'Instalações Elétricas Prediais',             sem:8,  prereqs:['dt','circ2'],                codigo:'AL0441', ch:'60h',  cat:'ee_eletrotecnica'},
  {id:'aut_ind', name:'Automação de Processos Industriais',          sem:8,  prereqs:['arq_comp'],                  codigo:'AL0442', ch:'60h',  cat:'ee_logica_programacao'},
  {id:'empreend',name:'Empreendedorismo',                            sem:8,  prereqs:['adm'],                       codigo:'AL0402', ch:'30h',  cat:'ee_gestao'},
  {id:'tcc1',    name:'Trabalho de Conclusão de Curso I',            sem:8,  prereqs:[],                            codigo:'AL0440', ch:'30h',  cat:'ee_multidisciplinares', specialMinCH:2400},
  {id:'proj_int1',name:'Projeto Integrado I',                        sem:8,  prereqs:[],                            codigo:'AL0439', ch:'150h', cat:'ee_multidisciplinares', specialMinCH:2400},
  {id:'cccg8',   name:'CCCG 3',                                      sem:8,  prereqs:[],                            codigo:'—',      ch:'60h',  cat:'ee_cccg'},
  // 9º SEM
  {id:'inst_ind',name:'Instalações Elétricas Industriais',           sem:9,  prereqs:['inst_pred','sep2'],          codigo:'AL0446', ch:'60h',  cat:'ee_eletrotecnica'},
  {id:'leg_et',  name:'Legislação, Ética e Exercício Profissional da Engenharia', sem:9, prereqs:[], codigo:'AL0142', ch:'30h', cat:'ee_relacoes_sociedade', specialMinCH:2400},
  {id:'plan_sep',name:'Planejamento, Operação e Controle de SEP',    sem:9,  prereqs:['sep2','ctrl2'],              codigo:'AL0445', ch:'60h',  cat:'ee_sistemas_eletricos_potencia'},
  {id:'gest_amb',name:'Fundamentos da Gestão Ambiental',             sem:9,  prereqs:['adm'],                       codigo:'AL0390', ch:'30h',  cat:'ee_gestao'},
  {id:'seg_trab',name:'Segurança e Saúde no Trabalho',               sem:9,  prereqs:[],                            codigo:'AL0368', ch:'30h',  cat:'ee_gestao'},
  {id:'tcc2',    name:'Trabalho de Conclusão de Curso II',           sem:9,  prereqs:['tcc1'],                      codigo:'AL0444', ch:'60h',  cat:'ee_multidisciplinares'},
  {id:'proj_int2',name:'Projeto Integrado II',                       sem:9,  prereqs:['proj_int1'],                 codigo:'AL0443', ch:'150h', cat:'ee_multidisciplinares'},
  // 10º SEM
  {id:'estagio', name:'Estágio Supervisionado em Engenharia Elétrica 2', sem:10, prereqs:[], codigo:'AL0447', ch:'240h', cat:'ee_multidisciplinares', specialMinCH:2950},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'ee',
    title: "Grade Curricular \u2014 Engenharia El\u00e9trica",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
  };
})();
