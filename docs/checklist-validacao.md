# Checklist de validação — Grade Curricular UNIPAMPA

Use em `http://localhost:3000` após `npm start` e **Ctrl+Shift+R** (cache SW atual).

**Legenda:** `[ ]` pendente · `[x]` OK · `[!]` falhou · `[~]` parcial · `[—]` não implementado

---

## 0. Infraestrutura

| # | Item | Auto | Manual |
|---|------|------|--------|
| 0.1 | `npm test` — testes de grade + persistência | [x] 12/12 | |
| 0.2 | `/` abre `index.html` (serve.json) | | [ ] |
| 0.3 | Service Worker registra e cacheia (v38+) | | [ ] |
| 0.4 | Sidebar em todas as páginas (exc. index/login) | | [ ] |
| 0.5 | Skip link “Ir para o conteúdo” | | [ ] |
| 0.6 | Layout mobile: drawer, toques | | [ ] |

---

## 1. Navegação e páginas estáticas

| # | Item | Manual |
|---|------|--------|
| 1.1 | Index visitante: disclaimer, intro, CTA conta, **grade de cursos** (vários cards) | [ ] |
| 1.2 | Index logada: saudação, “Meu curso”, um card | [ ] |
| 1.3 | FAQ: seções, accordions, rodapé no final | [ ] |
| 1.4 | Sobre: conteúdo completo, rodapé no final | [ ] |
| 1.5 | `conta.html` → redireciona para `perfil.html` | [ ] |

---

## 2. Grade curricular (por curso — repetir em ES + 1 outro)

**Curso testado:** _______________

| # | Item | Manual |
|---|------|--------|
| 2.1 | Página carrega grade (9/10 semestres) | [ ] |
| 2.2 | Marcar **concluída** → pill `X / N concluídas` atualiza | [ ] |
| 2.3 | Barra de % no strip atualiza | [ ] |
| 2.4 | Pill de horas `Xh / Yh` atualiza | [ ] |
| 2.5 | Chips: Concluídas / Em andamento / Disponíveis / Bloqueadas / Total | [ ] |
| 2.6 | % por semestre no cabeçalho da coluna | [ ] |
| 2.7 | Marcar **em andamento** e **não iniciada** | [ ] |
| 2.8 | Cartão bloqueado: não permite concluir sem pré-req | [ ] |
| 2.9 | Desmarcar concluída bloqueada por dependente | [ ] |
| 2.10 | Modal: ementa, objetivo, CH, pré-requisitos | [ ] |
| 2.11 | Link “Editar horário…” → `horarios.html` do curso | [ ] |
| 2.12 | Busca por nome/código | [ ] |
| 2.13 | Filtros: todas / disponíveis / em andamento / concluídas | [ ] |
| 2.14 | Painel “Disponíveis agora” | [ ] |
| 2.15 | Legenda de categorias (cores da faixa) | [ ] |
| 2.16 | Slot CCCG: abrir seletor, escolher eletiva, cotas | [ ] |
| 2.17 | Integralização CH: buckets + campos manuais ACG/ACEE | [ ] |
| 2.18 | Exportar CSV (conteúdo coerente com progresso) | [ ] |
| 2.19 | PDF / imprimir abre diálogo | [ ] |
| 2.20 | Recarregar página: progresso persiste | [ ] |
| 2.21 | Aviso de backup (primeira visita / após marcar) | [ ] |

**Outros cursos (smoke):** CC [ ] EC [ ] EE [ ] EM [ ] EA [ ] ET [ ]

---

## 3. Horários

| # | Item | Manual |
|---|------|--------|
| 3.1 | Visitante: seletor de curso (7 opções) | [ ] |
| 3.2 | Com conta: curso fixo do perfil (sem select) | [ ] |
| 3.3 | Lista disciplinas em andamento + CCCGs escolhidos | [ ] |
| 3.4 | Anotar horário, sala, professor, e-mail | [ ] |
| 3.5 | Disciplina avulsa: adicionar / editar / remover | [ ] |
| 3.6 | Grade semanal renderiza blocos | [ ] |
| 3.7 | Imprimir / salvar PDF | [ ] |
| 3.8 | Salvar imagem PNG | [ ] |
| 3.9 | Dados persistem após recarregar | [ ] |

---

## 4. Preferências (Acessibilidade)

| # | Item | Manual |
|---|------|--------|
| 4.1 | Tema: escuro / claro / alto contraste (todas as páginas) | [ ] |
| 4.2 | Fonte A− / A+ (14 / 16 / 18 px) | [ ] |
| 4.3 | Exportar backup JSON | [ ] |
| 4.4 | Importar backup (substituir) | [ ] |
| 4.5 | Importar com “mesclar” | [ ] |
| 4.6 | Reset progresso **um curso** | [ ] |
| 4.7 | Limpar **todos** os dados (mantém tema/fonte) | [ ] |
| 4.8 | Espaço inferior da página confortável | [ ] |

---

## 5. Conta, perfil e personalização

| # | Item | Manual |
|---|------|--------|
| 5.1 | `index.html`: aviso + intro + login (sem sidebar); sem grade de cursos | [ ] |
| 5.2 | “Continuar sem conta” → abre grade (menu lateral nos cursos) | [ ] |
| 5.3 | Login Google + e-mail/senha; confirmação de e-mail (Supabase: Confirm email) | [ ] |
| 5.4 | Onboarding: nome, curso, período, ingresso, matrícula | [ ] |
| 5.5 | Redirect para grade do curso após onboarding | [ ] |
| 5.6 | `perfil.html`: dados, dashboard desempenho, nuvem | [ ] |
| 5.7 | Perfil sem login → redirect `index.html?login=1` | [ ] |
| 5.8 | Sidebar: só curso do perfil + link Perfil | [ ] |
| 5.9 | Salvar na nuvem | [ ] |
| 5.10 | Carregar da nuvem (substituir) | [ ] |
| 5.11 | Carregar com mesclar | [ ] |
| 5.12 | Sair da conta | [ ] |
| 5.13 | Editar perfil (`index.html?edit=1`) | [ ] |
| 5.14 | Temas extras para logados | [—] não no escopo v1 |

---

## 6. Modo visitante vs conta

| # | Item | Manual |
|---|------|--------|
| 6.1 | Visitante: 7 cursos na sidebar | [ ] |
| 6.2 | Visitante: sem link Perfil na sidebar | [ ] |
| 6.3 | Conta: index só “Meu curso” | [ ] |
| 6.4 | Progresso local independente por navegador | [ ] |
| 6.5 | Backup restaura progresso + prefs | [ ] |

---

## 7. Offline (PWA)

| # | Item | Manual |
|---|------|--------|
| 7.1 | Primeira visita online → SW ativo | [ ] |
| 7.2 | DevTools offline: grade + FAQ abrem | [ ] |
| 7.3 | Export/backup offline (limitação esperada) | [ ] |

---

## Registro de falhas

| Data | # | Descrição | Status |
|------|---|-----------|--------|
| 2026-05 | 2.1–2.5 | Contagem concluídas/CH zerada após refatoração | Corrigido em `persistence.js` |

---

## Próximo passo sugerido

Validar na ordem: **0 → 2 (ES)** → **4** → **5** (se tiver Supabase) → **3** → demais cursos.
