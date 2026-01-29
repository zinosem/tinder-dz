// Service Worker pour LoveDZ PWA
const CACHE_NAME = 'lovedz-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Stratégie de cache: Network First, puis Cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Cloner la réponse car elle ne peut être utilisée qu'une fois
                const responseClone = response.clone();
                
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        // Mettre en cache uniquement les requêtes GET
                        if (event.request.method === 'GET') {
                            cache.put(event.request, responseClone);
                        }
                    });
                
                return response;
            })
            .catch(() => {
                // Si le réseau échoue, utiliser le cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        // Page hors ligne par défaut
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nouveau message sur LoveDZ!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'Voir', icon: '/icons/checkmark.png' },
            { action: 'close', title: 'Fermer', icon: '/icons/xmark.png' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('LoveDZ 💕', options)
    );
});

// Clic sur notification
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/index.html#messages')
        );
    }
});
