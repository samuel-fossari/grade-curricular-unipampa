import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function loadSearch() {
  const sandbox = { globalThis: {} };
  sandbox.globalThis = sandbox;
  sandbox.window = sandbox;
  const context = createContext(sandbox);
  runInContext(readFileSync(join(root, 'js/grade/search.js'), 'utf8'), context);
  return context.globalThis.GRADE_SEARCH;
}

const { normalizeSearchText, cardMatchesFilter } = loadSearch();

describe('GRADE_SEARCH.normalizeSearchText', () => {
  it('remove acentos e baixa caixa', () => {
    assert.equal(normalizeSearchText('Cálculo Numérico'), 'calculo numerico');
    assert.equal(normalizeSearchText('PROGRAMAÇÃO'), 'programacao');
    assert.equal(normalizeSearchText(null), '');
  });
});

describe('GRADE_SEARCH.cardMatchesFilter', () => {
  const disc = { id: 'calc1', name: 'Cálculo I', codigo: 'AL0363' };

  it('encontra disciplina acentuada digitando sem acento', () => {
    assert.equal(cardMatchesFilter(disc, 'ready', 'all', 'calculo'), true);
    assert.equal(cardMatchesFilter(disc, 'ready', 'all', 'CÁLCULO'), true);
  });

  it('casa por código, ignorando caixa', () => {
    assert.equal(cardMatchesFilter(disc, 'ready', 'all', 'al0363'), true);
  });

  it('busca vazia sempre passa', () => {
    assert.equal(cardMatchesFilter(disc, 'locked', 'all', '   '), true);
  });

  it('respeita o filtro de status', () => {
    assert.equal(cardMatchesFilter(disc, 'locked', 'done', ''), false);
    assert.equal(cardMatchesFilter(disc, 'done', 'done', ''), true);
  });

  it('não casa termo ausente', () => {
    assert.equal(cardMatchesFilter(disc, 'ready', 'all', 'fisica'), false);
  });
});
