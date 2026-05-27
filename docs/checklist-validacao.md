# Checklist de validação — Grade Curricular UNIPAMPA

Use em `http://localhost:3000` após `npm start` e **Ctrl+Shift+R** (confira a versão do SW em `sw.js`, ex.: v63+).

**Legenda:** `[ ]` pendente · `[x]` OK · `[!]` falhou · `[~]` parcial · `[—]` fora do escopo / decisão de produto

**Decisões de produto** (não são falhas): logado vê **só um curso** no menu; outros cursos via **sem conta** ou **sair**; index **sem** cards dos 7 cursos — ver [planejamento.md](planejamento.md).

---

## 0. Infraestrutura

| # | Item | Auto | Manual |
|---|------|------|--------|
| 0.1 | `npm test` — testes de grade + persistência | [x] 12/12 | |
| 0.2 | `/` abre `index.html` (serve.json) | | [ ] |
| 0.3 | Service Worker registra e cacheia (versão atual em `sw.js`) | | [ ] |
| 0.4 | Sidebar nas páginas com menu (cursos, horários, FAQ…) | | [ ] |
| 0.5 | Index **sem** sidebar (só entrada) | | [ ] |
| 0.6 | Skip link “Ir para o conteúdo” | | [ ] |
| 0.7 | Mobile: drawer com **texto** nos itens do menu | | [ ] |

---

## 1. Navegação e páginas estáticas

| # | Item | Manual |
|---|------|--------|
| 1.1 | Index **visitante**: aviso amarelo + login + “Continuar sem conta” (sem lista de 7 cursos) | [ ] |
| 1.2 | Index **logada**: card Início — Perfil, Minha grade, Sair (vermelho) | [ ] |
| 1.3 | FAQ: busca lateral, índice vertical, scroll só no conteúdo (desktop) | [ ] |
| 1.4 | Sobre: conteúdo e rodapé | [ ] |
| 1.5 | `entrar.html` e `conta.html` redirecionam | [ ] |

---

## 2. Grade curricular (repetir em ES + 1 outro curso)

**Curso testado:** _______________

| # | Item | Manual |
|---|------|--------|
| 2.1 | Página carrega grade (9/10 semestres) | [ ] |
| 2.2 | Marcar **concluída** → contadores atualizam | [ ] |
| 2.3 | Barra de % e pill de horas atualizam | [ ] |
| 2.4 | Chips e % por semestre | [ ] |
| 2.5 | Pré-requisitos e desmarcar com dependente | [ ] |
| 2.6 | Modal, link horários, busca, filtros, CCCG | [ ] |
| 2.7 | Exportar CSV e PDF | [ ] |
| 2.8 | Progresso persiste após F5 | [ ] |
| 2.9 | Aviso de backup na grade | [ ] |

**Smoke outros cursos:** CC [ ] EC [ ] EE [ ] EM [ ] EA [ ] ET [ ]

---

## 3. Horários

| # | Item | Manual |
|---|------|--------|
| 3.1 | Visitante: seletor dos 7 cursos | [ ] |
| 3.2 | Logado: curso fixo do perfil | [ ] |
| 3.3 | Anotações, avulsas, grade semanal, PDF/PNG | [ ] |
| 3.4 | Persistência após recarregar | [ ] |

---

## 4. Preferências (Acessibilidade)

| # | Item | Manual |
|---|------|--------|
| 4.1 | Tema claro / escuro / alto contraste | [ ] |
| 4.2 | Fonte 14 / 16 / 18 px | [ ] |
| 4.3 | Exportar e importar backup JSON (substituir e mesclar) | [ ] |
| 4.4 | Reset por curso e limpar todos | [ ] |

---

## 5. Conta, perfil e personalização

| # | Item | Manual |
|---|------|--------|
| 5.1 | Login Google (produção: domínio `grade-curricular-unipampa.vercel.app`) | [ ] |
| 5.2 | Login e-mail/senha; confirmação de e-mail (se ativo no Supabase) | [ ] |
| 5.3 | **Onboarding** (1ª vez): formulário curso/nome na index; depois tela Início | [ ] |
| 5.4 | Login em **outro aparelho** com conta já configurada → **não** pede onboarding de novo (se já salvou na nuvem) | [ ] |
| 5.5 | `perfil.html`: dados, desempenho, Salvar/Carregar nuvem, Sair | [ ] |
| 5.6 | Perfil sem login → `index.html` | [ ] |
| 5.7 | Sidebar logado: Tela inicial, **Perfil**, **só um curso** | [ ] |
| 5.8 | Sidebar visitante: 7 cursos, **sem** Perfil | [ ] |
| 5.9 | Editar perfil: `index.html?edit=1` | [ ] |
| 5.10 | “Ver outros cursos” no menu logado | [—] intencional — ver planejamento |
| 5.11 | Sync automático ao marcar disciplina | [—] planejado futuro |
| 5.12 | Temas extras só para logados | [—] após redesign do tema escuro |

---

## 6. Modo visitante vs conta

| # | Item | Manual |
|---|------|--------|
| 6.1 | Visitante: 7 cursos no menu | [ ] |
| 6.2 | Logado: um curso + Perfil | [ ] |
| 6.3 | Sair → volta à index visitante | [ ] |
| 6.4 | Backup JSON restaura progresso + perfil | [ ] |

---

## 7. Offline (PWA)

| # | Item | Manual |
|---|------|--------|
| 7.1 | Primeira visita online → SW ativo | [ ] |
| 7.2 | Offline: grade + FAQ abrem | [ ] |

---

## Registro de falhas

| Data | # | Descrição | Status |
|------|---|-----------|--------|
| 2026-05 | 2.x | Contagem concluídas/CH zerada | Corrigido (`persistence.js`) |
| 2026-05 | 5.4 | Google no celular pedia onboarding com conta existente | Corrigido (`syncAfterLogin` + perfil na nuvem) |
| 2026-05 | 0.7 | Drawer mobile sem rótulos | Corrigido (`mobile-nav.js`) |

---

## Ordem sugerida de validação

**0 → 5 (Supabase) → 2 (ES) → 4 → 3 → smoke outros cursos → 7**
