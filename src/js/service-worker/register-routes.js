/* global ROOT_PATH PUBLIC_PATH */
/* eslint-disable no-restricted-globals */
import { registerRoute /* , setCatchHandler */ } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import * as navigationPreload from 'workbox-navigation-preload';
import { precacheAndRoute } from 'workbox-precaching';

const OFFLINE_CACHE_NAME = 'offline';
const OFFLINE_HTML_URL = `${ROOT_PATH}offline/index.html`;
const OFFLINE_IMG_URL = `${PUBLIC_PATH}img/not-found.jpg`;

export function registerRoutes() {
    self.addEventListener('install', async (event) => {
        event.waitUntil(
            caches.open(OFFLINE_CACHE_NAME).then((cache) => {
                cache.add(OFFLINE_HTML_URL);
                cache.add(OFFLINE_IMG_URL);
            }),
        );
    });

    navigationPreload.enable();

    // Non-content Images
    registerRoute(
        /\.(?:png|gif|svg|ico)$/,
        new StaleWhileRevalidate({
            cacheName: 'non-content-images',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 30,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                }),
            ],
        }),
    );

    // Content images
    registerRoute(/\.(jpg|jpeg|webp)$/, async (params) => {
        const staleWhileRevalidate = new StaleWhileRevalidate({
            cacheName: 'content-images',
            plugins: [
                new ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
                }),
            ],
        });

        try {
            // Attempt a network request.
            return staleWhileRevalidate.handle(params);
        } catch (err) {
            // If it fails, return the cached image.
            return caches.match(OFFLINE_IMG_URL, { cacheName: OFFLINE_CACHE_NAME });
        }
    });

    // Static assets
    // registerRoute(
    //     new RegExp(`${PUBLIC_PATH}(css|js|wasm)/`),
    //     new CacheFirst({
    //         cacheName: 'static',
    //         plugins: [
    //             new ExpirationPlugin({
    //                 maxEntries: 30,
    //                 maxAgeSeconds: 60 * 60 * 24 * 30, // 30 Days
    //             }),
    //         ],
    //     }),
    // );

    // Fonts
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

        try {
            return await networkFirst.handle(params);
        } catch (err) {
            return caches.match(OFFLINE_HTML_URL, { cacheName: OFFLINE_CACHE_NAME });
        }
    });

    // This "catch" handler is triggered when any of the other routes fail to
    // generate a response.
    // setCatchHandler(({ event }) => {
    //     switch (event.request.destination) {
    //         case 'image':
    //             return caches.match(OFFLINE_IMG_URL);
    //         default:
    //             return Response.error();
    //     }
    // });

    precacheAndRoute(self.__WB_MANIFEST || []);
}
