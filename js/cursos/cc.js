/**
 * Dados da grade — CC (UNIPAMPA Alegrete).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'alg',    name:'Algoritmos e Programação para Computação', sem:1, cat:'computacao',  prereqs:[],            codigo:'AL0493', ch:'90h'},
  {id:'intro',  name:'Introdução à Computação',                  sem:1, cat:'computacao',  prereqs:[],            codigo:'AL0494', ch:'30h'},
  {id:'circ',   name:'Circuitos Digitais',                       sem:1, cat:'computacao',  prereqs:[],            codigo:'AL0013', ch:'60h'},
  {id:'fmat',   name:'Fundamentos de Matemática para Computação',sem:1, cat:'matematica',  prereqs:[],            codigo:'AL0495', ch:'60h'},
  {id:'logica', name:'Lógica Matemática',                        sem:1, cat:'matematica',  prereqs:[],            codigo:'AL0324', ch:'60h'},
  // 2º SEM
  {id:'ed1',    name:'Estruturas de Dados I',                    sem:2, cat:'computacao',  prereqs:['alg'],       codigo:'AL0506', ch:'60h'},
  {id:'arq1',   name:'Arquitetura e Org. de Computadores I',     sem:2, cat:'computacao',  prereqs:[],            codigo:'AL0023', ch:'60h'},
  {id:'geom',   name:'Geometria Analítica',                      sem:2, cat:'matematica',  prereqs:[],            codigo:'AL0002', ch:'60h'},
  {id:'calc1',  name:'Cálculo para Computação I',               sem:2, cat:'matematica',  prereqs:['fmat'],      codigo:'AL0496', ch:'60h'},
  {id:'etica',  name:'Ética e Legislação em Computação',         sem:2, cat:'profissional',prereqs:[],            codigo:'AL0348', ch:'30h'},
  {id:'inov',   name:'Inovação e Criatividade',                  sem:2, cat:'profissional',prereqs:[],            codigo:'AL0335', ch:'30h'},
  // 3º SEM
  {id:'ed2',    name:'Estruturas de Dados II',                   sem:3, cat:'computacao',  prereqs:['ed1'],       codigo:'AL0507', ch:'60h'},
  {id:'poo',    name:'Programação Orientada a Objetos',          sem:3, cat:'computacao',  prereqs:['ed1'],       codigo:'AL0050', ch:'60h'},
  {id:'arq2',   name:'Arquitetura e Org. de Computadores II',    sem:3, cat:'computacao',  prereqs:[],            codigo:'AL0508', ch:'60h'},
  {id:'alg_lin',name:'Álgebra Linear',                           sem:3, cat:'matematica',  prereqs:[],            codigo:'AL0009', ch:'60h'},
  {id:'calc2',  name:'Cálculo para Computação II',              sem:3, cat:'matematica',  prereqs:['calc1'],     codigo:'AL0497', ch:'60h'},
  // 4º SEM
  {id:'ed3',    name:'Estruturas de Dados III',                  sem:4, cat:'computacao',  prereqs:['ed1'],       codigo:'AL0498', ch:'60h'},
  {id:'grafos', name:'Teoria dos Grafos',                        sem:4, cat:'computacao',  prereqs:['fmat','ed1'],codigo:'AL0499', ch:'60h'},
  {id:'apa',    name:'Projeto e Análise de Algoritmos',          sem:4, cat:'computacao',  prereqs:['fmat','ed1'],codigo:'AL0509', ch:'60h'},
  {id:'so',     name:'Sistemas Operacionais',                    sem:4, cat:'computacao',  prereqs:[],            codigo:'AL0510', ch:'60h'},
  {id:'probest',name:'Probabilidade e Estatística',              sem:4, cat:'matematica',  prereqs:[],            codigo:'AL0022', ch:'60h'},
  // 5º SEM
  {id:'lf',     name:'Linguagens Formais',                       sem:5, cat:'computacao',  prereqs:['fmat'],      codigo:'AL0336', ch:'60h'},
  {id:'ia',     name:'Inteligência Artificial',                  sem:5, cat:'computacao',  prereqs:[],            codigo:'AL0069', ch:'60h'},
  {id:'bd',     name:'Banco de Dados',                           sem:5, cat:'computacao',  prereqs:[],            codigo:'AL0500', ch:'60h'},
  {id:'redes',  name:'Redes de Computadores',                    sem:5, cat:'computacao',  prereqs:[],            codigo:'AL0511', ch:'60h'},
  {id:'cccg5',  name:'CCCGs',                                    sem:5, cat:'nao_definido',prereqs:[],            codigo:'—',      ch:'120h'},
  // 6º SEM
  {id:'tc',     name:'Teoria da Computação',                     sem:6, cat:'computacao',  prereqs:['fmat'],      codigo:'AL0501', ch:'60h'},
  {id:'cg',     name:'Computação Gráfica',                       sem:6, cat:'computacao',  prereqs:[],            codigo:'AL0512', ch:'60h'},
  {id:'esw',    name:'Engenharia de Software',                   sem:6, cat:'software',    prereqs:[],            codigo:'AL0504', ch:'60h'},
  {id:'ihc',    name:'Interação Humano-Computador',              sem:6, cat:'software',    prereqs:[],            codigo:'AL0502', ch:'60h'},
  {id:'metci',  name:'Metodologia Científica',                   sem:6, cat:'profissional',prereqs:[],            codigo:'AL0503', ch:'60h'},
  {id:'cccg6',  name:'CCCGs',                                    sem:6, cat:'nao_definido',prereqs:[],            codigo:'—',      ch:'60h'},
  // 7º SEM — reservado para CCCGs
  {id:'cccg7',  name:'CCCGs',                                    sem:7, cat:'nao_definido',prereqs:[],            codigo:'—',      ch:'300h'},
  // 8º SEM
  {id:'tcc1',   name:'Trabalho de Conclusão de Curso I',         sem:8, cat:'nao_definido',prereqs:[],            codigo:'AL0350', ch:'120h'},
  {id:'cccg8',  name:'CCCGs',                                    sem:8, cat:'nao_definido',prereqs:[],            codigo:'—',      ch:'120h'},
  // 9º SEM
  {id:'tcc2',   name:'Trabalho de Conclusão de Curso II',        sem:9, cat:'nao_definido',prereqs:['tcc1'],      codigo:'AL0351', ch:'120h'},
  {id:'cccg9',  name:'CCCGs',                                    sem:9, cat:'nao_definido',prereqs:[],            codigo:'—',      ch:'60h'},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'cc',
    title: "Grade Curricular \u2014 Ci\u00eancia da Computa\u00e7\u00e3o",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 9,
    disciplines,
  };
})();
