/* global NODE_ENV DEBUG */
if (NODE_ENV === 'production') {
    // require('picturefill');
    require('@babel/polyfill');
}

if ((NODE_ENV === 'production') && !Object.assign) {
    Object.assign = require('object-assign');
}

