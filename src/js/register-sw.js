/* global SERVICE_WORKER_HASH */
export default () => {
    if (!SERVICE_WORKER_HASH) {
        throw new Error('[sw-precache] Service Worker hash error.');
    }
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/service-worker.js', { updateViaCache: 'none' })
            .then((registration) => {
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        switch (installingWorker.state) {
                            case 'installed':
                                if (navigator.serviceWorker.controller) {
                                    console.log('[sw-precache] New or updated content is available.');
                                } else {
                                    console.log('[sw-precache] Content is now available offline!');
                                }
                                break;
                            case 'redundant':
                                console.error('[sw-precache] The installing of service worker became redundant.');
                                break;
                            default:
                                break;
                        }
                    };
                };
                if (
                    localStorage.getItem('SERVICE_WORKER_HASH') !== SERVICE_WORKER_HASH &&
                    (registration.installing && registration.installing.state === 'installed')
                ) {
                    console.log('[sw-precache] Service Worker was updated because hash changed.');
                    try {
                        registration.update();
                    } catch (error) {
                        console.error(error);
                    }
                }
                localStorage.setItem('SERVICE_WORKER_HASH', SERVICE_WORKER_HASH);
            })
            .catch((error) => {
                console.error('[sw-precache] Error during service worker registration:', error);
            });
    }
};
