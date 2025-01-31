const CACHE_NAME = "v1_cache";
const urlsToCache = [
  "./",
  "./index.html",
  "./script.js",
  "./css/style.css", // Vérifie bien ce chemin !
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert");
      return cache
        .addAll(urlsToCache)
        .catch((err) => console.error("Erreur de cache:", err));
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
