/**
 * Verificações estáticas: assets, scripts referenciados, paletas de categoria.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';
import { loadGradeModules } from './load-grade.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadCategories() {
  const sandbox = { globalThis: {}, document: { documentElement: { getAttribute: () => 'light' } } };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  const ctx = createContext(sandbox);
  runInContext(read('js/grade/categories.js'), ctx);
  return ctx.globalThis.GRADE_CATEGORIES;
}

function read(file) {
  return fs.readFileSync(path.join(ROOT, file), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

describe('smoke estático: arquivos e SW', () => {
  it('todos os assets listados no sw.js existem no disco', () => {
    const sw = read('sw.js');
    const assets = [...sw.matchAll(/'\.\/([^']+)'/g)].map((m) => m[1]);
    const missing = assets.filter((a) => !exists(a));
    assert.equal(missing.length, 0, `Assets ausentes: ${missing.join(', ')}`);
  });

  it('scripts src em HTML existem', () => {
    const htmlFiles = [];
    function walk(dir) {
      for (const name of fs.readdirSync(dir)) {
        if (name === 'node_modules' || name.startsWith('.')) continue;
        const p = path.join(dir, name);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (name.endsWith('.html')) htmlFiles.push(p);
      }
    }
    walk(ROOT);
    const missing = [];
    for (const file of htmlFiles) {
      const relDir = path.relative(ROOT, path.dirname(file));
      const html = fs.readFileSync(file, 'utf8');
      for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
        let src = m[1];
        if (src.startsWith('http')) continue;
        const resolved = path.normalize(path.join(relDir, src));
        if (!exists(resolved)) missing.push(`${path.relative(ROOT, file)} → ${src}`);
      }
    }
    assert.equal(missing.length, 0, missing.join('\n'));
  });
});

describe('smoke estático: paletas de categoria', () => {
  const GRADE_CATEGORIES = loadCategories();

  const courses = [
    { sigla: 'es', file: 'js/cursos/es.js' },
    { sigla: 'cc', file: 'js/cursos/cc.js' },
    { sigla: 'ee', file: 'js/cursos/ee.js' },
    { sigla: 'et', file: 'js/cursos/et.js' },
    { sigla: 'ec', file: 'js/cursos/ec.js' },
    { sigla: 'em', file: 'js/cursos/em.js' },
    { sigla: 'ea', file: 'js/cursos/ea.js' },
  ];

  const themes = ['light', 'sepia', 'dark', 'kitty', 'cyberpunk', 'miku', 'contrast'];

  function extractCats(jsText) {
    const cats = new Set();
    for (const m of jsText.matchAll(/cat:\s*["']([^"']+)["']/g)) cats.add(m[1]);
    return [...cats];
  }

  function paletteKeyFor(sigla) {
    if (['ec', 'em', 'ea'].includes(sigla)) return 'eng';
    return sigla;
  }

  for (const { sigla, file } of courses) {
    it(`${sigla}: chaves cat do PPC têm nome e cor em todos os temas`, () => {
      const js = read(file);
      const cats = extractCats(js);
      const pk = paletteKeyFor(sigla);
      const paletteBundle = GRADE_CATEGORIES.CAT_PALETTES[pk];
      assert.ok(paletteBundle, `CAT_PALETTES.${pk} ausente`);
      const order =
        sigla === 'ec' || sigla === 'em' || sigla === 'ea'
          ? [...GRADE_CATEGORIES.CAT_ORDER_BY_SIGLA[sigla]]
          : GRADE_CATEGORIES.CAT_ORDER_BY_SIGLA[sigla];

      for (const cat of cats) {
        assert.ok(GRADE_CATEGORIES.CAT_NAMES[cat], `CAT_NAMES sem ${cat} em ${sigla}`);
        const idx = order.indexOf(cat);
        if (idx < 0 && !cat.endsWith('_cccg')) {
          /* slots podem usar chaves fora da ordem padrão */
        }
        for (const theme of themes) {
          const palette = paletteBundle[theme];
          assert.ok(palette?.length, `paleta ${pk}.${theme} vazia`);
          if (idx >= 0) {
            assert.ok(palette[idx], `cor vazia ${pk}.${theme}[${idx}] para ${cat}`);
          }
        }
      }
    });
  }

  it('paletas não repetem cor no mesmo tema (EE, CC, ET)', () => {
    for (const key of ['ee', 'cc', 'et']) {
      const order = GRADE_CATEGORIES.CAT_ORDER_BY_SIGLA[key === 'ee' ? 'ee' : key];
      const bundle = GRADE_CATEGORIES.CAT_PALETTES[key];
      for (const theme of themes) {
        const palette = bundle[theme];
        const used = palette.map((hex, i) => ({ hex, cat: order[i] }));
        const byHex = new Map();
        for (const { hex, cat } of used) {
          if (!byHex.has(hex)) byHex.set(hex, []);
          byHex.get(hex).push(cat);
        }
        const dups = [...byHex.entries()].filter(([, cats]) => cats.length > 1);
        assert.equal(
          dups.length,
          0,
          `${key}/${theme}: cores repetidas: ${dups.map(([h, c]) => `${h}: ${c.join(', ')}`).join('; ')}`
        );
      }
    }
  });
});

describe('smoke estático: temas registrados', () => {
  it('theme-init e siteprefs têm os mesmos temas premium', () => {
    const init = read('js/theme-init.js');
    const prefs = read('js/siteprefs.js');
    const premium = ['ocean', 'sepia', 'nord', 'kitty', 'cyberpunk', 'miku'];
    for (const t of premium) {
      assert.match(init, new RegExp(`'${t}'`), `theme-init sem ${t}`);
      assert.match(prefs, new RegExp(`'${t}'`), `siteprefs sem ${t}`);
    }
  });
});
