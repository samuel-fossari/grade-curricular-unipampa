#!/usr/bin/env node
/**
 * Gera js/auth/supabase-config.js a partir de .env (local) ou variáveis de ambiente (Vercel).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = join(root, 'js/auth/supabase-config.js');

function parseEnvFile(path) {
  const env = {};
  try {
    const content = readFileSync(path, 'utf8');
    for (const line of content.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const i = t.indexOf('=');
      if (i === -1) continue;
      const key = t.slice(0, i).trim();
      let val = t.slice(i + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  } catch {
    /* .env opcional se vars vierem do ambiente */
  }
  return env;
}

const fileEnv = parseEnvFile(join(root, '.env'));
const url = process.env.SUPABASE_URL || fileEnv.SUPABASE_URL || '';
const anonKey =
  process.env.SUPABASE_ANON_KEY ||
  fileEnv.SUPABASE_ANON_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  fileEnv.SUPABASE_PUBLISHABLE_KEY ||
  '';
const siteUrl =
  process.env.SUPABASE_SITE_URL ||
  fileEnv.SUPABASE_SITE_URL ||
  'http://localhost:3000';

mkdirSync(dirname(outPath), { recursive: true });

if (!url || !anonKey) {
  const msg =
    'SUPABASE_URL ou SUPABASE_ANON_KEY ausentes: não foi possível gerar supabase-config.js.';
  if (process.env.VERCEL) {
    console.error(`ERRO (Vercel build): ${msg}`);
    console.error(
      'Configure SUPABASE_URL e SUPABASE_ANON_KEY em Settings → Environments → Preview e redeploy.'
    );
    process.exit(1);
  }
  console.warn(`AVISO: ${msg}`);
  writeFileSync(
    outPath,
    '/** Gerado por scripts/generate-supabase-config.mjs: preencha .env e rode npm run config */\nwindow.GRADE_SUPABASE_CONFIG = null;\n',
    'utf8'
  );
  process.exit(0);
}

const body = `/** Gerado por scripts/generate-supabase-config.mjs: não editar à mão */
window.GRADE_SUPABASE_CONFIG = ${JSON.stringify({ url, anonKey, siteUrl }, null, 2)};
`;

writeFileSync(outPath, body, 'utf8');
console.log('OK:', outPath);
