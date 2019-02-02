/* global NODE_ENV */
import '../css/app.scss';
import './polyfills';
import Barba from 'barba.js';
// import '~/bootstrap';
// Transitions
import DefaultTransition from './transitions/default';
// Views
import IndexPageView from './views/index';
// Modules
// import './modules/layout-calc';

window.addEventListener('DOMContentLoaded', () => {
    $(document.documentElement).addClass('js-ready');

    const views = [IndexPageView];

    Barba.Pjax.getTransition = () => DefaultTransition;
    views.forEach(view => view.init());
    Barba.Pjax.start();

    Barba.Dispatcher.on('initStateChange', (currentStatus) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] initStateChange: ', { currentStatus });
        }
    });

    Barba.Dispatcher.on('newPageReady', (currentStatus, prevStatus/* , container, newPageRawHTML */) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] newPageReady: ', { currentStatus, prevStatus });
        }
    });

    Barba.Dispatcher.on('transitionCompleted', (currentStatus, prevStatus) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] transitionCompleted: ', { currentStatus, prevStatus });
        }
    });
});
