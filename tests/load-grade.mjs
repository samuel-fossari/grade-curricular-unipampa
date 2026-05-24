import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Carrega módulos `js/grade/*` em ordem (mesmo ambiente do browser). */
export function loadGradeModules() {
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  const context = createContext(sandbox);

  const scripts = [
    'js/grade/normalize.js',
    'js/grade/ch.js',
    'js/grade/prereqs.js',
    'js/grade/cccg-rules.js',
  ];

  for (const rel of scripts) {
    const code = readFileSync(join(root, rel), 'utf8');
    runInContext(code, context);
  }

  return context.globalThis;
}
