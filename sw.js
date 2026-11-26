// Weekmenu - service worker
// Zorgt dat de app ook zonder internet opent. Online krijg je altijd de nieuwste versie;
// is het netwerk weg of trager dan 4 seconden, dan komt de laatst opgeslagen versie.
// De gegevens zelf (Google Sheet) lopen niet hierlangs: die bewaart de pagina zelf op het toestel.
var CACHE = 'weekmenu-v1';
var FILES = ['./', 'index.html', 'config.js', 'manifest.webmanifest', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; // Google-aanvragen niet onderscheppen

  var net = fetch(req).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  });
  var late = new Promise(function (_, rej) { setTimeout(rej, 4000); });

  e.respondWith(
    Promise.race([net, late]).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (r) {
        return r || net.catch(function () { return caches.match('index.html'); });
      });
    })
  );
});
