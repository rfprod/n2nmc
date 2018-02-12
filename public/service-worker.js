function getCacheName() {
	return new Promise(function(resolve, reject) {
		fetch(self.registration.scope + 'api/app-diag/hashsum').then(async function(response) {
			var json = await response.json();
			resolve('ng2nmc-' + json.hashsum);
		}).catch(function(error) {
			resolve('NA-' + new Date().getTime());
		});
	});
}
var cacheName;

self.addEventListener('install', function(event) {
	console.log('>> serviceWorker, install event', event);
	// self.skipWaiting();
	/*
	*	use caching then force activation
	*/
	event.waitUntil(
		getCacheName().then(function(gotCacheName) {
			cacheName = gotCacheName;
			console.log('cacheName', cacheName);
			caches.open(cacheName).then(function(cache) {
				return cache.addAll([
					// '/',
					// '/public/index.html',
					// '/public/css/vendor-bundle.min.css',
					// '/public/css/bundle.min.css',
					'/public/fonts/FontAwesome.otf',
					'/public/fonts/fontawesome-webfont.svg',
					'/public/fonts/fontawesome-webfont.ttf',
					'/public/fonts/fontawesome-webfont.eot',
					'/public/fonts/fontawesome-webfont.woff',
					'/public/fonts/fontawesome-webfont.woff2',
					// '/public/js/vendor-bundle.min.js',
					// '/public/js/bundle.min.js'
				]).then(function() {
					console.log('>> serviceWorker, cached static assets');
					self.skipWaiting();
				});
			});
		})
	);
});

self.addEventListener('activate', function(event) {
	console.log('>> serviceWorker, activated event', event);
	event.waitUntil(
		caches.keys().then(function(keys) {
			console.log('caches keys', keys);
			keys.forEach(function(cacheKey) {
				if (cacheKey !== cacheName) {
					caches.delete(cacheKey);
				}
			});
		})
	);
});

function updateCache() {
	return new Promise(function(resolve, reject) {
		getCacheName().then(function(gotCacheName) {
			console.log('updateCache, compare build hashes');
			if (cacheName !== gotCacheName) {
				cacheName = gotCacheName;
				console.log('updateCache, updating cache, cacheName', cacheName);

				caches.keys().then(function(keys) {
					keys.forEach(function(cacheKey) {
						if (cacheKey !== cacheName) {
							caches.delete(cacheKey);
						}
					});
				}).then(function() {
					caches.open(cacheName).then(function(cache) {
						cache.addAll([
							// '/',
							// '/public/index.html',
							// '/public/app/views/admin-workspace.html',
							// '/public/css/vendor-bundle.min.css',
							// '/public/css/bundle.min.css',
							'/public/fonts/FontAwesome.otf',
							'/public/fonts/fontawesome-webfont.svg',
							'/public/fonts/fontawesome-webfont.ttf',
							'/public/fonts/fontawesome-webfont.eot',
							'/public/fonts/fontawesome-webfont.woff',
							'/public/fonts/fontawesome-webfont.woff2',
							'/public/fonts/MaterialIcons-Regular.ttf',
							'/public/fonts/MaterialIcons-Regular.eot',
							'/public/fonts/MaterialIcons-Regular.woff',
							'/public/fonts/MaterialIcons-Regular.woff2',
							'/public/img/Angular_logo.svg',
							'/public/img/Node.js_logo.svg',
							// '/public/js/vendor-bundle.min.js',
							// '/public/js/bundle.min.js'
						]).then(function() {
							console.log('>> serviceWorker, updated cached static assets');
							resolve();
						});
					});
				});
			} else {
				console.log('updateCache. not need to do that, build hashes are the same');
				resolve();
			}
		})
	});
}

var proxyBaseUrl = {
	local: 'http://localhost:8080',
	remote: 'TODO'
};

self.addEventListener('fetch', function(event) {
	console.log('>> serviceWorker, fetch event', event);
	var request = event.request;
	/*
	*	sample proxy
	*
	if (/https:\/\/website\-domain\.pattern\.tld\//.test(request.url)) {
		console.log('>> serviceWorker, call intercepted, request url', request.url);
		var newUrl = proxyBaseUrl.local + '/api/proxy?url=' + encodeURIComponent(request.url);
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
	/*
	*	fetch requests without checking cache which contains static assets or... see next comment
	*/
	// event.respondWith(fetch(request));
	/*
	*	check cache, containing static assets, before fetching requests
	*/
	if (/service\-worker\-registration\.js$/.test(request.url)) {
		console.log('>> serviceWorker, should check cache update, this happens on initial page load when worker is already installed');
		event.waitUntil(updateCache());
		event.respondWith(fetch(request));
	} else {
		event.respondWith(caches.open(cacheName).then(function(cache) {
			return cache.match(request).then(function(response) {
				if (response) {
					console.log('>> serviceWorker returns cached respose on request', request);
					return response;
				} else {
					return fetch(request);
				}
			}).catch(function(error) {
				return error;
			});
		}));
	}
});
