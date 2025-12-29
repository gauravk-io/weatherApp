const CACHE_NAME = 'weather-pro-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './css/variables.css',
  './css/responsive.css',
  './js/app.js',
  './js/api.js',
  './js/ui.js',
  './js/utils.js',
  './js/storage.js',
  './js/charts.js',
  './assets/images/clear.png',
  './assets/images/clouds.png',
  './assets/images/drizzle.png',
  './assets/images/humidity.png',
  './assets/images/mist.png',
  './assets/images/rain.png',
  './assets/images/search.png',
  './assets/images/snow.png',
  './assets/images/wind.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
