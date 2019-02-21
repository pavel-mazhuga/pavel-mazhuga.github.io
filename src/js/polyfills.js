/* eslint global-require: "off" */
/* global NODE_ENV */
// import 'wicg-inert';

// if (NODE_ENV === 'production') {
//     require('picturefill');
// }

if ((NODE_ENV === 'production') && !Object.assign) {
    Object.assign = require('object-assign');
}
