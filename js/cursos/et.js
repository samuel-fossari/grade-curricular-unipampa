/**
 * Dados da grade — ET (UNIPAMPA Alegrete).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'calc1',   name:'Cálculo I',                          sem:1,  prereqs:[],                   codigo:'AL0363', ch:'90h'},
  {id:'fis1',    name:'Física I',                           sem:1,  prereqs:[],                   codigo:'AL0003', ch:'75h'},
  {id:'geom',    name:'Geometria Analítica',                sem:1,  prereqs:[],                   codigo:'AL0002', ch:'60h'},
  {id:'intro_ct',name:'Introdução à Ciência e Tecnologia',  sem:1,  prereqs:[],                   codigo:'AL0004', ch:'30h'},
  {id:'alg',     name:'Algoritmos e Programação',           sem:1,  prereqs:[],                   codigo:'AL0005', ch:'60h'},
  {id:'seg_trab',name:'Segurança e Saúde no Trabalho',      sem:1,  prereqs:[],                   codigo:'AL0368', ch:'30h'},
  {id:'ext1',    name:'Extensão I',                         sem:1,  prereqs:[],                   codigo:'AL0411', ch:'45h'},
  // 2º SEM
  {id:'alg_lin', name:'Álgebra Linear',                     sem:2,  prereqs:[],                   codigo:'AL0009', ch:'60h'},
  {id:'calc2',   name:'Cálculo II',                         sem:2,  prereqs:['calc1'],            codigo:'AL0010', ch:'60h'},
  {id:'fis2',    name:'Física II',                          sem:2,  prereqs:['fis1'],             codigo:'AL0011', ch:'75h'},
  {id:'quim',    name:'Química Geral e Experimental',       sem:2,  prereqs:[],                   codigo:'AL0366', ch:'45h'},
  {id:'circ_dig',name:'Circuitos Digitais',                 sem:2,  prereqs:[],                   codigo:'AL0013', ch:'60h'},
  {id:'probest', name:'Probabilidade e Estatística',        sem:2,  prereqs:[],                   codigo:'AL0022', ch:'60h'},
  {id:'circ_med',name:'Introdução a Circuitos e Medidas Elétricas',sem:2,prereqs:[],             codigo:'AL0412', ch:'30h'},
  // 3º SEM
  {id:'eq_dif1', name:'Equações Diferenciais I',            sem:3,  prereqs:['calc2'],            codigo:'AL0019', ch:'60h'},
  {id:'calc3',   name:'Cálculo III',                        sem:3,  prereqs:['calc2'],            codigo:'AL0020', ch:'60h'},
  {id:'fis3',    name:'Física III',                         sem:3,  prereqs:['calc2'],            codigo:'AL0021', ch:'75h'},
  {id:'gest_amb',name:'Fundamentos da Gestão Ambiental',    sem:3,  prereqs:[],                   codigo:'AL0390', ch:'30h'},
  {id:'arq_comp',name:'Arquitetura e Org. de Computadores I',sem:3, prereqs:['circ_dig'],         codigo:'AL0023', ch:'60h'},
  {id:'circ1',   name:'Circuitos Elétricos I',              sem:3,  prereqs:['calc2'],            codigo:'AL0413', ch:'60h'},
  {id:'dtcd',    name:'Desenho Técnico Civil e Digital',    sem:3,  prereqs:[],                   codigo:'AL0367', ch:'60h'},
  // 4º SEM
  {id:'eletromag',name:'Eletromagnetismo Aplicado',         sem:4,  prereqs:['calc3','fis3'],     codigo:'AL0270', ch:'60h'},
  {id:'fis_apl', name:'Física Aplicada',                    sem:4,  prereqs:['fis3'],             codigo:'AL0271', ch:'75h'},
  {id:'eq_dif2', name:'Equações Diferenciais II',           sem:4,  prereqs:['eq_dif1'],          codigo:'AL0036', ch:'60h'},
  {id:'sinais',  name:'Sinais e Sistemas',                  sem:4,  prereqs:['calc2'],            codigo:'AL0272', ch:'60h'},
  {id:'circ2',   name:'Circuitos Elétricos II',             sem:4,  prereqs:['circ1'],            codigo:'AL0414', ch:'60h'},
  {id:'lab_c1',  name:'Laboratório de Circuitos Elétricos I',sem:4, prereqs:['circ_med','circ1'], codigo:'AL0415', ch:'30h'},
  {id:'calc_num',name:'Cálculo Numérico',                   sem:4,  prereqs:['alg'],              codigo:'AL0037', ch:'60h'},
  // 5º SEM
  {id:'ondas',   name:'Ondas e Linhas',                     sem:5,  prereqs:['eletromag'],        codigo:'AL0307', ch:'60h'},
  {id:'fot',     name:'Dispositivos Fotônicos',             sem:5,  prereqs:['fis_apl'],          codigo:'AL2165', ch:'60h'},
  {id:'proc_est',name:'Processos Estocásticos',             sem:5,  prereqs:['calc2','probest'],  codigo:'AL0308', ch:'60h'},
  {id:'sist_com1',name:'Sistemas de Comunicação I',         sem:5,  prereqs:['sinais'],           codigo:'AL0310', ch:'60h'},
  {id:'so',      name:'Sistemas Operacionais',              sem:5,  prereqs:['alg'],              codigo:'AL0341', ch:'30h'},
  {id:'lab_c2',  name:'Lab. de Circuitos Elétricos II',     sem:5,  prereqs:['circ2','lab_c1'],   codigo:'AL0418', ch:'30h'},
  {id:'circ_el1',name:'Circuitos Eletrônicos I',            sem:5,  prereqs:['circ1'],            codigo:'AL0419', ch:'60h'},
  // 6º SEM
  {id:'pds1',    name:'Processamento Digital de Sinais I',  sem:6,  prereqs:['sinais'],           codigo:'AL0420', ch:'60h'},
  {id:'microond',name:'Micro-ondas',                        sem:6,  prereqs:['ondas'],            codigo:'AL0315', ch:'60h'},
  {id:'sist_com2',name:'Sistemas de Comunicação II',        sem:6,  prereqs:['sist_com1'],        codigo:'AL0313', ch:'60h'},
  {id:'redes_com',name:'Redes de Comunicação',              sem:6,  prereqs:['so'],               codigo:'AL0309', ch:'60h'},
  {id:'circ_el2',name:'Circuitos Eletrônicos II',           sem:6,  prereqs:['circ_el1','lab_c2'],codigo:'AL0421', ch:'60h'},
  {id:'com_opt', name:'Comunicações Ópticas',               sem:6,  prereqs:['fot'],              codigo:'AL0322', ch:'60h'},
  {id:'inst_el', name:'Instalações Elétricas Prediais',     sem:6,  prereqs:['circ2'],            codigo:'AL0081', ch:'60h'},
  {id:'ext2',    name:'Extensão II',                        sem:6,  prereqs:['ext1'],             codigo:'AL0422', ch:'60h'},
  // 7º SEM
  {id:'antenas', name:'Antenas',                            sem:7,  prereqs:['ondas'],            codigo:'AL0316', ch:'60h'},
  {id:'sist_com3',name:'Sistemas de Comunicação III',       sem:7,  prereqs:['sist_com2'],        codigo:'AL0318', ch:'60h'},
  {id:'sist_dist',name:'Fundamentos de Sistemas Distribuídos',sem:7,prereqs:['redes_com'],        codigo:'AL0423', ch:'30h'},
  {id:'el_inst', name:'Eletrônica Aplicada e Instrumentação',sem:7, prereqs:['circ_el2'],         codigo:'AL0059', ch:'60h'},
  {id:'circ_el3',name:'Circuitos Eletrônicos III',          sem:7,  prereqs:['circ_el2'],         codigo:'AL0424', ch:'60h'},
  {id:'pds2',    name:'Processamento Digital de Sinais II', sem:7,  prereqs:['pds1'],             codigo:'AL0425', ch:'60h'},
  {id:'eng_eco', name:'Introdução à Engenharia Econômica',  sem:7,  prereqs:['probest'],          codigo:'AL0380', ch:'45h'},
  {id:'ext3',    name:'Extensão III',                       sem:7,  prereqs:['ext2'],             codigo:'AL0426', ch:'60h'},
  // 8º SEM
  {id:'prop',    name:'Propagação',                         sem:8,  prereqs:['ondas'],            codigo:'AL0317', ch:'60h'},
  {id:'circ_mw', name:'Circuitos Ativos em Micro-ondas',    sem:8,  prereqs:['microond'],         codigo:'AL0320', ch:'60h'},
  {id:'com_mov', name:'Comunicações Móveis',                sem:8,  prereqs:['sist_com2'],        codigo:'AL0321', ch:'30h'},
  {id:'proj_rf', name:'Projeto de Receptores e Transmissores de RF',sem:8,prereqs:['circ_el3'],  codigo:'AL0427', ch:'60h'},
  {id:'micro',   name:'Microcontroladores',                 sem:8,  prereqs:['circ_el1'],         codigo:'AL0105', ch:'60h'},
  {id:'proj_pesq',name:'Projeto de Pesquisa e Desenvolvimento',sem:8,prereqs:[],                  codigo:'AL0144', ch:'45h'},
  {id:'adm',     name:'Administração',                      sem:8,  prereqs:['eng_eco'],          codigo:'AL0394', ch:'30h'},
  // 9º SEM
  {id:'tcc',     name:'Trabalho de Conclusão de Curso',     sem:9,  prereqs:['proj_pesq'],        codigo:'AL0155', ch:'60h'},
  {id:'leg_et',  name:'Legislação, Ética e Exercício Profissional',sem:9,prereqs:[],              codigo:'AL0142', ch:'30h'},
  {id:'empreend',name:'Empreendedorismo',                   sem:9,  prereqs:['adm'],              codigo:'AL0402', ch:'30h'},
  {id:'cccg1',   name:'CCCGs',                              sem:9,  prereqs:[],                   codigo:'—',      ch:'60h'},
  {id:'cccg2',   name:'CCCGs',                              sem:9,  prereqs:[],                   codigo:'—',      ch:'60h'},
  // 10º SEM
  {id:'estagio', name:'Estágio Supervisionado', sem:10, prereqs:[], codigo:'AL0448', ch:'165h', specialNote: 'Este componente costuma exigir a conclusão de cerca de 80% das componentes curriculares obrigatórias — confirme com a coordenação.' },
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'et',
    title: "Grade Curricular \u2014 Engenharia de Telecomunica\u00e7\u00f5es",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC vigente",
    maxSemesters: 10,
    disciplines,
  };
})();
