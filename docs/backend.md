# Backend — Supabase (sync de dados do usuário)

Versão estática **v1.0.0-static** guarda PPC em `js/cursos/*.js`. O Supabase guarda **dados por usuário** (progresso, CCCGs, horários, preferências).

## 1. Configuração local

```bash
cp .env.example .env
# Preencha SUPABASE_URL e SUPABASE_ANON_KEY (Publishable key)
npm run config
```

Isso gera `js/auth/supabase-config.js` (gitignored). **Não commite** `.env` nem `supabase-config.js`.

## 2. SQL no Supabase

1. Dashboard → **SQL Editor** → New query  
2. Cole o conteúdo de [`supabase/migrations/001_user_sync.sql`](supabase/migrations/001_user_sync.sql)  
3. **Run**

Cria a tabela `user_sync_snapshots` com **RLS** (cada usuário só acessa a própria linha).

## 3. Authentication

Em **Authentication → Providers**:

- Ative **Email** (e/ou **Google**)
- **URL Configuration**:
  - Site URL: `https://grade-unipampa.vercel.app`
  - Redirect URLs:
    - `https://grade-unipampa.vercel.app/acessibilidade.html`
    - `http://localhost:5500/acessibilidade.html` (ou sua porta local)

Para Google OAuth, configure Client ID/Secret no Google Cloud Console e no Supabase.

## 4. Vercel

Em **Project → Settings → Environment Variables** (Production):

| Variável | Valor |
|----------|--------|
| `SUPABASE_URL` | URL do projeto |
| `SUPABASE_ANON_KEY` | Publishable / anon key |
| `SUPABASE_SITE_URL` | `https://grade-unipampa.vercel.app` |

O `vercel.json` roda `npm run build` (alias `vercel-build`), que regenera `js/auth/supabase-config.js` no deploy.

Se aparecer **“Supabase não configurado”** ou **“Nuvem não configurada”** no site publicado:

1. Confira as 3 env vars em **Settings → Environments → Preview** (para branch `dev`).
2. **Redeploy** (variáveis só entram em deploy novo).
3. Abra `https://sua-url/js/auth/supabase-config.js` — deve mostrar JSON com `url` e `anonKey`, não 404.
4. No deploy, veja **Build Logs** — deve aparecer `OK: .../supabase-config.js`.

## 5. Testar

1. `npm run config`
2. Sirva o site por HTTP (ex.: Live Server, `npx serve .`)
3. Abra **Acessibilidade → Conta e nuvem**
4. Crie conta ou entre com Google
5. **Salvar na nuvem** / **Carregar da nuvem**

## Modelo de dados

| Tabela | Conteúdo |
|--------|----------|
| `user_sync_snapshots` | Um JSON por usuário = `GRADE_STORAGE.exportAll()` |

## Segurança

- Use apenas a **publishable / anon key** no front.
- **Nunca** use `service_role` / secret key no browser.
- RLS garante isolamento por `auth.uid()`.

## Próximas fases

- Sync automático ao marcar progresso (debounce)
- Catálogo CCCG / oferta semestral no banco (não nesta sprint)
