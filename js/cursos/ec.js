/**
 * Dados da grade — EC (UNIPAMPA Alegrete).
 * Ementas, códigos e CH alinhados ao ementário do PPC (texto fornecido).
 * Pré-requisitos conferidos com a matriz curricular do projeto; disciplinas só
 * na lista do PPC e ausentes aqui tratam-se como CCCG/eletivas (não incluídas).
 */
(function () {
  'use strict';

  const disciplines = [
    // 1º SEM
    {
      id: 'intro_ec',
      name: 'Introdução à Engenharia Civil',
      sem: 1,
      prereqs: [],
      codigo: 'AL0362',
      ch: '30h',
      ementa:
        'Evolução tecnológica; disseminação da cultura científica e tecnológica; organização do curso; atividades de ensino e pesquisa; caracterização da profissão, áreas e do profissional; formação acadêmica e atribuições; oportunidades ocupacionais; setor da construção civil (local, estadual e nacional).\n\n' +
        'Objetivo geral: conhecer objetivos e estrutura curricular, metodologia científica e tecnológica, comunicação na área técnica, projeto de curso e papel do engenheiro civil.\n\n' +
        'Objetivos específicos: panorama dos cursos de tecnologia, atuação, carreira e desenvolvimento; encontro com profissionais (seminários); noções aplicáveis ao longo da graduação; postura crítica diante do conhecimento científico e comunicação técnica; noções sobre períodos e personagens da evolução da ciência.',
    },
    {
      id: 'geom',
      name: 'Geometria Analítica',
      sem: 1,
      prereqs: [],
      codigo: 'AL0002',
      ch: '60h',
      ementa:
        'Vetores no plano e no espaço; retas no plano e no espaço; estudo do plano; distância, área e volume; cônicas; quádricas.\n\n' +
        'Objetivo geral: desenvolver noções sobre vetores, curvas e superfícies no plano e no espaço.\n\n' +
        'Objetivos específicos: manipular vetores em operações matemáticas; distinguir escalares e vetores; visão tridimensional de curvas e superfícies; aplicar geometria analítica em problemas de engenharia e de física.',
    },
    {
      id: 'calc1',
      name: 'Cálculo I',
      sem: 1,
      prereqs: [],
      codigo: 'AL0363',
      ch: '90h',
      ementa:
        'Revisão de matemática básica; conjuntos; reta real; intervalos e desigualdades; funções de uma variável; limites; continuidade; derivadas; regras de derivação; regra da cadeia; derivação implícita; diferencial; regra de L\u2019Hôpital; máximos e mínimos e outras aplicações.\n\n' +
        'Objetivo geral: compreender e aplicar cálculo diferencial e integral para funções reais de uma variável, com ênfase em aplicações.\n\n' +
        'Objetivos específicos: fixar álgebra e cálculo básicos; reconhecer e construir gráficos de funções principais; usar propriedades do cálculo diferencial na representação de funções; calcular e avaliar limites e derivadas com aplicações; aplicar o cálculo diferencial em problemas clássicos de engenharia e ciências exatas.',
    },
    {
      id: 'dt',
      name: 'Desenho Técnico',
      sem: 1,
      prereqs: [],
      codigo: 'AL0007',
      ch: '30h',
      ementa:
        'Introdução ao desenho técnico; desenho arquitetônico; introdução ao desenho projetivo.\n\n' +
        'Objetivo geral: utilizar o desenho técnico como linguagem de comunicação conforme normas ABNT.\n\n' +
        'Objetivos específicos: fundamentos e normas de desenho técnico; instrumentos de desenho; elementos fundamentais do desenho; fundamentos e interpretação do desenho arquitetônico; traçado de elementos arquitetônicos; desenho projetivo; desenhos à mão livre em projeção ortogonal e isométrica; desenhos em escala, cotados em projeção ortogonal e isométrica.',
    },
    {
      id: 'geo_desc',
      name: 'Geometria Descritiva',
      sem: 1,
      prereqs: [],
      codigo: 'AL0364',
      ch: '60h',
      ementa:
        'Introdução à técnica de desenho; introdução à geometria descritiva; elementos fundamentais; métodos descritivos; representação e seção plana de poliedros e sólidos de revolução; projeções cotadas.\n\n' +
        'Objetivo geral: introduzir figuras planas e volumétricas por geometria descritiva.\n\n' +
        'Objetivos específicos: princípios teóricos do desenho técnico; processos gráficos para raciocínio e visualização espacial; resolver problemas de aplicação.',
    },
    {
      id: 'alg',
      name: 'Algoritmos e Programação',
      sem: 1,
      prereqs: [],
      codigo: 'AL0005',
      ch: '60h',
      ementa:
        'Noções de lógica de programação; dados, expressões e algoritmos sequenciais; estruturas de controle; estruturas complexas; modularização.\n\n' +
        'Objetivo geral: desenvolver raciocínio lógico na solução de problemas computacionais e introduzir desenvolvimento de algoritmos com visão crítica e sistemática.\n\n' +
        'Objetivos específicos: resolver problemas lógicos; identificar entradas e saídas; definir estruturas adequadas; elaborar algoritmos estruturados; aplicar linguagem de programação; trabalhar estruturas de armazenamento; modularizar com funções e parâmetros.',
    },
    {
      id: 'ext1',
      name: 'Práticas de Extensão em Engenharia Civil I',
      sem: 1,
      prereqs: [],
      codigo: 'AL0365',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: desenvolver extensão que articule UNIPAMPA e sociedade por meio da produção e aplicação do conhecimento técnico, integrando ensino e pesquisa.\n\n' +
        'Objetivos específicos: introduzir a extensão na formação; formação interdisciplinar, cidadã, crítica e responsável; integração e diálogo com a sociedade; incentivo ao desenvolvimento humano, econômico, social e cultural.',
    },
    // 2º SEM
    {
      id: 'quim',
      name: 'Química Geral e Experimental',
      sem: 2,
      prereqs: [],
      codigo: 'AL0366',
      ch: '45h',
      ementa:
        'Atomística; ligações químicas; quantidade de matéria; fórmulas e equações; estequiometria; reações químicas; parte experimental.\n\n' +
        'Objetivo geral: compreender estrutura atômica e tabela periódica; tipos de ligação; mol e massa molar; fórmulas e equações; estequiometria, rendimento e reagente limitante; tipos de reação; técnicas e equipamentos de laboratório.\n\n' +
        'Objetivos específicos: elétrons, níveis, orbitais, números quânticos, periodicidade; ligações iônicas, covalentes, metálicas e intermoleculares; mol, massa molar, composição percentual, fórmulas empírica e molecular; representação e balanceamento; neutralização e oxirredução; práticas experimentais alinhadas ao conteúdo.',
    },
    {
      id: 'alg_lin',
      name: 'Álgebra Linear',
      sem: 2,
      prereqs: ['geom'],
      codigo: 'AL0009',
      ch: '60h',
      ementa:
        'Matrizes; determinantes; sistemas lineares; espaços vetoriais; espaços com produto interno; transformações lineares; autovalores e autovetores; diagonalização de operadores.\n\n' +
        'Objetivo geral: compreender sistemas lineares, operações e propriedades; raciocínio, abstração e visualização vetorial; operar com sistemas, espaços vetoriais, produtos, transformações lineares, autovalores e produto interno.\n\n' +
        'Objetivos específicos: métodos de resolução de sistemas e aplicações em engenharias; núcleo e imagem de transformações lineares; transformações inversíveis e espaço das transformações; autovalores, autovetores e diagonalização; norma, base ortogonal e ortonormal.',
    },
    {
      id: 'calc2',
      name: 'Cálculo II',
      sem: 2,
      prereqs: ['calc1'],
      codigo: 'AL0010',
      ch: '60h',
      ementa:
        'Integral indefinida e técnicas de integração; integral definida; teorema fundamental do cálculo; integral imprópria; aplicações (áreas, volumes por rotação e invólucro cilíndrico, comprimento de arco); coordenadas polares e área em polares; funções de várias variáveis; derivação parcial; gradiente e derivadas direcionais.\n\n' +
        'Objetivo geral: dominar técnicas de cálculo diferencial e integral em uma variável para aplicações em ciência e engenharia; compreender limite e diferenciabilidade em várias variáveis.\n\n' +
        'Objetivos específicos: integração indefinida e teorema fundamental; integral definida para áreas e volumes; funções de várias variáveis, limites e derivadas parciais.',
    },
    {
      id: 'dtcd',
      name: 'Desenho Técnico Civil e Digital',
      sem: 2,
      prereqs: ['dt', 'geo_desc'],
      codigo: 'AL0367',
      ch: '60h',
      ementa:
        'Desenho arquitetônico, de estruturas, instalações hidrossanitárias e elétricas; desenho universal; desenho digital; renderização.\n\n' +
        'Objetivo geral: desenvolver desenhos com instrumentos, escalas, formatos e layout; planejar projetos com diversidade humana e acessibilidade; usar software de CAD conforme ABNT.\n\n' +
        'Objetivos específicos: ler e executar desenhos técnicos; concepção e normas de desenho; desenho universal e requisitos de acessibilidade; software de desenho e comandos principais; projetos arquitetônicos 2D/3D; fundamentos de renderização e maquetes virtuais simples.',
    },
    {
      id: 'seg_trab',
      name: 'Segurança e Saúde no Trabalho',
      sem: 2,
      prereqs: [],
      codigo: 'AL0368',
      ch: '30h',
      ementa:
        'Introdução à segurança no trabalho; legislação e normatização; EPI/EPC; higiene e medicina do trabalho; ergonomia; segurança com eletricidade; proteção contra incêndios; primeiros socorros.\n\n' +
        'Objetivo geral: estudar normas de segurança, saúde, higiene e medicina no trabalho.\n\n' +
        'Objetivos específicos: cultura prevencionista; riscos ambientais e doenças profissionais e do trabalho; identificar e indicar EPI/EPC por atividade; procedimentos contra atos e condições inseguras; responsabilidades de empregador e empregado.',
    },
    {
      id: 'fis1',
      name: 'Física I',
      sem: 2,
      prereqs: ['calc1'],
      codigo: 'AL0003',
      ch: '75h',
      ementa:
        'Movimento retilíneo; movimento no plano; leis de Newton; trabalho e energia cinética; energia potencial e conservação; quantidade de movimento linear e choques; rotação de corpos rígidos; gravitação.\n\n' +
        'Objetivo geral: identificar fenômenos em termos de quantidade e regularidade; interpretar princípios da mecânica clássica e aplicá-los em problemas simples.\n\n' +
        'Objetivos específicos: aplicar fundamentos da física clássica em situações práticas nas engenharias; relacionar conceitos a exemplos cotidianos; resolver cinemática e mecânica em uma, duas e três dimensões; conservação de energia mecânica e momento linear e angular.',
    },
    {
      id: 'ext2',
      name: 'Práticas de Extensão em Engenharia Civil II',
      sem: 2,
      prereqs: ['ext1'],
      codigo: 'AL0369',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: desenvolver extensão que articule UNIPAMPA e sociedade por meio da produção e aplicação do conhecimento técnico, integrando ensino e pesquisa.\n\n' +
        'Objetivos específicos: introduzir a extensão na formação técnica; formação interdisciplinar, cidadã, crítica e responsável; integração com a sociedade; promoção do desenvolvimento humano, econômico, social e cultural.',
    },
    // 3º SEM
    {
      id: 'mec_ger',
      name: 'Mecânica Geral',
      sem: 3,
      prereqs: ['fis1'],
      codigo: 'AL0015',
      ch: '60h',
      ementa:
        'Princípios da estática; sistemas de forças em equilíbrio; equilíbrio de partículas e de corpos rígidos; esforços internos em vigas isostáticas; centro de gravidade e centro de massa; momento de inércia e produto de inércia.\n\n' +
        'Objetivo geral: reconhecer esforços em estruturas e determinar características geométricas das seções.\n\n' +
        'Objetivos específicos: equacionar equilíbrio de partículas e corpos rígidos; interpretar e calcular solicitações internas; determinar características geométricas de seções e corpos.',
    },
    {
      id: 'cien_mat',
      name: 'Ciência dos Materiais',
      sem: 3,
      prereqs: ['quim'],
      codigo: 'AL0371',
      ch: '60h',
      ementa:
        'Composição e propriedades dos materiais; normas técnicas e avaliação de desempenho; metais; madeiras; cerâmicos; polímeros; vidros; tintas e vernizes.\n\n' +
        'Objetivo geral: conhecer propriedades físicas dos materiais de construção, qualidades, possibilidades e limitações de uso em edificações.\n\n' +
        'Objetivos específicos: classificar materiais por função ou ligação química; reconhecer propriedades; especificar materiais e fornecedores e ensaios; analisar resultados visando otimização técnica e econômica.',
    },
    {
      id: 'probest',
      name: 'Probabilidade e Estatística',
      sem: 3,
      prereqs: ['calc2'],
      codigo: 'AL0022',
      ch: '60h',
      ementa:
        'Estatística descritiva; teoria das probabilidades; distribuições discretas e contínuas; teoria da amostragem; estimação de parâmetros; testes de hipótese; correlação e regressão.\n\n' +
        'Objetivo geral: fundamentos de probabilidade, variáveis aleatórias, processos aleatórios e estatística.\n\n' +
        'Objetivos específicos: linguagem estatística; tabelas e gráficos; medidas descritivas; técnicas de probabilidade; amostragem; testes comparativos entre grupos; correlação e regressão; interpretação de dados experimentais.',
    },
    {
      id: 'eq_dif',
      name: 'Equações Diferenciais I',
      sem: 3,
      prereqs: ['calc2'],
      codigo: 'AL0019',
      ch: '60h',
      ementa:
        'Conceito e classificação de equações diferenciais; tipos de soluções; EDOs de primeira e segunda ordem; lineares de ordem superior; sistemas lineares de EDOs.\n\n' +
        'Objetivo geral: desenvolver conceitos matemáticos de EDOs; aplicar em problemas de engenharia; interpretar resultados; escolher técnica adequada ao problema.\n\n' +
        'Objetivos específicos: identificar e resolver EDOs de primeira e segunda ordem, de ordem superior e sistemas lineares de primeira ordem; modelar problemas clássicos de engenharia por EDOs.',
    },
    {
      id: 'transp',
      name: 'Sistemas de Transportes',
      sem: 3,
      prereqs: [],
      codigo: 'AL0372',
      ch: '60h',
      ementa:
        'Transporte e desenvolvimento econômico; aspectos técnicos e econômicos; planejamento global e setorial; análise de projetos de transportes; introdução à logística.\n\n' +
        'Objetivo geral: conhecer sistemas e modalidades de transporte; avaliar aspectos técnicos e econômicos em planos de transporte; introduzir engenharia de tráfego e urbanização; noções de logística.\n\n' +
        'Objetivos específicos: características dos modos no Brasil e no mundo; escolha de modo com vantagens e desvantagens; intermodalidade/multimodalidade; engenharia de tráfego e logística de transportes.',
    },
    {
      id: 'fis2',
      name: 'Física II',
      sem: 3,
      prereqs: ['fis1'],
      codigo: 'AL0011',
      ch: '75h',
      ementa:
        'Oscilações; ondas; temperatura; primeira e segunda lei da termodinâmica; teoria cinética dos gases; hidrostática; hidrodinâmica.\n\n' +
        'Objetivo geral: distinguir oscilações e ondas; compreender calor e temperatura; aplicar equações em problemas; relacionar princípios às aplicações em engenharia.\n\n' +
        'Objetivos específicos: exemplos do cotidiano; aspectos conceituais e matemáticos de movimentos oscilatórios e ondulatórios; líquidos e gases; leis do escoamento; leis da termodinâmica com aplicações; manipulação de equações.',
    },
    {
      id: 'ext3',
      name: 'Práticas de Extensão em Engenharia Civil III',
      sem: 3,
      prereqs: ['ext1'],
      codigo: 'AL0374',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: desenvolver extensão que articule UNIPAMPA e sociedade por meio da produção e aplicação do conhecimento técnico, integrando ensino e pesquisa.\n\n' +
        'Objetivos específicos: introduzir a extensão na formação técnica; formação interdisciplinar, cidadã, crítica e responsável; integração com a sociedade; desenvolvimento humano, econômico, social e cultural.',
    },
    // 4º SEM
    {
      id: 'res_mat1',
      name: 'Resistência dos Materiais I',
      sem: 4,
      prereqs: ['mec_ger'],
      codigo: 'AL0375',
      ch: '60h',
      ementa:
        'Tensão, deformação, propriedades mecânicas dos materiais; carga axial, torção, flexão, cisalhamento transversal.\n\n' +
        'Objetivo geral: determinar e compreender tensões e deformações decorrentes dos esforços internos.\n\n' +
        'Objetivos específicos: identificar tensões e deformações por tipo de carregamento; propriedades mecânicas dos materiais; determinar tensões e deformações em componentes estruturais ou mecânicos.',
    },
    {
      id: 'mat_cons1',
      name: 'Materiais de Construção Civil I',
      sem: 4,
      prereqs: ['cien_mat'],
      codigo: 'AL0376',
      ch: '60h',
      ementa:
        'Agregados; aglomerantes minerais; adições minerais; argamassa; blocos.\n\n' +
        'Objetivo geral: conhecer propriedades dos materiais de construção, qualidades, possibilidades e limitações de uso em edificações.\n\n' +
        'Objetivos específicos: especificar materiais; especificar ensaios de caracterização conforme normas; analisar resultados para otimização técnica e econômica; selecionar fornecedores.',
    },
    {
      id: 'est_iso',
      name: 'Estruturas Isostáticas',
      sem: 4,
      prereqs: ['mec_ger'],
      codigo: 'AL0377',
      ch: '60h',
      ementa:
        'Grau de estaticidade; vigas (método das seções e método gráfico); vigas Gerber; pórticos planos e espaciais; arcos; treliças planas (nós, Ritter); linhas de influência em estruturas isostáticas.\n\n' +
        'Objetivo geral: compreender estática dos corpos rígidos e análise de estruturas isostáticas lineares para aplicação em problemas práticos.\n\n' +
        'Objetivos específicos: diagramas de esforços em vigas e pórticos; esforços em treliças planas; linhas de influência em estruturas isostáticas.',
    },
    {
      id: 'top',
      name: 'Topografia e Elementos de Geodésia',
      sem: 4,
      prereqs: ['geom'],
      codigo: 'AL0046',
      ch: '90h',
      ementa:
        'Fundamentos de geodésia geométrica; representação plana do modelo geodésico; instrumentação; grandezas de medição; levantamentos horizontais e verticais; posicionamento por satélites.\n\n' +
        'Objetivo geral: conhecer topografia e geodésia para levantamentos, estimativa de grandezas e representação de área e altimetria.\n\n' +
        'Objetivos específicos: aplicar conceitos em projetos de engenharia; manusear teodolito, níveis, estação total e GPS; realizar levantamentos e aplicar em projetos de engenharia civil.',
    },
    {
      id: 'geo_eng',
      name: 'Geologia de Engenharia',
      sem: 4,
      prereqs: [],
      codigo: 'AL0378',
      ch: '60h',
      ementa:
        'Noções de geologia geral; minerais e rochas; intemperismo; estruturas geológicas; investigação geológica; caracterização geomecânica de maciços rochosos; noções de hidrogeologia; dinâmica superficial e depósitos superficiais.\n\n' +
        'Objetivo geral: compreender geologia aplicada à localização, construção e manutenção de obras, visando segurança e minimização de impactos ambientais.\n\n' +
        'Objetivos específicos: identificar minerais e rochas e classificá-los; intemperismo e erosão; dinâmica das águas superficial e subterrânea e efeitos em obras.',
    },
    {
      id: 'fen_trans',
      name: 'Fenômenos de Transferência',
      sem: 4,
      prereqs: ['calc2', 'fis2'],
      codigo: 'AL0038',
      ch: '60h',
      ementa:
        'Propriedades dos fluidos em meios contínuos; estática dos fluidos; cinemática dos fluidos; transferência de calor por condução, convecção e radiação; transferência de massa.\n\n' +
        'Objetivo geral: compreender e aplicar mecanismos de transferência de massa, calor e quantidade de movimento; estática e dinâmica de fluidos ideais e reais em escoamentos.\n\n' +
        'Objetivos específicos: interpretar fenômenos físicos por modelagem matemática de problemas de engenharia.',
    },
    {
      id: 'eng_traf',
      name: 'Engenharia de Tráfego',
      sem: 4,
      prereqs: ['transp'],
      codigo: 'AL0379',
      ch: '60h',
      ementa:
        'Organização do tráfego; elementos e características; relações volume, densidade e velocidade; segurança no trânsito; mobilidade urbana; normas de sinalização (vertical, horizontal, semafórica, obras, auxiliares); estacionamentos.\n\n' +
        'Objetivo geral: conhecimentos básicos de engenharia de tráfego urbano e sinalização viária; operação, gestão e planejamento da mobilidade.\n\n' +
        'Objetivos específicos: identificar elementos do tráfego e sua influência na mobilidade; demanda e oferta e formas de alteração; segurança de pedestres e veículos; tipos e funções da sinalização; avaliação e cálculo semafórico; estacionamentos urbanos.',
    },
    {
      id: 'eng_eco',
      name: 'Introdução à Engenharia Econômica',
      sem: 4,
      prereqs: ['probest'],
      codigo: 'AL0380',
      ch: '45h',
      ementa:
        'Fundamentos da matemática financeira; análise de viabilidade econômica de projetos de investimentos.\n\n' +
        'Objetivo geral: fundamentos da engenharia econômica para tomada de decisão em análise de investimentos.\n\n' +
        'Objetivos específicos: definições e princípios da matemática financeira e da engenharia econômica; aplicar métodos na análise de projetos de investimentos.',
    },
    // 5º SEM
    {
      id: 'res_mat2',
      name: 'Resistência dos Materiais II',
      sem: 5,
      prereqs: ['res_mat1'],
      codigo: 'AL0381',
      ch: '60h',
      ementa:
        'Cargas combinadas; transformações de tensão e de deformação; teorias de falha; projeto de vigas e eixos; deflexão de vigas e eixos; flambagem de colunas; métodos de energia.\n\n' +
        'Objetivo geral: compreender estado de tensões e deformações; projeto de vigas e eixos; deflexão e flambagem.\n\n' +
        'Objetivos específicos: analisar tensões e deformações em carregamentos combinados; tensões em diferentes orientações e verificação por teorias de falha; dimensionar e analisar deflexão; avaliar estabilidade de estruturas esbeltas.',
    },
    {
      id: 'mat_cons2',
      name: 'Materiais de Construção Civil II',
      sem: 5,
      prereqs: ['mat_cons1'],
      codigo: 'AL0382',
      ch: '60h',
      ementa:
        'Concreto; propriedades do concreto fresco e endurecido; dosagem; produção; controle tecnológico; durabilidade.\n\n' +
        'Objetivo geral: propriedades dos concretos, qualidades, aplicações e limitações em edificações.\n\n' +
        'Objetivos específicos: especificar materiais para produção de concretos; dosar concretos convencionais; ensaios de controle no fresco e endurecido; executar ensaios de controle tecnológico; analisar resultados.',
    },
    {
      id: 'hidro',
      name: 'Hidrologia',
      sem: 5,
      prereqs: ['probest'],
      codigo: 'AL0109',
      ch: '60h',
      ementa:
        'Introdução à hidrologia; ciclo hidrológico; bacia hidrográfica; meteorologia; precipitação; evapotranspiração; interceptação; infiltração; água subterrânea; hidrometria; escoamento superficial; disponibilidade hídrica; controle de enchentes.\n\n' +
        'Objetivo geral: obter, processar e analisar informações hidrológicas para uso racional e sustentável da água.\n\n' +
        'Objetivos específicos: ciclo hidrológico e variáveis; relações entre ações humanas e meio ambiente; calcular variáveis para projetos e dimensionamentos hidráulicos.',
    },
    {
      id: 'hidraul',
      name: 'Hidráulica Geral',
      sem: 5,
      prereqs: ['fen_trans'],
      codigo: 'AL0170',
      ch: '75h',
      ementa:
        'Princípios básicos; condutos forçados; estações de bombeamento; golpe de aríete em casas de bombas; condutos livres; escoamento por orifícios, bocais, comportas e vertedores.\n\n' +
        'Objetivo geral: subsídios teóricos do escoamento em condutos forçados e livres para dimensionamento de estruturas hidráulicas.\n\n' +
        'Objetivos específicos: comportamento e equações do fluido em movimento; dimensionar condutos livres e forçados; dimensionar instalações elevatórias; noções de orifícios, bocais, comportas e vertedores.',
    },
    {
      id: 'mec_solo1',
      name: 'Mecânica dos Solos I',
      sem: 5,
      prereqs: ['geo_eng'],
      codigo: 'AL0383',
      ch: '60h',
      ementa:
        'Solos na engenharia; física dos solos; classificação; compactação; tensões nos solos; hidráulica dos solos.\n\n' +
        'Objetivo geral: princípios da mecânica dos solos (propriedades físicas, classificação, compactação, tensões e fluxo); ensaios de laboratório e interpretação; base para problemas mais complexos.\n\n' +
        'Objetivos específicos: índices físicos dos solos; sistemas de classificação; compactação Proctor e aplicação; tensões geostáticas; influência do fluxo de água no comportamento dos solos.',
    },
    {
      id: 'proj_via',
      name: 'Projeto de Estruturas Viárias',
      sem: 5,
      prereqs: ['dtcd', 'top'],
      codigo: 'AL0063',
      ch: '60h',
      ementa:
        'Planejamento de via; classificação de vias; projeto geométrico de vias de tráfego; elaboração de projeto geométrico de trecho.\n\n' +
        'Objetivo geral: noções de planejamento para elaboração de projeto geométrico de via terrestre.\n\n' +
        'Objetivos específicos: interpretar cartas com restituição do relevo; normas aplicáveis ao projeto viário; variáveis do projeto geométrico; realizar projeto geométrico de uma via.',
    },
    {
      id: 'eletrot',
      name: 'Eletrotécnica',
      sem: 5,
      prereqs: [],
      codigo: 'AL0006',
      ch: '45h',
      ementa:
        'Segurança em laboratório e com eletricidade; relatórios; elementos e leis de circuitos em regime permanente; voltímetro, amperímetro, wattímetro, osciloscópio; noções de acionamento de motores CA; instalações elétricas residenciais.\n\n' +
        'Objetivo geral: medições de tensão, corrente e potência; segurança e prevenção de choques; conceitos para acionamento de motor CA.\n\n' +
        'Objetivos específicos: montagem, simulação e análise de circuitos básicos em regime permanente; uso correto de instrumentos; segurança com eletricidade; acionamento de motor CA; projeto simplificado de instalação residencial.',
    },
    {
      id: 'calc_num',
      name: 'Cálculo Numérico',
      sem: 5,
      prereqs: ['alg', 'alg_lin', 'calc2'],
      codigo: 'AL0037',
      ch: '60h',
      ementa:
        'Erros; zeros de funções e polinômios; aproximações de funções; interpolação numérica; integração numérica; sistemas lineares; resolução numérica de EDOs; apoio computacional.\n\n' +
        'Objetivo geral: noções sobre métodos numéricos básicos para problemas modelados por equações algébricas ou diferenciais.\n\n' +
        'Objetivos específicos: avaliar viabilidade de métodos numéricos em problemas específicos; usar linguagem de programação na resolução de problemas matemáticos.',
    },
    // 6º SEM
    {
      id: 'est_hiper',
      name: 'Estruturas Hiperestáticas',
      sem: 6,
      prereqs: ['est_iso', 'res_mat2'],
      codigo: 'AL0384',
      ch: '60h',
      ementa:
        'Teorema dos trabalhos virtuais; método da carga unitária; estruturas hiperestáticas; método das forças e dos deslocamentos; introdução à análise matricial de estruturas.\n\n' +
        'Objetivo geral: resolver estruturas estaticamente indeterminadas e aplicar em problemas práticos de engenharia estrutural.\n\n' +
        'Objetivos específicos: TVM e carga unitária em isostáticas; análise por método das forças e dos deslocamentos; fundamentos da análise matricial.',
    },
    {
      id: 'const1',
      name: 'Construção Civil I',
      sem: 6,
      prereqs: ['mat_cons2'],
      codigo: 'AL0089',
      ch: '60h',
      ementa:
        'Introdução à construção civil; infraestrutura; impermeabilização; elementos de concreto armado; alvenarias.\n\n' +
        'Objetivo geral: identificar etapas e serviços de obra e aplicar técnicas de execução.\n\n' +
        'Objetivos específicos: tecnologias construtivas; instrumentos de gestão da obra; comportamento de materiais e ensaios; gestão de materiais no canteiro com redução de desperdício.',
    },
    {
      id: 'acoes',
      name: 'Ações e Segurança das Estruturas',
      sem: 6,
      prereqs: ['res_mat2'],
      codigo: 'AL0385',
      ch: '60h',
      ementa:
        'Critérios básicos de segurança; método dos estados limites; levantamento de carregamentos; combinação das ações; verificação de segurança; ações do vento em edificações e galpões.\n\n' +
        'Objetivo geral: ações e segurança das estruturas; introdução ao vento e forças estáticas equivalentes.\n\n' +
        'Objetivos específicos: levantamento e combinação de ações para atender ELU e ELS; comportamento do vento e ações estáticas equivalentes na análise de segurança.',
    },
    {
      id: 'inst_hid',
      name: 'Instalações Hidráulicas Prediais',
      sem: 6,
      prereqs: ['hidro', 'hidraul'],
      codigo: 'AL0163',
      ch: '60h',
      ementa:
        'Água fria e quente; esgoto sanitário; águas pluviais; combate a incêndio; gás.\n\n' +
        'Objetivo geral: elaborar e executar projetos hidrossanitários, de gás e de prevenção e combate a incêndio.\n\n' +
        'Objetivos específicos: terminologia e normas; dimensionar e projetar sistemas hidráulicos prediais; plantas, esquemas, perspectivas, cortes e detalhes; relação de materiais para execução.',
    },
    {
      id: 'mec_solo2',
      name: 'Mecânica dos Solos II',
      sem: 6,
      prereqs: ['mec_solo1'],
      codigo: 'AL0386',
      ch: '60h',
      ementa:
        'Compressibilidade e adensamento; resistência ao cisalhamento; tópicos especiais; drenagem e rebaixamentos.\n\n' +
        'Objetivo geral: compressibilidade, cisalhamento e drenagem; base para problemas mais complexos.\n\n' +
        'Objetivos específicos: compressibilidade e resistência ao cisalhamento; conceitos de drenagem e rebaixamento do nível d\u2019água.',
    },
    {
      id: 'terrap',
      name: 'Terraplanagem e Movimentação de Terra',
      sem: 6,
      prereqs: ['mec_solo1', 'proj_via'],
      codigo: 'AL0086',
      ch: '60h',
      ementa:
        'Estudos geotécnicos e complementares para terraplanagem; projeto de terraplanagem de via; elaboração de projeto de trecho; orientações e execução.\n\n' +
        'Objetivo geral: conceitos de terraplanagem e movimentação de terra aplicados ao projeto de terraplanagem de via.\n\n' +
        'Objetivos específicos: alternativas econômicas de movimento de terra; elaborar projeto de terraplanagem; dimensionar equipes; planejar e executar serviços; definir custos.',
    },
    {
      id: 'inst_el',
      name: 'Instalações Elétricas Prediais',
      sem: 6,
      prereqs: ['eletrot'],
      codigo: 'AL0081',
      ch: '60h',
      ementa:
        'Projeto de instalações elétricas prediais: definições, simbologia, cargas, quadro de cargas, eletrodutos e condutores, luminotécnica, proteções; CAD; projeto de instalações telefônicas: definições, simbologia, esquemas e dimensionamento de tubulações e cabos.\n\n' +
        'Objetivo geral: dimensionar e projetar força, iluminação e telefonia em níveis residenciais e prediais.\n\n' +
        'Objetivos específicos: elementos dos projetos elétricos residenciais e prediais; acessibilidade nas instalações elétricas; desenho técnico com ferramentas computacionais.',
    },
    {
      id: 'arq',
      name: 'Arquitetura',
      sem: 6,
      prereqs: ['dtcd'],
      codigo: 'AL0171',
      ch: '60h',
      ementa:
        'Introdução ao estudo da arquitetura; habitação unifamiliar e multifamiliar.\n\n' +
        'Objetivo geral: elaborar projetos arquitetônicos unifamiliares e multifamiliares.\n\n' +
        'Objetivos específicos: condicionantes na elaboração; organização dos espaços; interação interior/exterior e edificação/cidade.',
    },
    // 7º SEM
    {
      id: 'conc1',
      name: 'Concreto Armado I',
      sem: 7,
      prereqs: ['res_mat2', 'calc_num', 'acoes'],
      codigo: 'AL0388',
      ch: '60h',
      ementa:
        'Introdução a estruturas de concreto armado; armadura de flexão; detalhamento longitudinal na seção transversal; estados limites de utilização; detalhamento longitudinal ao longo da viga.\n\n' +
        'Objetivo geral: comportamento mecânico de CA; dimensionamento e detalhamento de vigas.\n\n' +
        'Objetivos específicos: comportamento básico de CA; dimensionar e detalhar flexão; verificar fissuração e flecha em vigas.',
    },
    {
      id: 'const2',
      name: 'Construção Civil II',
      sem: 7,
      prereqs: ['const1'],
      codigo: 'AL0389',
      ch: '60h',
      ementa:
        'Revestimento de paredes e pisos; pinturas; esquadrias; coberturas; forros e divisórias.\n\n' +
        'Objetivo geral: identificar etapas e serviços e aplicar técnicas de execução.\n\n' +
        'Objetivos específicos: tecnologias construtivas; ensaios e interpretação de materiais; gestão de materiais no canteiro.',
    },
    {
      id: 'gest_amb',
      name: 'Fundamentos da Gestão Ambiental',
      sem: 7,
      prereqs: [],
      codigo: 'AL0390',
      ch: '30h',
      ementa:
        'Ambiente e desenvolvimento sustentável; políticas ambientais; projetos ambientais.\n\n' +
        'Objetivo geral: definições, legislação e projetos ambientais em obras com possíveis impactos.\n\n' +
        'Objetivos específicos: conceitos das ciências do ambiente; medidas de preservação e impactos; base para desenvolvimento e gerenciamento de projetos; cultura de preservação ambiental.',
    },
    {
      id: 'san1',
      name: 'Sistemas de Saneamento Básico I',
      sem: 7,
      prereqs: ['hidro', 'hidraul'],
      codigo: 'AL0391',
      ch: '60h',
      ementa:
        'Parâmetros de qualidade da água; abastecimento (captação, adução, tratamento, reservação e distribuição); conceitos sobre resíduos sólidos.\n\n' +
        'Objetivo geral: projetar e dimensionar abastecimento urbano; tipos de resíduos sólidos, gerenciamento e disposição final.\n\n' +
        'Objetivos específicos: etapas do sistema até o usuário; legislação e normas; soluções com adequação ambiental.',
    },
    {
      id: 'obras_t',
      name: 'Obras de Terra',
      sem: 7,
      prereqs: ['mec_solo2'],
      codigo: 'AL0392',
      ch: '60h',
      ementa:
        'Equilíbrio de maciços de terras; estabilidade e estabilização de taludes; aterros; estruturas de contenção; barragens.\n\n' +
        'Objetivo geral: projeto e técnicas executivas de obras de terra; base para aprofundamento.\n\n' +
        'Objetivos específicos: metodologias de estabilidade de taludes; sistemas de estabilização; aterros sobre solos moles; barragens de terra e enrocamento.',
    },
    {
      id: 'mat_via',
      name: 'Materiais de Estruturas Viárias',
      sem: 7,
      prereqs: ['mec_solo1', 'terrap'],
      codigo: 'AL0393',
      ch: '60h',
      ementa:
        'Infraestrutura; materiais; agregados; ligantes; métodos de preparação de misturas.\n\n' +
        'Objetivo geral: pesquisar, obter e manusear materiais e misturas em pavimentação.\n\n' +
        'Objetivos específicos: ensaios de controle tecnológico em laboratório; projetar e interpretar misturas; dosagens de revestimentos asfálticos.',
    },
    {
      id: 'adm',
      name: 'Administração',
      sem: 7,
      prereqs: ['eng_eco'],
      codigo: 'AL0394',
      ch: '30h',
      ementa:
        'Fundamentos da administração; o administrador; partes da administração; planejamento da ação empresarial.\n\n' +
        'Objetivo geral: natureza da gestão empresarial e sistemas produtivos; técnicas e metodologias administrativas na tomada de decisão em bens e serviços.\n\n' +
        'Objetivos específicos: conceitos e processos básicos da administração; ferramentas e metodologias; planejamento, organização, direção e controle na gestão.',
    },
    {
      id: 'ext7',
      name: 'Práticas de Extensão em Engenharia Civil VII',
      sem: 7,
      prereqs: ['ext3'],
      codigo: 'AL0395',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: extensão articulando UNIPAMPA e sociedade por meio do conhecimento técnico com ensino e pesquisa.\n\n' +
        'Objetivos específicos: extensão na formação técnica; formação interdisciplinar e cidadã; integração com a sociedade; desenvolvimento humano, econômico, social e cultural.',
    },
    // 8º SEM
    {
      id: 'conc2',
      name: 'Concreto Armado II',
      sem: 8,
      prereqs: ['conc1', 'est_hiper'],
      codigo: 'AL0396',
      ch: '60h',
      ementa:
        'Cisalhamento em vigas; armadura transversal; torção; dimensionamento de lajes; escadas; reservatórios de água.\n\n' +
        'Objetivo geral: comportamento mecânico de CA; dimensionamento e detalhamento de vigas e lajes.\n\n' +
        'Objetivos específicos: cisalhamento e torção em vigas; lajes, escadas e reservatórios com verificação de fissuras e flecha.',
    },
    {
      id: 'orc_ob',
      name: 'Orçamento e Programação de Obras',
      sem: 8,
      prereqs: ['const2', 'inst_el', 'inst_hid'],
      codigo: 'AL0397',
      ch: '60h',
      ementa:
        'Generalidades; custos unitários; orçamento analítico; programação da execução; legalização da construção; incorporação imobiliária.\n\n' +
        'Objetivo geral: elaboração de orçamento e programação de obras.\n\n' +
        'Objetivos específicos: orçamento analítico; cronogramas físico-financeiros; reajustamento de preços; incorporação imobiliária; licitação de obra pública.',
    },
    {
      id: 'est_mad',
      name: 'Estruturas de Madeira',
      sem: 8,
      prereqs: ['est_hiper', 'acoes'],
      codigo: 'AL0398',
      ch: '45h',
      ementa:
        'Características do material; tração e compressão axial; cisalhamento direto e compressão normal às fibras; flexão; instabilidade lateral de vigas; ligações; peças múltiplas.\n\n' +
        'Objetivo geral: comportamento mecânico da madeira; dimensionamento; introdução a novas tecnologias.\n\n' +
        'Objetivos específicos: ligações; forças normais; cisalhamento; flexão; peças múltiplas; novas tecnologias em madeira estrutural.',
    },
    {
      id: 'san2',
      name: 'Sistemas de Saneamento Básico II',
      sem: 8,
      prereqs: ['san1'],
      codigo: 'AL0399',
      ch: '60h',
      ementa:
        'Rede coletora de esgotos domésticos; tratamento de esgotos domésticos; drenagem urbana.\n\n' +
        'Objetivo geral: projetar e dimensionar coleta de esgoto doméstico e drenagem urbana.\n\n' +
        'Objetivos específicos: efeitos antrópicos de esgotos doméstico e pluvial; legislação e normas; soluções com adequação ambiental.',
    },
    {
      id: 'fund',
      name: 'Fundações',
      sem: 8,
      prereqs: ['obras_t'],
      codigo: 'AL0400',
      ch: '60h',
      ementa:
        'Investigações geológico-geotécnicas; concepção de fundações; fundações rasas e profundas.\n\n' +
        'Objetivo geral: engenharia de fundações para projetos simples e base para aprofundamento.\n\n' +
        'Objetivos específicos: condições do subsolo por ensaios de campo; capacidade de carga, recalques e dimensionamentos simples; execução e controle de fundações.',
    },
    {
      id: 'est_via',
      name: 'Estruturas Viárias e Mecânica dos Pavimentos',
      sem: 8,
      prereqs: ['transp', 'mat_via'],
      codigo: 'AL0401',
      ch: '60h',
      ementa:
        'Infraestrutura; construção; mecânica dos pavimentos; tráfego rodoviário; dimensionamento de pavimentos rígidos e flexíveis; reforço de pavimentos; projeto de pavimento.\n\n' +
        'Objetivo geral: estudos, levantamentos e projeto de pavimentos.\n\n' +
        'Objetivos específicos: estrutura dos pavimentos; dimensionar e executar pavimentos rígidos e flexíveis; projetar reforços.',
    },
    {
      id: 'empreend',
      name: 'Empreendedorismo',
      sem: 8,
      prereqs: ['adm'],
      codigo: 'AL0402',
      ch: '30h',
      ementa:
        'Introdução ao empreendedorismo; processo empreendedor; expansão do negócio.\n\n' +
        'Objetivo geral: criação de negócios e cultura empreendedora.\n\n' +
        'Objetivos específicos: conceitos, teorias e ferramentas; processo empreendedor; plano de negócios e gestão; oportunidades de inovação e empreendedorismo.',
    },
    {
      id: 'ext8',
      name: 'Práticas de Extensão em Engenharia Civil VIII',
      sem: 8,
      prereqs: ['ext3'],
      codigo: 'AL0403',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: extensão articulando UNIPAMPA e sociedade por meio do conhecimento técnico com ensino e pesquisa.\n\n' +
        'Objetivos específicos: extensão na formação técnica; formação interdisciplinar e cidadã; integração com a sociedade; desenvolvimento humano, econômico, social e cultural.',
    },
    // 9º SEM
    {
      id: 'conc3',
      name: 'Concreto Armado III',
      sem: 9,
      prereqs: ['conc2'],
      codigo: 'AL0404',
      ch: '60h',
      ementa:
        'Concepção do projeto estrutural; análise estrutural; flexo-compressão normal e oblíqua; pilares; sapatas e blocos de fundação.\n\n' +
        'Objetivo geral: concepção e análise estrutural; dimensionamento e detalhamento de pilares, sapatas e blocos de fundação.\n\n' +
        'Objetivos específicos: lançamento de estruturas de CA; analisar, dimensionar e detalhar pilares; dimensionar e detalhar sapatas e blocos.',
    },
    {
      id: 'ger_ob',
      name: 'Gerenciamento de Obras',
      sem: 9,
      prereqs: ['adm', 'orc_ob'],
      codigo: 'AL0405',
      ch: '60h',
      ementa:
        'Gerenciamento e gestão da construção; gerenciamento de projetos; produtividade; planejamento e controle de obras.\n\n' +
        'Objetivo geral: estrutura organizacional em construtoras e empreendimentos; planejamento e controle básicos.\n\n' +
        'Objetivos específicos: ferramentas de gerenciamento de obras e projetos; produtividade no canteiro; gestão e planejamento das construções; EAP de projetos.',
    },
    {
      id: 'est_aco',
      name: 'Estruturas de Aço',
      sem: 9,
      prereqs: ['est_hiper', 'acoes'],
      codigo: 'AL0406',
      ch: '60h',
      ementa:
        'Ações e segurança em estruturas de aço; ligações parafusadas e soldadas; chapas de ligação; barras tracionadas, comprimidas e flexionadas.\n\n' +
        'Objetivo geral: dimensionamento e detalhamento de estruturas de aço.\n\n' +
        'Objetivos específicos: critérios da NBR 8800/2008; análise de estruturas reticuladas; dimensionamento de estruturas de aço.',
    },
    {
      id: 'pat',
      name: 'Patologia das Construções',
      sem: 9,
      prereqs: ['const2'],
      codigo: 'AL0407',
      ch: '60h',
      ementa:
        'Manifestações patológicas; durabilidade e vida útil; revestimentos e pinturas; impermeabilização; patologias do concreto; gretas, fissuras e trincas; patologias de fundações; tratamentos dos danos.\n\n' +
        'Objetivo geral: reconhecer e avaliar patologias e propor soluções com base em prognóstico.\n\n' +
        'Objetivos específicos: patologias em fachadas; anomalias por intempéries; soluções para manifestações patológicas.',
    },
    {
      id: 'tcc1',
      name: 'Trabalho de Conclusão de Curso I',
      sem: 9,
      prereqs: [],
      codigo: 'AL0148',
      ch: '30h',
      ementa:
        'Elaboração de trabalho de conclusão de curso voltado à complementação profissional, sob orientação de professor do curso.\n\n' +
        'Objetivo geral: síntese dos conhecimentos e habilidades adquiridos ao longo do curso.\n\n' +
        'Objetivos específicos: elaborar TCC com base em metodologia científica; apresentar à comissão examinadora.',
    },
    {
      id: 'leg_et',
      name: 'Legislação, Ética e Exercício Profissional da Engenharia',
      sem: 9,
      prereqs: [],
      codigo: 'AL0142',
      ch: '30h',
      ementa:
        'Moral, ética e valores; ética no trabalho; sistema CONFEA/CREA; legislação profissional; código de ética; responsabilidade civil e técnica; CDC; propriedade intelectual, direitos autorais, transferência de tecnologia, concorrência desleal; acervo técnico; atribuições profissionais.\n\n' +
        'Objetivo geral: responsabilidades técnicas e civis na perspectiva da ética e do exercício profissional.\n\n' +
        'Objetivos específicos: identificar atribuições profissionais; distinguir áreas de atuação da engenharia; princípios legais e éticos da área.',
    },
    {
      id: 'proj_int',
      name: 'Projeto Integrado',
      sem: 9,
      prereqs: ['conc2', 'san2', 'arq', 'fund'],
      codigo: 'AL0408',
      ch: '60h',
      ementa:
        'Projetos complementares de edificação; interferências e compatibilização; técnicas e conceitos BIM (modelagem da informação da construção).\n\n' +
        'Objetivo geral: visão global do projeto de edificação por elaboração e compatibilização de projetos complementares e arquitetônico, integrando o curso e introduzindo BIM.\n\n' +
        'Objetivos específicos: elaborar projetos complementares; compatibilizar com o arquitetônico; aplicar técnicas e conceitos BIM.',
    },
    {
      id: 'ext9',
      name: 'Práticas de Extensão em Engenharia Civil IX',
      sem: 9,
      prereqs: ['ext7'],
      codigo: 'AL0409',
      ch: '30h',
      ementa:
        'Ações extensionistas do curso de engenharia civil vinculadas a programas/projetos institucionais.\n\n' +
        'Objetivo geral: extensão articulando UNIPAMPA e sociedade por meio do conhecimento técnico com ensino e pesquisa.\n\n' +
        'Objetivos específicos: extensão na formação técnica; formação interdisciplinar e cidadã; integração com a sociedade; desenvolvimento humano, econômico, social e cultural.',
    },
    // 10º SEM
    {
      id: 'estagio',
      name: 'Estágio Supervisionado',
      sem: 10,
      prereqs: [],
      codigo: 'AL0410',
      ch: '240h',
      ementa:
        'Atividades de estágio; relatório de estágio.\n\n' +
        'Objetivo geral: aplicar conhecimentos do curso na análise, elaboração e implantação de projetos, avaliando desempenho com base nesses conhecimentos.\n\n' +
        'Objetivos específicos: integrar teoria e prática; identificar campos de atuação profissional; demonstrar domínio técnico; integração universidade-empresa e transferência de tecnologia; subsídios para adequação do currículo ao mercado.',
    },
    {
      id: 'tcc2',
      name: 'Trabalho de Conclusão de Curso II',
      sem: 10,
      prereqs: ['tcc1'],
      codigo: 'AL0157',
      ch: '30h',
      ementa:
        'Elaboração de trabalho de conclusão de curso voltado à complementação profissional, sob orientação de professor do curso.\n\n' +
        'Objetivo geral: síntese dos conhecimentos e habilidades adquiridos ao longo do curso.\n\n' +
        'Objetivos específicos: TCC com metodologia científica; aplicar conhecimento técnico na elaboração; apresentar à comissão examinadora.',
    },
  ];

  window.GRADE_CURSO_CONFIG = {
    sigla: 'ec',
    title: 'Grade Curricular — Engenharia Civil',
    subtitle: 'UNIPAMPA · Campus Alegrete · PPC 2023',
    maxSemesters: 10,
    disciplines,
  };
})();
