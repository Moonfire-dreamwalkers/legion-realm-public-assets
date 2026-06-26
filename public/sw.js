const THUMB_CACHE = "son-video-thumbnails-v1";
const THUMB_HOSTS = new Set(["i.ytimg.com", "img.youtube.com"]);
self.addEventListener("install", () => {
self.skipWaiting();
});
self.addEventListener("activate", (event) => {
event.waitUntil(self.clients.claim());
});
function isYouTubeThumbnail(request) {
if (request.destination !== "image") return false;
try {
const url = new URL(request.url);
return THUMB_HOSTS.has(url.hostname) && url.pathname.includes("/vi/");
} catch {
return false;
}
}
self.addEventListener("fetch", (event) => {
if (!isYouTubeThumbnail(event.request)) return;
event.respondWith((async () => {
const cache = await caches.open(THUMB_CACHE);
const cached = await cache.match(event.request);
if (cached) return cached;
const response = await fetch(event.request);
await cache.put(event.request, response.clone());
return response;
})());
});