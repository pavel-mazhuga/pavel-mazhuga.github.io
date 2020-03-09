import './webpack-imports';
import './sentry';
import './polyfills';

document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.classList.add('js-ready');
});
