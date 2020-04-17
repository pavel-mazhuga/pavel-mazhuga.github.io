/* global ROOT_PATH PUBLIC_PATH */
/* eslint-disable no-restricted-globals */
import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import * as navigationPreload from 'workbox-navigation-preload';
import { precacheAndRoute } from 'workbox-precaching';

const OFFLINE_CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = `${ROOT_PATH}offline/index.html`;

export function registerRoutes() {
    const networkFirst = new NetworkFirst({
        cacheName: 'html',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
            }),
        ],
        networkTimeoutSeconds: 10,
    });

    self.addEventListener('install', async (event) => {
        event.waitUntil(caches.open(OFFLINE_CACHE_NAME).then((cache) => cache.add(FALLBACK_HTML_URL)));
    });

    navigationPreload.enable();

    registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg|webp|ico)$/,
        new StaleWhileRevalidate({
            cacheName: 'images',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 60,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                }),
            ],
        }),
    );

    registerRoute(
        new RegExp(`${PUBLIC_PATH}(css|js|wasm)/`),
        new CacheFirst({
            cacheName: 'static',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                }),
            ],
        }),
    );

    registerRoute(
        new RegExp(`${PUBLIC_PATH}fonts/*.woff2$`),
        new CacheFirst({
            cacheName: 'fonts',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                }),
            ],
        }),
    );

    // HTML
    registerRoute(/\//, async (params) => {
        try {
            // Attempt a network request.
            return await networkFirst.handle(params);
        } catch (err) {
            // If it fails, return the cached HTML.
            return caches.match(FALLBACK_HTML_URL, { cacheName: OFFLINE_CACHE_NAME });
        }
    });

    precacheAndRoute(self.__WB_MANIFEST || []);
}
