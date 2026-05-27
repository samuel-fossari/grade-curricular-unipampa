/**
 * Smoke E2E com Playwright — páginas principais, erros de console, elementos-chave.
 * Requer: npm start (porta 3000) em outro terminal.
 *
 * Uso: node tests/smoke-browser.mjs
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const BASE = process.env.SMOKE_BASE || 'http://127.0.0.1:3000';

const PAGES = [
  { path: '/', name: 'index', expect: '#indexLoginCard' },
  { path: '/index.html?dev=1', name: 'index-dev', expect: '#indexDevMock' },
  { path: '/faq.html', name: 'faq', expect: '#faqSearch' },
  { path: '/acessibilidade.html', name: 'acessibilidade', expect: '#themeSel' },
  { path: '/horarios.html', name: 'horarios', expect: '#schedule-root, #horariosCursoPicker' },
  { path: '/sobre.html', name: 'sobre', expect: 'main' },
  { path: '/perfil.html', name: 'perfil-mock', expect: '#perfilDataList', mock: true },
  { path: '/cursos/engenharia-software.html', name: 'grade-es', expect: '#grid' },
  { path: '/cursos/ciencias-computacao.html', name: 'grade-cc', expect: '#grid' },
  { path: '/cursos/engenharia-eletrica.html', name: 'grade-ee', expect: '#grid' },
  { path: '/cursos/engenharia-telecom.html', name: 'grade-et', expect: '#grid' },
  { path: '/cursos/engenharia-civil.html', name: 'grade-ec', expect: '#grid' },
];

const THEMES = ['light', 'dark', 'contrast', 'miku', 'kitty'];

async function mockAccount(page, sigla = 'cc') {
  await page.evaluate((s) => {
    localStorage.setItem('grade_unipampa_logged_in_v1', 'true');
    localStorage.removeItem('grade_unipampa_guest_v1');
    localStorage.setItem('grade_unipampa_dev_mock_v1', 'true');
    localStorage.setItem(
      'grade_unipampa_profile_v1',
      JSON.stringify({
        nome: 'Smoke',
        curso: s,
        periodo: 1,
        anoIngresso: 2024,
        onboardingDone: true,
      })
    );
    localStorage.setItem('grade_unipampa_theme_v1', 'miku');
  }, sigla);
}

async function main() {
  const failures = [];
  let browser;
  try {
    const probe = await fetch(BASE);
    if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
  } catch (e) {
    console.error(`Servidor não responde em ${BASE}. Rode: npm start`);
    process.exit(2);
  }

  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push({ type: 'pageerror', msg: String(err) }));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push({ type: 'console', msg: msg.text() });
  });

  for (const { path: urlPath, name, expect: sel, mock } of PAGES) {
    consoleErrors.length = 0;
    const url = BASE + urlPath;
    try {
      if (mock) await mockAccount(page, 'es');
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      assert.ok(res && res.ok(), `HTTP ${res?.status()} em ${url}`);
      await page.waitForTimeout(800);
      for (const selector of sel.split(',').map((s) => s.trim())) {
        const el = await page.$(selector);
        assert.ok(el, `Seletor ausente em ${name}: ${selector}`);
      }
      const fatal = consoleErrors.filter(
        (e) =>
          !e.msg.includes('Supabase') &&
          !e.msg.includes('Failed to load resource') &&
          !e.msg.includes('favicon')
      );
      if (fatal.length) {
        failures.push({ name, url, errors: fatal });
      } else {
        console.log(`OK  ${name}`);
      }
    } catch (err) {
      failures.push({ name, url, errors: [{ msg: String(err) }] });
      console.log(`FAIL ${name}: ${err.message}`);
    }
  }

  /* Grade CC com mock + tema miku: legenda e cards */
  consoleErrors.length = 0;
  try {
    await page.goto(BASE + '/cursos/ciencias-computacao.html', { waitUntil: 'domcontentloaded' });
    await mockAccount(page, 'cc');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1200);
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'miku');
      window.GRADE_SITEPREFS?.applyTheme?.('miku');
    });
    await page.waitForTimeout(500);
    const legend = await page.$('.category-legend .stl-item');
    assert.ok(legend, 'Legenda de categorias não renderizada');
    const cards = await page.$$('.disc-card');
    assert.ok(cards.length > 5, 'Poucos cards na grade');
    const done = await page.$('.disc-card.done');
    const ready = await page.$('.disc-card.ready');
    if (done && ready) {
      const doneColor = await done.evaluate((el) => getComputedStyle(el).color);
      const readyColor = await ready.evaluate((el) => getComputedStyle(el).color);
      assert.notEqual(doneColor, readyColor, 'Miku: done e ready com mesma cor de texto');
    }
    console.log('OK  grade-cc-miku-mock');
  } catch (err) {
    failures.push({ name: 'grade-cc-miku-mock', errors: [{ msg: String(err) }] });
    console.log(`FAIL grade-cc-miku-mock: ${err.message}`);
  }

  /* Temas na acessibilidade (mock) */
  await page.goto(BASE + '/acessibilidade.html?dev=1', { waitUntil: 'domcontentloaded' });
  await mockAccount(page, 'es');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  for (const theme of THEMES) {
    try {
      await page.selectOption('#themeSel', theme);
      await page.waitForTimeout(200);
      const applied = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      assert.equal(applied, theme, `Tema não aplicado: ${theme}`);
      console.log(`OK  tema-${theme}`);
    } catch (err) {
      failures.push({ name: `tema-${theme}`, errors: [{ msg: String(err) }] });
      console.log(`FAIL tema-${theme}: ${err.message}`);
    }
  }

  await browser.close();

  console.log('\n--- Resumo ---');
  if (failures.length === 0) {
    console.log('Todos os smoke tests passaram.');
    process.exit(0);
  }
  console.log(`${failures.length} falha(s):`);
  for (const f of failures) {
    console.log(`\n[${f.name}] ${f.url || ''}`);
    for (const e of f.errors) console.log(`  - ${e.msg}`);
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
