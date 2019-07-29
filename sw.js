// All of the code on this page was derived from:
// https://developers.google.com/web/fundamentals/primers/service-workers/

const CACHE_NAME = 'cache-v1';
const cacheFiles = [
    '/',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/index.html',
    '/restaurant.html',
];

self.addEventListener('install', function(event) {
    // Perform install steps - open cache, cache files, confirm assets cached
    event.waitUntil(
        // takes a chain of promises
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        // pass in a promise
        caches.match(event.request) // looks at request and finds cached results
        .then(function(response) {
            // if matched, return cached value
            if (response) {
                return response;
            }
            // if not, return the result of call to fetch
            return fetch(event.request).then(
                function(response) {
                    // Check if we received a valid response
                    // 'basic' means request is from origin; requests to 3rd party assets will not be cached.
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }
            );
        })
    );
});