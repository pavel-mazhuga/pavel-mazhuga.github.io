/* global BUILD_TYPE */
/* eslint global-require: "off" */
import 'focus-visible';
// import 'intersection-observer';

if (BUILD_TYPE === 'legacy') {
    require('whatwg-fetch');
    require('core-js/es/symbol');
    require('core-js/es/promise/finally');
    // require('picturefill');
}
