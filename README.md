# Grade Curricular UNIPAMPA — Campus Alegrete

Site estático para acompanhar grades curriculares de forma interativa: progresso local, pré-requisitos, ementas, CCCGs, integralização de carga horária e agenda semanal.

**[grade-curricular-unipampa.vercel.app](https://grade-curricular-unipampa.vercel.app)**

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

## Como usar o site

### Sem conta (visitante)

1. Abra a [tela inicial](index.html).
2. Use **Continuar sem conta**.
3. No menu lateral, escolha qualquer um dos **7 cursos** e marque seu progresso (fica neste navegador).

### Com conta

1. Na [tela inicial](index.html), entre com **Google** ou **e-mail/senha**.
2. Na **primeira vez**, preencha o formulário de **perfil** (curso obrigatório) — isso é o *onboarding*.
3. Depois você vê a tela **Início** com atalhos para [Perfil](perfil.html) e **Minha grade** (só o seu curso).
4. O menu lateral mostra **apenas o curso do seu perfil**. Para ver outras grades, use **sem conta** ou **saia da conta**.
5. Em Perfil, use **Salvar na nuvem** / **Carregar da nuvem** para backup remoto (Supabase).

Mais detalhes e decisões de produto: [docs/planejamento.md](docs/planejamento.md).

## Funcionalidades

### Grade curricular
- Estados por disciplina: **não feita**, **em andamento**, **concluída**
- Bloqueio por **pré-requisitos** e regras especiais (ex.: % mínima de CH para TCC/estágio)
- **Busca e filtros** por nome/código e status
- Painel **“Disponíveis agora”**
- Modal com **ementa**, objetivo e CH detalhada
- **CCCGs** e **integralização de CH** por buckets do PPC
- **Exportar CSV** e **PDF / imprimir**

### Horários
- [Horários](horarios.html): agenda semanal, anotações, disciplinas avulsas, PDF/PNG

### Conta, perfil e dados
- [Tela inicial](index.html): aviso do projeto, login ou continuar sem conta; logado → início com atalhos
- [Perfil](perfil.html): seus dados, desempenho na grade, sync na nuvem, sair
- [Acessibilidade](acessibilidade.html): tema, fonte, backup JSON, reset
- [FAQ](faq.html): glossário PPC, busca no texto, backup e exportações

### Temas
- **Claro** (padrão), **escuro** e **alto contraste** — em Acessibilidade
- O tema escuro pode ser refinado no futuro (feedback de usuários); novos temas só depois disso

### Offline (PWA)
Após a primeira visita online, o Service Worker cacheia o site para uso sem internet. Limpar dados do navegador apaga progresso e exige nova visita online para recachear.

## Versões

- **[v1.0.0-static](CHANGELOG.md)** — grade estática completa, sem conta
- **v1.1** (em uso) — login, perfil, onboarding, sync manual, tela inicial unificada — ver [CHANGELOG.md](CHANGELOG.md)

## Como rodar localmente

```bash
git clone https://github.com/samuel-fossari/grade-curricular-unipampa.git
cd grade-curricular-unipampa
npm run config   # se for testar login (gera js/auth/supabase-config.js)
npm start        # http://localhost:3000
```

**Login / OAuth:** use `http://localhost:3000` e configure as Redirect URLs no Supabase (`index.html`). Ver [docs/backend.md](docs/backend.md).

**Testes:** `npm test` (12 testes unitários).

## Estrutura do repositório

```
├── index.html              # Entrada: login / início logado / onboarding
├── perfil.html             # Perfil, desempenho, nuvem
├── entrar.html, conta.html # Redirecionam (legado)
├── cursos/*.html           # Uma grade por curso
├── horarios.html, faq.html, acessibilidade.html, sobre.html
├── js/
│   ├── main.js, horarios.js, grade-export.js
│   ├── grade-storage.js, profile.js, index-page.js
│   ├── auth/               # Supabase (session, onboarding, perfil)
│   ├── sync/cloud-sync.js
│   ├── grade/              # Motor da grade
│   └── cursos/*.js         # Dados PPC
├── css/style.css
├── sw.js
├── supabase/migrations/
├── docs/
│   ├── backend.md
│   ├── planejamento.md     # Estado do projeto e decisões
│   └── checklist-validacao.md
└── tests/
```

## Dados e privacidade

Progresso e perfil ficam no **localStorage** do navegador. Com conta, um backup JSON completo pode ser salvo na **nuvem** (Supabase). Faça **exportar backup** em Acessibilidade antes de trocar de aparelho ou limpar dados do site.

**Sync automático** ao marcar disciplinas: planejado; hoje a nuvem é atualizada manualmente em Perfil (ou no primeiro login, com restauração do backup remoto).

## Manutenção dos cursos

- **EC, EM, ET**: `node scripts/build-{ec,em,et}-from-ppc.mjs`
- **ES, CC, EE, EA**: edição em `js/cursos/*.js`

## Aviso legal

Projeto não oficial da UNIPAMPA. Confirme matrícula e integralização com a coordenação.

---

Desenvolvido por Samuel Fossari · Engenharia de Software · UNIPAMPA Campus Alegrete
