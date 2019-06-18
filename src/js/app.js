import './sentry';
import '../css/app.scss';
import './polyfills';
import barba from '@barba/core';
// import calculateScrollbarWidth from './modules/calculate-scrollbar-width';
// import vhMobileFix from './modules/vh-mobile-fix';

// Transitions
// import FadeTransition from './transitions/fade';
// Views
import IndexPageView from './views/index';

// Globals
// window.$window = jQuery(window);
// window.$document = jQuery(document);
// window.$body = jQuery('body');

jQuery(($) => {
    $(document.documentElement).addClass('js-ready');
    // calculateScrollbarWidth();
    // vhMobileFix();

    // barba.hooks.leave(() => {});

    barba.init({
        // transitions: [FadeTransition],
        views: [IndexPageView],
    });
});
