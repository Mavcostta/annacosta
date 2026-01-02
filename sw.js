const CACHE_NAME = "anna-costa-v1.2.0";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/imagens/favicon.ico",
  "/imagens/flutuante.webp",
  "/imagens/flutuante.jpeg",
  "/extensao-cilios-guarulhos.html",
  "/design-sobrancelhas-guarulhos.html",
  "/lash-lifting-guarulhos.html",
  "/brow-lamination-guarulhos.html",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("Failed to cache:", err);
      });
    })
  );
  // Força ativação imediata
  self.skipWaiting();
});

// Fetch event - Network First com fallback para cache (melhor para SEO)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta é válida, clona e armazena no cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tenta buscar do cache
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Assume controle de todas as páginas imediatamente
  return self.clients.claim();
});
