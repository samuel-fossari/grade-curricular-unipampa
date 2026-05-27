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
- **Confirmação de e-mail** (recomendado): **Authentication → Providers → Email** → ative **Confirm email**. Novos cadastros recebem um link; o login com senha só funciona após confirmar.
- **URL Configuration**:
  - **Site URL**: URL base do site (ex. `https://grade-curricular-unipampa.vercel.app`) — sem path de página
  - **Redirect URLs** (obrigatório para OAuth Google e links de confirmação de e-mail):
    - `https://grade-curricular-unipampa.vercel.app/index.html` (produção — **mesmo host** do Site URL)
    - `http://localhost:3000/index.html` (dev — porta do `npm start`)
    - Cada preview Vercel que for testar: `https://<nome-do-preview>.vercel.app/index.html`
    - Domínio customizado, se houver: `https://seu-dominio/index.html`
    - Opcional (legado): `*/entrar.html` — redireciona para `index.html`
  - **Site URL** e **Redirect URLs** de produção devem usar o **mesmo domínio** (ex. `grade-curricular-unipampa`, não `grade-unipampa`). URL de preview efêmera (`*-git-*-*.vercel.app`) só se for testar aquele preview.
  - No `.env` local, use `SUPABASE_SITE_URL=http://localhost:3000` (mesma porta do `npm start`)

Para **Google OAuth** (erro `Unsupported provider: provider is not enabled` = Google ainda desligado no Supabase):

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Ligue **Enable Sign in with Google**
3. Crie credenciais em [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → **OAuth 2.0 Client ID** (tipo *Web application*)
4. Em **Authorized redirect URIs** do Google, adicione exatamente (troque o ID do projeto):
   - `https://<SEU-PROJECT-REF>.supabase.co/auth/v1/callback`
   - O valor aparece no próprio formulário do Google no Supabase ao expandir a ajuda
5. Cole **Client ID** e **Client Secret** no Supabase e clique **Save**
6. Confira **Redirect URLs** do site (`index.html`) na seção **URL Configuration** (passo acima)

### Google: “Prosseguir para …supabase.co”

É **normal**. O login passa pelo servidor de auth do Supabase (`<projeto>.supabase.co`); depois o Supabase redireciona de volta para o seu site (`index.html`). No Google Cloud você pode melhorar o nome exibido em **OAuth consent screen** (nome do app, logo, homepage = URL do site), mas o domínio técnico do callback continua sendo `*.supabase.co` — isso não é um vazamento do seu app, é o fluxo padrão do Supabase Auth.

### Login Google cai em 404 na Vercel

1. **Supabase** → Authentication → URL Configuration: **Site URL** e **Redirect URLs** com o **mesmo host** (ex. `https://grade-curricular-unipampa.vercel.app` + `.../index.html`).
2. Remova Redirect URLs com domínio errado (ex. `grade-unipampa.vercel.app` se o site real é `grade-curricular-unipampa`).
3. **Vercel** → Settings → Environment Variables: confira **Production** (não só Preview) — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SITE_URL` = `https://grade-curricular-unipampa.vercel.app`.
4. **Redeploy** do ambiente Production após alterar variáveis.
5. Teste em `https://grade-curricular-unipampa.vercel.app` (não em preview antigo).

## 4. Vercel

Em **Project → Settings → Environment Variables** (Production):

| Variável | Valor |
|----------|--------|
| `SUPABASE_URL` | URL do projeto |
| `SUPABASE_ANON_KEY` | Publishable / anon key |
| `SUPABASE_SITE_URL` | `https://grade-curricular-unipampa.vercel.app` |

O `vercel.json` roda `npm run build` (alias `vercel-build`), que regenera `js/auth/supabase-config.js` no deploy.

Se aparecer **“Supabase não configurado”** ou **“Nuvem não configurada”** no site publicado:

1. Confira as 3 env vars em **Production** (branch `main`) e, se usar, em **Preview** (branch `dev`) — valores de `SUPABASE_SITE_URL` podem diferir por ambiente.
2. **Redeploy** (variáveis só entram em deploy novo).
3. Abra `https://sua-url/js/auth/supabase-config.js` — deve mostrar JSON com `url` e `anonKey`, não 404.
4. No deploy, veja **Build Logs** — deve aparecer `OK: .../supabase-config.js`.

## 5. Testar

1. `npm run config`
2. Sirva o site por HTTP (ex.: Live Server, `npx serve .`)
3. Abra a **tela inicial** (`index.html`) para login ou **Perfil** após entrar
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
