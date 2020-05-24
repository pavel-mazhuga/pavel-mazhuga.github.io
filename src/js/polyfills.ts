/* global BUILD_TYPE */
/* eslint global-require: "off" */
import 'focus-visible';
// import 'intersection-observer';

if (BUILD_TYPE === 'legacy') {
    require('core-js/es/symbol');
    require('core-js/es/promise/finally');
    // require('core-js/es/map');
    // require('core-js/es/set');
    // require('element-matches-polyfill');
    require('whatwg-fetch');
}
