import './polyfills';
import Barba, { BarbaView } from 'barba.js';
// import '~/bootstrap';
// Transitions
import DefaultTransition from './transitions/default';
// Views
import IndexPageView from './views/index';
// Types
import { IAppWindow } from './types';

import '../css/app.scss';

declare const window: IAppWindow;

import './modules/layout-calc';

window.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');

    const views: BarbaView[] = [IndexPageView];

    Barba.Pjax.getTransition = () => DefaultTransition;
    views.forEach(view => view.init());
    Barba.Pjax.start();

    Barba.Dispatcher.on('initStateChange', (currentStatus: any) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] initStateChange: ', { currentStatus });
        }
    });

    Barba.Dispatcher.on('newPageReady', (
        currentStatus: any,
        prevStatus: any,
        container: HTMLElement,
        newPageRawHTML: string,
    ) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] newPageReady: ', { currentStatus, prevStatus });
        }

        // Barba.Pjax.getTransition = () => DefaultTransition;

        // parse new html
        // const newHTML = newPageRawHTML.replace(/<(\/?)(body|html|head)/gi, '<$1new-$2');
        // const newPage = $.parseHTML(newHTML, null, true);
        // const newBody = $('new-body', newPage);
    });

    Barba.Dispatcher.on('transitionCompleted', (currentStatus: any, prevStatus: any) => {
        if (NODE_ENV === 'development') {
            console.log('[barba.js] transitionCompleted: ', { currentStatus, prevStatus });
        }
    });
});
