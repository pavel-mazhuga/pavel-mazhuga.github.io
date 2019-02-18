/* eslint global-require: "off" */
/* global NODE_ENV */

// if (NODE_ENV === 'production') {
//     require('picturefill');
// }

if ((NODE_ENV === 'production') && !Object.assign) {
    Object.assign = require('object-assign');
}
