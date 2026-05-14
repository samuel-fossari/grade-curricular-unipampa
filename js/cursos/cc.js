/**
 * Dados da grade — CC (UNIPAMPA Alegrete).
 * Categorias conforme fluxograma do PPC (CCOG: Fundamentos, Tecnologias,
 * Matemática, Contexto social e profissional, TCC; à parte: CCCG).
 * Fonte: GUIA_PROJETO.md; pré-requisitos com [VALIDAR] no guia quando indicado.
 * Ementas vazias (exceto CCCG) — ver política no guia.
 */
(function () {
'use strict';
const disciplines = [
  // 1º SEM
  {id:'alg',    name:'Algoritmos e Programação para Computação', sem:1, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0493', ch:'90h'},
  {id:'intro',  name:'Introdução à Computação',                  sem:1, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0494', ch:'30h'},
  {id:'circ',   name:'Circuitos Digitais',                       sem:1, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0013', ch:'60h'},
  {id:'fmat',   name:'Fundamentos de Matemática para Computação',sem:1, cat:'cc_matematica',  prereqs:[],            codigo:'AL0495', ch:'60h'},
  {id:'logica', name:'Lógica Matemática',                        sem:1, cat:'cc_matematica',  prereqs:[],            codigo:'AL0324', ch:'60h'},
  // 2º SEM
  {id:'ed1',    name:'Estruturas de Dados I',                    sem:2, cat:'cc_fundamentos', prereqs:['alg'],       codigo:'AL0506', ch:'60h'},
  {id:'arq1',   name:'Arquitetura e Org. de Computadores I',     sem:2, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0023', ch:'60h'},
  {id:'geom',   name:'Geometria Analítica',                      sem:2, cat:'cc_matematica',  prereqs:[],            codigo:'AL0002', ch:'60h'},
  {id:'calc1',  name:'Cálculo para Computação I',               sem:2, cat:'cc_matematica',  prereqs:['fmat'],      codigo:'AL0496', ch:'60h'},
  {id:'etica',  name:'Ética e Legislação em Computação',         sem:2, cat:'cc_contexto',    prereqs:[],            codigo:'AL0348', ch:'30h'},
  {id:'inov',   name:'Inovação e Criatividade',                  sem:2, cat:'cc_contexto',    prereqs:[],            codigo:'AL0335', ch:'30h'},
  // 3º SEM
  {id:'ed2',    name:'Estruturas de Dados II',                   sem:3, cat:'cc_fundamentos', prereqs:['ed1'],       codigo:'AL0507', ch:'60h'},
  {id:'poo',    name:'Programação Orientada a Objetos',          sem:3, cat:'cc_fundamentos', prereqs:['ed1'],       codigo:'AL0050', ch:'60h'},
  {id:'arq2',   name:'Arquitetura e Org. de Computadores II',    sem:3, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0508', ch:'60h'},
  {id:'alg_lin',name:'Álgebra Linear',                           sem:3, cat:'cc_matematica',  prereqs:[],            codigo:'AL0009', ch:'60h'},
  {id:'calc2',  name:'Cálculo para Computação II',              sem:3, cat:'cc_matematica',  prereqs:['calc1'],     codigo:'AL0497', ch:'60h'},
  // 4º SEM
  {id:'ed3',    name:'Estruturas de Dados III',                  sem:4, cat:'cc_fundamentos', prereqs:['ed1'],       codigo:'AL0498', ch:'60h'},
  {id:'grafos', name:'Teoria dos Grafos',                        sem:4, cat:'cc_fundamentos', prereqs:['fmat','ed1'],codigo:'AL0499', ch:'60h'},
  {id:'apa',    name:'Projeto e Análise de Algoritmos',          sem:4, cat:'cc_fundamentos', prereqs:['fmat','ed1'],codigo:'AL0509', ch:'60h'},
  {id:'so',     name:'Sistemas Operacionais',                    sem:4, cat:'cc_fundamentos', prereqs:[],            codigo:'AL0510', ch:'60h'},
  {id:'probest',name:'Probabilidade e Estatística',              sem:4, cat:'cc_matematica',  prereqs:[],            codigo:'AL0022', ch:'60h'},
  // 5º SEM
  {id:'lf',     name:'Linguagens Formais',                       sem:5, cat:'cc_fundamentos', prereqs:['fmat'],      codigo:'AL0336', ch:'60h'},
  {id:'ia',     name:'Inteligência Artificial',                  sem:5, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0069', ch:'60h'},
  {id:'bd',     name:'Banco de Dados',                           sem:5, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0500', ch:'60h'},
  {id:'redes',  name:'Redes de Computadores',                    sem:5, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0511', ch:'60h'},
  {id:'cccg5a', name:'CCCG 1',                                   sem:5, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg5b', name:'CCCG 2',                                   sem:5, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  // 6º SEM
  {id:'tc',     name:'Teoria da Computação',                     sem:6, cat:'cc_fundamentos', prereqs:['fmat'],      codigo:'AL0501', ch:'60h'},
  {id:'cg',     name:'Computação Gráfica',                       sem:6, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0512', ch:'60h'},
  {id:'esw',    name:'Engenharia de Software',                   sem:6, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0504', ch:'60h'},
  {id:'ihc',    name:'Interação Humano-Computador',              sem:6, cat:'cc_tecnologias', prereqs:[],            codigo:'AL0502', ch:'60h'},
  {id:'metci',  name:'Metodologia Científica',                   sem:6, cat:'cc_contexto',    prereqs:[],            codigo:'AL0503', ch:'60h'},
  {id:'cccg6a', name:'CCCG 1',                                   sem:6, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  // 7º SEM — cinco vagas de CCCG (60h cada)
  {id:'cccg7a', name:'CCCG 1',                                   sem:7, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg7b', name:'CCCG 2',                                   sem:7, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg7c', name:'CCCG 3',                                   sem:7, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg7d', name:'CCCG 4',                                   sem:7, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg7e', name:'CCCG 5',                                   sem:7, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  // 8º SEM
  {id:'tcc1',   name:'Trabalho de Conclusão de Curso I',         sem:8, cat:'cc_tcc',         prereqs:[],            codigo:'AL0350', ch:'120h'},
  {id:'cccg8a', name:'CCCG 1',                                   sem:8, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  {id:'cccg8b', name:'CCCG 2',                                   sem:8, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
  // 9º SEM
  {id:'tcc2',   name:'Trabalho de Conclusão de Curso II',        sem:9, cat:'cc_tcc',         prereqs:['tcc1'],      codigo:'AL0351', ch:'120h'},
  {id:'cccg9',  name:'CCCG',                                     sem:9, cat:'cc_cccg',        prereqs:[],            codigo:'—',      ch:'60h'},
];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'cc',
    title: "Grade Curricular \u2014 Ci\u00eancia da Computa\u00e7\u00e3o",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 9,
    disciplines,
  };
})();
