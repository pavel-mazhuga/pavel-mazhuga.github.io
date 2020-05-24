/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';

import sw from './sw';

document.documentElement.classList.add('js-ready');

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}
