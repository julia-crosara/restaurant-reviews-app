// Listens for install event which fires when sw is registered
self.addEventListener('install', function(e) {
    // Waits until install event is complete
    e.waitUntil(
        // Opens caches object and returns a promise chained
        // with a function that returns added cacheFiles
        caches.open('v1').then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

// Caches an array of file path strings that the app uses/requests
const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
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
];

// Listens for fetch addEvent
self.addEventListener('fetch', function(e) {
    // respondWith method prevents default fetch event
    e.respondWith(
        // match method checks if event request url is already in cacheFiles
        // loaded during install. Chain then method to receive a promise.
        caches.match(e.request).then(function(response) {
            // check if there's a match; if true, returns request
            if (response) {
                console.log('Found ', e.request, ' in cache');
                return response;
            } else {
                console.log('Could not find ', e.request, ' in cache, FETCHING');
                // if false, the request is fetched and added to the cache
                return fetch(e.request)
                    .then(function(response) {
                        const clonedResponse = response.clone();
                        // open cache; use put method to pair request & response
                        caches.open('v1').then(function(cache) {
                            cache.put(e.request, clonedResponse);
                        });
                        return response;
                    })
                    // catch method logs potential errors
                    .catch(function(err) {
                        console.error(err);
                    });
            }
        })
    );
});