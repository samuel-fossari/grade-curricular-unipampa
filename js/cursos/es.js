/**
 * Engenharia de Software — PPC (UNIPAMPA Alegrete).
 * Códigos, CH, pré-requisitos e ementas alinhados ao ementário do PPC fornecido.
 */
(function () {
  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';

  window.GRADE_CURSO_CONFIG = {
    sigla: 'es',
    title: 'Grade Curricular — Engenharia de Software',
    subtitle: 'UNIPAMPA · Campus Alegrete · PPC 2020',
    maxSemesters: 9,
    disciplines: [
      {
        id: 'alg',
        name: 'Algoritmos e Programação',
        sem: 1,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0323',
        ch: '120h',
        ementa:
          'Lógica de programação; notações para algoritmos; teste de mesa; dados e expressões; algoritmos sequenciais; estruturas de controle; variáveis compostas; modularização: classes, objetos, atributos e métodos; programação; depuração; arquivos de dados; documentação de código.\n\n' +
          'Objetivos: desenvolver programas aplicando raciocínio lógico e conceitos de algoritmos e programação. Específicos: aplicar raciocínio lógico na resolução de problemas computacionais; elaborar algoritmos estruturados; utilizar diferentes representações de algoritmos; aplicar linguagem de programação na codificação; empregar classes e objetos na escrita dos programas.',
      },
      {
        id: 'logica',
        name: 'Lógica Matemática',
        sem: 1,
        cat: 'matematica',
        prereqs: [],
        codigo: 'AL0324',
        ch: '60h',
        ementa:
          'Introdução à lógica; álgebra booleana; lógica proposicional; lógica de predicados.\n\n' +
          'Objetivos: solucionar problemas com raciocínio lógico baseado em lógica proposicional e de predicados. Específicos: compreender a lógica matemática como linguagem de especificação; identificar o tipo de lógica adequado para especificar sistema ou propriedade; modelar sistemas e propriedades; implementar programas em linguagem de programação lógica.',
      },
      {
        id: 'matdisc',
        name: 'Matemática Discreta',
        sem: 1,
        cat: 'matematica',
        prereqs: [],
        codigo: 'AL0325',
        ch: '60h',
        ementa:
          'Conjuntos; álgebra de conjuntos; relações; funções parciais e totais; relação de ordem e equivalência; indução e recursão; arranjo, combinação, permutação; teoria da contagem.\n\n' +
          'Objetivos: compreender conceitos e resolver problemas em conjuntos finitos com base na aritmética dos naturais; aplicar análise combinatória na modelagem e resolução de problemas. Específicos: princípios, técnicas e metodologias de estruturas discretas; indução e recursão; função e relação em computação; análise combinatória em problemas computacionais.',
      },
      {
        id: 'prob1',
        name: 'Resolução de Problemas I',
        sem: 1,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0326',
        ch: '120h',
        ementa:
          'Requisitos de software; identificação de requisitos; especificação de requisitos; análise de requisitos; validação de requisitos; controle de versão.\n\n' +
          'Objetivos: executar processos de engenharia de requisitos para desenvolver requisitos de software no contexto, mantendo artefatos sob controle de versões. Específicos: perceber fontes de requisitos no domínio; aplicar técnicas de levantamento adequadas a cada fonte; identificar, especificar, analisar e validar requisitos; gerenciar configuração de artefatos em sistema de controle de versão.',
      },
      {
        id: 'bd',
        name: 'Banco de Dados',
        sem: 2,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0327',
        ch: '60h',
        ementa:
          'Fundamentos de bancos de dados; sistema de gerenciamento de banco de dados; modelo entidade-relacionamento; modelo relacional; transformações entre modelos; normalização; linguagens para definição e manipulação de dados; álgebra relacional; transações.\n\n' +
          'Objetivos: analisar, projetar e manipular modelos, esquemas e informações em bancos de dados. Específicos: fundamentar características de SGBD; analisar requisitos de negócio, projetar modelos conceituais e transformá-los em relacionais; engenharia reversa e normalização; consultas com linguagens de definição, manipulação e consulta; criar, modificar e gerenciar bases com SGBD.',
      },
      {
        id: 'cs',
        name: 'Computação e Sociedade',
        sem: 2,
        cat: 'profissional',
        prereqs: [],
        codigo: 'AL0328',
        ch: '30h',
        ementa:
          'História da computação; cidadania; impacto das tecnologias da computação na sociedade; relações humanas; ergonomia e saúde no ambiente de trabalho; política e indústria de software; universidade e seu entorno social.\n\n' +
          'Objetivos: analisar repercussões das tecnologias da computação considerando aspectos humanos, sociais, culturais e políticos. Específicos: descrever a evolução tecnológica da computação; analisar impacto de novas tecnologias na sociedade e articulação com outras áreas; relacionar ergonomia e saúde ao uso de tecnologias e ao trabalho; discutir o papel social da universidade e promover atividades de extensão.',
      },
      {
        id: 'ihc',
        name: 'Interação Humano-Computador',
        sem: 2,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0329',
        ch: '60h',
        ementa:
          'Fundamentos e paradigmas de interação humano-computador; aspectos cognitivos, ergonômicos e sociais; qualidade em IHC; avaliação de interfaces; processos e técnicas de design em IHC; tópicos especiais em IHC.\n\n' +
          'Objetivos: avaliar e projetar sistemas interativos considerando usuários, contextos de uso e qualidade de interação e interface. Específicos: fundamentar conceitos e princípios de IHC; projetar interfaces e esquemas de interação com base em aspectos cognitivos, ergonômicos e sociais; aplicar técnicas de design e avaliação visando qualidade no uso e design universal; comparar critérios de qualidade; discutir tendências e tópicos especiais.',
      },
      {
        id: 'poo',
        name: 'Programação Orientada a Objetos',
        sem: 2,
        cat: 'computacao',
        prereqs: ['alg'],
        codigo: 'AL0330',
        ch: '90h',
        ementa:
          'Abstração; associações; encapsulamento; herança; polimorfismo; linguagem de programação orientada a objetos; tratamento de exceções; interface gráfica com usuário.\n\n' +
          'Objetivos: desenvolver software orientado a objetos utilizando adequadamente recursos de linguagem. Específicos: interpretar requisitos conforme conceitos de OO; aplicar conceitos de POO; aplicar tratamento de exceções; implementar interfaces gráficas com usuário.',
      },
      {
        id: 'prob2',
        name: 'Resolução de Problemas II',
        sem: 2,
        cat: 'software',
        prereqs: ['alg'],
        codigo: 'AL0331',
        ch: '120h',
        ementa:
          'Técnicas e métodos de teste de software; processo de teste de software; automação de teste de software; ferramentas de apoio e automação; geração de dados de teste.\n\n' +
          'Objetivos: realizar teste de software de forma sistemática e apoiada por ferramentas de gerenciamento e automação. Específicos: conhecer e aplicar fundamentos de teste de software; conhecer técnicas de automação e identificar a técnica adequada ao contexto; aplicar na prática técnicas, processos e ferramentas de automação e apoio ao teste.',
      },
      {
        id: 'aps',
        name: 'Análise e Projeto de Software',
        sem: 3,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0332',
        ch: '60h',
        ementa:
          'Fundamentos de análise e projeto; linguagem de modelagem; modelagem de software; arquitetura de software; análise e projeto orientado a objetos.\n\n' +
          'Objetivos: elaborar modelos necessários para projetar software tecnicamente viável e em conformidade com os requisitos. Específicos: explicar fundamentos de análise e projeto; analisar requisitos e transformá-los em modelos; interpretar modelos em linguagem de modelagem; selecionar modelos para cada necessidade do desenvolvimento; selecionar arquiteturas adequadas ao software em desenvolvimento.',
      },
      {
        id: 'arq',
        name: 'Arquitetura e Organização de Computadores',
        sem: 3,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0333',
        ch: '30h',
        ementa:
          'Organização de computadores; arquitetura de computadores; arquiteturas paralelas.\n\n' +
          'Objetivo (PPC): compreender os princípios de arquitetura e organização de computadores e como influenciam os sistemas computacionais. Específicos: identificar componentes básicos e funcionalidades; compreender características de uma arquitetura; diferenciar particularidades de arquiteturas paralelas.',
      },
      {
        id: 'ed',
        name: 'Estruturas de Dados',
        sem: 3,
        cat: 'computacao',
        prereqs: ['alg'],
        codigo: 'AL0334',
        ch: '60h',
        ementa:
          'Abstração de dados; alternativas de implementação; classificação, pesquisa e recursão; arranjos; listas; pilhas; filas; mapas e dicionários; árvores.\n\n' +
          'Objetivos: selecionar e aplicar tipos abstratos de dados na solução de problemas reais. Específicos: selecionar tipos de dados e estruturas adequados à resolução de problemas; implementar tipos abstratos de dados; compreender e aplicar recursão; implementar métodos de pesquisa e classificação.',
      },
      {
        id: 'inov',
        name: 'Inovação e Criatividade',
        sem: 3,
        cat: 'profissional',
        prereqs: [],
        codigo: 'AL0335',
        ch: '30h',
        ementa:
          'Conceitos de inovação; inovação em processos, produtos e serviços; técnicas de inovação, de pensamento criativo e de identificação de novas oportunidades.\n\n' +
          'Objetivos: compreender inovação; conhecer e aplicar técnicas de inovação e de pensamento criativo; analisar casos de pensamento criativo e identificação de oportunidades que geram inovação. Específicos: identificar, discutir e analisar a articulação de novos saberes com conhecimentos do curso sob a perspectiva da inovação; desenvolver visão holística e estratégica da aplicabilidade das técnicas para criação de valor.',
      },
      {
        id: 'lf',
        name: 'Linguagens Formais',
        sem: 3,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0336',
        ch: '60h',
        ementa:
          'Gramáticas; linguagens regulares; linguagens livres de contexto; linguagens sensíveis ao contexto; autômatos finitos determinísticos e não determinísticos; autômatos de pilha; autômato linearmente limitado.\n\n' +
          'Objetivos: compreender conceitos formais de reconhecedores e geradores de linguagens. Específicos: relacionar estruturas e formalismos aos programas de computadores; aplicar expressões regulares no desenvolvimento de software; aplicar formalmente conceitos de autômatos, gramáticas e linguagens.',
      },
      {
        id: 'prob3',
        name: 'Resolução de Problemas III',
        sem: 3,
        cat: 'software',
        prereqs: ['alg'],
        codigo: 'AL0337',
        ch: '120h',
        ementa:
          'Programação procedimental; programação lógica; programação funcional; programação orientada a aspectos.\n\n' +
          'Objetivos: resolver problemas por meio do desenvolvimento de software com diferentes paradigmas de programação. Específicos: abstrair características dos principais paradigmas; escolher linguagem adequada ao problema; programar e testar software com diferentes paradigmas.',
      },
      {
        id: 'apa',
        name: 'Análise e Projeto de Algoritmos',
        sem: 4,
        cat: 'computacao',
        prereqs: ['ed'],
        codigo: 'AL0338',
        ch: '60h',
        ementa:
          'Análise de algoritmos; análise de recorrência; algoritmos gulosos; divisão e conquista; programação dinâmica; conceitos e algoritmos para grafos; busca e ordenação.\n\n' +
          'Objetivos: analisar e projetar algoritmos considerando a complexidade computacional para encontrar soluções computacionais adequadas aos problemas. Específicos: aplicar técnicas para algoritmos eficientes e reutilizáveis; avaliar a eficiência de algoritmos; aplicar conceitos de grafos na organização de dados.',
      },
      {
        id: 'probest',
        name: 'Probabilidade e Estatística',
        sem: 4,
        cat: 'matematica',
        prereqs: [],
        codigo: 'AL0022',
        ch: '60h',
        ementa:
          'Estatística descritiva; teoria das probabilidades; distribuições de probabilidade; teoria da amostragem; estimação de parâmetros; testes de hipóteses; correlação e regressão.\n\n' +
          'Objetivos: aplicar conceitos de probabilidade e estatística para analisar dados e interpretar resultados de pesquisa. Específicos: analisar tabelas e gráficos; calcular e interpretar medidas descritivas; conhecer distribuições de probabilidade e aplicá-las em problemas de computação; analisar e interpretar conjuntos de dados experimentais.',
      },
      {
        id: 'pqs',
        name: 'Processo e Qualidade de Software',
        sem: 4,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0340',
        ch: '60h',
        ementa:
          'Fundamentos de processo e qualidade; modelos de processo; abordagens tradicionais e ágeis; qualidade de processo e de produto; modelos de referência de qualidade; modelagem de processo.\n\n' +
          'Objetivos: sistematizar práticas dos modelos de qualidade para viabilizar melhoria contínua dos processos de desenvolvimento de software. Específicos: compreender fundamentos de processo e de qualidade; reconhecer perspectivas para a qualidade; interpretar modelos de referência; selecionar práticas aderentes aos objetivos de melhoria; estabelecer processos alinhados aos objetivos organizacionais.',
      },
      {
        id: 'so',
        name: 'Sistemas Operacionais',
        sem: 4,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0341',
        ch: '30h',
        ementa:
          'Introdução aos sistemas operacionais; gerenciamento de processos; gerenciamento de memória; gerenciamento de E/S; sistemas de arquivos.\n\n' +
          'Objetivos: analisar os aspectos fundamentais da estrutura e do funcionamento de sistemas operacionais. Específicos: compreender o conceito de SO e suas funcionalidades; entender a transformação de programas em processos; compreender o impacto de técnicas e soluções de gerenciamento no desenvolvimento de software.',
      },
      {
        id: 'vv',
        name: 'Verificação e Validação',
        sem: 4,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0342',
        ch: '30h',
        ementa:
          'Conceitos básicos de verificação e validação; revisão, inspeção, walkthrough e auditorias de software; técnicas de leitura de artefatos; convenções de codificação.\n\n' +
          'Objetivos: fundamentar e aplicar conceitos e técnicas que permitem identificar se o produto de software está sendo construído corretamente e se atende às expectativas das partes interessadas. Específicos: identificar terminologias e fundamentações de V&V; sistematizar tipos de avaliação de um sistema; aplicar técnicas de V&V e etapas adequadas ao ciclo de vida; analisar problemas, elaborar e realizar inspeções e relatórios.',
      },
      {
        id: 'prob4',
        name: 'Resolução de Problemas IV',
        sem: 4,
        cat: 'software',
        prereqs: ['poo', 'aps'],
        codigo: 'AL0343',
        ch: '120h',
        ementa:
          'Fundamentos de padrões; padrões de criação; padrões estruturais; padrões comportamentais; outros padrões de projeto.\n\n' +
          'Objetivos: reconhecer e aplicar padrões de projeto orientados a objetos e determinar sua aplicabilidade na solução de um problema. Específicos: compreender a importância dos padrões; reconhecer e aplicar padrões de criação, estruturais e comportamentais; explorar outros catálogos de padrões de projeto.',
      },
      {
        id: 'adm',
        name: 'Administração e Empreendedorismo',
        sem: 5,
        cat: 'profissional',
        prereqs: [],
        codigo: 'AL0104',
        ch: '60h',
        ementa:
          'Definição de administração; funções do administrador; teorias da administração; funções empresariais; gestão de estoques; empreendedorismo.\n\n' +
          'Objetivos: entender a natureza da gestão empresarial e os sistemas produtivos; aplicar técnicas administrativas à gestão e à tomada de decisão na produção de bens e serviços. Específicos: identificar teorias da administração; constatar a dinâmica das organizações; sistematizar funções do administrador e empresariais; descrever conceitos de empreendedorismo; elaborar um plano de negócios.',
      },
      {
        id: 'med',
        name: 'Medição e Análise',
        sem: 5,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0345',
        ch: '30h',
        ementa:
          'Fundamentos de medição; medidas de software; abordagem de medição e análise; medidas funcionais.\n\n' +
          'Objetivos: estabelecer estratégias de medição e análise para suportar a tomada de decisão no gerenciamento de software. Específicos: explicar fundamentos de medição de software; selecionar medidas alinhadas aos objetivos organizacionais; usar medidas funcionais para estimativas de gerenciamento.',
      },
      {
        id: 'redes',
        name: 'Redes de Computadores',
        sem: 5,
        cat: 'computacao',
        prereqs: [],
        codigo: 'AL0344',
        ch: '30h',
        ementa:
          'Fundamentos de redes; estrutura e topologias de rede; modelo TCP/IP com ênfase nas camadas de transporte e aplicação.\n\n' +
          'Objetivos: compreender conceitos essenciais de redes de computadores no desenvolvimento de software. Específicos: compreender conceitos e características de redes; diferenciar o propósito de cada camada do TCP/IP; compreender e aplicar conceitos das camadas de transporte e aplicação.',
      },
      {
        id: 'prob5',
        name: 'Resolução de Problemas V',
        sem: 5,
        cat: 'software',
        prereqs: ['prob1', 'poo', 'aps', 'prob2'],
        codigo: 'AL0346',
        ch: '120h',
        ementa:
          'Fundamentos de evolução; manutenção de software; processo de evolução; gerenciamento de evolução; reengenharia de software; refatoração.\n\n' +
          'Objetivos: estabelecer abordagens de evolução de software para atender continuamente as demandas dos usuários. Específicos: explicar fundamentos de manutenção e evolução; compreender processos de desenvolvimento orientados à evolução; escolher estratégias de evolução alinhadas aos objetivos organizacionais.',
      },
      {
        id: 'cccg5',
        name: 'CCCGs',
        sem: 5,
        cat: 'nao_definido',
        prereqs: [],
        codigo: '—',
        ch: '120h',
        ementa: CCCG_EMENTA,
      },
      {
        id: 'mpa',
        name: 'Metodologia da Pesquisa Acadêmica',
        sem: 6,
        cat: 'software',
        prereqs: [],
        codigo: 'AL0339',
        ch: '60h',
        specialNote:
          'PPC: pré-requisito de integralização — anteprojeto de TCC aprovado (conforme coordenação).',
        ementa:
          'Ciência e conhecimento científico; métodos científicos; métodos de leitura; análise e síntese de textos; pesquisa bibliográfica sistemática; trabalhos e publicações técnico-científicas; fundamentos de engenharia de software experimental; tipos de experimentos.\n\n' +
          'Objetivos: conhecer, elaborar e realizar pesquisas acadêmicas sistemáticas em engenharia de software. Específicos: discutir o papel da ciência e do conhecimento científico na sociedade; diferenciar e comparar métodos científicos; conhecer conceitos de engenharia de software experimental; conduzir um estudo experimental em engenharia de software.',
      },
      {
        id: 'prob6',
        name: 'Resolução de Problemas VI',
        sem: 6,
        cat: 'software',
        prereqs: ['prob1', 'poo', 'aps', 'prob2'],
        codigo: 'AL0347',
        ch: '120h',
        ementa:
          'Fundamentos de projeto; áreas de conhecimento; processo de gerenciamento; ferramentas de gerenciamento.\n\n' +
          'Objetivos: empregar técnicas de gerenciamento adequadas ao planejamento, controle e encerramento de projetos de software. Específicos: explicar fundamentos de gerenciamento de projetos; interpretar as áreas de conhecimento de gerenciamento de projetos; elaborar artefatos de gerenciamento de projetos.',
      },
      {
        id: 'cccg6',
        name: 'CCCGs',
        sem: 6,
        cat: 'nao_definido',
        prereqs: [],
        codigo: '—',
        ch: '120h',
        ementa: CCCG_EMENTA,
      },
      {
        id: 'engeco',
        name: 'Engenharia Econômica',
        sem: 7,
        cat: 'profissional',
        prereqs: [],
        codigo: 'AL0125',
        ch: '30h',
        ementa:
          'Matemática financeira; engenharia econômica.\n\n' +
          'Objetivos: desenvolver conhecimentos em matemática financeira e engenharia econômica para possibilitar tomada de decisão na análise de investimentos. Específicos: apresentar conhecimentos do campo da matemática financeira; apresentar conhecimentos do campo da engenharia econômica.',
      },
      {
        id: 'etica',
        name: 'Ética e Legislação em Computação',
        sem: 7,
        cat: 'profissional',
        prereqs: [],
        codigo: 'AL0348',
        ch: '30h',
        ementa:
          'Responsabilidade ética na computação; código de ética e prática profissional da ciência da computação e da engenharia de software; legislação aplicada à computação.\n\n' +
          'Objetivos: promover relações éticas e avaliar responsabilidades profissionais e sociais no exercício da computação e da engenharia de software. Específicos: fundamentar conceitos da ética no cotidiano profissional e social; analisar e discutir estudos de caso sobre conflitos éticos e profissionais; interpretar legislação relacionada à computação e regulamentação sobre propriedade intelectual, registro de programas de computador e software livre.',
      },
      {
        id: 'tcc1',
        name: 'Trabalho de Conclusão de Curso I',
        sem: 7,
        cat: 'software',
        prereqs: ['mpa'],
        codigo: 'AL0350',
        ch: '120h',
        ementa:
          'Elaboração do projeto de trabalho técnico-científico.\n\n' +
          'Objetivos: planejar a síntese e a integração de conhecimentos adquiridos ao longo do curso. Os objetivos específicos do TCC dependem do tema do trabalho escolhido.',
      },
      {
        id: 'cccg7',
        name: 'CCCGs',
        sem: 7,
        cat: 'nao_definido',
        prereqs: [],
        codigo: '—',
        ch: '120h',
        ementa: CCCG_EMENTA,
      },
      {
        id: 'tc',
        name: 'Teoria da Computação',
        sem: 8,
        cat: 'computacao',
        prereqs: ['matdisc'],
        codigo: 'AL0349',
        ch: '60h',
        ementa:
          'Programas e máquinas; máquinas universais; funções recursivas; computabilidade; introdução à complexidade.\n\n' +
          'Objetivos: compreender os fundamentos teóricos da computação e a natureza dos problemas reais sob o ponto de vista da computabilidade. Específicos: compreender formalismos de programa, máquina e função computada; relacionar programas e funções; classificar problemas quanto à computabilidade.',
      },
      {
        id: 'tcc2',
        name: 'Trabalho de Conclusão de Curso II',
        sem: 8,
        cat: 'software',
        prereqs: ['tcc1'],
        codigo: 'AL0351',
        ch: '120h',
        ementa:
          'Elaboração do projeto de trabalho técnico-científico.\n\n' +
          'Objetivos: sintetizar e integrar conhecimentos adquiridos ao longo do curso. Os objetivos específicos do TCC dependem do tema do trabalho escolhido.',
      },
      {
        id: 'cccg8',
        name: 'CCCGs',
        sem: 8,
        cat: 'nao_definido',
        prereqs: [],
        codigo: '—',
        ch: '120h',
        ementa: CCCG_EMENTA,
      },
      {
        id: 'estagio',
        name: 'Estágio Obrigatório',
        sem: 9,
        cat: 'nao_definido',
        prereqs: [],
        codigo: 'AL0352',
        ch: '240h',
        specialMinCH: 1650,
        ementa:
          'Atividades profissionais da área de engenharia de software.\n\n' +
          'Objetivos: vivenciar o ambiente profissional e participar do processo de integração universidade-empresa. Específicos: oportunizar experiências pré-profissionais e identificação de campos de atuação; ampliar interesse por pesquisa técnico-científica em problemas da engenharia de software; participar da integração universidade-empresa e transferência de tecnologia; obter subsídios para adequação do currículo às exigências do mercado.\n\n' +
          'Integralização (PPC): exige ao menos 1650 horas integralizadas no curso.',
      },
    ],
  };
})();
