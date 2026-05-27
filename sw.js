/**
 * Service Worker — cache dos arquivos estáticos do projeto (mesma origem).
 */
const CACHE_NAME = 'grade-unipampa-v59';

const ASSETS = [
  './',
  './index.html',
  './horarios.html',
  './acessibilidade.html',
  './conta.html',
  './perfil.html',
  './entrar.html',
  './sobre.html',
  './faq.html',
  './assets/favicon.png',
  './assets/vendor/source-sans-3.css',
  './assets/vendor/tabler-icons.min.css',
  './assets/vendor/fonts/tabler-icons.woff2',
  './assets/vendor/fonts/tabler-icons.woff',
  './assets/fonts/source-sans-3-300.ttf',
  './assets/fonts/source-sans-3-400.ttf',
  './assets/fonts/source-sans-3-600.ttf',
  './assets/fonts/source-sans-3-700.ttf',
  './css/style.css',
  './js/theme-init.js',
  './js/profile.js',
  './js/sidebar.js',
  './js/index-page.js',
  './js/entrar-page.js',
  './js/siteprefs.js',
  './js/sw-register.js',
  './js/mobile-nav.js',
  './js/backup-nudge.js',
  './js/grade/normalize.js',
  './js/grade/ch.js',
  './js/grade/prereqs.js',
  './js/grade/cccg-rules.js',
  './js/grade/dom.js',
  './js/grade/search.js',
  './js/grade/categories.js',
  './js/grade/persistence.js',
  './js/grade/disc-menu.js',
  './js/grade/toolbar.js',
  './js/grade/modal.js',
  './js/grade/cccg-picker.js',
  './js/grade/render.js',
  './js/main.js',
  './js/grade-export.js',
  './js/horarios.js',
  './js/vendor/html-to-image.js',
  './js/acessibilidade-page.js',
  './js/grade-storage.js',
  './js/auth/supabase-client.js',
  './js/auth/session.js',
  './js/sync/cloud-sync.js',
  './js/auth/account-panel.js',
  './js/auth/onboarding.js',
  './js/auth/perfil-guard.js',
  './js/auth/perfil-page.js',
  './js/cursos/es.js',
  './js/cursos/cc.js',
  './js/cursos/ec.js',
  './js/cursos/ee.js',
  './js/cursos/em.js',
  './js/cursos/ea.js',
  './js/cursos/et.js',
  './cursos/engenharia-software.html',
  './cursos/ciencias-computacao.html',
  './cursos/engenharia-civil.html',
  './cursos/engenharia-eletrica.html',
  './cursos/engenharia-mecanica.html',
  './cursos/engenharia-agricola.html',
  './cursos/engenharia-telecom.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  /* Config Supabase é gerada no build — sempre buscar na rede. */
  if (url.pathname.endsWith('/js/auth/supabase-config.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
