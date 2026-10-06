const CACHE_NAME = "devconnect-v1";

const ARCHIVOS = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/app.js",
    "/manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((respuesta) => {
            return respuesta || fetch(event.request);
        })
    );
});