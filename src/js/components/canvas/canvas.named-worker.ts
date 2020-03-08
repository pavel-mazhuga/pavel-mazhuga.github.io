/* eslint-disable no-restricted-globals */
import { expose } from 'comlink';

import Canvas from './canvas-module';

self.addEventListener('message', ({ data: { message, options } }) => {
    if (message === 'init') {
        const module = new Canvas(options);
        expose(module);
        self.postMessage('ready');
    }
});
