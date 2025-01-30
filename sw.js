importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
console.log(`yai! Workbox is loaded of TodoList 🎉`);
const { registerRoute } = workbox.routing;
const { StaleWhileRevalidate } = workbox.strategies;
const { CacheFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;
const { CachableResponsePlugin } = workbox.expiration;
registerRoute(
  ({ url }) =>
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts",
    plugins: [new ExpirationPlugin({ maxEntries: 10 })],
  })
);
registerRoute(
  ({ request }) =>
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style",
  new StaleWhileRevalidate({ cacheName: "cache-files" })
);
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);