'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  ".git/COMMIT_EDITMSG": "977f92b572c77cf6593e426c99bbf1c6",
".git/config": "d254f9536db63001194a8b847ac4461a",
".git/description": "a0a7c3fff21f2aea3cfa1d0316dd816c",
".git/HEAD": "cf7dd3ce51958c5f13fece957cc417fb",
".git/hooks/applypatch-msg.sample": "ce562e08d8098926a3862fc6e7905199",
".git/hooks/commit-msg.sample": "579a3c1e12a1e74a98169175fb913012",
".git/hooks/fsmonitor-watchman.sample": "ea587b0fae70333bce92257152996e70",
".git/hooks/post-update.sample": "2b7ea5cee3c49ff53d41e00785eb974c",
".git/hooks/pre-applypatch.sample": "054f9ffb8bfe04a599751cc757226dda",
".git/hooks/pre-commit.sample": "305eadbbcd6f6d2567e033ad12aabbc4",
".git/hooks/pre-merge-commit.sample": "39cb268e2a85d436b9eb6f47614c3cbc",
".git/hooks/pre-push.sample": "2c642152299a94e05ea26eae11993b13",
".git/hooks/pre-rebase.sample": "56e45f2bcbc8226d2b4200f7c46371bf",
".git/hooks/pre-receive.sample": "2ad18ec82c20af7b5926ed9cea6aeedd",
".git/hooks/prepare-commit-msg.sample": "2b5c047bdb474555e1787db32b2d2fc5",
".git/hooks/push-to-checkout.sample": "c7ab00c7784efeadad3ae9b228d4b4db",
".git/hooks/update.sample": "647ae13c682f7827c22f5fc08a03674e",
".git/index": "6d77d2a6a88d7f0d1f61b3db33a2df8e",
".git/info/exclude": "036208b4a1ab4a235d75c181e685e5a3",
".git/logs/HEAD": "420a8eedc9370e23aae35e5d913df261",
".git/logs/refs/heads/main": "b356eb94c52af47034e3bcde0e8a8185",
".git/logs/refs/remotes/origin/main": "65a519bc7515780c18257a1120fcfda7",
".git/objects/02/2b93d0a8f1f3bec4bc9639f62753791deca4aa": "fbfe21de2a3f573c6a55a425ed59679b",
".git/objects/15/03ba3219987d19b97c3364f72bf415e24e9dbb": "b84562db22cc49daaaf055c43759fa93",
".git/objects/18/61865e497e67abba216a244273b682caa6fad5": "3a28f0c835a4dc7add948bb02bce1d7a",
".git/objects/1c/2220f1853ef1b7cd53387e5f4aea7f1ee9bde5": "8888da4b9ff969ceca3fc5ee9458e8e0",
".git/objects/1d/a5e6f51ef8d08e7f1bdfcfc94ca472d8d2e5ac": "28b9d7c41003be4ba1a2a6d0589ad550",
".git/objects/22/bab5b9e55a1e21e1255773eb7c99428a7df64e": "09a7df5d69a70278289dccf8ac93146b",
".git/objects/3d/cbbb98c10f73f5ec3a1b0d8a495501cc7c4e70": "661752fef3afe0c72edb50b2adee5c07",
".git/objects/46/4ab5882a2234c39b1a4dbad5feba0954478155": "2e52a767dc04391de7b4d0beb32e7fc4",
".git/objects/46/b18ef5949d752a3a9de8c77929b3deec7d2a3c": "39339d92ddb8ed8e1b59a382da0a8d50",
".git/objects/52/480a63b1f184ea74afb06662aa98fa98864864": "6f8b2cf71be2b4830601f9db57eded45",
".git/objects/58/54831eed7dff051bd264eb1a65c4a918307d5d": "dfc098d7a7d23f690557c1d515551d10",
".git/objects/5b/6fa60338451a4d9d89d3c9cea5b29d88e41830": "bb2b11d698a034b18facc665ad5d670b",
".git/objects/5d/852e2382a23930d18077ee4473998c2083297a": "03ea9bf3ac97f826d054964788322569",
".git/objects/63/62e7286dfe84a5abbb968574f46da50fdfdeef": "9ec4a659ad2f36c01793be8e160e5787",
".git/objects/64/44e7dc785fe52bc7f94bc2f25075b03db75ff5": "73706fc29d824f6c047b88f626f385f4",
".git/objects/64/99f358afea2cfc699c36b783c1e7407a67e03d": "bed51001fea9f26c6934d9fcc422ac8b",
".git/objects/74/15c28664547bbbc66275ea1c5661eaaae9b6f6": "cc0359c0152288d6f313f8e7cfcc437c",
".git/objects/78/55cd55f2cfcfb696157e69e52df852b9a4cca4": "6f7ecf5795fc2786a967645b0abae993",
".git/objects/79/ba7ea0836b93b3f178067bcd0a0945dbc26b3f": "f3e31aec622d6cf63f619aa3a6023103",
".git/objects/7a/06188e205b3e8dcf78e4547fbfbdbedc794f4a": "046d2bcead2c6374ab5c53747ee40065",
".git/objects/84/9af655b0b121132886009c0e4998884624a37c": "00cde39af3f77afe8a5202061e112510",
".git/objects/88/cfd48dff1169879ba46840804b412fe02fefd6": "e42aaae6a4cbfbc9f6326f1fa9e3380c",
".git/objects/8a/aa46ac1ae21512746f852a42ba87e4165dfdd1": "1d8820d345e38b30de033aa4b5a23e7b",
".git/objects/91/d5efb4de891c4042f9fe2dc1ce462eb210e483": "4d577c8c5cdaf813d0adbd27f9738ebf",
".git/objects/92/acc11803adb99ccecc99a0e9910ac6dde267d7": "f43030c8f7b3db4e83c464cbd5f96ff4",
".git/objects/a1/3837a12450aceaa5c8e807c32e781831d67a8f": "bfe4910ea01eb3d69e9520c3b42a0adf",
".git/objects/ab/0e98497a51ead7821d1da35a24968ff314e50f": "557c35fe3928eb2af403d1b3926bb9ba",
".git/objects/ad/6c78967d2956231fc76e4627f84500f11f0010": "921a4fe1c1c38669db455302730edb3b",
".git/objects/b7/49bfef07473333cf1dd31e9eed89862a5d52aa": "36b4020dca303986cad10924774fb5dc",
".git/objects/b9/2a0d854da9a8f73216c4a0ef07a0f0a44e4373": "f62d1eb7f51165e2a6d2ef1921f976f3",
".git/objects/bb/17d393beebd4b77e573a621d41f563e5b82487": "5213af28737e803b35a14ce450058f1b",
".git/objects/c3/a3d3d3283e2313751080267db96ab2f65e7d0a": "473c5069b097732ecb8993aa4ae46815",
".git/objects/cf/47d1f3b02e3cc63739ce034614ccf6a03737e4": "1914375f704547423c5d4c847b095b66",
".git/objects/d6/9c56691fbdb0b7efa65097c7cc1edac12a6d3e": "868ce37a3a78b0606713733248a2f579",
".git/objects/dc/1b80cfac64fdc338bef3c3705738654e7c7b7f": "e0732070f3b2c7da06c2d66ef6e2b22a",
".git/objects/e3/3ff90fb6c188654676899d0b575fd50e7a77f0": "269ccad187d9eef30736e7f1b43296f6",
".git/objects/e5/951dfb943474a56e611d9923405cd06c2dd28d": "c6fa51103d8db5478e1a43a661f6c68d",
".git/objects/e6/ee34e6bbc4157630d3702fb9249ef38214d421": "3f282b3c55352f27b2827c3cc8bf07fd",
".git/objects/eb/9b4d76e525556d5d89141648c724331630325d": "37c0954235cbe27c4d93e74fe9a578ef",
".git/objects/fe/472874d1e4c360bc09b75f9b7cbda487e12c66": "c3e30b8c1c8d9e11b924cdffd6a7aa6d",
".git/refs/heads/main": "9df2b65c2f09a3c8ad18eba9a9cd3d53",
".git/refs/remotes/origin/main": "9df2b65c2f09a3c8ad18eba9a9cd3d53",
"assets/AssetManifest.json": "721addae9cc98db916ad6240076633f8",
"assets/assets/backgroundLogin.png": "43afd099d5a3b16078d410431a6a4db7",
"assets/assets/Jpg_octan_test_logo.jpg": "35e07192dde21b05b84327613738264e",
"assets/assets/logo.svg": "7bf6ff9438ea2062ca18b7873c579896",
"assets/assets/octan_logo_test.svg": "29cd5bea59d565705015064375d4f666",
"assets/assets/octan_name_logo_test.svg": "1e6dc85c5c4d42667620d1a854f38071",
"assets/assets/Png_octan_logo.png": "2f4ce7fc1fdb56ddd872c708ec2a1237",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "a2fad2579ab0eb01353edc80b5b018dc",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "c9141d12a6bc11190b827f7171555263",
"/": "c9141d12a6bc11190b827f7171555263",
"main.dart.js": "9dfb70dfcf760b455b385bc28da064d3",
"manifest.json": "813727d295ad71cb43aa476e83d103eb",
"version.json": "668e21b341fec127f7669fedf623d823"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
