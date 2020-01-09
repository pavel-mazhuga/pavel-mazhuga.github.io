import '../css/app.scss';
import './sentry';
import './polyfills';
import barba from '@barba/core';

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
