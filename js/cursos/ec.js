/**
 * Dados da grade — EC (UNIPAMPA Alegrete).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'intro_ec',name:'Introdução à Engenharia Civil',     sem:1,  prereqs:[],                           codigo:'AL0362', ch:'30h'},
  {id:'geom',    name:'Geometria Analítica',               sem:1,  prereqs:[],                           codigo:'AL0002', ch:'60h'},
  {id:'calc1',   name:'Cálculo I',                         sem:1,  prereqs:[],                           codigo:'AL0363', ch:'90h'},
  {id:'dt',      name:'Desenho Técnico',                   sem:1,  prereqs:[],                           codigo:'AL0007', ch:'30h'},
  {id:'geo_desc',name:'Geometria Descritiva',              sem:1,  prereqs:[],                           codigo:'AL0364', ch:'60h'},
  {id:'alg',     name:'Algoritmos e Programação',          sem:1,  prereqs:[],                           codigo:'AL0005', ch:'60h'},
  {id:'ext1',    name:'Práticas de Extensão EC I',         sem:1,  prereqs:[],                           codigo:'AL0365', ch:'30h'},
  // 2º SEM
  {id:'quim',    name:'Química Geral e Experimental',      sem:2,  prereqs:[],                           codigo:'AL0366', ch:'45h'},
  {id:'alg_lin', name:'Álgebra Linear',                    sem:2,  prereqs:['geom'],                     codigo:'AL0009', ch:'60h'},
  {id:'calc2',   name:'Cálculo II',                        sem:2,  prereqs:['calc1'],                    codigo:'AL0010', ch:'60h'},
  {id:'dtcd',    name:'Desenho Técnico Civil e Digital',   sem:2,  prereqs:['dt','geo_desc'],             codigo:'AL0367', ch:'60h'},
  {id:'seg_trab',name:'Segurança e Saúde no Trabalho',     sem:2,  prereqs:[],                           codigo:'AL0368', ch:'30h'},
  {id:'fis1',    name:'Física I',                          sem:2,  prereqs:['calc1'],                    codigo:'AL0003', ch:'75h'},
  {id:'ext2',    name:'Práticas de Extensão EC II',        sem:2,  prereqs:['ext1'],                     codigo:'AL0369', ch:'30h'},
  // 3º SEM
  {id:'mec_ger', name:'Mecânica Geral',                    sem:3,  prereqs:['fis1'],                     codigo:'AL0015', ch:'60h'},
  {id:'cien_mat',name:'Ciência dos Materiais',             sem:3,  prereqs:['quim'],                     codigo:'AL0371', ch:'60h'},
  {id:'probest', name:'Probabilidade e Estatística',       sem:3,  prereqs:['calc2'],                    codigo:'AL0022', ch:'60h'},
  {id:'eq_dif',  name:'Equações Diferenciais I',           sem:3,  prereqs:['calc2'],                    codigo:'AL0019', ch:'60h'},
  {id:'transp',  name:'Sistemas de Transportes',           sem:3,  prereqs:[],                           codigo:'AL0372', ch:'60h'},
  {id:'fis2',    name:'Física II',                         sem:3,  prereqs:['fis1'],                     codigo:'AL0011', ch:'75h'},
  {id:'ext3',    name:'Práticas de Extensão EC III',       sem:3,  prereqs:['ext1'],                     codigo:'AL0374', ch:'30h'},
  // 4º SEM
  {id:'res_mat1',name:'Resistência dos Materiais I',       sem:4,  prereqs:['mec_ger'],                  codigo:'AL0375', ch:'60h'},
  {id:'mat_cons1',name:'Materiais de Construção Civil I',  sem:4,  prereqs:['cien_mat'],                 codigo:'AL0376', ch:'60h'},
  {id:'est_iso', name:'Estruturas Isostáticas',            sem:4,  prereqs:['mec_ger'],                  codigo:'AL0377', ch:'60h'},
  {id:'top',     name:'Topografia e Elementos de Geodésia',sem:4,  prereqs:['geom'],                     codigo:'AL0046', ch:'90h'},
  {id:'geo_eng', name:'Geologia de Engenharia',            sem:4,  prereqs:[],                           codigo:'AL0378', ch:'60h'},
  {id:'fen_trans',name:'Fenômenos de Transferência',       sem:4,  prereqs:['calc2','fis2'],             codigo:'AL0038', ch:'60h'},
  {id:'eng_traf',name:'Engenharia de Tráfego',             sem:4,  prereqs:['transp'],                   codigo:'AL0379', ch:'60h'},
  {id:'eng_eco', name:'Introdução à Engenharia Econômica', sem:4,  prereqs:['probest'],                  codigo:'AL0380', ch:'45h'},
  // 5º SEM
  {id:'res_mat2',name:'Resistência dos Materiais II',      sem:5,  prereqs:['res_mat1'],                 codigo:'AL0381', ch:'60h'},
  {id:'mat_cons2',name:'Materiais de Construção Civil II', sem:5,  prereqs:['mat_cons1'],                codigo:'AL0382', ch:'60h'},
  {id:'hidro',   name:'Hidrologia',                        sem:5,  prereqs:['probest'],                  codigo:'AL0109', ch:'60h'},
  {id:'hidraul', name:'Hidráulica Geral',                  sem:5,  prereqs:['fen_trans'],                codigo:'AL0170', ch:'75h'},
  {id:'mec_solo1',name:'Mecânica dos Solos I',             sem:5,  prereqs:['geo_eng'],                  codigo:'AL0383', ch:'60h'},
  {id:'proj_via',name:'Projeto de Estruturas Viárias',     sem:5,  prereqs:['dtcd','top'],               codigo:'AL0063', ch:'60h'},
  {id:'eletrot', name:'Eletrotécnica',                     sem:5,  prereqs:[],                           codigo:'AL0006', ch:'45h'},
  {id:'calc_num',name:'Cálculo Numérico',                  sem:5,  prereqs:['alg','alg_lin','calc2'],    codigo:'AL0037', ch:'60h'},
  // 6º SEM
  {id:'est_hiper',name:'Estruturas Hiperestáticas',        sem:6,  prereqs:['est_iso','res_mat2'],        codigo:'AL0384', ch:'60h'},
  {id:'const1',  name:'Construção Civil I',                sem:6,  prereqs:['mat_cons2'],                codigo:'AL0089', ch:'60h'},
  {id:'acoes',   name:'Ações e Segurança das Estruturas',  sem:6,  prereqs:['res_mat2'],                 codigo:'AL0385', ch:'60h'},
  {id:'inst_hid',name:'Instalações Hidráulicas Prediais',  sem:6,  prereqs:['hidro','hidraul'],          codigo:'AL0163', ch:'60h'},
  {id:'mec_solo2',name:'Mecânica dos Solos II',            sem:6,  prereqs:['mec_solo1'],                codigo:'AL0386', ch:'60h'},
  {id:'terrap',  name:'Terraplanagem e Movimentação de Terra',sem:6,prereqs:['mec_solo1','proj_via'],    codigo:'AL0086', ch:'60h'},
  {id:'inst_el', name:'Instalações Elétricas Prediais',    sem:6,  prereqs:['eletrot'],                  codigo:'AL0081', ch:'60h'},
  {id:'arq',     name:'Arquitetura',                       sem:6,  prereqs:['dtcd'],                     codigo:'AL0171', ch:'60h'},
  // 7º SEM
  {id:'conc1',   name:'Concreto Armado I',                 sem:7,  prereqs:['res_mat2','calc_num','acoes'],codigo:'AL0388', ch:'60h'},
  {id:'const2',  name:'Construção Civil II',               sem:7,  prereqs:['const1'],                   codigo:'AL0389', ch:'60h'},
  {id:'gest_amb',name:'Fundamentos da Gestão Ambiental',   sem:7,  prereqs:[],                           codigo:'AL0390', ch:'30h'},
  {id:'san1',    name:'Sistemas de Saneamento Básico I',   sem:7,  prereqs:['hidro','hidraul'],          codigo:'AL0391', ch:'60h'},
  {id:'obras_t', name:'Obras de Terra',                    sem:7,  prereqs:['mec_solo2'],                codigo:'AL0392', ch:'60h'},
  {id:'mat_via', name:'Materiais de Estruturas Viárias',   sem:7,  prereqs:['mec_solo1','terrap'],       codigo:'AL0393', ch:'60h'},
  {id:'adm',     name:'Administração',                     sem:7,  prereqs:['eng_eco'],                  codigo:'AL0394', ch:'30h'},
  {id:'ext7',    name:'Práticas de Extensão EC VII',       sem:7,  prereqs:['ext3'],                     codigo:'AL0395', ch:'30h'},
  // 8º SEM
  {id:'conc2',   name:'Concreto Armado II',                sem:8,  prereqs:['conc1','est_hiper'],        codigo:'AL0396', ch:'60h'},
  {id:'orc_ob',  name:'Orçamento e Programação de Obras',  sem:8,  prereqs:['const2','inst_el','inst_hid'],codigo:'AL0397', ch:'60h'},
  {id:'est_mad', name:'Estruturas de Madeira',             sem:8,  prereqs:['est_hiper','acoes'],        codigo:'AL0398', ch:'45h'},
  {id:'san2',    name:'Sistemas de Saneamento Básico II',  sem:8,  prereqs:['san1'],                     codigo:'AL0399', ch:'60h'},
  {id:'fund',    name:'Fundações',                         sem:8,  prereqs:['obras_t'],                  codigo:'AL0400', ch:'60h'},
  {id:'est_via', name:'Estruturas Viárias e Mec. Pavimentos',sem:8,prereqs:['transp','mat_via'],         codigo:'AL0401', ch:'60h'},
  {id:'empreend',name:'Empreendedorismo',                  sem:8,  prereqs:['adm'],                      codigo:'AL0402', ch:'30h'},
  {id:'ext8',    name:'Práticas de Extensão EC VIII',      sem:8,  prereqs:['ext3'],                     codigo:'AL0403', ch:'30h'},
  // 9º SEM
  {id:'conc3',   name:'Concreto Armado III',               sem:9,  prereqs:['conc2'],                    codigo:'AL0404', ch:'60h'},
  {id:'ger_ob',  name:'Gerenciamento de Obras',            sem:9,  prereqs:['adm','orc_ob'],             codigo:'AL0405', ch:'60h'},
  {id:'est_aco', name:'Estruturas de Aço',                 sem:9,  prereqs:['est_hiper','acoes'],        codigo:'AL0406', ch:'60h'},
  {id:'pat',     name:'Patologia das Construções',         sem:9,  prereqs:['const2'],                   codigo:'AL0407', ch:'60h'},
  {id:'tcc1',    name:'Trabalho de Conclusão de Curso I',  sem:9,  prereqs:[],                           codigo:'AL0148', ch:'30h'},
  {id:'leg_et',  name:'Legislação, Ética e Exercício Profissional',sem:9,prereqs:[],                    codigo:'AL0142', ch:'30h'},
  {id:'proj_int',name:'Projeto Integrado',                 sem:9,  prereqs:['conc2','san2','arq','fund'],codigo:'AL0408', ch:'60h'},
  {id:'ext9',    name:'Práticas de Extensão EC IX',        sem:9,  prereqs:['ext7'],                     codigo:'AL0409', ch:'30h'},
  // 10º SEM
  {id:'estagio', name:'Estágio Supervisionado',            sem:10, prereqs:[],                           codigo:'AL0410', ch:'240h'},
  {id:'tcc2',    name:'Trabalho de Conclusão de Curso II', sem:10, prereqs:['tcc1'],                     codigo:'AL0157', ch:'30h'},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'ec',
    title: "Grade Curricular \u2014 Engenharia Civil",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
  };
})();
