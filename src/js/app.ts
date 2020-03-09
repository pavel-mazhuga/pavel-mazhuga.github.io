import './webpack-imports';
import './sentry';
import './polyfills';

document.addEventListener('DOMContentLoaded', async () => {
    document.documentElement.classList.add('js-ready');
});
