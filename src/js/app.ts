/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';

import sw from './sw';
import { registerCustomElements } from './custom-elements';

document.addEventListener('DOMContentLoaded', () => {
    // Forces repaint, use when really needed.
    // document.documentElement.classList.add('js-ready');
    registerCustomElements();

    // Code here
});

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}

if (module.hot) {
    module.hot.accept();
}
