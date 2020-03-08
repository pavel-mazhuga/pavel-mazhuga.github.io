import './webpack-imports';
import './sentry';
import './polyfills';
import createCanvas from './components/canvas';

document.addEventListener('DOMContentLoaded', async () => {
    document.documentElement.classList.add('js-ready');

    const instance = createCanvas();
});
