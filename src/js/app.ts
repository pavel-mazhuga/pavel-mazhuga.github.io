/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';
import Vue from 'vue';

import App from './components/vue/App.vue';
import sw from './sw';

document.documentElement.classList.add('js-ready');

const root = document.querySelector('#root');

if (root) {
    const vm = new Vue({
        el: root,
        render: (h) => h(App),
    });
}

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}
