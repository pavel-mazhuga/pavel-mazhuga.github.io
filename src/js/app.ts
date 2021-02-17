/* global USE_SERVICE_WORKER */
import './webpack-imports';
import './sentry';
import './polyfills';

import sw from './sw';
import { registerCustomElements } from './custom-elements';
import { createParticlesBasic } from './experiments/particles/particles-basic';
import { createPhysicsWorker } from './experiments/physics/physics-worker';

registerCustomElements();

createParticlesBasic();
createPhysicsWorker();

// Service Worker
if (USE_SERVICE_WORKER) {
    window.addEventListener('load', () => sw.register());
} else {
    sw.unregister();
}

module.hot?.accept();
