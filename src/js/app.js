/* global USE_SERVICE_WORKER */
import '../css/app.scss';
import './sentry';
import './polyfills';
import barba from '@barba/core';

import registerServiceWorker from './register-sw';
// Transitions
// import FadeTransition from './transitions/fade';
// Views
import IndexPageView from './views/index';

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');

    barba.init({
        // transitions: [FadeTransition],
        views: [IndexPageView],
    });
});

if (USE_SERVICE_WORKER) {
    window.addEventListener('load', registerServiceWorker);
}
