// Copia offline dello scout: alla prima apertura salva tutti i file sul telefono,
// poi li serve sempre dalla copia (anche in modalità aereo).
// Quando si pubblica una versione nuova, cambiare VERSIONE: al primo avvio con rete il telefono la scarica.
const VERSIONE = 'scout-v1';
const FILE = ['./', './index.html', './manifest.webmanifest',
              './icone/icona-180.png', './icone/icona-192.png', './icone/icona-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n))))
    .then(() => self.clients.claim()));
});

// prima la copia sul telefono; la rete solo per ciò che non è in copia
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
