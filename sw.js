// sw.js - Archivo del Service Worker

// Nombre y versión de la caché
const CACHE_NAME = 'devconnect-v1';

// Lista de recursos estáticos obligatorios
const STATIC_ASSETS = [
   "/",
    "/index.html",
    "/css/styles.css",
    "/js/app.js",
    "/manifest.json"
];

// FASE 1: Instalación
// Se dispara cuando el archivo se descarga por primera vez o hay cambios en él.
self.addEventListener('install', event => {
    console.log('SW: 1. Instalado correctamente.');
    
    // Guardamos los archivos estáticos en caché
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('SW: Guardando archivos en caché...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// FASE 2: Activación
// Se dispara cuando el SW toma el control de la aplicación.
self.addEventListener('activate', event => {
    console.log('SW: 2. Activado y listo para controlar la app.');
    event.waitUntil(self.clients.claim());
});

// FASE 3: Intercepción de Peticiones (Fetch)
// Se dispara cada vez que la página HTML pide un recurso (CSS, JS, imágenes, etc.)
self.addEventListener('fetch', event => {
    console.log('SW: 3. Interceptando petición hacia ->', event.request.url);
    
    // Responde desde caché si existe, o va a la red
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});