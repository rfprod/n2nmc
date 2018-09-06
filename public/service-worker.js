/**
 * @name getCacheName
 * @member {Function}
 * @summary Gets cache name.
 * @description Gets build hash.
 * @returns {Promise}
 */
function getCacheName() {
	return new Promise(function(resolve) {
		fetch(self.registration.scope + 'api/app-diag/hashsum').then(async function(response) {
			var json = await response.json();
			resolve('ng2nmc-' + json.hashsum);
		}).catch(function() {
			resolve('NA-' + new Date().getTime());
		});
	});
}

/**
 * @name cacheName
 * @summary Cache name.
 * @description Cache name in format: tn-webapp-HASHSUM or NA-CURRENTTIME.
 */
var cacheName;

/**
 * @name staticAssets
 * @summary Cached static assets.
 */
var staticAssets = [
	'/public/index.html',
	'/public/css/vendor-bundle.min.css',
	'/public/css/bundle.min.css',
	'/public/js/vendor-bundle.min.js',
	'/public/js/bundle.min.js',
	'/public/webfonts/FontAwesome.otf',
	'/public/webfonts/fontawesome-webfont.svg',
	'/public/webfonts/fontawesome-webfont.ttf',
	'/public/webfonts/fontawesome-webfont.eot',
	'/public/webfonts/fontawesome-webfont.woff',
	'/public/webfonts/fontawesome-webfont.woff2',
	'/public/webfonts/MaterialIcons-Regular.ttf',
	'/public/webfonts/MaterialIcons-Regular.eot',
	'/public/webfonts/MaterialIcons-Regular.woff',
	'/public/webfonts/MaterialIcons-Regular.woff2',
	'/public/img/Angular_logo.svg',
	'/public/img/Node.js_logo.svg'
];

/**
 * @name updateCache
 * @member {Function}
 * @summary Updates cache.
 * @description Deletes caches with keys matching a specific pattern.
 * @returns {Promise}
 */
function updateCache() {
	return new Promise(function(resolve) {
		getCacheName().then(function(gotCacheName) {
			console.log('SW, updateCache: compare hashes, cacheName', cacheName, '| gotCacheName', gotCacheName);
			if (cacheName !== gotCacheName) {
				cacheName = gotCacheName;
				console.log('SW, updateCache, updating cache, cacheName', cacheName);

				clearCache().then(function() {
					caches.open(cacheName).then(function(cache) {
						cache.addAll(staticAssets).then(function() {
							console.log('SW, updated cached static assets');
							resolve();
						});
					});
				});
			} else {
				console.log('SW, updateCache: not need, hashes are the same');
				resolve();
			}
		});
	});
}

/**
 * @name clearCache
 * @member {Function}
 * @summary Clears cache.
 * @description Deletes all caches with name different from current cache name.
 * @returns {Promise}
 */
function clearCache() {
	return caches.keys().then(function(keys) {
		console.log('SW, clearCache: caches', caches);
		keys.forEach(function(key) {
			if (key !== cacheName) {
				caches.delete(key);
			}
		});
	});
}

/**
 * Service worker install event listener.
 */
self.addEventListener('install', function(event) {
	console.log('SW, installed', event);
	// self.skipWaiting();
	/*
	*	use caching then force activation
	*/
	event.waitUntil(
		updateCache()
	);
});

/**
 * Service worker activate event listener.
 */
self.addEventListener('activate', function(event) {
	console.log('SW, activated', event);
});

/**
 * Sample requests proxy.
 * Uncomment to use.
 */
/*
function requestProxy() {
	// TODO configure commented lines in this function for usage
	var proxyBaseUrl = 'http://localhost:8080/TODO'; // proxyBaseUrl - proxy endpoint.
	var urlPatternRegX = /https:\/\/website\-domain\.pattern\.tld\//; // urlPatternRegX - urls to intercept.
	if (urlPatternRegX.test(request.url)) {
		console.log('>> serviceWorker, call intercepted, request url', request.url);
		var newUrl = proxyBaseUrl.local + '/api/proxy?url=' + encodeURIComponent(request.url); // newUrl - how a server accepts proxy requests.
		var options = {
			method: request.method,
			headers: request.headers,
			bodyUsed: request.bodyUsed,
			body: request.body,
			mode: request.mode,
			credentials: request.credentials,
			cache: request.cache,
			redirect: request.redirect,
			referer: request.referer,
			refererPolicy: request.refererPolicy,
			integrity: request.integrity
		};
		request = new Request(newUrl, options);
		console.log('>> serviceWorker, url replaced, created a new request', request);
	}
}
*/

/**
 * Service worker fetch event listener.
 */
self.addEventListener('fetch', function(event) {
	console.log('>> serviceWorker, fetch event', event);
	var request = event.request;
	/*
	* use proxy to modify requests and pass through
	*/
	// requestProxy();
	/*
	*	fetch requests without checking cache which contains static assets or... see next comment
	*/
	// event.respondWith(fetch(request));
	/*
	*	check cache, containing static assets, before fetching requests
	*/
	event.respondWith(caches.open(cacheName).then(function(cache) {
		return cache.match(request).then(function(response) {
			if (response) {
				// console.log('SW, returns cached respose on request', request);
				return response;
			} else {
				return fetch(request);
			}
		}).catch(function(error) {
			return error;
		});
	}));
});
