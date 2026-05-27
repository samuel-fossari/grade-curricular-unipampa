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
- Link **Editar horário** no modal → abre a página Horários do curso
- **CCCGs**: slots na grade + catálogo por curso, com cotas por semestre
- **Integralização de CH** por buckets do PPC (CCOG, CCCG, ACEV, ACG, ACEE…)
- Campos manuais para horas **fora da grade** (ACG, ACEE) — veja [FAQ](faq.html)
- **Exportar CSV** e **PDF / imprimir** da grade com seu progresso (botões no cabeçalho de cada curso)

### Horários
- Página **[Horários](horarios.html)**: agenda semanal das disciplinas **em andamento** e CCCGs escolhidos
- Anotações de **horário, sala, professor e e-mail** — somente nesta página, não no modal da grade
- Disciplinas **avulsas** (optativas fora da grade)
- **Imprimir / salvar PDF** e **Salvar imagem (PNG)** da agenda

### Preferências e dados
- Temas: escuro, claro, alto contraste
- Tamanho de fonte: 14 / 16 / 18 px
- **[Entrar](entrar.html)**: conta (grade personalizada + sync na nuvem) ou **continuar sem conta**
- **[Conta](conta.html)**: login Supabase, onboarding (curso/período) e sync na nuvem
- **[Acessibilidade](acessibilidade.html)**: reset de progresso, **exportar/importar backup** JSON
- Aviso de backup na grade (primeira visita ou após marcar progresso)
- **[FAQ](faq.html)**: terminologia dos PPCs, siglas, CH/créditos, ACG/ACE, backup, exportações

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
Após a **primeira visita online**, o Service Worker cacheia HTML, CSS, JS, fontes (**Source Sans 3**) e ícones (**Tabler**) servidos do próprio site. A grade e as páginas auxiliares funcionam **sem internet** depois disso.

Limitações: dados dos cursos continuam em arquivos JS locais; **backup e exportações** exigem o navegador funcionando normalmente. Se limpar dados do site, o cache é reconstruído na próxima visita online.

## Versões

A release **`v1.0.0-static`** congela a versão estática (sem backend). Veja [CHANGELOG.md](CHANGELOG.md) para o escopo completo e o que fica para versões futuras.

## Como rodar localmente

```bash
git clone https://github.com/<seu-usuario>/grade-unipampa.git
cd grade-unipampa
npm run config   # se for testar login (gera js/auth/supabase-config.js)
npm start        # abre http://localhost:3000
```

O comando `npm start` usa [`serve`](https://www.npmjs.com/package/serve) na porta **3000** (igual ao `SUPABASE_SITE_URL` local recomendado). O arquivo `serve.json` mantém URLs com `.html` (necessário para links e Service Worker).

Alternativa sem script: `npx serve . -l 3000`

**Login / OAuth:** use HTTP em `localhost:3000`, não `file://` nem Live Server em outra porta sem atualizar as Redirect URLs do Supabase.

Abrir no navegador: [http://localhost:3000/](http://localhost:3000/) (redireciona para `index.html`) ou [http://localhost:3000/entrar.html](http://localhost:3000/entrar.html)

Se aparecer listagem de arquivos em vez do site, use `index.html` na URL ou reinicie o servidor após atualizar o `serve.json`.

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
│   ├── grade-export.js     # CSV e PDF da grade
│   ├── grade-storage.js    # Export/import backup JSON
│   ├── backup-nudge.js     # Aviso de backup
│   ├── sw-register.js
│   └── cursos/*.js         # Dados por curso (PPC)
├── assets/
│   ├── fonts/              # Source Sans 3 (local)
│   └── vendor/             # Tabler Icons (local)
├── sw.js                   # Service Worker
├── CHANGELOG.md
└── scripts/                # Geradores PPC → JS (EC, EM, ET)
```

## Dados e privacidade

Por padrão, o progresso fica no **`localStorage` do navegador**. **Conta** (opcional) sincroniza um backup JSON na nuvem (Supabase). Você pode usar o site **sem cadastro**; faça **backup** em Acessibilidade antes de limpar dados do site ou trocar de aparelho.

### Chave legada (ES)
Versões antigas salvavam só Engenharia de Software em `grade_es_unipampa_v1`. Hoje usa-se `grade_unipampa_es_progress_v1`. A migração é **automática** na primeira abertura da grade de ES.

## Manutenção dos cursos

- **EC, EM, ET**: `node scripts/build-{ec,em,et}-from-ppc.mjs` (ementários em `scripts/*-ppc.txt`)
- **ES, CC, EE, EA**: edição direta em `js/cursos/*.js`

## Aviso legal

Este projeto não é vinculado oficialmente à UNIPAMPA. Ementas, pré-requisitos e cargas horárias podem conter imprecisões. Confirme sempre com o PPC vigente e a coordenação do curso.

---

Desenvolvido por Samuel Fossari · Engenharia de Software · UNIPAMPA Campus Alegrete
