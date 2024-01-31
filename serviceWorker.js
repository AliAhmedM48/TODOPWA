// ^ Install and Activate Service Worker
const cacheName = 'AppData-v1';

var staticfilesToCache = [
    //#region 

    'index.html',

    'assets/js/index.js',
    'assets/js/main.js',

    'assets/css/index.css',
    'assets/css/all.min.css',
    'assets/css/bootstrap.min.css',

    'assets/manifest/manifest.json',
    'assets/manifest/icon512_maskable.png',
    'assets/manifest/icon512_rounded.png',

    'assets/images/favicon.ico',
    //#endregion
];

self.addEventListener('install', event => {
    //#region 
    console.log('[Service Worker] installing Service worker ...', event);
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(staticfilesToCache);
            })
            .then(() => {
                console.log('[Service Worker] Caching successful');
            })
            .catch(err => {
                console.error('[Service Worker] Caching failed', err);
            })
    )
    //#endregion
});

self.addEventListener('activate', event => {
    //#region 
    console.log('activating service worker');
    //#endregion
});

// ^ Fetch
// self.addEventListener('fetch', event => {
//     //#region
//     // console.log('Fetch intercepted for: ', event.request.url);
//     event.respondWith(

//         caches.match(event.request)
//             .then(
//                 response => {
//                     if (response) {
//                         console.log('found in cache', event.request.url)
//                         console.log('event request', event.request)
//                         return response
//                     }
//                     return fetch(event.request)
//                         .then(response => {   // ! [online] wrong url----> custom page Error page not exist
//                             if (response.status == 404) {
//                                 console.log('[online] wrong url----> custom page Error page not exist');
//                                 // return caches.match("./notFound.html");
//                             }
//                             // Network request to server
//                             console.log('network request', event.request.url)
//                             // console.log('event request', event.request)
//                             return response;
//                         });
//                 }
//             )
//             .catch(err => {
//                 console.log(err);
//                 // return caches.match('./offline.html');
//             })
//     );
//     //#endregion
// });

// ^ Notification events
// self.addEventListener('notificationclick', (event) => {
//     console.log({ event });
//     const notification = event.notification
//     const primaryKey = notification.data.primaryKey
//     if (event.action === 'explore') {
//         // ! window.open("http://www.mozilla.org", "_blank");
//         console.log(clients.openWindow("http://www.mozilla.org"));
//         console.log('true');
//     }
//     else if (event.action === 'close') console.log('close');
//     console.log('clicked');
// });

