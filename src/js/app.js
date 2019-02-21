/* global NODE_ENV */
import '../css/app.scss';
import './polyfills';
import Barba from 'barba.js';
// import '~/bootstrap';
// import './modules/layout-calc';

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

    function initBarba() {
        const views = [IndexPageView];

        Barba.Pjax.getTransition = () => DefaultTransition;
        views.forEach((view) => view.init());

        Barba.Dispatcher.on('initStateChange', (currentStatus) => {
            if (NODE_ENV === 'development') {
                console.log('[barba.js] initStateChange: ', { currentStatus });
            }

            BaseView.onLeave();
        });

        Barba.Dispatcher.on('newPageReady', (currentStatus, prevStatus /* , container, newPageRawHTML */) => {
            if (NODE_ENV === 'development') {
                console.log('[barba.js] newPageReady: ', { currentStatus, prevStatus });
            }

            BaseView.onEnter();
        });

        Barba.Dispatcher.on('transitionCompleted', (currentStatus, prevStatus) => {
            if (NODE_ENV === 'development') {
                console.log('[barba.js] transitionCompleted: ', { currentStatus, prevStatus });
            }

            BaseView.onLeaveCompleted();
            BaseView.onEnterCompleted();
        });

        Barba.Pjax.start();
    }

    initBarba();
});
