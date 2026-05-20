# Grade Curricular UNIPAMPA — Campus Alegrete

Site estático para acompanhar grades curriculares de forma interativa: progresso local, pré-requisitos, ementas, CCCGs, integralização de carga horária e agenda semanal.

**[grade-unipampa.vercel.app](https://grade-unipampa.vercel.app)**

## O que é

Projeto acadêmico **independente** (não oficial da UNIPAMPA). Dados baseados nos **PPCs públicos** dos cursos do campus Alegrete. Use como referência de estudo e planejamento — não substitui a coordenação, a secretaria ou o sistema institucional.

## Cursos

| Curso | Sigla | Semestres |
|-------|-------|-----------|
| Engenharia de Software | ES | 9 |
| Ciência da Computação | CC | 9 |
| Engenharia Civil | EC | 10 |
| Engenharia Elétrica | EE | 10 |
| Engenharia Mecânica | EM | 10 |
| Engenharia Agrícola | EA | 10 |
| Eng. de Telecomunicações | ET | 10 |

## Funcionalidades

### Grade curricular
- Estados por disciplina: **não feita**, **em andamento**, **concluída**
- Bloqueio por **pré-requisitos** e regras especiais (ex.: % mínima de CH para TCC/estágio)
- **Busca e filtros** por nome/código e status
- Painel **“Disponíveis agora”** — o que você pode cursar com o progresso atual
- **Progresso por semestre** (concluídas/total e %)
- Modal com **ementa**, objetivo e CH detalhada (T/P/EaD/extensão)
- **CCCGs**: slots na grade + catálogo por curso, com cotas por semestre
- **Integralização de CH** por buckets do PPC (CCOG, CCCG, ACEV, ACG, ACEE…)
- Campos manuais para horas **fora da grade** (ACG, ACEE) — veja [FAQ](faq.html)

### Horários
- Página **[Horários](horarios.html)**: agenda semanal, anotações de horário/sala/professor/e-mail
- Disciplinas **em andamento** + CCCGs escolhidos; disciplinas avulsas

### Preferências e dados
- Temas: escuro, claro, alto contraste
- Tamanho de fonte: 14 / 16 / 18 px
- **[Acessibilidade](acessibilidade.html)**: reset de progresso, **exportar/importar backup** JSON
- **[FAQ](faq.html)**: terminologia dos PPCs, siglas, CH/créditos, ACG/ACE, backup

## Terminologia (PPC UNIPAMPA)

Os PPCs (*Projetos Pedagógicos de Curso*) compartilham siglas curriculares. Resumo do que aparece na grade:

| Sigla | Significado |
|-------|-------------|
| **CCOG / CCG** | Componentes **obrigatórios** da matriz |
| **CCCG / CCC** | Componentes **complementares** (eletivas) |
| **ACE** | Atividades de extensão — subdivididas em **ACEV** (vinculadas a disciplinas) e **ACEE** (projetos/eventos fora da grade) |
| **ACG** | Atividades complementares de graduação (monitoria, congressos, etc.) |
| **TCC** | Trabalho de Conclusão de Curso |
| **Enade** | Exame nacional — integralização por **parecer**, não por horas |

- **Créditos:** nos PPCs da UNIPAMPA, em geral **15 h = 1 crédito** (a matriz lista CR; o site foca na CH).
- **Colunas de CH:** teórica/prática presencial, EaD (DT/DP) e extensão (CE) — espelhadas no modal de cada disciplina.
- **AL0000:** código no histórico para disciplinas externas aproveitadas como CCCG.

Detalhes, hierarquia de integralização e glossário completo: **[faq.html](faq.html)**.

### Offline (Service Worker)
Após a primeira visita **online**, o navegador pode cachear HTML/CSS/JS do projeto e abrir a grade **sem internet**. Ícones (Tabler) e fonte (Google Fonts) vêm de CDN e podem não carregar offline — o conteúdo principal continua acessível.

## Como rodar localmente

Não precisa instalar dependências:

```bash
git clone https://github.com/<seu-usuario>/grade-unipampa.git
cd grade-unipampa
```

Abra `index.html` no navegador ou use um servidor local (ex.: Live Server no VS Code). Para testar o Service Worker, sirva por **HTTP** (`localhost`), não via `file://`.

## Estrutura do repositório

```
├── index.html              # Hub de cursos
├── cursos/*.html           # Uma página por curso
├── horarios.html           # Agenda semanal
├── faq.html                # Perguntas frequentes
├── acessibilidade.html     # Tema, fonte, backup, reset
├── css/style.css
├── js/
│   ├── main.js             # Motor da grade
│   ├── horarios.js
│   ├── grade-storage.js    # Export/import
│   ├── sw-register.js
│   └── cursos/*.js         # Dados por curso (PPC)
├── sw.js                   # Service Worker
└── scripts/                # Geradores PPC → JS (EC, EM, ET)
```

## Dados e privacidade

Tudo fica no **`localStorage` do seu navegador**. Não há cadastro nem servidor de backend. Faça **backup** em Acessibilidade antes de limpar dados do site ou trocar de aparelho.

### Chave legada (ES)
Versões antigas salvavam só Engenharia de Software em `grade_es_unipampa_v1`. Hoje usa-se `grade_unipampa_es_progress_v1`. A migração é **automática** na primeira abertura da grade de ES.

## Manutenção dos cursos

- **EC, EM, ET**: `node scripts/build-{ec,em,et}-from-ppc.mjs` (ementários em `scripts/*-ppc.txt`)
- **ES, CC, EE, EA**: edição direta em `js/cursos/*.js`

## Aviso legal

Este projeto não é vinculado oficialmente à UNIPAMPA. Ementas, pré-requisitos e cargas horárias podem conter imprecisões. Confirme sempre com o PPC vigente e a coordenação do curso.

---

Desenvolvido por Samuel Fossari · Engenharia de Software · UNIPAMPA Campus Alegrete
