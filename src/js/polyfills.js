/* eslint global-require: "off" */
/* global NODE_ENV */
import 'focus-visible';
// import 'wicg-inert';

// if (NODE_ENV === 'production') {
//     require('picturefill');
// }

if ((NODE_ENV === 'production') && !Object.assign) {
    Object.assign = require('object-assign');
}
