const CACHE_VERSION = "v1"
const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/app/app.component.html",
    "/app/login/login.component.html",
    "/app/login/login.component.css",
    "/app/main/main.component.html",
    "/app/main/main.component.css",
    "https://www.google.com/recaptcha/api.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
    "https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap",
    "https://fonts.googleapis.com/icon?family=Material+Icons",

    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&amp;display=swap" rel="stylesheet" />,
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
]

self.addEventListener('install', evt => {
    console.log('service worker has been installed');
    evt.waitUntil(
        
        caches.open(CACHE_VERSION).then(cache => {
            console.log('Prosao')
            return cache.addAll(PRECACHE_ASSETS);
        })
    )
})
//activate event
self.addEventListener('activate', evt => {
    console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName != CACHE_VERSION).
                    map(cacheNames => caches.delete(cacheName))
            );

        }
        )
    );
})