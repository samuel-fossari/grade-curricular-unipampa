/**
 * Dados da grade — CC (UNIPAMPA Alegrete).
 * Categorias conforme fluxograma do PPC (CCOG: Fundamentos, Tecnologias,
 * Matemática, Contexto social e profissional, TCC; à parte: CCCG).
 * Ementas, códigos, CH e pré-requisitos alinhados ao PPC 2023 (texto fornecido).
 */
(function () {
  'use strict';

  const disciplines = [
    // 1º SEM
    {
      id: 'alg',
      name: 'Algoritmos e Programação para Computação',
      sem: 1,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0493',
      ch: '90h',
      ementa:
        'Noções de programação: fluxo de execução, variáveis, operações aritméticas, operações de entrada e saída; tipos de dados escalares: inteiros, reais e caracteres; operações de controle de fluxo: sequência, seleção e iteração; tipos estruturados básicos: vetores, matrizes, registros e strings. Alocação de memória: estática e dinâmica; ponteiros; subprogramas: funções com e sem retorno, funções com e sem parâmetro, recursividade; operações com arquivos.\n\n' +
        'Objetivos: desenvolver o raciocínio lógico aplicado à resolução de problemas por meio de algoritmos e programas com programação estruturada. Específicos: analisar problemas e elaborar programas para solucioná-los; compreender conceitos básicos de programação estruturada; desenvolver algoritmos com estruturas de dados simples; implementar programas modulares com subprogramação e arquivos.',
    },
    {
      id: 'intro',
      name: 'Introdução à Computação',
      sem: 1,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0494',
      ch: '30h',
      ementa:
        'História da computação; impactos da computação na ciência, tecnologia e sociedade; áreas da ciência da computação; carreiras e áreas de atuação; perfil do profissional; pensamento computacional.\n\n' +
        'Objetivos: conhecer as diferentes áreas da computação e possibilidades de atuação com base em aspectos históricos e estado da arte. Específicos: conhecer a história da computação; compreender impactos da computação nos diversos campos e na sociedade; identificar áreas da computação e possibilidades de carreira; compreender fundamentos do pensamento computacional e sua importância para solução de problemas computacionais.',
    },
    {
      id: 'circ',
      name: 'Circuitos Digitais',
      sem: 1,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0013',
      ch: '60h',
      ementa:
        'Portas lógicas; simplificação de funções booleanas; hardware digital; componentes lógicos; elementos de memória; circuitos lógicos sequenciais.\n\n' +
        'Objetivos: analisar, simplificar e sintetizar sistemas à base de circuitos digitais. Específicos: identificar sistemas de numeração e algoritmos de aritmética binária; descrever elementos básicos de hardware e organização interna; implementar circuitos combinacionais de forma otimizada; aplicar metodologia de desenvolvimento de circuitos digitais em problemas de engenharia computacional.',
    },
    {
      id: 'fmat',
      name: 'Fundamentos de Matemática para Computação',
      sem: 1,
      cat: 'cc_matematica',
      prereqs: [],
      codigo: 'AL0495',
      ch: '60h',
      ementa:
        'Matrizes e determinantes; relações e funções; funções notáveis: logaritmos, exponenciais, polinomiais e trigonométricas; progressões aritméticas e geométricas; teoria dos conjuntos; análise combinatória; taxonomia de enunciados matemáticos (axiomas, teoremas, lemas, conjecturas); introdução a técnicas de demonstração (direto, contradição, contrapositiva, indução); provas construtivas e não construtivas; recursão e recorrência.\n\n' +
        'Objetivos: compreender conceitos matemáticos fundamentais para a formação em ciência da computação. Específicos: vetores, matrizes e determinantes; definição e aplicações de funções importantes; teoria e álgebra de conjuntos; progressões e aplicações; identificar enunciados e estratégias de demonstração; recursão e recorrências; análise combinatória e problemas de contagem.',
    },
    {
      id: 'logica',
      name: 'Lógica Matemática',
      sem: 1,
      cat: 'cc_matematica',
      prereqs: [],
      codigo: 'AL0324',
      ch: '60h',
      ementa:
        'Introdução à lógica; álgebra booleana; lógica proposicional; lógica de predicados.\n\n' +
        'Objetivos: solucionar problemas com raciocínio lógico baseado em lógica proposicional e de predicados. Específicos: compreender a lógica como linguagem de especificação; identificar o tipo de lógica adequado para especificar sistema ou propriedade; modelar sistemas e propriedades; implementar programas em linguagem de programação lógica.',
    },
    // 2º SEM
    {
      id: 'ed1',
      name: 'Estruturas de Dados I',
      sem: 2,
      cat: 'cc_fundamentos',
      prereqs: ['alg'],
      codigo: 'AL0506',
      ch: '60h',
      ementa:
        'Registros; recursividade; alocação dinâmica; estruturas lineares contíguas e encadeadas; listas encadeadas, pilhas e filas; matrizes dinâmicas; métodos de pesquisa e de classificação de dados; operações com arquivos.\n\n' +
        'Objetivos: projetar representações de dados na memória e implementar operações sobre elas. Específicos: operações com ponteiros; estruturas lineares contíguas e encadeadas; ordenação e busca; arquivos; recursividade e matrizes dinâmicas.',
    },
    {
      id: 'arq1',
      name: 'Arquitetura e Organização de Computadores I',
      sem: 2,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0023',
      ch: '60h',
      ementa:
        'Componentes de computadores; medidas de desempenho; organização da memória; arquitetura do conjunto de instruções; modos de endereçamento; linguagem de montagem; implementação do caminho de dados de processadores; parte operacional e de controle; aritmética computacional.\n\n' +
        'Objetivos: descrever elementos de um sistema computacional, analisar fluxo elementar dos módulos e desenvolver visão crítica sobre requisitos de desempenho. Específicos: organização ao nível de arquitetura de instruções e comunicação entre módulos; fluxo de dados e controle, memória, sequenciamento e interrupções; impacto de mecanismos no desempenho; projetos ao nível de arquitetura; importância da estrutura das instruções.',
    },
    {
      id: 'geom',
      name: 'Geometria Analítica',
      sem: 2,
      cat: 'cc_matematica',
      prereqs: [],
      codigo: 'AL0002',
      ch: '60h',
      ementa:
        'Vetores no plano e no espaço; retas no plano e no espaço; estudo do plano; distância, área e volume; cônicas; quádricas.\n\n' +
        'Objetivos: desenvolver noções sobre vetores, curvas e superfícies no plano e no espaço. Específicos: manipular vetores em operações matemáticas; compreender escalares versus vetores; visão tridimensional de curvas e superfícies; aplicar geometria analítica em problemas de engenharia e física.',
    },
    {
      id: 'calc1',
      name: 'Cálculo para Computação I',
      sem: 2,
      cat: 'cc_matematica',
      prereqs: ['fmat'],
      codigo: 'AL0496',
      ch: '60h',
      ementa:
        'Limites das principais funções, limites fundamentais, continuidade, limites no infinito; derivadas, interpretação, propriedades, regra da cadeia, produto e quociente; derivadas de funções lineares, exponenciais, logarítmicas e trigonométricas e de ordem superior; derivadas de funções implícitas; diferencial, interpretação geométrica e gráfica, linearização; regra de L\'Hospital; máximos e mínimos; aproximação da derivada por diferenças finitas; método da tangente e da secante; solução numérica iterativa; aplicações (taxa de variação, velocidade, aceleração); implementações e gráficos.\n\n' +
        'Objetivos: compreender e aplicar técnicas do cálculo diferencial para funções reais de uma variável, com ênfase em metodologias e aplicações à computação. Específicos: limite, continuidade, derivada e diferencial; regras básicas de cálculo; interpretações geométricas; aplicar na resolução de problemas da computação.',
    },
    {
      id: 'etica',
      name: 'Ética e Legislação em Computação',
      sem: 2,
      cat: 'cc_contexto',
      prereqs: [],
      codigo: 'AL0348',
      ch: '30h',
      ementa:
        'Introdução à ética; responsabilidade ética na computação; código de ética e prática profissional em ciência da computação e engenharia de software; legislação aplicada à computação.\n\n' +
        'Objetivos: promover relações éticas e avaliar responsabilidades profissionais e sociais no exercício da computação e da engenharia de software. Específicos: fundamentar conceitos da ética no cotidiano profissional e social; analisar estudos de caso sobre conflitos éticos; interpretar legislação, propriedade intelectual, registro de programas e software livre.',
    },
    {
      id: 'inov',
      name: 'Inovação e Criatividade',
      sem: 2,
      cat: 'cc_contexto',
      prereqs: [],
      codigo: 'AL0335',
      ch: '30h',
      ementa:
        'Conceitos de inovação; inovação em processos, produtos e serviços; técnicas de inovação, pensamento criativo e identificação de oportunidades.\n\n' +
        'Objetivos: compreender inovação; conhecer e aplicar técnicas de inovação e pensamento criativo; analisar casos que geram inovação. Específicos: articular novos saberes com conhecimentos do curso sob a perspectiva da inovação; visão holística e estratégica da aplicabilidade das técnicas para criação de valor.',
    },
    // 3º SEM
    {
      id: 'ed2',
      name: 'Estruturas de Dados II',
      sem: 3,
      cat: 'cc_fundamentos',
      prereqs: ['ed1'],
      codigo: 'AL0507',
      ch: '60h',
      ementa:
        'Árvore; árvore binária, binária de busca, AVL, rubro-negra, B e B+; heap; compressão e organização de arquivos.\n\n' +
        'Objetivos: projetar e implementar estruturas hierárquicas e identificar aplicações em problemas reais. Específicos: implementar árvores e algoritmos; usar estruturas hierárquicas na resolução de problemas; programas com compressão e organização de arquivos.',
    },
    {
      id: 'poo',
      name: 'Programação Orientada a Objetos',
      sem: 3,
      cat: 'cc_fundamentos',
      prereqs: ['ed1'],
      codigo: 'AL0050',
      ch: '60h',
      ementa:
        'Classes e objetos; encapsulamento, herança e polimorfismo; mecanismos de abstração e composição; manipulação de dados; introdução a padrões de projeto orientado a objetos; tratamento de exceções.\n\n' +
        'Objetivos: projetar e desenvolver programas com os conceitos da POO. Específicos: apropriar-se dos conceitos de OO; encapsulamento, abstração e composição; manipulação de dados; técnicas como bottom-up, top-down, por contrato, por aspectos, entre outras.',
    },
    {
      id: 'arq2',
      name: 'Arquitetura e Organização de Computadores II',
      sem: 3,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0508',
      ch: '60h',
      ementa:
        'Paralelismo no nível de instrução: pipeline e arquiteturas superescalares; memória cache; memória virtual; arquiteturas multicore; tópicos opcionais.\n\n' +
        'Objetivos: compreender conceitos arquiteturais atuais e implicações no desempenho dos programas. Específicos: alternativas de organização de processador; projeto de hierarquia de memória; organizações paralelas e modelo de programação; comparar arquiteturas paralelas.',
    },
    {
      id: 'alg_lin',
      name: 'Álgebra Linear',
      sem: 3,
      cat: 'cc_matematica',
      prereqs: [],
      codigo: 'AL0009',
      ch: '60h',
      ementa:
        'Matrizes; determinantes; sistemas lineares; espaços vetoriais; espaços com produto interno; transformações lineares; autovalores e autovetores; diagonalização de operadores.\n\n' +
        'Objetivos: compreender sistemas lineares, operações e propriedades; raciocínio matemático, abstração e visualização vetorial. Específicos (PPC): métodos para resolução de sistemas lineares e aplicações; transformações lineares, núcleo e imagem; transformações inversíveis e espaço das transformações; autovalores, autovetores e diagonalização; norma, base ortogonal e ortonormal.',
    },
    {
      id: 'calc2',
      name: 'Cálculo para Computação II',
      sem: 3,
      cat: 'cc_matematica',
      prereqs: ['calc1'],
      codigo: 'AL0497',
      ch: '60h',
      ementa:
        'Integral indefinida e técnicas de integração; integral definida e aplicações na computação; teorema fundamental do cálculo; integral imprópria; fundamentos de integração numérica; aplicações do integral (áreas, volumes por rotação e invólucro cilíndrico, comprimento de arco); aplicações numéricas; coordenadas polares e área em polares; funções de várias variáveis; derivação parcial; gradiente e derivadas direcionais.\n\n' +
        'Objetivos: aplicar cálculo diferencial e integral, limites e diferenciabilidade para funções de várias variáveis, gradiente com aplicações na computação. Específicos: métodos de integração; áreas, volumes e comprimentos de arco; aplicações do integral na computação; derivadas parciais e direcionais, diferencial e gradiente.',
    },
    // 4º SEM
    {
      id: 'ed3',
      name: 'Estruturas de Dados III',
      sem: 4,
      cat: 'cc_fundamentos',
      prereqs: ['ed1'],
      codigo: 'AL0498',
      ch: '60h',
      ementa:
        'Grafos ponderados; dígrafos; representações de grafos; algoritmos em grafos: busca em largura e profundidade, backtrack; caminhos máximo e mínimo; árvore geradora mínima; ordenação topológica; coloração; aplicações.\n\n' +
        'Objetivos: projetar e implementar estruturas do tipo grafo e identificar aplicações em problemas reais. Específicos: implementar grafos e algoritmos; comparar estruturas; selecionar estruturas adequadas ao problema.',
    },
    {
      id: 'grafos',
      name: 'Teoria dos Grafos',
      sem: 4,
      cat: 'cc_fundamentos',
      prereqs: ['fmat', 'ed1'],
      codigo: 'AL0499',
      ch: '60h',
      ementa:
        'Grafos direcionados e não direcionados; isomorfismo; árvores; conexidade; caminho mínimo; trilhas eulerianas e ciclos hamiltonianos; emparelhamentos; algoritmos de busca; fluxo máximo; planaridade; coloração; tópicos opcionais.\n\n' +
        'Objetivos: utilizar conceitos da teoria dos grafos na modelagem matemática de problemas computacionais. Específicos: reconhecer temas centrais e resultados teóricos; identificar classes importantes de grafos e aplicabilidade; empregar algoritmos de grafos na resolução de problemas.',
    },
    {
      id: 'apa',
      name: 'Projeto e Análise de Algoritmos',
      sem: 4,
      cat: 'cc_fundamentos',
      prereqs: ['fmat', 'ed1'],
      codigo: 'AL0509',
      ch: '60h',
      ementa:
        'Provas de corretude com invariantes de laço e indução; notação assintótica O, o, Ω, ω e Θ; ordens assintóticas comuns; análise assintótica de algoritmos recursivos e iterativos (pior e melhor caso); recorrências; substituição, árvore de recursão, iteração e mestre; paradigmas: busca exaustiva, tentativa e erro (backtracking), divisão e conquista, programação dinâmica e gulosa; algoritmos de busca e ordenação.\n\n' +
        'Objetivos: analisar e projetar algoritmos eficientes. Específicos: aplicar técnicas de projeto; calcular limitantes inferiores e superiores de complexidade de tempo (melhor e pior caso); argumentar corretude por invariantes e/ou indução.',
    },
    {
      id: 'so',
      name: 'Sistemas Operacionais',
      sem: 4,
      cat: 'cc_fundamentos',
      prereqs: [],
      codigo: 'AL0510',
      ch: '60h',
      ementa:
        'Introdução a SO: conceitos, chamadas de sistema, arquitetura. Gerência de processos: estados, comunicação e escalonamento. Gerência de memória: partições fixas e variáveis, segmentação, paginação, memória virtual. Gerência de E/S: dispositivos, controladores, software de E/S, interrupções. Sistemas de arquivos: arquivos, diretórios, implementação, proteção.\n\n' +
        'Objetivos: analisar estrutura e funcionamento fundamentais de sistemas operacionais. Específicos: conceito e funcionalidades do SO; papel do escalonador na multiprogramação; comparar alocação de memória; integração de dispositivos de E/S; diferenciar tipos de sistemas de arquivos.',
    },
    {
      id: 'probest',
      name: 'Probabilidade e Estatística',
      sem: 4,
      cat: 'cc_matematica',
      prereqs: [],
      codigo: 'AL0022',
      ch: '60h',
      ementa:
        'Estatística descritiva; teoria das probabilidades; distribuições discretas e contínuas; teoria da amostragem; estimação de parâmetros; testes de hipótese; correlação e regressão.\n\n' +
        'Objetivos: probabilidade, variáveis aleatórias, processos aleatórios e estatística. Específicos: linguagem estatística; tabelas e gráficos; medidas descritivas; técnicas de probabilidade; amostragem; testes comparativos entre grupos; correlação e regressão; interpretação de dados experimentais.',
    },
    // 5º SEM
    {
      id: 'lf',
      name: 'Linguagens Formais',
      sem: 5,
      cat: 'cc_fundamentos',
      prereqs: ['fmat'],
      codigo: 'AL0336',
      ch: '60h',
      ementa:
        'Gramáticas; linguagens regulares; livres de contexto; sensíveis ao contexto; autômatos finitos determinísticos e não determinísticos; autômatos de pilha; autômato linearmente limitado.\n\n' +
        'Objetivos: compreender conceitos formais de reconhecedores e geradores de linguagens. Específicos: relacionar formalismos a programas; aplicar expressões regulares no desenvolvimento de software; aplicar formalmente autômatos, gramáticas e linguagens.',
    },
    {
      id: 'ia',
      name: 'Inteligência Artificial',
      sem: 5,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0069',
      ch: '60h',
      ementa:
        'Inteligência artificial; problemas, espaços e busca; jogos; representação de conhecimento e métodos de inferência; abordagens alternativas de processamento de conhecimento.\n\n' +
        'Objetivos: aprender ideias básicas e técnicas em sistemas de computação inteligentes. Específicos: aplicar conceitos e técnicas de IA com ênfase em sistemas de resolução de problemas.',
    },
    {
      id: 'bd',
      name: 'Banco de Dados',
      sem: 5,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0500',
      ch: '60h',
      ementa:
        'Fundamentos de banco de dados; modelo conceitual, lógico e físico; transformação entre modelos; normalização; linguagens para definição e manipulação de dados; transações.\n\n' +
        'Objetivos: analisar, projetar e manipular modelos, esquemas e informações em BD. Específicos: conceitos principais; requisitos, modelos conceituais e relacionais; engenharia reversa e normalização; consultas com linguagens de definição, manipulação e consulta; criar, modificar e gerenciar bases com SGBD.',
    },
    {
      id: 'redes',
      name: 'Redes de Computadores',
      sem: 5,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0511',
      ch: '60h',
      ementa:
        'Introdução a redes; estrutura e topologias; camada de aplicação; transporte; rede; enlace; física.\n\n' +
        'Objetivos: entender projeto, configuração e análise de redes, com foco em rede, transporte e aplicação. Específicos: explicar arquitetura da internet; analisar e implementar protocolos da camada de aplicação; avaliar protocolos de transporte; descrever plano de dados da camada de rede; avaliar protocolos de enlace e física.',
    },
    { id: 'cccg5a', name: 'CCCG 1', sem: 5, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg5b', name: 'CCCG 2', sem: 5, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    // 6º SEM
    {
      id: 'tc',
      name: 'Teoria da Computação',
      sem: 6,
      cat: 'cc_fundamentos',
      prereqs: ['fmat'],
      codigo: 'AL0501',
      ch: '60h',
      ementa:
        'Máquinas e programas; máquinas universais; funções recursivas parciais, cálculo lambda, máquinas de Turing e outros modelos; tese de Church-Turing; computabilidade: indecidibilidade e reduções; introdução à complexidade: classes P, NP, NP-difícil e NP-completo, reduções polinomiais, intratabilidade.\n\n' +
        'Objetivos: compreender fundamentos teóricos e limites da computação (computabilidade e tratabilidade). Específicos: relacionar formalismos de funções, programas, linguagens e problemas; capacidades e limitações de modelos importantes; classificar problemas com reduções.',
    },
    {
      id: 'cg',
      name: 'Computação Gráfica',
      sem: 6,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0512',
      ch: '60h',
      ementa:
        'Introdução à teoria de imagens digitais; objetos raster e vetoriais em 2D e 3D; filtros; transformações 2D e 3D; projeção; modelos de iluminação; visualização; renderização; animação; práticas de implementação.\n\n' +
        'Objetivos: usar computação gráfica em programas para processamento e visualização de imagens e animações em 2D e 3D. Específicos: síntese e visualização 2D/3D; algoritmos no plano (Bresenham, círculos de ponto médio, B-splines, preenchimento de triângulos); transformações 3D (rotação, translação, escala, projeção); iluminação e textura.',
    },
    {
      id: 'esw',
      name: 'Engenharia de Software',
      sem: 6,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0504',
      ch: '60h',
      ementa:
        'Introdução à engenharia de software; processos de desenvolvimento; engenharia de requisitos; projeto de software; verificação e validação; tópicos especiais.\n\n' +
        'Objetivos: especificar, projetar, implementar, verificar e validar sistemas computacionais com teorias, práticas e ferramentas de ES. Específicos: conceitos, processos, métodos e técnicas; documentação de requisitos; projeto de soluções; verificação e validação de artefatos.',
    },
    {
      id: 'ihc',
      name: 'Interação Humano-Computador',
      sem: 6,
      cat: 'cc_tecnologias',
      prereqs: [],
      codigo: 'AL0502',
      ch: '60h',
      ementa:
        'Fundamentos e paradigmas de IHC; aspectos cognitivos, ergonômicos e sociais; qualidade em IHC; avaliação de interfaces; processos e técnicas de design em IHC; tópicos especiais.\n\n' +
        'Objetivos: avaliar e projetar sistemas interativos considerando usuários, contextos e qualidade de interação e interface. Específicos: fundamentar conceitos e princípios de IHC; projetar interfaces com base em aspectos cognitivos, ergonômicos e sociais; aplicar técnicas de design e avaliação (incluindo design universal); comparar critérios de qualidade; discutir tendências e tópicos especiais.',
    },
    {
      id: 'metci',
      name: 'Metodologia Científica',
      sem: 6,
      cat: 'cc_contexto',
      prereqs: [],
      codigo: 'AL0503',
      ch: '60h',
      ementa:
        'Métodos científicos; pesquisa bibliográfica; estrutura e organização de trabalhos técnico-científicos; ferramentas de apoio à pesquisa.\n\n' +
        'Objetivos: conduzir e reportar pesquisa acadêmica na área da computação. Específicos: diferenciar e comparar métodos científicos; ferramentas de apoio; estrutura de trabalhos técnico-científicos; pesquisa bibliográfica; produção de trabalho técnico-científico.',
    },
    { id: 'cccg6a', name: 'CCCG 1', sem: 6, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    // 7º SEM
    { id: 'cccg7a', name: 'CCCG 1', sem: 7, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg7b', name: 'CCCG 2', sem: 7, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg7c', name: 'CCCG 3', sem: 7, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg7d', name: 'CCCG 4', sem: 7, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg7e', name: 'CCCG 5', sem: 7, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    // 8º SEM
    {
      id: 'tcc1',
      name: 'Trabalho de Conclusão de Curso I',
      sem: 8,
      cat: 'cc_tcc',
      prereqs: [],
      codigo: 'AL0350',
      ch: '120h',
      specialMinCH: 1600,
      ementa:
        'Elaboração de projeto de trabalho técnico-científico.\n\n' +
        'Objetivos: planejar a síntese e a integração de conhecimentos adquiridos ao longo do curso. Os objetivos específicos dependem do tema escolhido.\n\n' +
        'Integralização (PPC): exige ao menos 1600 horas integralizadas no curso.',
    },
    { id: 'cccg8a', name: 'CCCG 1', sem: 8, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    { id: 'cccg8b', name: 'CCCG 2', sem: 8, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
    // 9º SEM
    {
      id: 'tcc2',
      name: 'Trabalho de Conclusão de Curso II',
      sem: 9,
      cat: 'cc_tcc',
      prereqs: ['tcc1'],
      codigo: 'AL0351',
      ch: '120h',
      ementa:
        'Elaboração de trabalho técnico-científico.\n\n' +
        'Objetivos: sintetizar e integrar conhecimentos adquiridos ao longo do curso. Os objetivos específicos dependem do tema escolhido.',
    },
    { id: 'cccg9', name: 'CCCG', sem: 9, cat: 'cc_cccg', prereqs: [], codigo: '—', ch: '60h' },
  ];

  window.GRADE_CURSO_CONFIG = {
    sigla: 'cc',
    title: 'Grade Curricular — Ciência da Computação',
    subtitle: 'UNIPAMPA · Campus Alegrete · PPC 2023',
    maxSemesters: 9,
    disciplines,
  };
})();
