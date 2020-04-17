/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';

import sw from './sw';

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');
});

if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}
