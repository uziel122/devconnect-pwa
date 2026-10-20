const CACHE_NAME = 'devconnect-v4';
const BASE_URL = self.registration.scope;

const STATIC_ASSETS = [
    BASE_URL,
    new URL('index.html', BASE_URL).href
];

const OPTIONAL_ASSETS = [
    new URL('css/styles.css', BASE_URL).href, // Corregido de style.css a styles.css
    new URL('js/app.js', BASE_URL).href,
    new URL('manifest.json', BASE_URL).href,
    new URL('images/icon-192x192.png', BASE_URL).href,
    new URL('images/icon-512x512.png', BASE_URL).href
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                for (const url of STATIC_ASSETS) {
                    const response = await fetch(url);

                    if (response.ok) {
                        await cache.put(url, response);
                    }
                }

                await Promise.allSettled(
                    OPTIONAL_ASSETS.map(async url => {
                        const response = await fetch(url);

                        if (response.ok) {
                            await cache.put(url, response);
                        }
                    })
                );

                await self.skipWaiting();
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names =>
                Promise.all(
                    names
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                )
            )
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (
        request.method !== 'GET' ||
        !['http:', 'https:'].includes(url.protocol) ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cached => {
                if (cached) {
                    return cached;
                }

                return fetch(request).then(response => {
                    if (response.ok) {
                        const copy = response.clone();

                        event.waitUntil(
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(request, copy))
                        );
                    }

                    return response;
                });
            })
            .catch(async () => {
                if (request.mode === 'navigate') {
                    const cachedPage = await caches.match(
                        new URL('index.html', BASE_URL).href
                    );

                    if (cachedPage) {
                        return cachedPage;
                    }
                }

                return new Response('Recurso no disponible sin conexión', {
                    status: 503,
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8'
                    }
                });
            })
    );
});