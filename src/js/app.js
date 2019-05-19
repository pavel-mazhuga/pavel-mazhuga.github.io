import './sentry';
import '../css/app.scss';
import './polyfills';
import Barba from 'barba.js';
// import calculateScrollbarWidth from './modules/calculate-scrollbar-width';
// import vhMobileFix from './modules/vh-mobile-fix';

// Transitions
import DefaultTransition from './transitions/default';
// Views
import BaseView from './views/_base';
import IndexPageView from './views/index';

// Globals
// window.$window = jQuery(window);
// window.$document = jQuery(document);
// window.$body = jQuery('body');

jQuery(($) => {
    $(document.documentElement).addClass('js-ready');
    // calculateScrollbarWidth();
    // vhMobileFix();

    function initBarba() {
        Barba.Pjax.getTransition = () => DefaultTransition;

        [IndexPageView].forEach((view) => view.init());

        Barba.Dispatcher.on('initStateChange', () => {
            BaseView.onLeave();
        });

        Barba.Dispatcher.on('newPageReady', () => {
            BaseView.onEnter();
        });

        Barba.Dispatcher.on('transitionCompleted', () => {
            BaseView.onLeaveCompleted();
            BaseView.onEnterCompleted();
        });

        Barba.Pjax.start();
    }

    initBarba();
});
