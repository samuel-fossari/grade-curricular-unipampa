/**
 * Service Worker — cache dos arquivos estáticos do projeto (mesma origem).
 * Fontes e ícones em CDN não são cacheados aqui.
 */
const CACHE_NAME = 'grade-unipampa-v8';

const ASSETS = [
  './',
  './index.html',
  './horarios.html',
  './acessibilidade.html',
  './sobre.html',
  './faq.html',
  './assets/favicon.png',
  './css/style.css',
  './js/sidebar.js',
  './js/siteprefs.js',
  './js/sw-register.js',
  './js/mobile-nav.js',
  './js/main.js',
  './js/horarios.js',
  './js/acessibilidade-page.js',
  './js/grade-storage.js',
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
