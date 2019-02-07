/* global NODE_ENV */
import '../css/app.scss';
import './polyfills';
import Barba from 'barba.js';
// import '~/bootstrap';
// Transitions
import DefaultTransition from './transitions/default';
// Views
import IndexPageView from './views/index';
import Modal from './components/modal';
// Modules
// import './modules/layout-calc';

window.$window = jQuery(window);
window.$document = jQuery(document);
window.$body = jQuery('body');

function hideOutline() {
    this.style.outline = '0';
}

function restoreOutline() {
    this.style.outline = '';
}

function blur() {
    this.blur();
}

jQuery(($) => {
    $(document.documentElement).addClass('js-ready');

    const views = [IndexPageView];

    Barba.Pjax.getTransition = () => DefaultTransition;
    views.forEach((view) => view.init());
    Barba.Pjax.start();

    const menu = new Modal('menu');
    menu.init();

    function onPageInit() {
        $('.js-blur')
            .on('mouseenter.blur', hideOutline)
            .on('mouseleave.blur', restoreOutline)
            .on('click.blur touch.blur', blur);
    }

    function onPageDestroy() {
        $('.js-blur')
            .off('mouseenter.blur')
            .off('mouseleave.blur')
            .off('click.blur touch.blur');
    }

    onPageInit();

    Barba.Dispatcher.on('initStateChange', (currentStatus) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] initStateChange: ', { currentStatus });
        }
    });

    Barba.Dispatcher.on('newPageReady', (currentStatus, prevStatus /* , container, newPageRawHTML */) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] newPageReady: ', { currentStatus, prevStatus });
        }

        onPageDestroy();
    });

    Barba.Dispatcher.on('transitionCompleted', (currentStatus, prevStatus) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] transitionCompleted: ', { currentStatus, prevStatus });
        }

        onPageInit();
    });
});
