/* global BUILD_TYPE */
/* eslint global-require: "off" */
import 'focus-visible';
// import 'intersection-observer';

if (BUILD_TYPE === 'legacy') {
    require('whatwg-fetch');
    // require('picturefill');
}
