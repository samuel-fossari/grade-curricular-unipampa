/**
 * Dados da grade — EA (UNIPAMPA Alegrete).
 * Ementas, objetivos e CH alinhados ao ementário do PPC (texto fornecido).
 * Semestragem e pré-requisitos (códigos AL) conforme matriz curricular oficial.
 * Integralização mínima (h) em PI I, SST, TCC I e estágio via specialMinCH.
 */
(function () {
  'use strict';
  const CCCG_EMENTA =
    'Componente Curricular Complementar de Graduação. Consulte a oferta semestral do curso.';

  const disciplines = [
    // 1º SEM
    {
      id: 'calc1',
      name: 'Cálculo I',
      sem: 1,
      prereqs: [],
      codigo: 'AL0363',
      ch: '90h',
      ementa:
        'Revisão de matemática básica. Noções básicas de conjuntos. A reta real. Intervalos e desigualdades. Funções de uma variável. Limites. Continuidade. Derivadas. Regras de derivação. Regra da cadeia. Derivação implícita. Diferencial. Regra de L\u2019Hôpital, máximos e mínimos e outras aplicações.\n\n' +
        'Objetivo geral: compreender e aplicar as técnicas do Cálculo Diferencial e Integral para funções reais de uma variável real, dando ênfase às suas aplicações.\n\n' +
        'Objetivos específicos: fixar conteúdos básicos de álgebra e de cálculo; reconhecer e construir gráficos das principais funções em um plano cartesiano; utilizar propriedades do cálculo diferencial (máximos, mínimos, assíntotas, etc.) na representação de funções; calcular e avaliar os limites de funções e as suas derivadas e aplicações dos conceitos em exercícios práticos; aplicar os conhecimentos do cálculo diferencial na resolução de problemas clássicos das áreas da engenharia e das ciências exatas.',
    },
    {
      id: 'fis1',
      name: 'Física I',
      sem: 1,
      prereqs: [],
      codigo: 'AL0003',
      ch: '75h',
      ementa:
        'Movimento retilíneo. Movimento no plano. Leis de Newton. Trabalho e energia cinética. Energia potencial e conservação de energia. Quantidade de movimento linear e choque. Rotação de corpos rígidos. Gravitação.\n\n' +
        'Objetivo geral: identificar fenômenos naturais em termos de quantidade e regularidade, bem como interpretar princípios fundamentais que generalizam as relações entre eles e aplicá-los na resolução de problemas simples da mecânica clássica.\n\n' +
        'Objetivos específicos: saber aplicar os princípios básicos e fundamentos teóricos da Física Clássica em diversas situações práticas reais nas diferentes áreas da engenharia; compreender os conceitos de física utilizando sempre que possível exemplos do dia a dia; resolver problemas de cinemática e da mecânica clássica em uma, duas e três dimensões, assim como compreender o princípio de conservação da energia mecânica e momento linear e angular.',
    },
    {
      id: 'quim',
      name: 'Química Geral e Experimental',
      sem: 1,
      prereqs: [],
      codigo: 'AL0366',
      ch: '45h',
      ementa:
        'Atomística. Ligações químicas. Quantidade de matéria. Fórmulas químicas. Equações químicas. Estequiometria das reações. Reações químicas. Parte experimental.\n\n' +
        'Objetivo geral: conhecer e aplicar conceitos básicos de Química Geral teórica e experimental.\n\n' +
        'Objetivos específicos: distribuição dos elétrons nos átomos, níveis de energia, orbitais atômicos, números quânticos, tabela periódica, periodicidade do raio atômico, energia de ionização e afinidade eletrônica, ligações iônicas, covalentes e metálicas, ligações intermoleculares, mol, massa molar, composição percentual em massa, fórmulas empíricas e moleculares, reações químicas, representação e balanceamento de equações, estequiometria, rendimento e reagente limitante, neutralização, oxirredução, técnicas, vidrarias e equipamentos básicos de laboratório e experimentos relacionados ao conteúdo do componente.',
    },
    {
      id: 'dt',
      name: 'Desenho Técnico',
      sem: 1,
      prereqs: [],
      codigo: 'AL0007',
      ch: '30h',
      ementa:
        'Introdução ao desenho técnico. Desenho arquitetônico. Introdução ao desenho projetivo. Desenho em perspectiva. Traçados em 3D.\n\n' +
        'Objetivo geral: utilizar o desenho técnico como linguagem técnica de comunicação, conforme as técnicas normalizadas pela ABNT.\n\n' +
        'Objetivos específicos: conhecer fundamentos e normas técnicas de desenho técnico; distinguir e utilizar os instrumentos de desenho; expressar graficamente os elementos fundamentais do desenho; conhecer fundamentos do desenho arquitetônico; interpretar e traçar elementos do desenho arquitetônico; conhecer fundamentos do desenho projetivo; elaborar desenhos à mão livre em projeção ortogonal e em perspectiva isométrica; elaborar desenhos em escala, cotados em projeção ortogonal e em perspectiva isométrica.',
    },
    {
      id: 'intro_ea',
      name: 'Introdução à Engenharia Agrícola',
      sem: 1,
      prereqs: [],
      codigo: 'AL0449',
      ch: '30h',
      ementa:
        'O profissional Engenheiro Agrícola: histórico, perfil e atribuições profissionais. Engenharia Agrícola na Unipampa. Mercado de Trabalho. Interação com outros ramos de Engenharia.\n\n' +
        'Objetivo geral: compreender sobre as áreas de atuação e o curso de Engenharia Agrícola da Unipampa.\n\n' +
        'Objetivos específicos: entender a profissão de Engenheiro Agrícola; compreender o curso e a formação do profissional Engenheiro Agrícola da UNIPAMPA; identificar campos de atuação do Engenheiro Agrícola no mercado de trabalho.',
    },
    {
      id: 'alg',
      name: 'Algoritmos e Programação',
      sem: 1,
      prereqs: [],
      codigo: 'AL0005',
      ch: '60h',
      ementa:
        'Noções de lógica de programação. Dados, expressões e algoritmos sequenciais. Estruturas de controle. Estruturas complexas. Modularização.\n\n' +
        'Objetivo geral: desenvolver o raciocínio lógico aplicado à solução de problemas em nível computacional, além de introduzir os conceitos básicos de desenvolvimento de algoritmos, de forma a propiciar uma visão crítica e sistemática sobre resolução de problemas e prepará-lo para a atividade de programação.\n\n' +
        'Objetivos específicos: resolução de problemas lógicos; identificar entradas e saídas esperadas; definir estruturas adequadas na resolução dos problemas; elaborar algoritmos estruturados; aplicar linguagem de programação; solucionar problemas com muitos valores simultâneos (estruturas complexas de armazenamento); modularizar com funções e passagem de parâmetros.',
    },
    {
      id: 'metcient',
      name: 'Metodologia Científica',
      sem: 1,
      prereqs: [],
      codigo: 'AL0486',
      ch: '30h',
      ementa:
        'Delineamento da pesquisa científica. Redação, apresentação e defesa do trabalho científico. Estrutura do trabalho científico.\n\n' +
        'Objetivo geral: aprender a elaborar e apresentar trabalhos científicos, tais como projeto de pesquisa, artigos e trabalho de conclusão de curso.\n\n' +
        'Objetivos específicos: conhecer os passos fundamentais na elaboração de um trabalho científico; conhecer o manual de normalização de trabalhos acadêmicos da Unipampa; adquirir conhecimentos sobre metodologia científica aplicada à elaboração de trabalhos científicos; entender o processo de busca e de utilização de informações científicas; entender o processo de apresentação e de defesa do trabalho científico.',
    },
    // 2º SEM
    {
      id: 'geom',
      name: 'Geometria Analítica',
      sem: 2,
      prereqs: [],
      codigo: 'AL0002',
      ch: '60h',
      ementa:
        'Vetores no plano e no espaço. Retas no plano e no espaço. Estudo do plano. Distância, área e volume. Cônicas, Quádricas.\n\n' +
        'Objetivo geral: desenvolver noções e conhecimento sobre vetores, curvas, e superfícies no plano e no espaço.\n\n' +
        'Objetivos específicos: aprender a manipular vetores em operações matemáticas envolvendo estes; compreender a diferença entre grandezas físicas escalares e vetoriais; desenvolver uma visão tridimensional de curvas e superfícies; conseguir utilizar ou aplicar conceitos de geometria analítica na resolução de problemas de engenharia e de física em geral.',
    },
    {
      id: 'mec_ger',
      name: 'Mecânica Geral',
      sem: 2,
      prereqs: ['fis1'],
      codigo: 'AL0015',
      ch: '60h',
      ementa:
        'Princípios da estática. Sistemas de forças em equilíbrio. Equilíbrio de partículas e de corpos rígidos. Esforços internos solicitantes em vigas isostáticas. Centro de gravidade e centro da massa. Momento de inércia e produto de inércia.\n\n' +
        'Objetivo geral: desenvolver habilidades para reconhecer os esforços solicitados em estruturas e determinar as características geométricas das seções.\n\n' +
        'Objetivos específicos: definir o equacionamento para as condições de equilíbrio de partículas e de corpos rígidos; interpretar e calcular as solicitações internas em membros estruturais ou mecânicos; determinar as características geométricas das seções e corpos.',
    },
    {
      id: 'dt_dig',
      name: 'Desenho Digital',
      sem: 2,
      prereqs: ['dt'],
      codigo: 'AL0490',
      ch: '60h',
      ementa:
        'Principais comandos utilizados no desenho digital, aplicando-os aos projetos de engenharia. Características e aplicações do desenho universal. Compreensão dos fundamentos da renderização, para criação de maquetes virtuais.\n\n' +
        'Objetivo geral: desenvolver projetos de engenharia através de ferramentas de desenho digital.\n\n' +
        'Objetivos específicos: conhecer os fundamentos e funcionamento de software de desenho; utilizar softwares de desenho digital no desenvolvimento de projetos de engenharia; aplicar os princípios do Desenho Universal na concepção de projetos de engenharia; elaborar projetos de engenharia em 2D e 3D com uso de software de desenhos.',
    },
    {
      id: 'fis2',
      name: 'Física II',
      sem: 2,
      prereqs: ['fis1'],
      codigo: 'AL0011',
      ch: '75h',
      ementa:
        'Oscilações. Ondas. Temperatura. Primeira e Segunda Lei da Termodinâmica. Teoria cinética dos gases. Hidrostática. Hidrodinâmica.\n\n' +
        'Objetivo geral: compreender oscilações, ondas, temperatura, leis da termodinâmica, teoria cinética dos gases, hidrostática e hidrodinâmica.\n\n' +
        'Objetivos específicos: relacionar os conceitos com exemplos do dia a dia; compreender aspectos conceituais e matemáticos dos movimentos oscilatórios e ondulatórios; compreender a diferença entre líquidos e gases; compreender as leis que regem o escoamento de um fluido; compreender a diferença entre calor e temperatura; compreender e saber aplicar as leis da termodinâmica, enfatizando suas aplicações; aplicar e manipular equações para resolução de problemas.',
    },
    {
      id: 'calc2',
      name: 'Cálculo II',
      sem: 2,
      prereqs: ['calc1'],
      codigo: 'AL0010',
      ch: '60h',
      ementa:
        'Integral indefinida e técnicas de integração. Integral definida. O teorema fundamental do cálculo. Integral imprópria. Aplicações do cálculo integral: cálculo de áreas, cálculo de volumes por rotação e invólucro cilíndrico, comprimento de arco, sistema de coordenadas polares e área de uma região em coordenadas polares. Funções de várias variáveis reais. Derivação parcial. Gradiente e derivadas direcionais.\n\n' +
        'Objetivo geral: dominar técnicas fundamentais do cálculo diferencial e integral para funções reais de uma variável real, possibilitando a capacitação para a resolução de problemas aplicados em diversos campos da ciência e da engenharia; compreender os conceitos de limite e diferenciabilidade para funções de várias variáveis, viabilizando um melhor entendimento das suas aplicações.\n\n' +
        'Objetivos específicos: dominar técnicas básicas e propriedades referentes à integração indefinida, bem como o teorema fundamental do cálculo que possibilita a integração definida; utilizar a integral definida para determinar áreas e volumes; compreender o conceito de funções de várias variáveis, assim como o cálculo de limites e derivadas nesse contexto.',
    },
    {
      id: 'prod_veg',
      name: 'Princípios Básicos da Produção Vegetal',
      sem: 2,
      prereqs: [],
      codigo: 'AL0450',
      ch: '60h',
      ementa:
        'Célula, tecidos e órgãos vegetais. Relações hídricas nas plantas. Nutrição mineral de plantas. Fixação e metabolismo do nitrogênio. Absorção e translocação de solutos nas plantas. Fotossíntese. Respiração. Crescimento e desenvolvimento. Floração e fotoperíodo. Vernalização. Germinação e fisiologia de sementes. Hormônios vegetais.\n\n' +
        'Objetivo geral: proporcionar conhecimentos sobre os princípios básicos que regem o funcionamento dos vegetais, de forma que estes possam ser úteis no seu desempenho profissional futuro.\n\n' +
        'Objetivos específicos: compreender o funcionamento da célula vegetal, bem como suas estruturas básicas e formação de tecidos e órgãos; conhecer e caracterizar as relações da planta com a água; identificar os diferentes tipos de nutrientes minerais e suas funções nas plantas; caracterizar fenômenos fisiológicos (fotossíntese, respiração, floração, fotoperíodo, vernalização); reconhecer crescimento e desenvolvimento do vegetal, fisiologia da semente e germinação; conhecer e caracterizar hormônios vegetais, suas funções e aplicabilidade nas plantas.',
    },
    // 3º SEM
    {
      id: 'alg_lin',
      name: 'Álgebra Linear',
      sem: 3,
      prereqs: ['geom'],
      codigo: 'AL0009',
      ch: '60h',
      ementa:
        'Matrizes. Determinantes. Sistemas lineares. Espaços Vetoriais. Espaços com produto interno. Transformações Lineares. Autovalores e autovetores. Diagonalização de operadores.\n\n' +
        'Objetivo geral: compreender os conceitos básicos relativos aos sistemas de equações lineares, suas operações e propriedades existentes; desenvolver o raciocínio matemático, abstração e visualização de vetores, espaços vetoriais e suas operações no plano e no espaço; operar com sistemas de equações lineares, espaços vetoriais, produtos, transformações lineares, autovalores e espaços com produto interno.\n\n' +
        'Objetivos específicos: compreender os métodos para resolução de sistemas lineares e desenvolver algumas de suas aplicações nas engenharias; identificar e compreender as transformações lineares, seu núcleo e imagem; verificar transformações inversíveis e o espaço vetorial das transformações lineares; compreender autovalores e autovetores e a diagonalização de operadores; determinar norma, base ortogonal e base ortonormal em espaços vetoriais.',
    },
    {
      id: 'probest',
      name: 'Probabilidade e Estatística',
      sem: 3,
      prereqs: [],
      codigo: 'AL0022',
      ch: '60h',
      ementa:
        'Estatística Descritiva. Teoria das Probabilidades. Distribuições Discretas de Probabilidades. Distribuições Contínuas de Probabilidades. Teoria da Amostragem. Estimação de Parâmetros. Testes de Hipótese. Correlação e Regressão.\n\n' +
        'Objetivo geral: ter um sólido conhecimento sobre cálculo de probabilidade, variáveis aleatórias, processos aleatórios e estatística.\n\n' +
        'Objetivos específicos: conhecer a linguagem estatística; construir e interpretar tabelas e gráficos; calcular medidas descritivas e interpretá-las; conhecer as técnicas de probabilidade; identificar as técnicas de amostragem e sua utilização; aplicar testes comparativos entre grupos; trabalhar com correlação e análise de regressão; analisar e interpretar conjuntos de dados experimentais.',
    },
    {
      id: 'est_iso',
      name: 'Estruturas Isostáticas',
      sem: 3,
      prereqs: ['mec_ger'],
      codigo: 'AL0377',
      ch: '60h',
      ementa:
        'Grau de estaticidade; vigas: método das seções e método gráfico; vigas Gerber; pórticos planos e espaciais; arcos; treliças planas: método de equilíbrio de nós, método de Ritter; linhas de influência em estruturas isostáticas.\n\n' +
        'Objetivo geral: compreender conceitos básicos da Estática dos Corpos Rígidos e da Análise de Estruturas Isostáticas Lineares, para a aplicação destes conceitos em problemas práticos.\n\n' +
        'Objetivos específicos: realizar diagramas de esforços solicitantes em vigas; realizar diagramas de esforços solicitantes em pórticos planos e espaciais; calcular esforços solicitantes em treliças planas; obter e analisar linhas de influência em estruturas isostáticas.',
    },
    {
      id: 'fen_trans',
      name: 'Fenômenos de Transferência',
      sem: 3,
      prereqs: ['fis2'],
      codigo: 'AL0038',
      ch: '60h',
      ementa:
        'Propriedades dos fluidos em meios contínuos. Estática dos fluidos. Cinemática dos fluidos. Transferência de calor por condução, convecção e radiação. Transferência de massa.\n\n' +
        'Objetivo geral: compreender e aplicar conhecimentos básicos sobre os mecanismos de transferência de massa, de calor e de quantidade de movimento, sobre a estática e a dinâmica de fluidos ideais e reais na resolução de problemas práticos dos escoamentos.\n\n' +
        'Objetivos específicos: interpretar os fenômenos físicos através da modelagem matemática dos problemas de engenharia.',
    },
    {
      id: 'eletrot',
      name: 'Eletrotécnica',
      sem: 3,
      prereqs: ['fis2'],
      codigo: 'AL0006',
      ch: '45h',
      ementa:
        'Critérios de segurança no laboratório e segurança em trabalhos com eletricidade. Modelo de preparação dos relatórios. Elementos e Leis de circuitos elétricos: análise em regime permanente. Equipamentos básicos de eletricidade: voltímetro, amperímetro, wattímetro, osciloscópio. Noções de acionamento de motores elétricos. Noções de instalações elétricas residenciais.\n\n' +
        'Objetivo geral: identificar e utilizar corretamente os principais equipamentos para efetuar medições de tensão, corrente e potência; aprender noções básicas de segurança com eletricidade e evitar os principais riscos de choque elétrico; verificar conceitos fundamentais para acionamento de um motor elétrico CA.\n\n' +
        'Objetivos específicos: compreender e aplicar os conceitos para montagem experimental, simulação e análise de circuitos elétricos básicos em regime permanente; identificar e utilizar corretamente os principais equipamentos para medições; segurança com eletricidade; verificar conceitos para acionamento de motor CA; realizar o projeto simplificado de uma instalação elétrica residencial.',
    },
    {
      id: 'solo',
      name: 'Fundamentos da Ciência do Solo',
      sem: 3,
      prereqs: [],
      codigo: 'AL0452',
      ch: '60h',
      ementa:
        'Intemperismo e fatores de formação do solo; processos básicos de formação do solo; classes de processos de formação do solo; características morfológicas; descrição morfológica de perfis de solos; classificação de solos: princípios básicos, horizontes diagnósticos; Sistema Brasileiro de Classificação de Solos; principais classes de solos de ocorrência regional; relações solo-paisagem e uso do solo.\n\n' +
        'Objetivo geral: desenvolver conhecimentos básicos e aplicados sobre a ciência do solo, reconhecer o solo na paisagem e compreender o seu funcionamento como componente básico dos ecossistemas terrestres.\n\n' +
        'Objetivos específicos: identificar e caracterizar os principais tipos de rochas e seus constituintes minerais no Rio Grande do Sul; compreender o solo como corpo natural vivo; conhecer e interpretar características morfológicas (cor, textura, estrutura e consistência); relacionar fatores e processos de formação com características morfológicas; conhecer a gênese do solo e aspectos morfológicos, mineralógicos, físicos e biológicos; conhecer características dos principais solos, limitações e potencialidades para o uso agrícola.',
    },
    {
      id: 'agroclim',
      name: 'Agroclimatologia',
      sem: 3,
      prereqs: ['prod_veg'],
      codigo: 'AL0482',
      ch: '75h',
      ementa:
        'Introdução à agrometeorologia. Tempo e clima. Estações meteorológicas. Influência das relações terra-sol sobre vegetais e animais. Atmosfera. Radiação solar e terrestre. Temperatura do solo e do ar. Umidade do ar. Chuva. Vento. Geada. Evapotranspiração. Balanço hídrico. Condicionamento climático da produtividade vegetal. Temperatura do ar como fator agronômico. Zoneamento Agrícola de Risco Climático. Classificação climática. Mudanças climáticas e agricultura.\n\n' +
        'Objetivo geral: interpretar a dinâmica dos elementos meteorológicos, bem como quantificar seus efeitos e suas aplicações no planejamento das atividades agrícolas.\n\n' +
        'Objetivos específicos: conhecer as principais aplicações da agrometeorologia no planejamento das propriedades rurais; diferenciar tempo e clima; estações meteorológicas; efeitos das relações terra-sol e definição das estações do ano; relacionar e quantificar atmosfera, radiação, temperatura, umidade, chuva e vento nas atividades agrícolas; evapotranspiração e balanço hídrico; modelos básicos para estimativa da produtividade vegetal; temperatura do ar e duração do ciclo dos cultivos; Zoneamento Agrícola de Risco Climático, classificações climáticas e mudanças climáticas na agricultura.',
    },
    // 4º SEM
    {
      id: 'res_mat',
      name: 'Resistência dos Materiais',
      sem: 4,
      prereqs: ['est_iso'],
      codigo: 'AL0232',
      ch: '75h',
      ementa:
        'Equações de equilíbrio. Vínculos. Baricentros. Momentos e Produtos de Inércia de Superfícies Planas. Tensões. Deformações. Cargas Axiais. Torção. Cisalhamento. Traçado de Diagramas para Estruturas Isostáticas. Flexão. Transformação de Tensão. Deformação em vigas. Flambagem.\n\n' +
        'Objetivo geral: determinar e compreender os esforços internos e deformações atuantes em diferentes tipos de materiais, quando submetido a tensões axiais e multiaxiais.\n\n' +
        'Objetivos específicos: identificar e determinar os diferentes tipos de tensões e deformações provocados por diferentes tipos de carregamentos e orientações; conhecer as propriedades mecânicas dos materiais; avaliar a estabilidade de estruturas esbeltas.',
    },
    {
      id: 'hidraul',
      name: 'Hidráulica Agrícola',
      sem: 4,
      prereqs: ['fen_trans'],
      codigo: 'AL0296',
      ch: '60h',
      ementa:
        'Princípios básicos. Escoamento por orifícios, bocais e comportas. Escoamento em vertedores. Condutos livres ou canais. Escoamento em tubulações. Estações de bombeamento. Turbinas.\n\n' +
        'Objetivo geral: elaborar projetos hidráulicos relacionados com o armazenamento, a elevação, a condução e a distribuição da água em sistemas de irrigação, drenagem, saneamento e abastecimento de água.\n\n' +
        'Objetivos específicos: fornecer conhecimentos em condutos forçados, instalações de recalque, condutos livres, orifícios, bocais, vertedores e golpe de aríete; identificar os tipos de escoamento dos fluidos; aplicar o princípio da conservação da massa; identificar e relacionar as diferentes formas de energia de um escoamento; determinar perdas de energia; dimensionar circuitos hidráulicos por gravidade e por elevação; dimensionar conjuntos motobombas; dimensionar canais em regime uniforme; dimensionar orifícios e descarregadores.',
    },
    {
      id: 'maq_el',
      name: 'Tópicos de Máquinas Elétricas',
      sem: 4,
      prereqs: ['eletrot'],
      codigo: 'AL0221',
      ch: '30h',
      ementa:
        'O Sistema Elétrico: geração, transmissão; distribuição; energização versus eletrificação rural; legislação e tarifas de energia elétrica; transformadores monofásicos e trifásicos (aplicações, especificação, condições operacionais); máquinas elétricas de corrente contínua e alternada (aplicações, especificações, proteção, controle); aplicações de energia elétrica em sistemas e processos de uso final.\n\n' +
        'Objetivo geral: adquirir um embasamento prático para desenvolvimento de projetos elétricos que atendam aos requisitos dos serviços energéticos de uso final nos diferentes segmentos socioeconômicos.\n\n' +
        'Objetivos específicos: identificar e utilizar corretamente os principais equipamentos para medições de tensão, corrente e potência; noções básicas de segurança com eletricidade; conceitos para acionamento de motor CA; conhecimento de sistemas, equipamentos e dispositivos elétricos.',
    },
    {
      id: 'mat_const',
      name: 'Materiais e Técnicas de Construção',
      sem: 4,
      prereqs: [],
      codigo: 'AL0451',
      ch: '60h',
      ementa:
        'Materiais cerâmicos. Aglomerantes. Agregados. Argamassas. Concreto simples. Madeiras. Outros materiais.\n\n' +
        'Objetivo geral: conhecer a classificação, as propriedades e a utilização dos principais materiais usados na construção rural.\n\n' +
        'Objetivos específicos: conhecer as propriedades físicas dos materiais de construção, qualidades e limitações para uso nas edificações rurais; especificar materiais, selecionar fornecedores, especificar ensaios e analisar resultados visando otimização técnica e econômica; desenvolver habilidades para dosar concretos convencionais e para especificar ensaios de controle do concreto fresco e endurecido; expressar conceitos de forma precisa, por escrito ou oralmente.',
    },
    {
      id: 'geo_eng',
      name: 'Geologia para Engenharia Agrícola',
      sem: 4,
      prereqs: [],
      codigo: 'AL0491',
      ch: '45h',
      ementa:
        'Noções de Geologia Geral. Minerais e Rochas. Intemperismo e formação dos solos. Estruturas Geológicas. Investigação Geológica. Noções de Hidrogeologia. Dinâmica Superficial e Depósitos Superficiais.\n\n' +
        'Objetivo geral: compreender conceitos básicos de geologia que afetam a localização, construção e manutenção das obras de engenharia, no sentido de garantir sua segurança e minimizar seus impactos ambientais.\n\n' +
        'Objetivos específicos: identificar os principais minerais nas rochas e solos; identificar e classificar rochas e minerais constituintes; compreender intemperismo, origem e formação dos solos; compreender e identificar estruturas geológicas e relevos superficiais; conhecer técnicas básicas de investigação geológica de superfície e subsolo; conhecer conceitos básicos da hidrogeologia e a importância dos aquíferos; compreender a dinâmica superficial e deposição de massas.',
    },
    {
      id: 'eng_eco',
      name: 'Introdução à Engenharia Econômica',
      sem: 4,
      prereqs: ['probest'],
      codigo: 'AL0380',
      ch: '45h',
      ementa:
        'Fundamentos da matemática financeira. Análise de viabilidade econômica de projetos de investimentos.\n\n' +
        'Objetivo geral: obter conhecimentos, do campo da engenharia econômica, para possibilitar a adequada tomada de decisão na análise de projetos de investimentos.\n\n' +
        'Objetivos específicos: conhecer as definições e os demais princípios da matemática financeira e da engenharia econômica; saber aplicar os métodos da engenharia econômica na análise de projetos de investimentos.',
    },
    {
      id: 'top',
      name: 'Topografia',
      sem: 4,
      prereqs: ['geom'],
      codigo: 'AL0454',
      ch: '60h',
      ementa:
        'Fundamentos de geodésia geométrica. Representação plana do modelo geodésico da terra. Instrumentação. Grandezas de medição. Métodos de levantamentos horizontais. Métodos de levantamentos verticais. Posicionamento por satélites artificiais. Topografia aplicada ao georreferenciamento.\n\n' +
        'Objetivo geral: conhecer a topografia e geodésia, assim como a morfologia e funcionamento dos equipamentos topográficos, para efetuar levantamentos horizontais e verticais, estimar as grandezas de medição e elaborar a representação cartográfica.\n\n' +
        'Objetivos específicos: compreender conceitos e fundamentos básicos e aplicados de topografia; conhecer o manejo e utilização de equipamentos e métodos de levantamentos altimétricos e planimétricos; compreender a aplicação da topografia no georreferenciamento.',
    },
    // 5º SEM
    {
      id: 'elem_maq',
      name: 'Elementos de Máquinas Agrícolas',
      sem: 5,
      prereqs: ['mec_ger'],
      codigo: 'AL0455',
      ch: '45h',
      ementa:
        'Relações de transmissão. Rendimento das transmissões. Materiais de fabricação de transmissões. Transmissão por correias. Transmissão por correntes de rolos. Transmissão por engrenagens. Elementos de apoio. Elementos hidráulicos. Combustíveis e lubrificantes.\n\n' +
        'Objetivo geral: entender, identificar, dimensionar e selecionar os principais elementos utilizados nas máquinas agrícolas, seu desempenho e características.\n\n' +
        'Objetivos específicos: entender o funcionamento e constituição dos principais elementos de máquinas agrícolas; identificar, configurar e selecionar diferentes elementos presentes nas máquinas agrícolas; dimensionar elementos de transmissão para suportar esforços e transmitir potência em máquinas agrícolas.',
    },
    {
      id: 'hidro',
      name: 'Hidrologia Agrícola',
      sem: 5,
      prereqs: ['probest'],
      codigo: 'AL0488',
      ch: '60h',
      ementa:
        'Introdução ao estudo hidrológico: objetivos da análise hidrológica, o ciclo hidrológico. Bacia hidrográfica. Estatística e probabilidade aplicadas à hidrologia. Análise de precipitação: medição; tratamento dos dados; hietograma. Escoamento superficial: processos; fatores; relações com a precipitação; distribuição temporal (análise e síntese de hidrogramas); método racional. Medição de vazão; hidrogramas; curva-chave; regime dos cursos d\u2019água; curva de permanência. Chuvas intensas; hidrograma unitário. Propagação de enchentes em reservatórios. Regularização de vazão e controle de estiagem. Água subterrânea. Hidrometria.\n\n' +
        'Objetivo geral: obter, processar e analisar informações hidrológicas, visando à utilização racional e sustentada dos recursos hídricos.\n\n' +
        'Objetivos específicos: fundamentos teóricos dos fenômenos hidrometeorológicos e aplicações à Engenharia; variabilidade espaço-temporal do ciclo hidrológico; estudos hidrológicos em bacias hidrográficas; interpretar e avaliar variáveis hidrológicas; análise de séries históricas para estiagens e cheias e vazões de enchente; técnicas para dimensionamento de obras hidráulicas.',
    },
    {
      id: 'instr',
      name: 'Instrumentação e Automação Agrícola',
      sem: 5,
      prereqs: ['eletrot'],
      codigo: 'AL0456',
      ch: '60h',
      ementa:
        'Características e tipos de sinais envolvidos em sistemas de instrumentação e automação agrícola. Sensores, transdutores e sistemas de medidas de diferentes naturezas utilizados na agricultura. Sistemas de instrumentação eletrônica de grandezas elétricas e não elétricas para sistemas de automação e controle agrícola. Controladores Lógicos Programáveis. Elementos de sistemas de controle. Tecnologias de interface homem-máquina. Sistemas de comunicação em sistemas agrícolas.\n\n' +
        'Objetivo geral: ser capaz de compreender o funcionamento e selecionar diferentes tecnologias para a implementação de sistemas de instrumentação para automação de sistemas e processos agrícolas.\n\n' +
        'Objetivos específicos: compreender o funcionamento de sistemas de instrumentação para automação e controle de processos agrícolas; implementar sistemas de automação e controle usando controladores programáveis e sistemas de aquisição de dados; selecionar sensores e transdutores para diferentes aplicações agrícolas; conhecer interface homem-máquina e o fluxo de sinais e protocolos na automação de sistemas agrícolas.',
    },
    {
      id: 'exp_agr',
      name: 'Experimentação Agrícola',
      sem: 5,
      prereqs: ['probest'],
      codigo: 'AL0492',
      ch: '60h',
      ementa:
        'O papel da estatística na experimentação agrícola. Métodos para aumentar a eficiência dos experimentos (planejamento, condução e análise). Análise de variância e métodos de comparações múltiplas. Análise estatística e delineamentos experimentais. Experimentos fatoriais, parcelas subdivididas e faixas. Análise conjunta de experimentos. Apresentação e inferência de resultados.\n\n' +
        'Objetivo geral: conhecer os procedimentos necessários para o planejamento, instalação, condução e avaliação de experimentos em diferentes delineamentos e habilitar os alunos para a análise e interpretação de experimentos conduzidos em diferentes delineamentos experimentais.\n\n' +
        'Objetivos específicos: compreender os conceitos básicos para aplicação da estatística em experimentação agrícola; aplicar princípios básicos de experimentação, analisar dados e tomar decisões sob incertezas na Engenharia Agrícola; diferenciar métodos e aplicá-los corretamente; utilizar software estatístico para análise de experimentos agrícolas.',
    },
    {
      id: 'est_conc',
      name: 'Estruturas de Concreto',
      sem: 5,
      prereqs: ['res_mat'],
      codigo: 'AL0370',
      ch: '60h',
      ementa:
        'Introdução ao estudo das estruturas de concreto armado; cálculo da armadura de flexão e transversal; detalhamento da armadura longitudinal (flexão) na seção transversal e estados limite de utilização; torção; dimensionamento à flexo-compressão normal e oblíqua; lajes e pilares.\n\n' +
        'Objetivo geral: adquirir conhecimentos básicos necessários para o entendimento do comportamento mecânico das estruturas em concreto armado, capacitando-os para o dimensionamento dos elementos estruturais.\n\n' +
        'Objetivos específicos: compreender conceitos de domínio e estados limite de utilização do concreto com base em segurança e normativa vigente; compreender diferenças estruturais e vida útil das estruturas; dimensionar armaduras e elementos (vigas, lajes e pilares) para projetos agrícolas.',
    },
    {
      id: 'est_aco',
      name: 'Estruturas de Aço e Madeira',
      sem: 5,
      prereqs: ['res_mat'],
      codigo: 'AL0236',
      ch: '45h',
      ementa:
        'Características dos materiais sob o ponto de vista do engenheiro agrícola. Tração, compressão axial. Cisalhamento direto e compressão normal de aço e madeira. Flexão. Instabilidade lateral de vigas. Ligações.\n\n' +
        'Objetivo geral: adquirir conhecimentos básicos necessários para o entendimento do comportamento mecânico das estruturas em aço e madeira, capacitando-os para o dimensionamento dos elementos estruturais de interesse da Engenharia Agrícola.\n\n' +
        'Objetivos específicos: compreender as características de aço e madeira enquanto material estrutural; compreender tração e compressão e suas variações em estruturas de aço e madeira; dimensionar elementos para suportar cargas estruturais em projetos agrícolas com segurança baseada na normativa vigente.',
    },
    {
      id: 'ajust',
      name: 'Ajustamento de Observações Geodésicas',
      sem: 5,
      prereqs: ['top'],
      codigo: 'AL0457',
      ch: '60h',
      ementa:
        'Introdução ao estudo do ajustamento de observações geodésicas pelo método dos mínimos quadrados. Teoria dos erros de observação. Método dos mínimos quadrados. Ajustamento de observações diretas. Modelo paramétrico ou das equações de observação. Modelo dos correlatos ou das equações de condição. Modelo combinado ou implícito. Iteração. Análise de qualidade e medida de qualidade.\n\n' +
        'Objetivo geral: aplicar a lei de propagação das covariâncias nos problemas de medição para a escolha do modelo de ajustamento pelo método dos mínimos quadrados, desenvolvimento de um ajustamento, análise da qualidade dos dados advindos das medições e cálculo das medidas de qualidade em levantamentos geodésicos aplicados ao georreferenciamento.\n\n' +
        'Objetivos específicos: verificar as diversas aplicações do ajustamento dentro da Topografia e da Geodésia; praticar a aplicação dos modelos paramétrico, correlatos e combinado; aprender a realizar as análises e interpretações inerentes aos levantamentos.',
    },
    {
      id: 'cccg5',
      name: 'CCCG',
      sem: 5,
      cat: 'nao_definido',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },
    // 6º SEM
    {
      id: 'mot_trat',
      name: 'Motores e Tratores Agrícolas',
      sem: 6,
      prereqs: ['elem_maq'],
      codigo: 'AL0460',
      ch: '60h',
      ementa:
        'Princípios de funcionamento dos motores de combustão interna. Principais componentes dos motores. Sistemas complementares dos motores. Tratores agrícolas e seus sistemas. Transmissão de potência. Manutenção preventiva de tratores agrícolas. Chassi do trator agrícola e teoria da tração. Relação solo/máquina.\n\n' +
        'Objetivo geral: conhecer o funcionamento de tratores agrícolas, seus motores e demais sistemas e entender o comportamento dinâmico em tração com vistas ao correto aproveitamento da potência e uso do equipamento.\n\n' +
        'Objetivos específicos: entender o funcionamento dos motores de combustão interna com vistas à correta operação e manutenção; planejar e executar manutenções preventivas em tratores agrícolas; compreender o comportamento dinâmico do trator em condições de tração e a relação do equipamento com o solo quando em operação.',
    },
    {
      id: 'inst_el',
      name: 'Instalações Elétricas Prediais',
      sem: 6,
      prereqs: ['maq_el'],
      codigo: 'AL0081',
      ch: '60h',
      ementa:
        'Projeto de instalações elétricas prediais: definições, simbologia, localização de cargas elétricas, quadro de cargas, dimensionamento de eletrodutos e condutores, luminotécnico, proteção contra sobrecargas, curtos-circuitos e descargas atmosféricas. Desenho auxiliado por computador. Projeto de instalações telefônicas: definições, simbologia, esquemas e dimensionamento de tubulações e cabos (entrada, primária e secundária). Rede interna: distribuição e blocos terminais.\n\n' +
        'Objetivo geral: dimensionar e projetar sistemas de instalações elétricas, de força, iluminação e telefonia, nos níveis residenciais e prediais.\n\n' +
        'Objetivos específicos: identificar os elementos pertencentes aos projetos de instalações elétricas residenciais e prediais; identificar elementos necessários para acessibilidade na utilização de instalações elétricas; realizar o desenho técnico utilizando ferramentas computacionais.',
    },
    {
      id: 'agua_solo',
      name: 'Relação Água-Solo-Planta',
      sem: 6,
      prereqs: ['hidraul'],
      codigo: 'AL0487',
      ch: '45h',
      ementa:
        'Fundamentos físicos do solo: o solo do ponto de vista físico, relações massa/volume. A água do ponto de vista físico, estrutura molecular da água. Relações solo-água: retenção, armazenagem, potencial, movimento, infiltração e curva característica da água no solo. Medidas do teor e do potencial da água no solo. Relações solo-água-planta: disponibilidade de água às plantas, resposta das culturas a diferentes potenciais de água no solo, quando e quanto irrigar.\n\n' +
        'Objetivo geral: conhecer, quantificar e estabelecer os principais parâmetros físicos do solo associados à interação solo-água-planta-atmosfera, direcionado ao manejo e uso eficiente da água em sistemas agrícolas.\n\n' +
        'Objetivos específicos: determinar a retenção de água no solo; definir a capacidade do solo em armazenar água; calcular os potenciais em que a água é retida e armazenada; analisar o movimento da água no solo; medir a capacidade de infiltração e conhecer os usos de cada método; calcular quanto de água está disponível às plantas; conhecer a resposta das culturas a diferentes potenciais; definir quando e quanto irrigar.',
    },
    {
      id: 'adm',
      name: 'Administração',
      sem: 6,
      prereqs: ['eng_eco'],
      codigo: 'AL0394',
      ch: '30h',
      ementa:
        'Fundamentos da administração. O administrador. Partes da administração. Planejamento da ação empresarial.\n\n' +
        'Objetivo geral: entender a natureza da gestão empresarial e os sistemas produtivos; conhecer técnicas e metodologias administrativas que podem ser aplicadas na gestão e na tomada de decisão diante da produção de bens e execução de serviços.\n\n' +
        'Objetivos específicos: entender conceitos e processos básicos da administração de empresas; conhecer técnicas, ferramentas e metodologias administrativas; compreender a aplicação do planejamento, da organização, da direção e do controle na gestão de empresas.',
    },
    {
      id: 'mec_solo',
      name: 'Mecânica dos Solos',
      sem: 6,
      prereqs: ['geo_eng'],
      codigo: 'AL0480',
      ch: '60h',
      ementa:
        'Conceitos básicos de geotécnica. Amostragem de solos. Índices físicos, caracterização geotécnica. Classificação geotécnica dos solos. Compactação. Tensões geostáticas. Tensões induzidas. Permeabilidade e hidráulica de solos.\n\n' +
        'Objetivo geral: interpretar problemas básicos na área de mecânica dos solos, visando os projetos de engenharia.\n\n' +
        'Objetivos específicos: mostrar a importância dos solos na engenharia de edificações; conhecer formas de amostragem e a determinação das propriedades físicas dos solos; descrever técnicas de caracterização e aplicar metodologias de classificação geotécnica; entender o melhoramento mecânico dos solos sob compactação; compreender tensões naturais e sob cargas induzidas; compreender permeabilidade e hidráulica de solos.',
    },
    {
      id: 'cart_geo',
      name: 'Cartografia e Geoprocessamento',
      sem: 6,
      prereqs: ['top'],
      codigo: 'AL0458',
      ch: '60h',
      ementa:
        'Cartografia: conceitos; forma da terra e sistemas de coordenadas; escala; sistemas de projeções e o sistema UTM; representação cartográfica; planimetria e altimetria; declinação magnética e rumo; cartografia temática; técnicas de levantamento de dados. Geoprocessamento: introdução; tipos de dados; fases de um projeto de geoprocessamento; aplicações na engenharia agrícola; operações sobre dados geográficos: mapeamento, interpretação e análise de imagens de satélites.\n\n' +
        'Objetivo geral: desenvolver o conhecimento quanto ao uso das técnicas de cartografia e geoprocessamento, quanto aos princípios básicos das técnicas, de forma a favorecer suas aplicações na Engenharia Agrícola, em especial ao planejamento dos recursos naturais.\n\n' +
        'Objetivos específicos: conhecer a estrutura e o funcionamento básicos da fotogrametria; conhecer a estrutura e o funcionamento básico do GPS; conhecer a estrutura e o funcionamento básico de um SIG; aplicar o conhecimento teórico possibilitando a elaboração de mapas base e temáticos em forma digital.',
    },
    {
      id: 'cult_agr',
      name: 'Cultivos Agrícolas',
      sem: 6,
      prereqs: ['agroclim'],
      codigo: 'AL0459',
      ch: '60h',
      ementa:
        'Mercado e potencialidades, características agronômicas, fisiologia da produção e manejo e tratos culturais das culturas do arroz, algodão, feijão, milho e soja.\n\n' +
        'Objetivo geral: compreender como os condicionantes edafoclimáticos e morfofisiológicos interagem com práticas de manejo e fatores promotores e protetores da produtividade do arroz, algodão, feijão, milho e soja.\n\n' +
        'Objetivos específicos: compreender o impacto da produtividade, da qualidade do produto colhido, do preço pago e do capital investido por hectare na rentabilidade das lavouras brasileiras dessas culturas; conhecer a fenologia e relacionar demandas edafoclimáticas com momentos críticos para produtividade; mensurar o impacto do manejo do solo, adubação, época de semeadura, arranjo espacial, cultivar, proteção de plantas, qualidade de insumos e ponto de colheita; conhecer os principais sistemas de produção no Brasil quanto a sucessão e rotação de culturas.',
    },
    {
      id: 'man_solo',
      name: 'Manejo e Conservação do Solo e da Água',
      sem: 6,
      prereqs: ['hidro'],
      codigo: 'AL0253',
      ch: '60h',
      ementa:
        'Processos erosivos; métodos de controle de erosão; sistemas de cultivo; poluição hídrica nas atividades agropecuárias; dinâmica da matéria orgânica; qualidade do solo; manejo do solo e sistemas sustentáveis; educação ambiental.\n\n' +
        'Objetivo geral: reconhecer a importância do uso adequado do solo e demonstrar conhecimento sobre as práticas de conservação do solo e da água.\n\n' +
        'Objetivos específicos: conhecer os princípios do manejo e conservação do solo; compreender as causas da degradação da capacidade produtiva do solo; conhecer as consequências do manejo inadequado das terras agrícolas; identificar causas e processos de degradação do solo e dos recursos hídricos; reconhecer, adotar e implantar sistemas de manejo que visem conservar e recuperar solos e corpos hídricos em áreas agrícolas; indicar práticas conservacionistas adequadas; definir estratégias de recuperação de áreas degradadas; conhecer princípios básicos para a agricultura sustentável.',
    },
    {
      id: 'cccg6',
      name: 'CCCG',
      sem: 6,
      cat: 'nao_definido',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },
    // 7º SEM
    {
      id: 'leg_et',
      name: 'Legislação, Ética e Exercício Profissional de Engenharia',
      sem: 7,
      prereqs: [],
      codigo: 'AL0142',
      ch: '30h',
      ementa:
        'Fundamentos e conceituação filosófica de moral, ética e valores. Ética no ambiente de trabalho. Sistema CONFEA/CREAs. Legislação profissional. Código de Ética Profissional do engenheiro. Responsabilidade técnica; Código de Defesa do Consumidor. Propriedade intelectual. Direitos autorais. Transferência de tecnologia, concorrência desleal e abuso de poder econômico. Acervo técnico. Atribuições profissionais.\n\n' +
        'Objetivo geral: conhecer acerca das responsabilidades técnicas e civis, numa perspectiva da ética e do exercício profissional no papel de sujeitos participantes das mudanças socioeconômicas.\n\n' +
        'Objetivos específicos: identificar com clareza as suas atribuições profissionais; distinguir as diferentes áreas de atuação da engenharia; conhecer os princípios legais e éticos pertinentes às suas áreas profissionais.',
    },
    {
      id: 'maq_agr',
      name: 'Máquinas Agrícolas',
      sem: 7,
      prereqs: ['mot_trat'],
      codigo: 'AL0461',
      ch: '60h',
      ementa:
        'Manejo e preparo do solo. Máquinas para preparo e manejo do solo. Máquinas para implantação de culturas e adubação: mecanismos, regulagens e calibrações. Tecnologia de aplicação de defensivos. Máquinas para tratamento fitossanitário e aplicação de líquidos. Máquinas para colheita de grãos: constituição, regulagens e aferição de perdas na colheita. Tecnologias embarcadas.\n\n' +
        'Objetivo geral: reconhecer a constituição, o funcionamento, regulagens e manutenção durante a operação de máquinas e implementos agrícolas, visando à sua correta recomendação e utilização.\n\n' +
        'Objetivos específicos: entender o funcionamento de máquinas para implantação, condução e colheita de culturas anuais com vistas à correta operação e manutenção; regular e calibrar máquinas agrícolas para implantação, condução e colheita; compreender as diferenças entre manejo e preparo do solo e as implicações do uso de máquinas agrícolas para essas finalidades.',
    },
    {
      id: 'irrig',
      name: 'Irrigação e Drenagem',
      sem: 7,
      prereqs: ['agua_solo'],
      codigo: 'AL0479',
      ch: '60h',
      ementa:
        'Introdução ao estudo da irrigação. Qualidade da água de irrigação. Métodos de irrigação; caracterização e critérios de escolha. Sistematização do terreno. Irrigação por superfície: sulcos, faixas e inundação. Manejo da irrigação. Introdução à drenagem agrícola.\n\n' +
        'Objetivo geral: elaborar, implantar e operar projetos de sistemas de irrigação e drenagem de terras agrícolas.\n\n' +
        'Objetivos específicos: diagnosticar e decidir sobre a necessidade, viabilidade técnica e econômica do uso da irrigação em cultivos agrícolas; selecionar corretamente o método de irrigação e o de drenagem; dimensionar, elaborar, implantar e manejar os projetos de irrigação.',
    },
    {
      id: 'sec_aer',
      name: 'Secagem e Aeração de Produtos Agrícolas',
      sem: 7,
      prereqs: ['fen_trans'],
      codigo: 'AL0462',
      ch: '60h',
      ementa:
        'Princípios básicos de psicrometria. Umidade de equilíbrio. Processo de secagem. Métodos de secagem. Secadores de grãos e sementes. Aeração de grãos e sementes armazenados.\n\n' +
        'Objetivo geral: compreender os métodos e técnicas de secagem, para os diversos tipos de grãos e sementes, nas diversas situações, relacionando os secadores e cuidados para garantir a excelência na secagem e aeração dos grãos e sementes.\n\n' +
        'Objetivos específicos: compreender as propriedades psicrométricas do ar e suas relações; entender a umidade de equilíbrio dos grãos com o ar e sua importância para armazenamento seguro e de qualidade; conhecer métodos e processos de secagem e especificidades por espécie; compreender o sistema de aeração e ser capaz de dimensioná-lo para diferentes situações.',
    },
    {
      id: 'obras_t',
      name: 'Projeto de Obras de Terra',
      sem: 7,
      prereqs: ['mec_solo'],
      codigo: 'AL0481',
      ch: '60h',
      ementa:
        'Controle de percolação em barragens. Resistência ao cisalhamento dos solos. Empuxos de terra. Estabilidade de taludes. Geossintéticos. Compressibilidade e adensamento dos solos. Aterros e projeto de estradas. Projeto de barragens geotécnicas.\n\n' +
        'Objetivo geral: adquirir conhecimentos em projetos geotécnicos de obras de terra, visando a resolução de problemas de engenharia que afetem o desenvolvimento rural.\n\n' +
        'Objetivos específicos: entender e dimensionar o sistema de percolação em barramentos de terra; conhecer resistência ao cisalhamento dos solos; entender empuxos de terra e estabilidade de taludes para aplicação em edificações rurais; introduzir o uso de geossintéticos em obras de terra; compreender e aplicar compressibilidade e adensamento; conhecer e dimensionar aterros e estradas de terra; possibilitar projetos básicos de barragens de terra.',
    },
    {
      id: 'const_rur',
      name: 'Construções Rurais e Ambiência',
      sem: 7,
      prereqs: ['est_conc'],
      codigo: 'AL0255',
      ch: '60h',
      ementa:
        'Respostas fisiológicas: animal e vegetal e ambientes protegidos. Cálculo da carga térmica. Ventilação natural. Ventilação forçada. Ambientes para a produção vegetal.\n\n' +
        'Objetivo geral: dimensionar, projetar, avaliar e supervisionar projetos e instalações agrícolas baseado nos conceitos de engenharia de conforto ambiental.\n\n' +
        'Objetivos específicos: dimensionar e projetar diferentes tipos de instalações agrícolas, sistemas de ventilação e ambiente de produção vegetal; avaliar e supervisionar edificações com base em critérios de conforto e qualidade ambiental; compreender as diferentes etapas dos processos de construções e adequar conforme a região de instalação.',
    },
    {
      id: 'geo_per',
      name: 'Geotecnologias Aplicadas à Perícias Agrícolas',
      sem: 7,
      prereqs: ['cart_geo'],
      codigo: 'AL0463',
      ch: '60h',
      ementa:
        'Conceitos básicos, noções e princípios das geotecnologias. Operações de análise espaço temporal. Processamento e cálculo de índices de vegetação. Uso de imagens topográficas para obtenção de mapas hipsométricos, de declividade e rede de drenagem. Classificação supervisionada do uso do solo. Elaboração de mapas temáticos.\n\n' +
        'Objetivo geral: elaborar laudos técnicos a partir de perícias agropecuárias, por meio das geotecnologias.\n\n' +
        'Objetivos específicos: gerar e interpretar mapas de índice de vegetação para uso agrícola; elaborar laudos técnicos com base em técnicas de geoprocessamento utilizando imagens aéreas georreferenciadas; estudar a vegetação e topografia original do terreno baseado em imagens remotamente obtidas.',
    },
    {
      id: 'cccg7',
      name: 'CCCG',
      sem: 7,
      cat: 'nao_definido',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },
    // 8º SEM
    {
      id: 'irrig_p',
      name: 'Irrigação Pressurizada',
      sem: 8,
      prereqs: ['irrig'],
      codigo: 'AL0464',
      ch: '60h',
      ementa:
        'Sistemas de irrigação por aspersão: convencional; autopropelido; pivô central. Sistemas de microirrigação: gotejamento e microaspersão. Irrigação subterrânea. Projeto de drenagem em terras agrícolas.\n\n' +
        'Objetivo geral: elaborar, implantar e operar projetos de sistemas de irrigação e drenagem de terras agrícolas.\n\n' +
        'Objetivos específicos: diagnosticar e decidir sobre a necessidade, viabilidade técnica e econômica do uso da irrigação por aspersão, microirrigação, irrigação subterrânea e sistemas de drenagem em cultivos agrícolas; dimensionar, elaborar, implantar e manejar os projetos de irrigação e drenagem.',
    },
    {
      id: 'arm_prod',
      name: 'Armazenamento e Beneficiamento de Produtos Agrícolas',
      sem: 8,
      prereqs: ['sec_aer'],
      codigo: 'AL0256',
      ch: '60h',
      ementa:
        'Estrutura brasileira de armazenamento de grãos e sementes; fatores que influenciam a qualidade dos grãos e sementes; qualidade dos grãos e sementes; estrutura para armazenagem de grãos e sementes; beneficiamento de grãos; pragas de grãos armazenados e formas de controle.\n\n' +
        'Objetivo geral: compreender os aspectos que envolvem a manutenção da qualidade dos produtos armazenados, os diversos tipos de estruturas existentes e as técnicas de beneficiamento utilizadas nos diferentes tipos de grãos.\n\n' +
        'Objetivos específicos: compreender os níveis que contemplam as estruturas para armazenamento de produtos agrícolas; entender os fatores que influenciam a qualidade dos produtos armazenados e tomar decisões acerca das diferentes situações; conhecer estruturas para armazenamento de grãos e sementes e suas especificidades; conhecer as etapas do beneficiamento e os métodos para diferentes tipos de produtos.',
    },
    {
      id: 'mec_agr',
      name: 'Mecanização Agrícola',
      sem: 8,
      prereqs: ['maq_agr'],
      codigo: 'AL0476',
      ch: '60h',
      ementa:
        'Avaliação de máquinas agrícolas. Análise operacional e planejamento da mecanização agrícola. Estudo econômico da mecanização agrícola. Ergonomia e segurança aplicada às máquinas agrícolas.\n\n' +
        'Objetivo geral: desenvolver os conhecimentos necessários para a correta avaliação de desempenho, avaliação econômica e operacional de conjuntos mecanizados para atividades agrícolas.\n\n' +
        'Objetivos específicos: reconhecer e executar os principais métodos de avaliação de desempenho de máquinas agrícolas; dimensionar e planejar o uso de máquinas agrícolas em uma propriedade rural; conhecer o uso racional e seguro de máquinas agrícolas na propriedade rural em relação a potencialidades, segurança e ergonomia.',
    },
    {
      id: 'sens_rem',
      name: 'Sensoriamento Remoto',
      sem: 8,
      prereqs: ['cart_geo'],
      codigo: 'AL0477',
      ch: '60h',
      ementa:
        'Conceitos gerais de sensoriamento remoto; histórico; plataformas; sensores ativos e passivos; resoluções; radiação eletromagnética; espectro eletromagnético; interação entre energia e alvo; classificação digital de imagens; interpretação visual de imagens; composição colorida; aplicações do sensoriamento remoto.\n\n' +
        'Objetivo geral: desenvolver o conhecimento quanto ao uso das técnicas de sensoriamento remoto, propiciando capacitações quanto aos princípios básicos das técnicas, de forma a favorecer suas aplicações nas diversas áreas da Engenharia, em especial ao planejamento dos recursos naturais.\n\n' +
        'Objetivos específicos: possibilitar conhecimento das técnicas de sensoriamento remoto necessárias à elaboração de mapas temáticos necessários ao planejamento ambiental.',
    },
    {
      id: 'proj_int1',
      name: 'Projeto Integrado I',
      sem: 8,
      prereqs: [],
      specialMinCH: 2400,
      codigo: 'AL0484',
      ch: '150h',
      ementa:
        'Carga horária total 150 h (15 h presencial teórica, 135 h extensão). Metodologias de desenvolvimento de produtos. Processo de integração teoria-prática interdisciplinar de pesquisa e extensão. Problematização e contextualização de integração ao mercado de trabalho, de capacidade de trabalho em equipe, autônoma e empreendedora. Inovação tecnológica. Desenvolvimento de soluções práticas extensionistas nas áreas de Engenharia de Água e Solo, Máquinas e Mecanização Agrícola e Geotecnologias.\n\n' +
        'Objetivo geral: aplicar os conhecimentos obtidos nos componentes curriculares cursados, através da elaboração, especificação e implementação de um projeto que envolva as diferentes competências da Engenharia Agrícola, com aplicação direta na sociedade.\n\n' +
        'Objetivos específicos: levantar demandas de solução de problemas na sociedade; investigar e atender a demanda por meio dos conhecimentos teóricos e práticos adquiridos sob orientação; documentar, apresentar e implementar o projeto de forma integrada e exequível; estar habilitado na tomada de decisões em todas as fases dos projetos agrícolas com base nas normativas vigentes; capacitação em gestão de projetos (ciclo de vida, normalização e tecnologias); aprimorar competências e habilidades; divulgar o conhecimento científico produzido às comunidades acadêmicas e grupos sociais por ações extensionistas.',
    },
    {
      id: 'fund',
      name: 'Fundações',
      sem: 8,
      prereqs: ['obras_t'],
      codigo: 'AL0400',
      ch: '60h',
      ementa:
        'Investigações geológico-geotécnicas. Concepção de obras de fundações. Fundações rasas. Fundações profundas.\n\n' +
        'Objetivo geral: apresentação dos conhecimentos básicos a respeito da engenharia de fundações, capacitando o aluno para elaboração de projetos simples de fundações usuais e garantindo a base necessária para que possa se aprofundar no estudo do assunto nas ocasiões em que tenha que enfrentar problemas mais complexos.\n\n' +
        'Objetivos específicos: reconhecer as condições do subsolo através de ensaios em campo; desenvolver cálculos referentes à capacidade de carga, recalques, dimensionamentos de fundações simples; analisar características construtivas, aspectos de execução e controle dos principais tipos de fundações.',
    },
    {
      id: 'empreend',
      name: 'Empreendedorismo',
      sem: 8,
      prereqs: ['adm'],
      codigo: 'AL0402',
      ch: '30h',
      ementa:
        'Introdução ao empreendedorismo. Processo empreendedor. Entendendo a expansão do negócio.\n\n' +
        'Objetivo geral: adquirir conhecimentos a respeito da criação de negócios e desenvolver a cultura empreendedora.\n\n' +
        'Objetivos específicos: entender conceitos, teorias e ferramentas relacionadas ao empreendedorismo; conhecer o processo empreendedor; compreender a estrutura de um plano de negócios e a dinâmica da gestão dos negócios; saber identificar oportunidades de inovações e de empreendedorismo.',
    },
    {
      id: 'cccg8',
      name: 'CCCG',
      sem: 8,
      cat: 'nao_definido',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },
    // 9º SEM
    {
      id: 'proj_arm',
      name: 'Projeto de Unidades Armazenadoras',
      sem: 9,
      prereqs: ['arm_prod'],
      codigo: 'AL0478',
      ch: '60h',
      ementa:
        'Tratamento probabilístico das ações em silos. Efeito do vento sobre os silos. Orientação no cálculo estrutural de silos. Dimensionamento de silos verticais. Dimensionamento de moegas. Dimensionamento de transportadores de grãos.\n\n' +
        'Objetivo geral: conhecer o projeto de construção destinado à recepção, armazenamento e transporte de produtos agrícolas dentro de uma unidade armazenadora.\n\n' +
        'Objetivos específicos: compreender as ações em silos devido ao material ensilado (pressões verticais e horizontais) e ao vento, de maneira a proporcionar projetos seguros e eficientes; dimensionar silos verticais, moegas e transportadores para diferentes situações e produtos.',
    },
    {
      id: 'agr_prec',
      name: 'Agricultura de Precisão',
      sem: 9,
      prereqs: ['maq_agr'],
      codigo: 'AL0483',
      ch: '60h',
      ementa:
        'Amostragem georreferenciada. Geração e interpretação de mapas de atributos. Operações agrícolas em taxa variada. Sistemas de orientação automatizada. Sensores e atuadores em máquinas agrícolas. Telemetria. Fundamentos de agricultura digital.\n\n' +
        'Objetivo geral: compreender os fundamentos básicos teórico-práticos que norteiam o uso de manejo localizado na agricultura, através dos conhecimentos das principais técnicas, ferramentas e equipamentos agrícolas utilizados.\n\n' +
        'Objetivos específicos: amostrar, gerar e interpretar mapas de atributos de solo e planta; conhecer os sistemas de orientação automatizada que equipam as máquinas agrícolas; reconhecer e monitorar sensores e atuadores em máquinas agrícolas; conhecer os fundamentos da agricultura digital, como big data e machine learning.',
    },
    {
      id: 'proj_int2',
      name: 'Projeto Integrado II',
      sem: 9,
      prereqs: ['proj_int1'],
      codigo: 'AL0485',
      ch: '150h',
      ementa:
        'Carga horária total 150 h (15 h presencial teórica, 135 h extensão). Metodologias de desenvolvimento de produtos. Processo de integração teoria-prática interdisciplinar de pesquisa e extensão. Problematização e contextualização de integração ao mercado de trabalho, de capacidade de trabalho em equipe, autônoma e empreendedora. Inovação tecnológica. Desenvolvimento de soluções práticas extensionistas nas áreas de Energização Rural, Construções Rurais e Ambiência e Processamento de Produtos Agrícolas.\n\n' +
        'Objetivo geral: aplicar os conhecimentos obtidos nos componentes curriculares cursados, através da elaboração, especificação e implementação de um projeto que envolva as diferentes competências da Engenharia Agrícola, com aplicação direta na sociedade.\n\n' +
        'Objetivos específicos: levantar demandas de solução de problemas na sociedade; investigar e atender a demanda por meio dos conhecimentos teóricos e práticos adquiridos sob orientação; documentar, apresentar e implementar o projeto de forma integrada e exequível; estar habilitado na tomada de decisões em todas as fases dos projetos agrícolas com base nas normativas vigentes; capacitação em gestão de projetos; aprimorar competências e habilidades; divulgar o conhecimento científico produzido por ações extensionistas.',
    },
    {
      id: 'gest_amb',
      name: 'Fundamentos da Gestão Ambiental',
      sem: 9,
      prereqs: [],
      codigo: 'AL0390',
      ch: '30h',
      ementa:
        'Ambiente e desenvolvimento sustentável. Políticas ambientais. Projetos ambientais.\n\n' +
        'Objetivo geral: conhecer as principais definições, legislações e projetos ambientais requeridos, pertinentes aos projetos de engenharia que possam apresentar impactos ambientais.\n\n' +
        'Objetivos específicos: compreender algumas definições relacionadas às ciências do ambiente; compreender as medidas com relação à preservação ambiental e aos impactos ambientais; adquirir base para o desenvolvimento e o gerenciamento de projetos de engenharia; desenvolver a cultura de preservação ambiental.',
    },
    {
      id: 'seg_trab',
      name: 'Segurança e Saúde no Trabalho',
      sem: 9,
      prereqs: [],
      specialMinCH: 3000,
      codigo: 'AL0368',
      ch: '30h',
      ementa:
        'Introdução à segurança no trabalho. Legislação e normatização. EPI/EPC. Higiene e medicina do trabalho. Ergonomia. Segurança com a eletricidade. Proteção contra incêndios. Primeiros socorros.\n\n' +
        'Objetivo geral: estudar as normas vigentes relativas à segurança, saúde, higiene e medicina no trabalho.\n\n' +
        'Objetivos específicos: desenvolver a cultura prevencionista; saber identificar procedimentos para evitar condições e atos inseguros; identificar riscos ambientais, doenças profissionais e doenças do trabalho; identificar EPIs e EPCs e indicá-los corretamente conforme a atividade; minimizar condições de trabalho que geram inseguranças; reconhecer responsabilidades do empregador e do empregado no ambiente de trabalho.',
    },
    {
      id: 'tcc1',
      name: 'Trabalho de Conclusão de Curso I',
      sem: 9,
      prereqs: [],
      specialMinCH: 3000,
      codigo: 'AL0283',
      ch: '30h',
      ementa:
        'Elaboração de um trabalho de conclusão de curso voltado para atividades de complementação profissional, desenvolvido sob orientação de um professor do curso. Escolha do tema e apresentação conforme as normas institucionais.\n\n' +
        'Objetivo geral: elaborar um projeto de pesquisa que resultará no trabalho parcial de conclusão de curso, sob orientação de um docente responsável, cumprindo todas as etapas de um trabalho científico.\n\n' +
        'Objetivos específicos: apresentar o tema investigado como TCC; elaborar o plano de trabalho com o orientador; identificar tipos de abordagens metodológicas em pesquisas científicas; reconhecer cada etapa do desenvolvimento de um trabalho científico; compreender e discutir aspectos éticos e legais sobre pesquisas envolvendo seres humanos e animais; compreender aspectos éticos, morais e jurídicos da propriedade intelectual; realizar o relatório do TCC.',
    },
    {
      id: 'ext_rur',
      name: 'Extensão Rural',
      sem: 9,
      prereqs: [],
      codigo: 'AL0453',
      ch: '60h',
      ementa:
        'Carga horária total 60 h (15 h presencial teórica, 45 h extensão). Estudo da formação da sociedade rural e urbana brasileira. Análise dos princípios da comunicação e difusão de tecnologias agropecuárias com abordagens teóricas sobre o processo de comunicação e difusão, potencialidades e limites da ação difusionista na promoção do desenvolvimento rural. A Engenharia Agrícola no campo: desenvolvimento de comunidades.\n\n' +
        'Objetivo geral: proporcionar conhecimentos teórico-metodológicos e desenvolver habilidades necessárias para realização de ações extensionistas de difusão de inovações, capacitação e mobilização comunitária, de modo que o aluno compreenda o papel da extensão rural como instrumento de dinamização e promoção do desenvolvimento rural.\n\n' +
        'Objetivos específicos: desenvolver senso crítico para aplicar conhecimentos nas áreas de competência da engenharia agrícola; instrumentalizar por seminários, debates, programas de rádio, cartas circulares e outros; integrar acadêmicos com a comunidade por meio da extensão rural; introduzir debates atuais da extensão rural (enfoques participativos, identidades, agroecologia, organizações e desenvolvimento local); divulgar o conhecimento científico produzido por ações extensionistas.',
    },
    {
      id: 'cccg9',
      name: 'CCCG',
      sem: 9,
      cat: 'nao_definido',
      prereqs: [],
      codigo: '—',
      ch: '60h',
      ementa: CCCG_EMENTA,
    },
    // 10º SEM
    {
      id: 'tcc2',
      name: 'Trabalho de Conclusão de Curso II',
      sem: 10,
      prereqs: ['tcc1'],
      codigo: 'AL0284',
      ch: '30h',
      ementa:
        'Elaboração de um trabalho de conclusão de curso voltado para atividades de complementação profissional, desenvolvido sob orientação de um professor do curso. Escolha do tema e apresentação conforme as normas institucionais.\n\n' +
        'Objetivo geral: executar e finalizar um projeto de pesquisa, em áreas de atuação do engenheiro agrícola, que resultará no trabalho final de conclusão de curso, cumprindo todas as etapas de um trabalho científico.\n\n' +
        'Objetivos específicos: reconhecer cada etapa para o desenvolvimento de um trabalho científico; executar e finalizar o plano de trabalho e percurso metodológico para o TCC; apresentar o tema investigado como TCC.',
    },
    {
      id: 'estagio',
      name: 'Estágio Obrigatório',
      sem: 10,
      prereqs: [],
      specialMinCH: 3000,
      codigo: 'AL0489',
      ch: '210h',
      ementa:
        'A legislação atual brasileira, Lei nº 11.788, de 25 de setembro de 2008, apresenta o estágio curricular supervisionado como um ato educativo, desenvolvido no campo de trabalho, assegurando a inserção e preparação profissional do estudante, podendo ser realizado em instituições, empresas públicas civis ou militares, autárquicas, privadas e de economia mista. O estágio deve ser na área de Engenharia Agrícola ou área afim, sob orientação técnica de um professor e sob supervisão de um profissional de nível superior da empresa.\n\n' +
        'Objetivo geral: aplicar técnicas adquiridas ao longo do curso, na solução de problemas e desenvolvimento de atividades relacionadas à atuação profissional de um Engenheiro Agrícola.\n\n' +
        'Objetivos específicos: integrar teoria e prática; identificar experiências e atuação em campos de futuras atividades profissionais; participar no processo de integração universidade-empresa que possibilite a transferência de tecnologia; fornecer subsídios que permitam a adequação do currículo às exigências do mercado.',
    },
  ];
  window.GRADE_CURSO_CONFIG = {
    sigla: 'ea',
    title: "Grade Curricular \u2014 Engenharia Agr\u00edcola",
    subtitle: "UNIPAMPA \u00b7 Campus Alegrete \u00b7 PPC 2023",
    maxSemesters: 10,
    disciplines,
  };
})();
